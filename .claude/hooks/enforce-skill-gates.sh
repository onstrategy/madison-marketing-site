#!/bin/bash
set -euo pipefail

# PreToolUse hook: blocks Edit/Write on guarded file types unless the
# per-session skill marker exists.

INPUT=$(cat)

# Extract file_path (Edit/Write use "file_path"; some tools use "path")
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')

# Fail open if no file path (non-file tool invocation)
if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# Resolve project dir
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

# Resolve session key from stdin JSON for per-agent isolation.
# session_id identifies the session; agent_id (if present) identifies the sub-agent.
# Combined key ensures parent and sub-agents gate independently.
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
AGENT_ID=$(echo "$INPUT" | jq -r '.agent_id // empty')

if [[ -n "$SESSION_ID" && -n "$AGENT_ID" ]]; then
  SESSION_KEY="${SESSION_ID}/${AGENT_ID}"
elif [[ -n "$SESSION_ID" ]]; then
  SESSION_KEY="$SESSION_ID"
else
  SESSION_KEY="${PPID:-shared}"
fi

REQUIREMENTS_FILE="$PROJECT_DIR/.claude/hooks/skill-requirements.json"

# If no requirements file, fail open
if [[ ! -f "$REQUIREMENTS_FILE" ]]; then
  exit 0
fi

# Check each rule
MISSING_SKILLS=()
RULE_COUNT=$(jq '.rules | length' "$REQUIREMENTS_FILE")

for (( i=0; i<RULE_COUNT; i++ )); do
  PATTERN=$(jq -r ".rules[$i].pattern" "$REQUIREMENTS_FILE")

  # Check if the file path matches this rule's pattern
  if echo "$FILE_PATH" | grep -qE "$PATTERN"; then
    # Get all required skills for this rule
    SKILL_COUNT=$(jq ".rules[$i].skills | length" "$REQUIREMENTS_FILE")
    for (( j=0; j<SKILL_COUNT; j++ )); do
      SKILL=$(jq -r ".rules[$i].skills[$j]" "$REQUIREMENTS_FILE")
      MARKER="$PROJECT_DIR/.claude/.skill-gates/$SESSION_KEY/$SKILL"
      if [[ ! -f "$MARKER" ]]; then
        # Avoid duplicates
        if [[ ! " ${MISSING_SKILLS[*]:-} " =~ " $SKILL " ]]; then
          MISSING_SKILLS+=("$SKILL")
        fi
      fi
    done
  fi
done

if [[ ${#MISSING_SKILLS[@]} -gt 0 ]]; then
  SKILL_LIST=$(IFS=', '; echo "${MISSING_SKILLS[*]}")
  echo "SKILL GATE BLOCKED: Load the following skills before editing this file: $SKILL_LIST" >&2
  echo "" >&2
  echo "Run the Skill tool for each missing skill, then retry. Example:" >&2
  echo "  Use the Skill tool with skill: \"design-system\"" >&2
  echo "" >&2
  echo "If the Skill tool hook doesn't create the marker, run manually:" >&2
  echo "  mkdir -p \"$PROJECT_DIR/.claude/.skill-gates/$SESSION_KEY\" && touch \"$PROJECT_DIR/.claude/.skill-gates/$SESSION_KEY/<skill-name>\"" >&2
  exit 2
fi

exit 0
