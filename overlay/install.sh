#!/usr/bin/env bash
set -euo pipefail

# Madison governance overlay — installer.
# Extracts the portable governance bundle (skill-gate hooks + skills + token-lint rule +
# Storybook MCP client config) from this kit into an EXISTING repo. Run FROM the kit:
#
#   ./overlay/install.sh <target-repo-dir> [components-path-prefix]
#   e.g. ./overlay/install.sh ../acme-app "src/components/"
#
# Stack-specific bits (your tokens, CI, Storybook) are adapted by hand afterwards —
# see overlay/README.md. Existing skill/config files are never clobbered.

TARGET="${1:-}"
COMPONENTS="${2:-packages/ui/}"

if [[ -z "$TARGET" || ! -d "$TARGET" ]]; then
  echo "usage: ./overlay/install.sh <target-repo-dir> [components-path-prefix]" >&2
  echo '  e.g. ./overlay/install.sh ../acme-app "src/components/"' >&2
  exit 1
fi

KIT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="$(cd "$TARGET" && pwd)"

# jq is required: the skill-gate hooks parse their stdin JSON with it, and this
# installer uses it to derive the client's settings.json.
command -v jq >/dev/null 2>&1 || {
  echo "error: jq not found. The skill-gate hooks depend on jq — install it and re-run." >&2
  exit 1
}

echo "→ Installing Madison governance overlay into: $TARGET"
echo "  design-system gate will guard: $COMPONENTS"
echo

copy_dir_if_absent() { # src dst label
  if [[ -e "$2" ]]; then
    echo "  • skipped (exists, review manually): ${3:-$2}"
  else
    cp -R "$1" "$2"
    echo "  • added: ${3:-$2}"
  fi
}

# 1) Skill-gate hooks — verbatim, repo-agnostic (they match file paths). Safe to (re)overwrite.
mkdir -p "$TARGET/.claude/hooks"
for h in enforce-skill-gates on-skill-loaded clear-skill-gates; do
  cp "$KIT_ROOT/.claude/hooks/$h.sh" "$TARGET/.claude/hooks/$h.sh"
  chmod +x "$TARGET/.claude/hooks/$h.sh"
done
echo "  • added: .claude/hooks/{enforce,on-skill-loaded,clear}-skill-gates.sh"

# 2) skill-requirements.json — parameterize the gated component path.
sed "s#packages/ui/#${COMPONENTS}#g" \
  "$KIT_ROOT/.claude/hooks/skill-requirements.json" \
  >"$TARGET/.claude/hooks/skill-requirements.json"
echo "  • added: .claude/hooks/skill-requirements.json (gating $COMPONENTS → design-system)"

# 3) settings.json hooks block — copy if absent, else emit a merge file (never clobber).
# Derive from the kit's live settings MINUS the demo-only UserPromptSubmit router: the kit's
# route-prompt.sh hard-codes kit workflows (gen:prototype, apps/sandbox, /build, docs/prompts.md)
# that don't exist in a client repo, so shipping it would inject misleading guidance. The overlay
# installs the GATE (Pre/PostToolUse + SessionStart/PostCompact); routing is authored per client.
GATE_ONLY='del(.hooks.UserPromptSubmit)'
if [[ -f "$TARGET/.claude/settings.json" ]]; then
  jq "$GATE_ONLY" "$KIT_ROOT/.claude/settings.json" >"$TARGET/.claude/settings.madison.json"
  echo '  • settings.json exists → wrote .claude/settings.madison.json (merge its "hooks" block)'
else
  jq "$GATE_ONLY" "$KIT_ROOT/.claude/settings.json" >"$TARGET/.claude/settings.json"
  echo "  • added: .claude/settings.json (skill-gate hooks)"
fi

# 4) Skills — design-system must be adapted to YOUR tokens. Don't clobber existing skills.
mkdir -p "$TARGET/.agents/skills"
for s in design-system react typescript testing; do
  copy_dir_if_absent "$KIT_ROOT/.agents/skills/$s" "$TARGET/.agents/skills/$s" ".agents/skills/$s"
done
# Claude Code discovers skills via .claude/skills (symlink → .agents/skills).
if [[ ! -e "$TARGET/.claude/skills" ]]; then
  ln -s ../.agents/skills "$TARGET/.claude/skills"
  echo "  • added: .claude/skills → ../.agents/skills (symlink)"
fi

# 5) Token-lint ESLint rules (import into your flat config).
mkdir -p "$TARGET/eslint"
for r in no-raw-colors no-raw-dimensions no-raw-rings-zindex; do
  cp "$KIT_ROOT/eslint/$r.js" "$TARGET/eslint/$r.js"
done
echo "  • added: eslint/no-raw-{colors,dimensions,rings-zindex}.js"

# 6) Storybook MCP client config.
copy_dir_if_absent "$KIT_ROOT/.mcp.json" "$TARGET/.mcp.json" ".mcp.json"

cat <<EOF

✅ Portable bundle installed. Now adapt the stack-specific bits (see overlay/README.md):

  1. Tokens     → make .agents/skills/design-system/SKILL.md describe YOUR token vocabulary.
  2. ESLint     → compose the rules into one plugin in your flat config:
                    import { noRawColors } from "./eslint/no-raw-colors.js";
                    import { noRawDimensions } from "./eslint/no-raw-dimensions.js";
                    import { noRawRingsZindex } from "./eslint/no-raw-rings-zindex.js";
                    const madison = { rules: {
                      "no-raw-colors": noRawColors, "no-raw-dimensions": noRawDimensions,
                      "no-raw-rings-zindex": noRawRingsZindex } };
                    { files: ["**/*.{ts,tsx}"], plugins: { madison }, rules: {
                      "madison/no-raw-colors": "error", "madison/no-raw-dimensions": "error",
                      "madison/no-raw-rings-zindex": "error" } }
  3. Settings   → if you had a .claude/settings.json, merge the "hooks" block from
                  .claude/settings.madison.json, then delete that file.
  4. Storybook  → add @storybook/addon-mcp + features.componentsManifest to .storybook/main.ts;
                  point .mcp.json at your Storybook's port.
  5. CI         → run your check (typecheck + lint + test) + react-doctor on every PR
                  (see the kit's .github/workflows/ci.yml as a reference).

Then load the design-system skill and edit a file under $COMPONENTS — the gate should fire.
EOF
