#!/bin/bash
set -euo pipefail

# Clears skill gate markers for the current session.
# Used by SessionStart (fresh session = clean slate) and
# PostCompact (compaction loses skill content, force reload).

INPUT=$(cat)

# Resolve project dir
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

# Resolve session key from stdin JSON for per-agent isolation
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
AGENT_ID=$(echo "$INPUT" | jq -r '.agent_id // empty')

if [[ -n "$SESSION_ID" && -n "$AGENT_ID" ]]; then
  SESSION_KEY="${SESSION_ID}/${AGENT_ID}"
elif [[ -n "$SESSION_ID" ]]; then
  SESSION_KEY="$SESSION_ID"
else
  SESSION_KEY="${PPID:-shared}"
fi

GATES_DIR="$PROJECT_DIR/.claude/.skill-gates"

# Remove this session's markers (and all sub-agent dirs if clearing the parent)
if [[ -d "$GATES_DIR/$SESSION_KEY" ]]; then
  rm -rf "$GATES_DIR/$SESSION_KEY"
fi

# Prune stale session dirs older than 24h (prevents unbounded growth)
if [[ -d "$GATES_DIR" ]]; then
  find "$GATES_DIR" -mindepth 1 -maxdepth 1 -type d -mmin +1440 -exec rm -rf {} + 2>/dev/null || true
fi

exit 0
