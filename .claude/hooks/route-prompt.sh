#!/bin/bash
set -euo pipefail

# UserPromptSubmit hook: a SOFT router for non-technical contributors.
#
# It NEVER blocks (always exits 0). It classifies the prompt into one of the
# kit's approved workflows (build / restyle / undo / submit / promote) and injects a
# short, governance-aware playbook as context, so the agent stays on the rails
# even on free-typed prompts and after compaction. A wrong guess is harmless —
# it only adds an advisory pointer, never a rejection.
#
# It also flags the "suggest-only" maintainer territory (gates/hooks, the token
# engine, token deprecations) with a visible heads-up — still without blocking.
#
# Mirrors the catalog in docs/prompts.md and the commands in .claude/commands/.
# See AGENTS.md "Working with non-technical contributors" and docs/governance.md.

INPUT=$(cat)

# Prompt text. The field name has varied across versions — read both defensively.
PROMPT=$(echo "$INPUT" | jq -r '.prompt // .user_prompt // empty')

# Nothing to route on an empty prompt.
if [[ -z "$PROMPT" ]]; then
  exit 0
fi

PROMPT_LC=$(printf '%s' "$PROMPT" | tr '[:upper:]' '[:lower:]')

# Substring/keyword matcher. Used only inside conditionals so `set -e` is happy.
# Avoids \b (BSD grep on macOS doesn't support it); false positives are harmless.
match() { printf '%s' "$PROMPT_LC" | grep -qE "$1"; }

# Classify. Most specific first; the router only ever guides, so precedence ties
# are inconsequential — the agent still reads the full prompt.
KIND="none"
if match 'skill[- ]gate|governance hook|enforce-skill|route-prompt|generate-theme|hooks/|the gate|the hook|deprecate.*token|delete the repo|rm -rf|wipe the|wipe everything'; then
  KIND="maintainer"
elif match 'promote|reusable component|official component|make (this|it|that).*(reusable|official)|into a primitive|into the (design )?system'; then
  KIND="promote"
elif match 'submit|send .*for review|ready for review|ship (it|this|that|the)|publish (it|this|the)|open a (pull request|pr)|merge (this|it|that)'; then
  KIND="submit"
# Undo sits ABOVE build/restyle, so its patterns must be tight or they hijack the
# branch below. Deliberately NOT matched: a bare "never mind" (it usually precedes a
# NEW request — "never mind, build me a pricing page instead") and a bare "go back to"
# (almost always navigation — "go back to the landing page and add a section").
# Both are anchored to phrasing that can only mean reverting.
elif match 'undo|revert|roll ?back|put (it|that|this) back|change (it|that|this) back|change the [a-z]+( [a-z]+)? back|go back to (how|what|the way|the previous)|that was worse|like it was before'; then
  KIND="undo"
# The `([a-z-]+ )*` before each noun lets an adjective through — "make me a new PRICING page",
# "add a TESTIMONIALS section" — which the bare noun list used to drop on the floor.
elif match 'build|scaffold|create a|create me|new (page|screen|section|component)|make (me )?an? (new )?([a-z-]+ )*(page|screen|section|component|hero|dashboard|form|table|card|landing|view)|add an? ([a-z-]+ )*(page|section|hero|banner|button|card|form|table|list)|design (me )?a'; then
  KIND="build"
elif match 'restyle|reskin|re-skin|colou?r|spacing|padding|margin|breathing room|more room|font|typography|line ?-?height|leading|line spacing|theme|look|feel|bigger|smaller|compact|denser|spacious|tweak the (look|style|design)'; then
  KIND="restyle"
fi

# No match → inject nothing. Never penalize a free-form prompt.
if [[ "$KIND" == "none" ]]; then
  exit 0
fi

case "$KIND" in
  build)
    CTX="This looks like a BUILD request (non-technical contributor). Run the build workflow: derive a short page name and a one-line description, scaffold it with the generator (bun run gen:prototype, giving slug + title + description, all three non-empty), load the design-system skill, compose @madison/ui primitives on-token (never raw Tailwind or hex), run bun run check, and report the preview URL. Do all the tooling yourself. See docs/prompts.md or the /build command."
    ;;
  restyle)
    CTX="This looks like a RESTYLE request. Act at the right altitude: a single prototype's index.tsx, the app brand override in apps/sandbox/src/index.css, or a token in packages/ui/src/ui/tokens.tsx. Stay on-token: use a semantic or brand token, never a raw hex even if they name a color. Changes to tokens.tsx or packages/ui land as a draft PR. Run bun run check. If this is really a SINGLE bounded property change on one page (one size, one spacing, one line height, one word), take the fast lane instead: .claude/commands/small-edit.md — one file, one pass, no exploring, no clarifying questions. See docs/prompts.md or the /restyle command."
    ;;
  undo)
    CTX="This looks like an UNDO request, which is the contributor's explicit go-ahead to run git for this purpose only. Scope: UNCOMMITTED working-tree changes. Run git status --porcelain and git diff first, describe in plain words what would be reverted, and wait for a yes before touching anything. Then revert with git stash push -u -m <label> -- <the specific paths>, never a bare stash or checkout that sweeps in unrelated work — stash keeps the undo itself reversible (git stash pop) and -u also removes whole new pages that /build left untracked, which git checkout cannot. Tell them it is recoverable. If the change is already committed or pushed, stop and say so — never git reset --hard, never rewrite history, never force-push. Run bun run check afterwards. See docs/prompts.md or the /undo command."
    ;;
  submit)
    CTX="This looks like a SUBMIT request: the contributor's explicit go-ahead for the commit-to-PR flow. Run bun run check, fix failures and off-system colors, branch and commit with a conventional message, push, open a PR, and return the link. The trust matrix decides auto-merge vs draft PR; do not ask them to choose. See docs/prompts.md or the /submit command."
    ;;
  promote)
    CTX="This looks like a PROMOTE request (a prototype becoming a reusable @madison/ui primitive). Follow docs/promote.md: load the design-system, react, and typescript skills, scaffold with bun run gen:promote, rewrite any off-system classes, add a Storybook story, run bun run check, and open a DRAFT PR (promotions never auto-merge). See docs/prompts.md or the /promote command."
    ;;
  maintainer)
    CTX="This request appears to touch maintainer-only territory (the governance gates and hooks, scripts/generate-theme.ts, or token deprecations): the suggest-only trust tier. Do not auto-apply these changes. Prepare a clearly explained suggestion or diff for a maintainer to apply, and confirm intent before acting. Normal prototype and component work is unaffected."
    ;;
esac

# Emit additive context (exit 0). Maintainer territory also gets a visible,
# non-blocking heads-up via systemMessage.
if [[ "$KIND" == "maintainer" ]]; then
  MSG="Heads up: this looks like it touches the governance plumbing (the gates/hooks or the token engine), which is the suggest-only tier. I will prepare it as a suggestion for a maintainer rather than applying it automatically."
  jq -n --arg ctx "$CTX" --arg msg "$MSG" \
    '{systemMessage: $msg, hookSpecificOutput: {hookEventName: "UserPromptSubmit", additionalContext: $ctx}}'
else
  jq -n --arg ctx "$CTX" \
    '{hookSpecificOutput: {hookEventName: "UserPromptSubmit", additionalContext: $ctx}}'
fi

exit 0
