# The Installable Overlay

The **overlay** is the portable, repo-agnostic **governance layer** extracted from this kit —
the part you drop into a client's **existing** repo so their non-technical contributors can ship
real components into *their* product, made safe by the same guardrails Northwind demonstrates.

> **Kit vs overlay.** The kit (this repo) is a full standalone Turborepo — your sales demo and the
> clone-for-greenfield template. The overlay is *just the machinery*: it installs **on top of**
> whatever a client already has. You never hand a client the kit; you install its overlay into
> their repo.

## What it installs (the portable bundle)

`install.sh` extracts these from the kit's **live files** (single source of truth — no
duplication):

| Installed | What it is | Adaptation needed |
|-----------|------------|-------------------|
| `.claude/hooks/{enforce,on-skill-loaded,clear}-skill-gates.sh` | The skill-gate engine (PreToolUse blocker, marker writer, session reset) | None — matches file paths, works in any repo |
| `.claude/hooks/skill-requirements.json` | Pattern → required-skill rules | The component path is parameterized at install (`[components-path-prefix]`) |
| `.claude/settings.json` (hooks block) | Wires the hooks into Claude Code | If you already have one, merge the emitted `settings.northwind.json` |
| `.agents/skills/{react,typescript,testing}` + `.claude/skills` symlink | The conventions | Generic (already de-branded) |
| `.agents/skills/design-system` | The token vocabulary + rules | **Rewrite to your tokens** — this is the main setup work |
| `eslint/no-raw-colors.js` | Bans off-system color classes (`bg-indigo-500`, `text-[#hex]`) | Import into your ESLint flat config |
| `.mcp.json` | Storybook MCP client config | Point at your Storybook port |

**Not included** (you keep your own): your components, your tokens, your app. The overlay is
governance, not content.

## Install

Run it **from the kit**, pointing at the client repo:

```bash
./overlay/install.sh ../acme-app "src/components/"
#                    └ target     └ the path prefix to gate with the design-system skill
```

Existing skill/config files are never clobbered (they're skipped, or emitted as a `*.northwind.*`
merge file). Re-running updates the hooks and the gated path.

## Then adapt the stack-specific bits

The installer prints these; in order of impact:

1. **Tokens (the real work).** Rewrite `.agents/skills/design-system/SKILL.md` to describe *your*
   token vocabulary. If you're moving from Figma/shadcn to code-as-source-of-truth, establish a
   `tokens.tsx` + a `generate-theme.ts` (use the kit's `packages/ui` as the reference) and map your
   Figma variables → semantic tokens via `references/migration.md`.
2. **ESLint.** Add the token-lint rule:
   ```js
   import { northwind } from "./eslint/no-raw-colors.js";
   export default [
     // ...your config...
     { files: ["**/*.{ts,tsx}"], plugins: { northwind }, rules: { "northwind/no-raw-colors": "error" } },
   ];
   ```
3. **Settings.** If you already had `.claude/settings.json`, merge the `"hooks"` block from the
   emitted `.claude/settings.northwind.json`, then delete it.
4. **Storybook MCP.** Add `@storybook/addon-mcp` + `features: { componentsManifest: true }` to your
   `.storybook/main.ts`, and point `.mcp.json` at your Storybook's `/mcp` port. (For clients without
   local setup, host Storybook on Chromatic and point `.mcp.json` at the hosted URL.)
5. **CI.** Run your check (typecheck + lint + test) and `react-doctor` on every PR — see the kit's
   [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) as a reference. This is the
   governance-as-code gate on every diff.

## Recommended order (Phase 1 → 2)

This mirrors the engagement arc in [`../docs/governance.md`](../docs/governance.md):

1. **Tokens first** — code becomes the source of truth (reverse the Figma→code dependency).
2. **Storybook + MCP** over your real components — so agents know your true APIs and tokens.
3. **Install the gates** (this overlay) — the skill-gate + token-lint make off-system work hard.
4. **Wire CI** — `bun run check`-equivalent + react-doctor on every PR.

## Verify it took

Load the `design-system` skill, then edit a file under your gated path (e.g. `src/components/…`)
without it — the PreToolUse gate should block with `SKILL GATE BLOCKED: … design-system`. Load the
skill, retry, and it passes. That loop — running in *your* repo — is the whole point.
