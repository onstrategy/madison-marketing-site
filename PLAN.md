# Design System as Code — Productized Kit

## Context

Target clients want to "ditch Figma" and maintain their design system **directly in code**, usable by **non-technical people** (designers, PMs, marketing) via Claude Code. You and Vlad built `prompt-evaluator`, which already embodies most of the answer. Decisions confirmed with the user:

- **Goal:** a **repeatable, productized kit** sold to many clients — not a one-off.
- **Typical client state:** design system in **Figma, separate from code** (dual-maintenance); they have an **existing repo** (not greenfield). We make **code the source of truth**; Figma reads *from* it.
- **Audience:** designers + PMs + marketing — mostly non-terminal. Contributor UX must be near-zero-friction.
- **Required outcome:** non-technical people ship **real components into the real repo** (PRs engineers merge) — not throwaway prototypes. **Governance-as-code** makes that safe.
- **Repo strategy:** build the kit as a **separate, neutral reference/template repo** via **extract & distill** (port the proven internals, scaffold a clean structure, strip business logic). Keep `prompt-evaluator` as the **production proof/lab**.

**Why now:** "Code as source of truth" is 2026 consensus. W3C Design Tokens spec hit stable v1 (Oct 2025), explicitly because Figma's closed format was excluded from LLM training data while code wasn't. The repeatedly-cited *real* failure mode is **governance/drift, not tooling** (Shopify: 14% of admin UI drifted off Polaris in a year). **Governance-as-code is the moat almost nobody has — and you already run it in production.**

**Positioning vs Supernova (closest competitor):** Supernova is a separate SaaS sandbox that keeps non-technical people *out* of the real repo — re-creating the two-places problem + a handoff. **Our differentiator:** non-technical people produce **real PRs in the real repo**, made safe by guardrails. "You'll never be closer to your actual product" — democratized. Fits the agentric.pro identity: agentic AI applied to the design/frontend workflow.

*(Commercial model lives in its own doc — see the appendix at the end, to become `docs/business-model.md` in the kit repo.)*

---

## Repo Strategy: the Kit Repo (extract & distill)

A new **minimal Turborepo** under a **neutral demo brand** ("Northwind") — simultaneously your sales demo, the clone-per-client template, and the source of the installable overlay. Develop the kit here; **extract the overlay** from it for existing client repos.

**PORT verbatim from `prompt-evaluator`, then trim/generalize** (proven — don't rewrite):
- `.claude/hooks/{enforce-skill-gates,on-skill-loaded,clear-skill-gates}.sh` + `skill-requirements.json` + the `settings.json` hook wiring. Add `design-system` gate rules (below).
- `.agents/skills/design-system/` (SKILL.md + `references/migration.md` + `setup.md`) and `react`, `typescript`, `testing`. Fix the stale `setup.md` (cite `apps/sandbox`, not the non-existent `apps/sana`).
- Token engine: `packages/ui/src/ui/tokens.tsx`, `scripts/generate-theme.ts`, `src/ui/style-guide.tsx`, `src/ui/utils.ts` (`hexToHslChannels`, `blendHex`), `theme/ThemeProvider`.
- ~8 workshop-relevant primitives from `packages/ui/src/primitives/` (button, input, label, card, badge, select, tabs, dialog/alert-dialog, tooltip, checkbox).
- Storybook config `packages/ui/.storybook/{main,preview}.tsx` — add the MCP addon + manifest feature from day one.
- `turbo/generators/config.ts` + templates — base for the new `prototype` + `promote` generators.

**SCAFFOLD fresh (clean, intentional, kit-first):**
- Turborepo root (workspaces, `turbo.json`, base tsconfig, root `package.json`).
- `apps/sandbox` — **on the design system from day one**, wired via the canonical 4-line CSS header, with `gen:prototype` + `import.meta.glob` self-registration.
- Neutral "Northwind" brand override (3-line CSS) + a couple of showcase pages; re-skinnable live in workshops.
- `AGENTS.md`/`CLAUDE.md` (kit-focused orchestration) + the contributor recipe.
- Kit docs: `contributor-guide.md`, `governance.md`, the 30-60-90 enablement roadmap, `business-model.md`.

**STRIP / leave behind:** all business packages (CRM, billing, workflows, `features/*`, `infra/*`), `apps/{server,worker,web,tenant-portal,landing}`, the legacy shadcn token compat layer (start clean), and domain skills (`kb`, `dev-api`, `database-migrations`, blog). `perplexity-research` optional.

---

## Port-source map

All paths below are relative to the source repo root `/Users/pogadev18/Developer/ai_agents/prompt-evaluator/` (available to the new session via `--add-dir`). **Copy → trim → rename the `@prompt-evaluator/ui` package to the kit's name.**

**Token engine → `packages/ui/`**
- `packages/ui/src/ui/tokens.tsx` — token dictionary (source of truth; HSL channels, light/dark pairs, semantic triads)
- `packages/ui/scripts/generate-theme.ts` — generates `dist/theme.css` + `dist/tailwind-tokens.css` (run after porting to regenerate)
- `packages/ui/src/ui/style-guide.tsx` — living spec / visual-QA surface
- `packages/ui/src/ui/utils.ts` — `hexToHslChannels`, `blendHex` (the blend math)
- `packages/ui/src/theme/ThemeProvider.tsx` — theme/dark-mode provider
- `packages/ui/package.json` — model the `exports` map + scripts on this (don't copy deps wholesale)

**Primitives → `packages/ui/src/primitives/`** (port ~8–10 of the 29; start with): `button.tsx`, `input.tsx`, `label.tsx`, `card.tsx`, `badge.tsx`, `select.tsx`, `tabs.tsx`, `alert-dialog.tsx`, `tooltip.tsx`, `checkbox.tsx`, `separator.tsx`

**Storybook → `packages/ui/.storybook/`**
- `.storybook/main.ts` + `.storybook/preview.tsx` (port, then ADD `@storybook/addon-mcp` + `features.experimentalComponentsManifest` — new, not in source)
- `src/stories/` + `src/stories/stories.css` — story examples to mirror

**Skill-gate bundle → `.claude/`**
- `.claude/hooks/enforce-skill-gates.sh` (PreToolUse blocker), `on-skill-loaded.sh` (PostToolUse marker writer), `clear-skill-gates.sh` (SessionStart/PostCompact reset)
- `.claude/hooks/skill-requirements.json` (pattern→skills; ADD the `packages/ui/` + `.module.css` design-system rules)
- `.claude/settings.json` — copy the `hooks` block only (PreToolUse `Edit|Write`, PostToolUse `Skill`, SessionStart, PostCompact); leave behind unrelated settings/permissions

**Skills → `.agents/skills/`**
- `design-system/SKILL.md` + `references/migration.md` + `references/setup.md` (FIX the stale `apps/sana` → `apps/sandbox`)
- `react/SKILL.md`, `typescript/SKILL.md`, `testing/SKILL.md`
- `new-package/SKILL.md` — reference for generator conventions (don't necessarily ship it)

**Generators → `turbo/generators/`**
- `turbo/generators/config.ts` (the `@turbo/gen`/node-plop setup; base for new `prototype` + `promote` generators) + `turbo/generators/templates/` (existing `addMany` templates to mirror)

**Reference-only (model on these; don't copy wholesale)**
- `apps/web/src/index.css` — the canonical 4-line design-system CSS header for `apps/sandbox`
- `apps/web/package.json` (~line 54) — how an app declares the `ui` workspace dependency
- `apps/prototypes/{src/App.tsx,src/PrototypesIndex.tsx,vite.config.ts,tsconfig.app.json}` — routing structure reference ONLY (this app is OFF the design system; wire `apps/sandbox` ON it and replace manual registration with `import.meta.glob`)
- root `package.json` (`gen:*` scripts) + `turbo.json` (the `check` pipeline)

**Caveats:** tokens are HSL channels (not hex) for native opacity — keep that; the generator emits `dist/*` so don't hand-edit dist; Storybook is **10.2.13** (pin `@storybook/addon-mcp` to match); start the kit **without** the legacy shadcn compat layer.

---

## The Kit's Technical Pieces (MVP-first, demo-ordered)

**1. On-system sandbox** — `apps/sandbox/package.json` depends on the local `ui` package; `src/index.css` uses the canonical header (`@import "tailwindcss"; @source ".../ui/src"; @import ".../dist/theme.css" layer(design-system); @import ".../dist/tailwind-tokens.css";`). No legacy compat block (clean repo).

**2. Gate the `design-system` skill** *(highest demo-impact-per-effort)* — add to `skill-requirements.json`: `{ "pattern": "packages/ui/", "skills": ["design-system"] }` and `{ "pattern": "\\.module\\.css$", "skills": ["design-system"] }`. Honest scope: the hook matches **file paths, not content**, so it gates design-system *files*; `className` enforcement stays advisory (skill description) + CI (`react-doctor`/lint). Demo: agent edits a `ui` file → `SKILL GATE BLOCKED: Load … design-system` → auto-loads skill (marker written) → retry succeeds on-token. Markers reset per session/compaction → rules reload fresh.

**3. One-command prototype generator** *(the "zero-config real page" headline)* — extend `turbo gen` with a `prototype` generator (mirror the `addMany` pattern); root script `"gen:prototype": "turbo gen prototype"`. Template = a minimal **on-token** starter importing `ui` primitives. Use `import.meta.glob("./prototypes/*/index.tsx", { eager: false })` in `App.tsx` + index page → new prototypes **self-register with zero edits**; relative intra-prototype imports (no path-alias edits).

**4. Storybook MCP** *(agent knows real component APIs)* — `.storybook/main.ts`: add `'@storybook/addon-mcp'` + `features: { experimentalComponentsManifest: true }`; pin the addon to the Storybook `10.x` line. Connect via checked-in `.mcp.json`: `claude mcp add --scope project --transport http storybook http://localhost:6007/mcp`. Client-without-setup: host via Chromatic, point at the hosted `/mcp` URL. Add Card/Badge token-binding stories so the manifest is rich for the demo.

**5. PROMOTE path (sandbox → production)** *(makes "real components in the real repo" true)* — documented checklist + (later) a `gen:promote` generator scaffolding `packages/ui/src/primitives/<name>.tsx` + `src/stories/<Name>.stories.tsx` + the `exports` entry. Flow: pick validated prototype component → gate forces loading `design-system`+`react`+`typescript` → port JSX/props, rewrite off-system classes via `migration.md`, strip prototype cruft → `bun --filter ui build` + `bun run check` (the real gate) → PR. New component then appears in the MCP manifest.

**6. Kit docs** — `contributor-guide.md` (the 5-step "context recipe": load design-system skill → use Storybook MCP → follow AGENTS.md → `gen:prototype` → `bun run check` → PR; a "never do this" block; the **trust-levels matrix**: auto-merge = sandbox copy/content; draft-PR = any `ui`/token change; suggest-only = token deprecations, `generate-theme.ts`, editing the gates themselves). `governance.md` (three-layer context model + governance-as-code narrative + token request/review/deprecation + quarterly audit).

**Installable overlay (for existing client repos):** the generic drop-in subset — `.claude/` hook bundle + `design-system` skill + Storybook-MCP recipe + the generators. Extract from the kit repo once stable (later phase).

---

## The Enablement Workshop (Phase 2 design)

- **Pre-work** (night-before + morning-of; skipping costs 20–30 min): Claude Code installed & working, repo/template access, Storybook running or hosted MCP URL, accounts.
- **Ratio:** ~30% watch / 70% build. Half-day (~3–4h).
- **Arc:** (1) *Why* (15m) — code as source of truth, death of dual-maintenance. (2) *Killer demo* (20m, nobody types) — client brand: prompt → agent loads design-system skill (gate) → pulls real `Card`/`Button` from Storybook MCP → emits on-token component → tries a custom red hex → `bun run check` flags off-system → clean PR. **That loop is the entire value prop made visible.** (3) *Build together* (15m) — everyone runs `gen:prototype` → routed on-token page (the "aha"). (4) *Recipe + guardrails* (10m). (5) *Real build* (90m) — each builds a real component; facilitators circulate every 10 min. (6) *Promote + PR* (20m) — one component through the promote path, `bun run check` green, engineer merges. (7) *Demos + retro* (15m).
- **Leave-behind:** the kit + a recorded walkthrough + a **30-60-90 enablement roadmap** (champions, office hours, internal pattern library).

---

## Figma → Code migration spine (Phase 1, in client repo)

- Establish `tokens.tsx` (DTCG-aligned) as the **single source of truth**; generate CSS via `generate-theme.ts`. Map the client's Figma variables → semantic tokens (use `migration.md` as the pattern; no numbered scales).
- **Reverse the dependency graph:** code → tokens → (optional) Figma sync, not Figma → code.
- Stand up Storybook + MCP over their real components; install the overlay (`.claude/` gates + skills + generators) + wire `bun run check` CI as governance-as-code.

---

## Build order (in the new kit repo)

1. Scaffold the minimal Turborepo + Northwind brand; port the **token engine** + ~8 primitives; get Storybook running.
2. Port the **`.claude/` skill-gate bundle** + the `design-system`/`react`/`typescript` skills; **gate the design-system skill**.
3. Build `apps/sandbox` **on-system**; add **`gen:prototype` + glob self-registration** + on-token starter template.
4. Add **Storybook MCP** (addon + manifest + `.mcp.json`) + a few token-binding stories.
5. Promote one component sandbox → `packages/ui` live; `bun run check` green.
6. Write **contributor-guide.md** (recipe + never-do + trust matrix); seed `governance.md`; create `docs/business-model.md` from the appendix.

---

## Verification (prove the kit end-to-end, in the new repo)

1. `bun install`; start Storybook (port 6007); confirm the MCP manifest at `http://localhost:6007/mcp`.
2. In Claude Code, ask "what props does `Button` take and which tokens?" → answered from the manifest (MCP works).
3. `bun run gen:prototype -- --args demo "Demo"` → visit the sandbox; the route exists with zero manual edits, rendering on-token.
4. Ask the agent to edit a `packages/ui` file *without* loading the skill → observe `SKILL GATE BLOCKED` → it loads `design-system` → retry succeeds (gate works).
5. Promote one component into `packages/ui` with a story; `bun run check` → green.

---

## Kicking off the kit repo in a new session

The build happens in a **fresh Claude Code session rooted in the new folder** (clean slate; its own ported `CLAUDE.md` + gates — so we don't fight this repo's skill-gates while scaffolding a different tree). To make that session aware of everything:

1. *(Recommended)* copy this plan into the new repo so it's local + versioned: `cp ~/.claude/plans/i-want-you-to-linked-cookie.md <new-folder>/PLAN.md`
2. `cd <new-folder>` and run `claude`.
3. Paste this kickoff prompt as the first message:

> We're building a new repo from scratch: an AI-native, **code-first design system kit** under a neutral demo brand ("Northwind") that we'll productize for clients (setup + enablement + governance retainer). Read `./PLAN.md` first — it has the full strategy, repo plan, and build order.
>
> This kit is **extracted** from an existing production repo at `/Users/pogadev18/Developer/ai_agents/prompt-evaluator`. Before porting, read that repo's `AGENTS.md`, `CLAUDE.md`, and `.agents/skills/design-system/SKILL.md` to absorb conventions. Then **port** the proven pieces listed under "Repo Strategy → PORT" (the `packages/ui` token engine + ~8 primitives, the `.claude/hooks` skill-gate bundle + `settings.json` wiring, the `.agents/skills/{design-system,react,typescript,testing}` skills, the Storybook config, the `turbo/generators`). **Strip all business logic.**
>
> Start with build-order step 1: scaffold a minimal Turborepo (bun + turbo), port the token engine + ~8 primitives, get Storybook running on port 6007. Don't start long-running dev servers yourself — I'll run them. Run `bun run check` before concluding each step. Also create `docs/business-model.md` from the "Commercial ideas" appendix in `PLAN.md`.

*(Alternative: I can scaffold from this session via absolute paths into the new folder — but the fresh session is cleaner.)*

---

## Open items

- Repo name + final brand; the one real component to showcase in the demo.
- Discovery call with the client to confirm their stack, brand tokens, attendees, and the component each attendee will build.

---

## Appendix — Commercial ideas *(→ extract into `docs/business-model.md`)*

De-emphasized here by request; captured for later. Idea-level, not committed.

- **Three-phase engagement:** (1) Setup/Migration — fixed-fee, scoped post-discovery; (2) Enablement Workshop — fixed per-cohort fee, includes the leave-behind kit; (3) Governance-as-code Retainer — monthly recurring (audits, token lifecycle, gate/CI upkeep, office hours). The retainer is the recurring-revenue engine.
- **Productized tiers:** *Starter* (self-serve template + docs, low-touch / open-core) → *Done-with-you* (workshop + overlay install) → *Done-for-you + retainer* (high-touch).
- **Open-core lead-gen:** open-source the neutral "Northwind" kit as a credibility magnet + top-of-funnel; monetize install, enablement, retainer, and premium skills/generators.
- **Retainer pricing levers:** repo size, # of components/tokens, audit cadence, # of enabled non-technical seats.
- **v2 / optional SaaS:** a hosted "governance dashboard" — drift audits, token-usage reports, hosted MCP. Bigger build; only if the services motion proves demand.
- **Verticalized templates:** pre-branded kits for common stacks (e.g. Next.js/shadcn shops) to shorten setup.
- **Training-as-product:** recorded "design-system-as-code" course + a contributor certification.
- **Ecosystem partnerships:** Storybook/Chromatic (MCP hosting), AI-tooling communities.
- **ICP:** scale-ups with a Figma design system + a real codebase + AI-curious leadership; design-system teams feeling Figma/code drift pain.
