#!/bin/bash
set -euo pipefail

# PostToolUse hook: creates a per-session marker when a skill is loaded
# via the Skill tool, unlocking the gate for guarded file types.

INPUT=$(cat)

# Extract skill name from tool input
SKILL_NAME=$(echo "$INPUT" | jq -r '.tool_input.skill // empty')

# Nothing to do if no skill name
if [[ -z "$SKILL_NAME" ]]; then
  exit 0
fi

# Handle qualified skill names (e.g., "plugin:skill" → "skill")
# Also handle skill names with arguments by taking just the skill part
SKILL_NAME=$(echo "$SKILL_NAME" | sed 's/.*://' | awk '{print $1}')

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

# Create marker
GATE_DIR="$PROJECT_DIR/.claude/.skill-gates/$SESSION_KEY"
mkdir -p "$GATE_DIR"
touch "$GATE_DIR/$SKILL_NAME"

exit 0
