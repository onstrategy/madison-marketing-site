#!/bin/bash
set -euo pipefail

# Session-freshness gate: every working session starts from the latest origin/<base>.
#
#   sync  (SessionStart + PostCompact)   fetch origin/<base>, auto-fast-forward the
#         local <base> branch when that is safe, otherwise arm a stale marker.
#   gate  (PreToolUse Edit|Write)        LOCAL-only re-check; block (exit 2) while
#         the tree lacks origin/<base>'s head, clear the marker once it catches up.
#
# The marker is deliberately REPO-GLOBAL (not per-session like .skill-gates/):
# staleness is a property of the shared working tree, and SessionStart does not
# fire for subagents — a per-session marker would let subagents bypass the gate.
# That is also why the session_id/agent_id key derivation used by the skill gates
# is absent here on purpose.
#
# Fail-open policy: no repo / no origin remote / no commits / shallow clone /
# fetch failure (offline) / merge-or-rebase in progress → never block. Offline
# still gates against the last-known refs/remotes/origin/<base> (a local ref);
# a failed fetch never clears an existing marker — only an up-to-date tree does.

MODE="${1:-gate}"

# Parameterized by overlay/install.sh for client repos with a different base.
DEFAULT_BASE_BRANCH="main"
BASE_BRANCH="${MADISON_BASE_BRANCH:-$DEFAULT_BASE_BRANCH}"

INPUT=$(cat)

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

GATE_DIR="$PROJECT_DIR/.claude/.sync-gate"
MARKER="$GATE_DIR/stale"
STATE="$GATE_DIR/state"
REMOTE_REF="refs/remotes/origin/$BASE_BRANCH"

g() { git -C "$PROJECT_DIR" "$@"; }

# Universal fail-opens: nothing to compare against.
g rev-parse --git-dir >/dev/null 2>&1 || exit 0
g remote get-url origin >/dev/null 2>&1 || exit 0
g rev-parse --verify -q HEAD >/dev/null 2>&1 || exit 0

in_progress_op() {
  local d
  # --absolute-git-dir: the plain --git-dir answer is relative to the repo, not
  # to this hook's CWD, which may differ from CLAUDE_PROJECT_DIR.
  d=$(g rev-parse --absolute-git-dir)
  [[ -e "$d/MERGE_HEAD" || -d "$d/rebase-merge" || -d "$d/rebase-apply" || -e "$d/CHERRY_PICK_HEAD" ]]
}

up_to_date() { g merge-base --is-ancestor "$REMOTE_REF" HEAD 2>/dev/null; }

record() {
  mkdir -p "$GATE_DIR"
  printf '%s %s\n' "$(date +%s)" "$1" >"$STATE"
}

# =============================================================================
# gate mode — PreToolUse Edit|Write. Hot path: no marker → nothing to do.
# =============================================================================
if [[ "$MODE" == "gate" ]]; then
  [[ -f "$MARKER" ]] || exit 0

  # Only files inside the repo matter; scratchpad/outside paths pass.
  FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')
  [[ -z "$FILE_PATH" ]] && exit 0
  case "$FILE_PATH" in
    "$PROJECT_DIR"/*) ;;
    *) exit 0 ;;
  esac

  # Remote-tracking ref vanished (remote removed/renamed) → self-heal, fail open.
  if ! g rev-parse --verify -q "$REMOTE_REF" >/dev/null 2>&1; then
    rm -f "$MARKER"
    exit 0
  fi

  # Mid-merge/rebase: the remediation itself needs edits — never deadlock it.
  in_progress_op && exit 0

  if up_to_date; then
    rm -f "$MARKER"
    exit 0
  fi

  BRANCH=$(g symbolic-ref --quiet --short HEAD 2>/dev/null || echo "")
  echo "SYNC GATE BLOCKED: this workspace is behind the latest published $BASE_BRANCH, so edits are paused until it catches up." >&2
  echo "Newer work was merged into $BASE_BRANCH after this copy was taken; editing on top of stale code risks conflicts and overwriting others' work." >&2
  echo "" >&2
  if [[ "$BRANCH" == "$BASE_BRANCH" ]]; then
    echo "You are on $BASE_BRANCH but it has local commits it shouldn't have. Move them to a branch, then sync (run these, then retry the edit):" >&2
    echo "  git switch -c rescue-local-work" >&2
    echo "  git switch $BASE_BRANCH" >&2
    echo "  git merge --ff-only origin/$BASE_BRANCH" >&2
    echo "Continue the work on rescue-local-work, and mention to the contributor that an engineer should review those stranded commits." >&2
  elif [[ -z "$BRANCH" ]]; then
    echo "You are not on any branch (detached HEAD). Get back on one, then sync (run these, then retry the edit):" >&2
    echo "  git switch $BASE_BRANCH" >&2
    echo "  git merge --ff-only origin/$BASE_BRANCH" >&2
  else
    echo "Bring the latest $BASE_BRANCH into this branch (run these, then retry the edit):" >&2
    echo "  git fetch origin $BASE_BRANCH" >&2
    echo "  git merge origin/$BASE_BRANCH" >&2
    echo "If the merge reports conflicts you cannot resolve confidently, stop and tell the contributor an engineer needs to help bring this branch up to date." >&2
  fi
  echo "" >&2
  echo "Syncing with origin/$BASE_BRANCH for this purpose is pre-authorized (see AGENTS.md)." >&2
  exit 2
fi

# =============================================================================
# sync mode — SessionStart + PostCompact. Must always exit 0.
# =============================================================================
EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // empty')

emit_ctx() { # SessionStart supports additionalContext; PostCompact stays silent.
  [[ "$EVENT" == "SessionStart" ]] || return 0
  jq -n --arg ctx "$1" \
    '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $ctx}}'
}

# Shallow clones: merge-base is unreliable without full history → fail open
# (shallow = CI artifact, not a contributor laptop).
if [[ "$(g rev-parse --is-shallow-repository 2>/dev/null)" == "true" ]]; then
  record "shallow-skip"
  exit 0
fi

run_with_timeout() { # seconds cmd...
  local secs="$1"
  shift
  if command -v timeout >/dev/null 2>&1; then
    timeout "$secs" "$@"
  elif command -v gtimeout >/dev/null 2>&1; then
    gtimeout "$secs" "$@"
  else
    perl -e 'alarm shift; exec @ARGV' "$secs" "$@"
  fi
}

# Time-bounded fetch that can never hang the session (no credential prompt,
# abort stalled transfers). Failure = fail open against the last-known ref.
FETCH_OK=true
if ! run_with_timeout 15 env GIT_TERMINAL_PROMPT=0 \
    git -C "$PROJECT_DIR" -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=5 \
    fetch --no-tags --quiet origin "$BASE_BRANCH" >/dev/null 2>&1; then
  FETCH_OK=false
  record "fetch-failed"
fi

# Never fetched and no tracking ref at all → nothing to compare against.
if ! g rev-parse --verify -q "$REMOTE_REF" >/dev/null 2>&1; then
  record "no-remote-ref"
  exit 0
fi

if up_to_date; then
  rm -f "$MARKER"
  record "up-to-date"
  exit 0
fi

# Behind. Safe auto-fast-forward: on <base>, nothing in progress, no local
# commits ahead. `merge --ff-only` refuses on its own if dirty files would be
# overwritten — that failure falls through to arming the gate.
BRANCH=$(g symbolic-ref --quiet --short HEAD 2>/dev/null || echo "")
if [[ "$BRANCH" == "$BASE_BRANCH" ]] && ! in_progress_op \
    && g merge-base --is-ancestor HEAD "$REMOTE_REF" 2>/dev/null \
    && g merge --ff-only --quiet "$REMOTE_REF" >/dev/null 2>&1; then
  rm -f "$MARKER"
  record "auto-ff"
  emit_ctx "Heads up: this workspace was behind the latest published $BASE_BRANCH, and it was fast-forwarded automatically before the session started. You are now working on the newest version of the project."
  exit 0
fi

# Can't sync safely → arm the gate.
mkdir -p "$GATE_DIR"
g rev-parse "$REMOTE_REF" >"$MARKER"
record "stale"
if [[ "$BRANCH" == "$BASE_BRANCH" ]]; then
  DETAIL="the local $BASE_BRANCH has commits (or uncommitted changes) that conflict with the update. Before editing any repo file, follow the sync gate's instructions — it will block the first edit and print them."
else
  DETAIL="this branch does not contain the latest $BASE_BRANCH. Before editing any repo file, merge origin/$BASE_BRANCH into it (git fetch origin $BASE_BRANCH && git merge origin/$BASE_BRANCH); if that merge conflicts beyond confident resolution, tell the contributor an engineer needs to help. Syncing with origin/$BASE_BRANCH for this purpose is pre-authorized."
fi
FETCH_NOTE=""
[[ "$FETCH_OK" == false ]] && FETCH_NOTE=" (Note: fetching from the remote failed — possibly offline — so this is measured against the last state of $BASE_BRANCH this machine saw.)"
emit_ctx "Heads up: this workspace is BEHIND the latest published $BASE_BRANCH and could not be updated automatically — $DETAIL$FETCH_NOTE"
exit 0
