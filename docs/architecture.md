# Architecture — How Madison Fits Together

> **Engineer's deep-dive.** Read this to understand the machinery end-to-end. It traces the data
> flow through every moving part and ends with "follow-the-flow" walkthroughs and an FAQ. For the
> *why* (governance, commercial), see [`governance.md`](./governance.md) and
> [`business-model.md`](./business-model.md).

---

## 1. Two products in one repo

- **The kit** (this whole repo) — a full standalone Turborepo: token engine + primitives + sandbox
  + Storybook + governance. Now **Madison's design system**; as a complete standalone setup it also
  serves as the reference implementation and clone-for-greenfield template.
- **The overlay** ([`overlay/`](../overlay)) — just the **governance layer**, extracted so it
  **installs into a client's existing repo**. You never hand a client the kit; you install its overlay.

Everything below is the kit. §10 covers the overlay.

---

## 2. Repo map

```
ai-kit/
├─ packages/ui/            @madison/ui — the design system
│  ├─ src/ui/tokens.tsx        ← SOURCE OF TRUTH for all design tokens
│  ├─ scripts/generate-theme.ts ← tokens.tsx → dist/*.css (the build)
│  ├─ dist/                    ← generated CSS (gitignored)
│  ├─ src/primitives/          ← 18 primitives (button, card, alert, …) + index.ts barrel
│  ├─ src/theme/               ← ThemeProvider (light/dark)
│  ├─ src/ui/style-guide.tsx   ← living visual spec of every token
│  ├─ src/stories/             ← Storybook stories (feed the MCP manifest)
│  └─ .storybook/              ← Storybook config (port 6007 + MCP)
├─ apps/sandbox/           @madison/sandbox — on-system Vite app for prototypes
│  └─ src/prototypes/<slug>/{index.tsx, meta.ts}  ← self-register via import.meta.glob
├─ .agents/skills/         design-system · react · typescript · testing  (the conventions)
├─ .claude/                hooks/ (skill-gate engine) · settings.json · skills→../.agents/skills
│  └─ commands/               ← the contributor workflows as slash commands (§6g)
├─ turbo/generators/       gen:prototype · gen:promote
├─ eslint/                 no-raw-{colors,dimensions,rings-zindex}.js — token-lint rules (shippable)
├─ overlay/               install.sh + README — drop governance into an existing repo
├─ docs/                  these docs
└─ turbo.json · package.json · eslint.config.js · tsconfig.base.json   (workspace plumbing)
```

Tooling: **bun** workspaces (`packages/*`, `apps/*`) + **turbo** task runner. No webpack/jest —
Vite + Vitest + tsc + ESLint.

---

## 3. The token pipeline (the heart of the system)

Everything visual flows from one file. This is the single most important concept.

```
 packages/ui/src/ui/tokens.tsx                (hand-edited: hex values, light/dark, semantic triads)
        │  bun run build  →  scripts/generate-theme.ts
        ▼
 packages/ui/dist/theme.css                   :root{ --bg-surface: 0 0% 100%; … } + .bg-surface{…} utilities
 packages/ui/dist/tailwind-tokens.css         @theme inline { --color-surface: hsl(var(--bg-surface)); … }
        │  imported via the 4-line CSS header
        ▼
 apps (sandbox, Storybook, client app)        use `bg-surface`, `text-primary`, `bg-success/10`, …
```

**Why HSL channels, not hex.** Tokens are stored as raw HSL *channels* (`240 6% 90%`, no `hsl()`
wrapper) so Tailwind can inject an alpha: `bg-success/10` → `hsl(var(--semantic-success) / 0.1)`.
Hex can't do that. This is why opacity modifiers "just work."

**The two CSS layers (a subtle but important gotcha):**
| | Source | Example | Opacity? |
|---|---|---|---|
| **Static utilities** | `dist/theme.css` | `.border-default { border-color: hsl(var(--border-default)); }` | **No** (`border-default/40` is silently ignored) |
| **Tailwind `@theme` colors** | `dist/tailwind-tokens.css` | `--color-surface: hsl(var(--bg-surface))` | **Yes** (`bg-surface/50` works via `color-mix`) |

So `bg-surface/50` works but `border-default/40` doesn't — for opacity on borders you use the
arbitrary form `border-[hsl(var(--border-default)/0.4)]`. (The `design-system` skill documents this.)

**The 4-line header** that puts an app "on the system" (see `apps/sandbox/src/index.css`):
```css
@import "tailwindcss";
@source "../../../packages/ui/src";                     /* scan primitives for class names */
@import "../../../packages/ui/dist/theme.css" layer(design-system);   /* vars + static utilities */
@import "../../../packages/ui/dist/tailwind-tokens.css";              /* @theme color registrations */
```

Those four imports are the system wiring. (In `apps/sandbox/src/index.css` you'll also see
`@import "tw-animate-css";` for animation utilities and a `@custom-variant dark` — neither is part
of the Madison wiring.)

**Brand is a token default (Madison — Neon Blue), still overridable in ~3 lines.**
`--brand-primary/-foreground/-subtle` default to Neon Blue in `tokens.tsx`, so apps inherit the
Madison brand with no per-app CSS. The tokens remain override-able in ~3 lines (the "re-skin live"
mechanism) if a sub-app ever needs a different accent.

**`dist/` is generated, not committed** (gitignored). `turbo dev` has `dependsOn: ["build"]`, so
`bun run dev` regenerates the CSS before starting Storybook/sandbox. Never hand-edit `dist/`.

---

## 4. Primitives (`packages/ui/src/primitives`)

Each primitive is a small, on-token React component. The conventions:

- **Plain function components** taking `React.ComponentProps<…>`. **No `forwardRef`** — in React 19
  `ref` is a normal prop and flows through `{...props}`. (No primitive uses `forwardRef` — the
  whole set was modernized off it.)
- **`cn(...)`** = `twMerge(clsx(...))` — merges incoming `className` last so consumers can override.
- **`cva`** for variants (button/badge/alert) — variants map to token classes, never booleans-soup.
- **Only token classes** — `bg-surface`, `text-primary`, `bg-error-subtle`. No raw `bg-zinc-800`.

**Public API is explicit** (not glob): `packages/ui/package.json` `exports` maps each subpath
(`"./button": "./src/primitives/button.tsx"`), and `src/primitives/index.ts` re-exports each member
by name (no `export *`). An app imports `import { Button } from "@madison/ui/button"`. TypeScript
resolves the `.tsx` source directly (bundler resolution + the `exports` map) — there's no compile
step for the components; Vite/Storybook transpile them.

---

## 5. `apps/sandbox` — the on-system playground

A Vite + React app (port 5173) wired on-system via the 4-line header. It's where contributors
(human or agent) build prototypes. The clever bit is **zero-config self-registration**:

```
src/prototypes/<slug>/
├─ index.tsx   ← default-exported page component   (LAZY-loaded → code-split per prototype)
└─ meta.ts     ← default-exported { title, description }   (EAGER-loaded → powers the gallery)
```

`App.tsx` discovers them with two `import.meta.glob` calls — eager over `meta.ts`, lazy over
`index.tsx` — and generates routes + the gallery. **Drop a folder in, it appears. No central file to
edit.** (The two-file split is deliberate: eager-loading only the tiny `meta.ts` keeps the gallery
rich while the page components stay code-split.)

---

## 6. The governance machinery (the differentiator)

This is what makes "non-technical people ship into the real repo, safely" true. Four layers, each
catching a different class of mistake.

### 6a. The skill-gate — *path-based, enforced by the Claude Code harness*

Three bash hooks implement the gate, wired in `.claude/settings.json` (a fourth hook,
`route-prompt.sh`, is wired there too but is unrelated to gating — see §6f):

| Hook | Event | Job |
|---|---|---|
| `enforce-skill-gates.sh` | **PreToolUse** `Edit\|Write` | Block the edit (exit 2) if a required skill isn't loaded |
| `on-skill-loaded.sh` | **PostToolUse** `Skill` | Write a per-session marker when a skill loads |
| `clear-skill-gates.sh` | **SessionStart / PostCompact** | Wipe markers (fresh session / after compaction) |

`skill-requirements.json` maps **path patterns → required skills**:
```json
{ "rules": [
  { "pattern": "\\.test\\.(ts|tsx)$", "skills": ["testing"] },
  { "pattern": "/__tests__/",         "skills": ["testing"] },
  { "pattern": "\\.module\\.css$",    "skills": ["design-system"] },
  { "pattern": "packages/ui/",        "skills": ["design-system"] }
] }
```

**The flow** (the demo everyone sees):
```
edit packages/ui/button.tsx
   → enforce hook: no marker for "design-system" → exit 2, "SKILL GATE BLOCKED: … design-system"
   → agent loads the design-system skill (Skill tool)
   → on-skill-loaded hook writes .claude/.skill-gates/<session>/design-system
   → retry the edit → marker exists → passes
```

Markers live under `.claude/.skill-gates/<session-id>/<skill>` (per-session, gitignored), so loading
a skill once per session unlocks it; a fresh session or compaction forces a reload (the rules stay
fresh). **Honest scope:** the hook matches *file paths*, not file *content* — it gates design-system
*files*, not every `className`. Content discipline is §6c.

### 6b. The skills (`.agents/skills/`, symlinked to `.claude/skills`)

Markdown conventions the agent loads on demand: **design-system** (the token vocabulary + the
two-layer/opacity/contrast rules), **react** (dumb-vs-smart, component rules), **typescript**
(the `any` ban, prop typing), **testing** (Vitest conventions). `design-system` + `testing` are
hard-gated (above); `react`/`typescript` are advisory (load proactively).

### 6c. The content gate — the `no-raw-*` ESLint rules (CI-enforced)

Three sibling rules in `eslint/`, all wired at `error` in `eslint.config.js` under the `madison`
plugin, flag off-system *values* inside any string literal — exactly what the path-gate can't see:

- **`no-raw-colors`** — raw Tailwind color scales (`bg-indigo-500`) and arbitrary hex (`text-[#3b82f6]`).
- **`no-raw-dimensions`** — arbitrary spacing/type lengths (`p-[17px]`, `gap-[13px]`, `text-[40px]`)
  and arbitrary line-heights (`leading-[1.4]`, `leading-[28px]`), pushing you onto the tokenized scale
  (`p-4`, named steps like `py-section`, `text-xl`, `leading-snug`). Brackets that *reference* a token
  (`p-[var(--spacing-card)]`, `leading-[var(--leading-snug)]`) are allowed. Line-height carries **two**
  extra patterns of its own: one because its values are legitimately **unitless** (every other scale
  here requires a unit), and one banning the numeric form `leading-7` — which *looks* like the on-token
  numeric spacing scale but resolves through `--spacing` to a fixed `1.75rem`, pinning line-height
  against the font-size instead of scaling with it. `leading-none` is deliberately allowed: it's a
  Tailwind *static* utility hardcoded to `1`, so it sits outside the `--leading-*` namespace and no
  token governs it — but it never reads the theme, so unlike an undeclared step it cannot drift.
- **`no-raw-rings-zindex`** — focus-ring widths/offsets and z-index magic numbers, *including the
  numbered utilities* (`ring-2`, `ring-offset-2`, `z-50`) — because those hardcode px/index instead of
  referencing `--ring-width` / the named `--z-*` layers (`z-modal`, `z-tooltip`). Use
  `ring-[length:var(--ring-width)]` and the named z-scale.

They all ride `bun run check` (§9), so off-system values fail on every diff.

### 6d. The merge gate — `bun run check`

`turbo run typecheck test && eslint .` — TypeScript + Vitest + ESLint (incl. the `no-raw-*` rules). This
is **the** gate: green check = mergeable. Runs locally and in CI.

### 6e. The health gate — `react-doctor` (CI)

A React code-health linter (security/perf/a11y/correctness) run in CI at `--fail-on error` (errors
block; warnings annotate the PR). Distinct from §6c — react-doctor lints *React*, not *tokens*.

**The gate matrix** (what catches what):
| Layer | Enforced by | Catches |
|---|---|---|
| Skill-gate | PreToolUse hook | Editing `packages/ui`/`.module.css`/tests without the right skill loaded |
| Type / test | `bun run check` (CI) | Type errors, failing tests |
| Off-system values | `no-raw-{colors,dimensions,rings-zindex}` → `bun run check` (CI) | `bg-indigo-500`/`text-[#hex]`, `p-[17px]`/`text-[40px]`/`leading-[1.4]`/`leading-7`, `ring-2`/`z-50` |
| React health | `react-doctor` (CI) | Security/perf/a11y/correctness issues |

### 6f. The prompt router — `route-prompt.sh` (*not a gate*)

A fourth hook on **UserPromptSubmit**, wired in the same `settings.json`. It **never blocks** (always
exits 0): it classifies a free-typed, plain-language request into one of the approved workflows
(**build · restyle · undo · submit · promote**, plus a **maintainer** heads-up for gate/token-engine
territory) and injects a short, governance-aware playbook as context — so the agent stays on the rails
even on a vague prompt or after compaction. A wrong guess is harmless: it only adds an advisory pointer
(and, for maintainer territory, a non-blocking `systemMessage`). It mirrors the catalog in
[`prompts.md`](./prompts.md) and the `.claude/commands/` (§6g). (This is the "plain-language
contributor" layer from `AGENTS.md`: the path-gate enforces, the router *guides*.)

Note there is deliberately **no `small-edit` branch**. The `restyle` pattern already matches `font`,
`spacing`, `bigger`, `smaller` — and no regex reliably separates "small" from "big". So the `restyle`
playbook itself carries a pointer to the fast lane, rather than the router pretending to a judgement
it can't make.

**Branch order is load-bearing**, and `undo` is where it bites. It sits above `build`/`restyle` in the
`elif` chain, so a loose pattern there doesn't just mislabel an undo — it *hijacks* the branch below.
Two tempting patterns are deliberately excluded for exactly that reason: a bare `never mind` (it
usually introduces a **new** request — *"never mind, build me a pricing page instead"*) and a bare
`go back to` (almost always navigation — *"go back to the landing page and add a section"*). Both are
anchored instead to phrasing that can only mean reverting (`go back to how/what/the way/the previous`).
When adding a pattern to any branch, test it against the *other* kinds' example prompts, not just its
own — the pipeline in [`prompts.md`](./prompts.md) exists for this.

### 6g. The commands layer — `.claude/commands/`

The workflows a contributor can invoke by name. **Filename = command name**: `restyle.md` → `/restyle`.
There is no registry to update.

Two entry points, one set of instructions. A contributor who types `/restyle …` loads the command file
directly; one who types *"make our main color green"* gets §6f's router injecting a condensed version
of the same playbook. Keeping those two in sync is manual — when you change a command, check
`route-prompt.sh` and [`prompts.md`](./prompts.md).

**Authoring conventions** (read `restyle.md` for the plain shape, `small-edit.md` for the
cost-controlled one):

- Frontmatter `description` (one imperative line) + `argument-hint` (plain language, with an `e.g.`).
- First body line restates the persona and the request as `**$ARGUMENTS**`.
- Then "do all the technical work yourself" plus a pointer to `AGENTS.md` or a doc.
- Numbered steps, each opening with a **bolded imperative title.**
- Always a `bun run check` step and a "report outcomes only" step.
- Close with the trust tier the work lands in.

**The frontmatter that controls cost and scope.** These are Claude Code fields, not repo conventions,
and they are what makes a one-line tweak cost less than a page build:

| Field | What it does here |
|---|---|
| `model` · `effort` | Pins a cheaper model / lower reasoning effort **for that command's turn only** — not saved to settings, the session model resumes on the next prompt. `/small-edit` and `/undo` use `sonnet`. |
| `allowed-tools` | Pre-approves a narrow tool set so the command runs without permission prompts. **It grants, it does not restrict** — every other tool stays callable, governed by normal permissions. `disallowed-tools` is the field that removes tools. Either way the grant clears on the next message. |
| `disable-model-invocation` | Stops Claude from firing the command on its own. Set on anything with side effects (`/undo`), so reverting is always the contributor's call. |
| `` !`cmd` `` in the body | Runs at invocation and injects the output. `/small-edit` uses `` !`ls apps/sandbox/src/prototypes` `` so it starts knowing the page list instead of spending a turn discovering it. This is *preprocessing* — it runs before Claude sees anything, so it needs no `allowed-tools` entry of its own. |

**Two failure modes to check when authoring a command,** both of which surface as a permission prompt
in front of the one person the command exists to shield:

- **Every command a step tells you to run must be granted.** If the body says "run `bun run check`",
  `allowed-tools` needs it. A maintainer won't notice the omission — their gitignored
  `settings.local.json` already allows `Bash(bun *)`; a fresh contributor's does not.
- **`Bash(...)` rules are literal unless you glob.** `Bash(bun run check)` matches *only* that exact
  string, so `bun run check --filter …` prompts. Prefer `Bash(bun run check*)`.

The inverse is just as sharp: **don't grant what no step asks for.** A tool in `allowed-tools` that the
body never mentions is silent latitude to do something the prose never sanctioned.

**Scope caveat:** `.claude/commands/` is deliberately **not** part of the shippable overlay (§10) —
the commands hard-code kit paths (`apps/sandbox`, `gen:prototype`), so they'd break in a client repo.
The overlay ships the gates, skills and lint rules; the commands stay kit-scoped until those paths are
parameterized.

---

## 7. Generators (`turbo/generators`)

Two `turbo gen` (plop) generators. Their *difference* teaches the architecture:

- **`gen:prototype`** → `addMany` (adds files only). Works because the sandbox **auto-discovers** via
  `import.meta.glob` — nothing central to edit.
- **`gen:promote`** → `add` the primitive + story, then **`modify`** two existing files: insert the
  `exports` entry into `package.json` (anchored on `"exports": {`) and the barrel re-export into
  `index.ts` (anchored on a `// @gen:promote anchor` comment). It *has* to edit those because
  `packages/ui` exposes an **intentional, explicit public API** — there's no glob magic there
  (that's the typescript skill's "no `export *`" rule). The generated shell passes `check`
  immediately; you then port the real component.

---

## 8. Storybook + MCP

`.storybook/main.ts` enables `addon-mcp` + `features: { componentsManifest: true }`. Running
`storybook dev -p 6007` serves a **components manifest** (props from TS + stories + docs) at
`http://localhost:6007/mcp`. The checked-in `.mcp.json` connects Claude Code to it. Net effect:
ask *"what props does `Button` take and which tokens?"* → answered from the **real** manifest, not a
guess. (We enriched Button/Card/Badge/Alert stories with token-binding descriptions so the manifest
is rich.)

---

## 9. Build & CI plumbing

- **`turbo.json`** task graph: `build` (`dependsOn ^build`, outputs `dist/**`), `typecheck`/`test`
  (`dependsOn ^build`), `dev` (`dependsOn build`, persistent). So typechecking the sandbox first
  builds `@madison/ui` (generating `dist/`).
- **`bun run check`** = `turbo run typecheck test && eslint .` (lint runs once from root, robust).
- **CI** (`.github/workflows/ci.yml`): two parallel jobs — `check` and `react-doctor` — on every
  push to `main` and every PR. `setup-bun@v2` (pinned 1.3.9) + `bun install --frozen-lockfile`.

---

## 10. The overlay (`overlay/`)

`overlay/install.sh <target-repo> [components-path]` extracts the kit's **live** governance files
into an existing repo:
- the 3 skill-gate hooks (verbatim) + `skill-requirements.json` (with the component path
  **parameterized**), the `settings.json` hooks block (or a `settings.madison.json` to merge if one
  exists — **never clobbers**), the 4 skills + the `.claude/skills` symlink, the three `eslint/no-raw-*.js` rules,
  and `.mcp.json`.
- Then you adapt the stack-specific bits (your tokens → the design-system skill, ESLint wiring, CI,
  Storybook). See [`../overlay/README.md`](../overlay/README.md).

It pulls from the kit's live files, so there's **no duplication to drift**. Proven by installing into
a throwaway repo and confirming the gate fires on the client's own component path.

---

## 11. Follow-the-flow walkthroughs

**Change a token.** Edit `packages/ui/src/ui/tokens.tsx` → `bun run build` regenerates
`dist/{theme,tailwind-tokens}.css` → every app/Storybook picks it up (light + dark) → verify in the
style guide. (Gate: editing under `packages/ui/` requires the design-system skill.)

**Build a page (contributor loop).** `bun run gen:prototype` → folder self-registers in the gallery
+ a route → compose `@madison/ui` primitives on-token → `bun run check` green → PR.

**Promote a component.** `bun run gen:promote` scaffolds the primitive + story + wires exports/barrel
→ port the real JSX, rewrite off-system classes via the design-system skill's `references/migration.md` → `bun run check` → it appears in
the MCP manifest → draft PR.

**The gate fires.** Edit a `packages/ui` file without `design-system` → blocked → load it → marker
written → retry passes. The clean diff is what an engineer reviews.

**Re-skin the brand.** Change the 3 `--brand-*` lines in an app's `index.css` → every brand surface
recolors, semantic colors stay constant. (The workshop "aha.")

---

## 12. "To understand X, read Y"

| Want to understand… | Read |
|---|---|
| The tokens themselves | `packages/ui/src/ui/tokens.tsx` + `src/ui/style-guide.tsx` |
| How CSS is generated | `packages/ui/scripts/generate-theme.ts` |
| A primitive's shape | `packages/ui/src/primitives/button.tsx` (cva) · `card.tsx` (simple) · `alert.tsx` (variants+icon) |
| Self-registration | `apps/sandbox/src/App.tsx` |
| The skill-gate | `.claude/hooks/enforce-skill-gates.sh` + `.claude/hooks/skill-requirements.json` + `.claude/settings.json` |
| A slash command | `.claude/commands/restyle.md` (plain) · `small-edit.md` (cost-controlled frontmatter) |
| The token-lint rules | `eslint/no-raw-colors.js` · `no-raw-dimensions.js` · `no-raw-rings-zindex.js` |
| The generators | `turbo/generators/config.ts` + `templates/` |
| The overlay | `overlay/install.sh` + `overlay/README.md` |

---

## 13. FAQ (what a CTO / engineer will ask)

- **Is this just shadcn?** The primitives are shadcn-flavored, but the product is the **token engine
  + governance-as-code** (gates + check + MCP) that keeps a whole org *on* the system. That's the moat.
- **What's enforced vs advisory?** Enforced: the skill-gate (harness), `bun run check`/CI (types,
  tests, the `no-raw-*` rules), `react-doctor` errors. Advisory: load `react`/`typescript` proactively;
  most react-doctor findings are warnings.
- **Why HSL channels?** Native opacity modifiers (`bg-success/10`). Hex can't.
- **Is `dist/` committed?** No — generated from `tokens.tsx`; `turbo dev` builds it first.
- **How does `ref` work with no `forwardRef`?** React 19 treats `ref` as a normal prop; it flows
  through `{...props}`. `forwardRef` is dead weight (react-doctor flagged it; we removed it).
- **Why bun + turbo?** Fast installs/tasks, the W3C-tokens-friendly Vite v4 stack, and the LLM-native
  story (code, not Figma's closed format, is what the agent reads).
- **How does the MCP actually help?** The agent reads true component APIs + token bindings from the
  live Storybook manifest instead of hallucinating props/classes.
- **Where's the business case?** [`business-model.md`](./business-model.md) +
  [`governance.md`](./governance.md). The one-breath pitch: *democratize a code-first design system —
  non-technical people ship real PRs into the real repo, made safe by guardrails.*
