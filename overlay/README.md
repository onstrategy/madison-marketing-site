# The Installable Overlay

The **overlay** is the portable, repo-agnostic **governance layer** extracted from this kit —
the part you drop into a client's **existing** repo so their non-technical contributors can ship
real components into *their* product, made safe by the same guardrails Madison demonstrates.

> **Kit vs overlay.** The kit (this repo) is a full standalone Turborepo — now **Madison's design
> system**, and a reference implementation of the complete setup. The overlay is *just the
> machinery*: it installs **on top of** whatever a client already has. You never hand a client the
> kit; you install its overlay into their repo.

> **Doing a real client install?** This page is the reference. For the end-to-end engagement —
> discovery → tokens → skill → install → CI → verify → enablement — follow the step-by-step
> [`RUNBOOK.md`](./RUNBOOK.md).

## What it installs (the portable bundle)

`install.sh` extracts these from the kit's **live files** (single source of truth — no
duplication):

| Installed | What it is | Adaptation needed |
|-----------|------------|-------------------|
| `.claude/hooks/{enforce,on-skill-loaded,clear}-skill-gates.sh` | The skill-gate engine (PreToolUse blocker, marker writer, session reset) | None — matches file paths, works in any repo |
| `.claude/hooks/check-main-freshness.sh` | Session-freshness gate (auto-fast-forward at SessionStart, edit-block while the tree is behind `origin/<base>`) | The base branch is parameterized at install (`[base-branch]`, default `main`) |
| `.claude/hooks/skill-requirements.json` | Pattern → required-skill rules | The component path is parameterized at install (`[components-path-prefix]`) |
| `.claude/settings.json` (hooks block) | Wires the **skill-gate** hooks into Claude Code (the demo's prompt-router is stripped) | If you already have one, merge the emitted `settings.madison.json` |
| `.agents/skills/{react,typescript,testing}` + `.claude/skills` symlink | The conventions | Generic (already de-branded) |
| `.agents/skills/design-system` | The token vocabulary + rules | **Rewrite to your tokens** — this is the main setup work |
| `eslint/no-raw-{colors,dimensions,rings-zindex}.js` | Ban off-system colors (`bg-indigo-500`), spacing/type (`p-[17px]`, `text-[40px]`), and rings/z-index (`ring-2`, `z-50`) | Compose into your ESLint flat config |
| `.mcp.json` | Storybook MCP client config | Point at your Storybook port |

**Not included** (you keep your own): your components, your tokens, your app. The overlay is
governance, not content.

> **Prompt routing is intentionally not installed.** The kit's `route-prompt.sh` (a
> `UserPromptSubmit` hook that maps plain-language requests to `/build`, `/restyle`, …) is
> demo-specific — it points at `gen:prototype`, `apps/sandbox`, and the kit's slash commands, none
> of which exist in a client repo. `install.sh` strips that hook and installs the **gate** only. If
> you want plain-language routing, author it to *your* workflows using the kit's `route-prompt.sh`
> as a reference (see the runbook).

## Install

Run it **from the kit**, pointing at the client repo:

```bash
./overlay/install.sh ../acme-app "src/components/" main
#                    └ target     └ the path prefix    └ base branch for the sync gate
#                                   to gate with the     (optional, default main)
#                                   design-system skill
```

Existing skill/config files are never clobbered (they're skipped, or emitted as a `*.madison.*`
merge file). Re-running updates the hooks and the gated path.

## Then adapt the stack-specific bits

The installer prints these; in order of impact:

1. **Tokens (the real work).** Rewrite `.agents/skills/design-system/SKILL.md` to describe *your*
   token vocabulary. If you're moving from Figma/shadcn to code-as-source-of-truth, establish a
   `tokens.tsx` + a `generate-theme.ts` (use the kit's `packages/ui` as the reference) and map your
   Figma variables → semantic tokens via `references/migration.md`.
2. **ESLint.** Compose the token-lint rules into one `madison` plugin (mirrors the kit's
   `eslint.config.js`):
   ```js
   import { noRawColors } from "./eslint/no-raw-colors.js";
   import { noRawDimensions } from "./eslint/no-raw-dimensions.js";
   import { noRawRingsZindex } from "./eslint/no-raw-rings-zindex.js";

   const madison = { rules: {
     "no-raw-colors": noRawColors,
     "no-raw-dimensions": noRawDimensions,
     "no-raw-rings-zindex": noRawRingsZindex,
   } };

   export default [
     // ...your config...
     { files: ["**/*.{ts,tsx}"], plugins: { madison }, rules: {
       "madison/no-raw-colors": "error",
       "madison/no-raw-dimensions": "error",
       "madison/no-raw-rings-zindex": "error",
     } },
   ];
   ```
3. **Settings.** If you already had `.claude/settings.json`, merge the `"hooks"` block from the
   emitted `.claude/settings.madison.json`, then delete it.
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

For the sync gate: check out a branch that's behind your base branch and try an edit — it should
block with `SYNC GATE BLOCKED` and print the plain-language catch-up steps; merging the base
branch in unblocks it.
