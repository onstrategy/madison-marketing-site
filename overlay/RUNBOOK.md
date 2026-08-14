# Madison Governance Overlay — Client Onboarding Runbook

> **Purpose.** A step-by-step engagement guide for installing the Madison governance overlay into
> a client's **existing** repository and adapting it to *their* design system — so their team
> (technical or not) can ship UI through Claude Code, on-system and safely.
>
> **Audience.** You, running the engagement. The client never touches tooling.
>
> **Companions:** [`README.md`](./README.md) (reference for *what* installs) ·
> [`../docs/architecture.md`](../docs/architecture.md) (how the machinery works) ·
> [`../docs/governance.md`](../docs/governance.md) (trust model & commercial arc).

## The one idea to hold onto

The overlay is **generic machinery**; the governance value is **client-specific content** you author
on top of it. The hooks match file *paths* and load *markdown* — they know nothing about Madison's
tokens — so the same plumbing drops into any repo unchanged. What's bespoke is what you pour into it.

| Generic — ships as-is | Client-specific — you author |
|---|---|
| The skill-gate hooks (match file *paths*) | The `design-system` skill (their tokens & rules) |
| The `no-raw-*` ESLint rules (the regex engine) | The token vocabulary the rules treat as on-system |
| The MCP client config | Their Storybook + components behind it |
| The `check` shape (typecheck + lint + test) | Their actual commands and CI |

`install.sh` lays the machinery in seconds. **Phases 1–2 and 5–6 are the real work** — they're where
the client's system becomes the source of truth.

## Prerequisites

- The client repo is a **git repo**, and the team uses **Claude Code**.
- **`jq`** is installed — the skill-gate hooks parse their stdin with it (the installer hard-checks).
- The repo has a **component directory** with a stable path prefix (e.g. `src/components/`).
- A way to run **typecheck + lint + test** in CI (any package manager).
- *(Recommended)* **Storybook** over their components, or a plan to host one.

---

## Phase 0 — Discovery & audit · *½–1 day*

**Goal:** know what "on-system" will mean for this client before installing anything.

**Do**
1. Inventory where design values live today: raw hex, Tailwind color scales, shadcn
   `--background`/`--primary`/`--destructive` vars, inline styles, ad-hoc spacing.
2. Locate the component directory (the future gated path) and the CI config.
3. Note the styling stack (Tailwind? CSS modules? CSS-in-JS?) and any existing token build.

**Done when** you can name (a) the gated path, (b) the top 10–20 values to tokenize, (c) where CI runs.

---

## Phase 1 — Tokens: make code the source of truth · *the real work*

**Goal:** reverse the usual Figma→code dependency. One file becomes the single source of truth for
design tokens; CSS is generated from it.

**Do**
1. Establish a token dictionary. The kit's `packages/ui/src/ui/tokens.tsx` +
   `scripts/generate-theme.ts` are the reference shape: hand-edited tokens → generated CSS variables
   and utility classes.
2. Adopt the conventions that make this robust: **HSL channels** (so opacity modifiers like
   `bg-success/10` work), **semantic triads** (base/subtle/fg per status), **neutral-first**.
3. If the client is shadcn-flavored, map legacy vars → semantic tokens using the skill's
   [`references/migration.md`](../.agents/skills/design-system/references/migration.md).
4. Wire one surface "on the system" as a pilot (the CSS header import pattern; see the skill's
   [`references/setup.md`](../.agents/skills/design-system/references/setup.md)).

**Verify** changing a token regenerates CSS and visibly re-themes the pilot (light **and** dark).

**Done when** code — not Figma — is what you edit to change the look.

---

## Phase 2 — Author the `design-system` skill to *their* vocabulary · *highest leverage*

**Goal:** when the gate fires and Claude loads `design-system`, it loads **the client's** rules.

**Do**
1. Rewrite `.agents/skills/design-system/SKILL.md`: their token names, their do/don't, their utility
   vocabulary, the opacity/contrast gotchas for *their* stack. Keep the philosophy headers
   (neutral-first, semantic triads, no hardcoded colors) — swap the specifics.
2. Update `references/migration.md` to map *their* legacy classes → tokens — this is what Claude
   consults when porting old code.
3. Keep it tight and prescriptive. This file is read into context on every guarded edit; bloat costs
   tokens on every single edit.

**Verify** a teammate reading only `SKILL.md` can restyle a component correctly without asking.

**Done when** `SKILL.md` describes the client's system, with zero Madison-specific tokens left.

> The generic `react`, `typescript`, and `testing` skills usually ship as-is. Tune only if the
> client's conventions genuinely differ.

---

## Phase 3 — Install the overlay · *minutes*

**Goal:** drop the machinery into the client repo.

**Do** — run from the kit, pointing at the client repo and its component path:
```bash
./overlay/install.sh ../client-repo "src/components/" main
```
This copies the three skill-gate hooks plus the session-freshness gate (`check-main-freshness.sh`,
base branch parameterized by the third arg, default `main`), writes a `skill-requirements.json`
gating `src/components/` → `design-system`, installs a **gate-only** `settings.json` (or a
`settings.madison.json` to merge if one already exists — it never clobbers), the four skills + the
`.claude/skills` symlink, the three `no-raw-*` rules, and `.mcp.json`.

**Verify** `git status` in the client repo shows the new `.claude/`, `.agents/`, `eslint/`,
`.mcp.json`. If a `settings.madison.json` was emitted, merge its `"hooks"` block into the existing
`settings.json`, then delete the temp file.

**Done when** `.claude/hooks/` holds the four gate scripts and `settings.json` wires them
(Pre/PostToolUse + SessionStart/PostCompact) — no dangling references.

> **Note:** the installer ships the **gate**, not the kit's demo prompt-router. Routing is optional
> and client-specific — see Phase 7.

---

## Phase 4 — Wire & tune the ESLint rules · *½ day*

**Goal:** off-system *values* fail the build, not just review.

**Do**
1. Compose the three rules into one `madison` plugin in the client's flat config (mirrors the kit's
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
     // ...their config...
     { files: ["**/*.{ts,tsx}"], plugins: { madison }, rules: {
       "madison/no-raw-colors": "error",
       "madison/no-raw-dimensions": "error",
       "madison/no-raw-rings-zindex": "error",
     } },
   ];
   ```
2. Tune what counts as on-token to the client's scale (the regexes are generic; "allowed" = their
   token names). Expect a first pass of violations — fix them, or start at `warn` and ratchet to
   `error` as you burn the backlog down.

**Verify** a deliberate `bg-indigo-500` / `p-[17px]` / `ring-2` fails `eslint`.

**Done when** lint is `error`-level and green on the pilot surface.

---

## Phase 5 — Storybook + MCP over their components · *½–1 day*

**Goal:** Claude reads the client's **real** component APIs and token bindings instead of guessing.

**Do**
1. Add `@storybook/addon-mcp` + `features: { componentsManifest: true }` to their `.storybook/main.ts`.
2. Point the installed `.mcp.json` at their Storybook's `/mcp` URL (a local port, or a hosted
   Chromatic URL for teams without local setup).
3. Enrich a few key stories with token-binding descriptions so the manifest is rich.

**Verify** ask Claude *"what props does `<their Button>` take and which tokens?"* — it answers from the
manifest, not a guess.

**Done when** the MCP server resolves and returns their components.

---

## Phase 6 — CI: the merge gate · *½ day*

**Goal:** green check = mergeable, enforced on every PR — not just locally.

**Do**
1. Add a CI job running their **typecheck + lint + test** (the `check` shape; the kit's
   [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml) is the reference).
2. Add **`react-doctor`** at `--fail-on error` as a parallel job (errors block; warnings annotate).
3. Make the check **required** for merge via branch protection.

**Verify** open a throwaway PR with an off-system color → CI red. Fix on-token → green.

**Done when** no PR merges without a green check.

---

## Phase 7 — *(optional)* plain-language routing · *½ day*

The overlay installs the **gate**, not the kit's demo router. If the client wants plain-language
prompts mapped to *their* workflows:

**Do** author a `route-prompt.sh` on `UserPromptSubmit` (the kit's `.claude/hooks/route-prompt.sh` is
the template) pointing at *their* scaffolds, commands, and docs — never the kit's. Wire it in
`settings.json`. It must **never block** (always `exit 0`); it only injects advisory context, so a
wrong guess is harmless.

**Done when** a free-typed *"build me a pricing page"* routes to the client's build flow.

---

## Phase 8 — Acceptance test: prove the gate fires · *15 min, with the client watching*

This is the demo that sells the engagement — run it in *their* repo.

1. **Start a fresh Claude Code session** (markers reset on session start).
2. Ask Claude to edit a component under the gated path **without** loading the skill → the
   **PreToolUse gate blocks** with `SKILL GATE BLOCKED: … design-system`. The edit does not happen.
3. Claude loads the `design-system` skill → a marker is written → the retry **passes**.
4. Land an off-system color and watch **CI go red**; fix it on-token → **green**.

**Done when** the client has *seen* both the gate and CI stop off-system work in their own repo.

---

## Phase 9 — Enablement & govern over time

- **Trust tiers are policy, not magic.** The overlay enforces *on-system* (gate + CI). *Who* may
  change tokens, the gates, or the skill is a **review** decision — enforce it with `CODEOWNERS` +
  branch protection on the token file, `.claude/`, and `eslint/`. (See
  [`../docs/governance.md`](../docs/governance.md).)
- **Quarterly:** token-usage audit · guardrail health (gates fire, check green on `main`, MCP
  current) · how many non-technical seats are safely contributing.
- **Keep `SKILL.md` and stories current** — they are the agent's source of truth; stale docs =
  stale agent.

---

## Verification checklist (sign-off)

- [ ] Editing a token regenerates CSS and re-themes both light and dark.
- [ ] `SKILL.md` describes the client's system; no Madison tokens remain.
- [ ] `.claude/hooks/` has the four gate scripts; `settings.json` wires them with no dangling refs.
- [ ] `skill-requirements.json` gates the client's real component path.
- [ ] `eslint` errors on `bg-indigo-500` / `p-[17px]` / `ring-2`.
- [ ] MCP resolves and returns the client's components.
- [ ] CI (check + `react-doctor`) is required for merge.
- [ ] Live: the gate blocks a skill-less edit; CI blocks an off-system color.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Gate never fires | File path matches no `skill-requirements.json` pattern | Confirm the gated prefix matches the real component path |
| Gate fires but won't unlock | The `on-skill-loaded` marker isn't being written | Check `jq` is installed; inspect `.claude/.skill-gates/<session>/` |
| Gate re-fires after a while | New session / compaction reset the markers (by design) | Load the skill once per session — this is expected |
| A hook errors on every prompt | A `UserPromptSubmit` hook references a missing script | You wired routing (Phase 7) but didn't install the script |
| `eslint` passes off-system values | Rules not at `error`, or wrong `files` glob | Re-check the flat-config wiring |

## Uninstall / rollback

The overlay is additive. To remove it: delete the four hook scripts
(`.claude/hooks/{enforce,on-skill-loaded,clear}-skill-gates.sh` and
`.claude/hooks/check-main-freshness.sh`), the `"hooks"` block in `settings.json`, the
`.claude/.skill-gates/` and `.claude/.sync-gate/` markers, the `eslint/no-raw-*.js` rules and their
config wiring, and `.mcp.json`. The skills under `.agents/skills/` and your tokens are yours to keep.
