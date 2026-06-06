# Agent Guidelines — Northwind Design System Kit

High-level mandate for all AI agents working in this repo. Detailed recipes live in
**Skills** under `.agents/skills/`; load them before editing.

## What this project is

**Northwind** is an AI-native, **code-first design system kit**. Code is the single source
of truth for design tokens and components; non-technical contributors (designers, PMs,
marketing) ship real components into the real repo through Claude Code, made safe by
**governance-as-code** (skill gates + `bun run check`). It doubles as the sales demo and the
clone-per-client template. See [`PLAN.md`](./PLAN.md) for the full strategy.

## Architecture

Code flows downward — apps depend on packages, never the reverse.

```
apps/sandbox   (@northwind/sandbox)  on-system Vite app; hosts on-token prototypes
      │  depends on
      ▼
packages/ui    (@northwind/ui)       the design system: tokens → CSS, primitives, Storybook
```

- **`packages/ui`** — the system. Token dictionary `src/ui/tokens.tsx` (source of truth) →
  `scripts/generate-theme.ts` generates `dist/theme.css` + `dist/tailwind-tokens.css`.
  Primitives in `src/primitives/`. Theme provider in `src/theme/`. Storybook in `.storybook/`
  (port 6007) with the MCP manifest (`componentsManifest`).
- **`apps/sandbox`** — prototypes live in `src/prototypes/<slug>/` (`index.tsx` + `meta.ts`)
  and self-register via `import.meta.glob`. Wired to the system via the canonical 4-line CSS
  header in `src/index.css`.
- **`.agents/skills/`** — the conventions (design-system, react, typescript, testing),
  symlinked into `.claude/skills`.
- **`.claude/hooks/`** — the skill-gate bundle (enforces skill loading on guarded paths).
- **`turbo/generators/`** — `gen:prototype` (and, planned, `gen:promote`).

## Core mandates

- **Load skills before editing.** A PreToolUse gate **blocks** Edit/Write under `packages/ui/`
  and any `.module.css` until the **`design-system`** skill is loaded, and on `*.test.ts(x)` /
  `__tests__/` until **`testing`** is loaded. Load `react`/`typescript` proactively for
  component/TS work (advisory). Load once per session; markers reset on a new session or after
  compaction.
- **On-token only.** Never use raw Tailwind colors (`bg-gray-800`), hex/rgb in `className`, or
  shadcn-style legacy classes (`bg-card`, `text-foreground`). Use the token vocabulary from the
  `design-system` skill. Color is a signal, not decoration (neutral-first).
- **Verification loop.** For implementation work, run **`bun run check`** (typecheck + test +
  lint) before concluding — it must be green. Don't open PRs that normalize check failures.
- **Never hand-edit `dist/`.** It's generated from `tokens.tsx` by `bun run build`.

## Working with non-technical contributors

Most contributors here (designers, PMs, marketing) are **non-technical** and drive the repo
entirely through Claude Code in plain language. **You do all the technical work; they never
touch tooling.** Hold this contract:

- **They speak in outcomes, in everyday words** ("build a pricing page", "make our main color
  green", "submit this for review"). Never require them to know tool names, commands, file
  paths, package names, slugs, or git — translate intent into the right workflow yourself.
- **Run all tooling behind the scenes** — scaffolding (`bun run gen:prototype -- --args <slug>
  "<title>" "<description>"`, all three non-empty), `bun run check`, `bun run build`, branching,
  commits, PRs. They never type a command. (Still never start long-running dev servers — assume
  they're already running or hosted.)
- **Map their phrasing to the right action:**
  - *"build / make me a [page/section]"* → scaffold a prototype, then compose `@northwind/ui`
    primitives on-token.
  - *"change the [color / spacing / look]"* → act at the right altitude (prototype edit · brand
    override in the app CSS · token in `tokens.tsx`) and stay on-token — even if they say "make
    it red," use the semantic token, never a raw hex.
  - *"submit / send for review / ship / publish this"* → their **explicit go-ahead** for the
    commit→PR flow: run `bun run check`, fix any failures or off-system colors, branch, commit,
    push, open a PR, and return the **link**. (The trust matrix decides auto-merge vs draft —
    they don't specify it.)
  - *"make this an official / reusable component"* → the promote flow ([`docs/promote.md`](./docs/promote.md)).
- **Ask in plain language, never jargon.** Need a page name? Ask "what should we call this
  page?" — not "what slug?". Infer sensible defaults (including a one-line description) rather
  than interrogating.
- **Report only what they care about** — a preview URL, a PR link, "it's on-brand and the checks
  pass" — not raw command output, unless they ask or you need a decision from them.
- **The phrasing→action map above is also encoded as slash commands** — `/build`, `/restyle`,
  `/submit`, `/promote` (and `/prompts` for the menu), defined in `.claude/commands/` and cataloged
  in [`docs/prompts.md`](./docs/prompts.md). Treat them as canonical entry points; a free-typed
  request maps to the same workflows.

## Commands

```bash
bun run check          # typecheck + test + lint — the gate (run before concluding)
bun run build          # regenerate token CSS + build apps
bun run dev            # Storybook (:6007) + sandbox (:5173)  — the user starts servers
bun run gen:prototype  # scaffold a prototype — use --args <slug> "<title>" "<desc>" (all 3 required)
```

## Workflows

- **Contribute a component/page:** follow the recipe in [`docs/contributor-guide.md`](./docs/contributor-guide.md).
- **Promote a prototype component to a primitive:** follow [`docs/promote.md`](./docs/promote.md).
- **Governance (tokens, audits, trust levels):** [`docs/governance.md`](./docs/governance.md).

## Branch & commit naming

Inspect recent commits (`git log --oneline -10`) and match the conventional style:
`feat(scope): …`, `fix(scope): …`, `refactor(scope): …`. Use a short, meaningful scope; never
title-case prose messages.

## Nuances

- **Don't start long-running dev servers** (`storybook dev`, `vite`) — assume the user starts
  them, or asks. A one-shot `build` / `build-storybook` is fine for verification.
- **Scaffold prototypes via the generator — all three args, non-interactively.** Run
  `bun run gen:prototype -- --args <slug> "<title>" "<description>"`. Supply **all three**
  non-empty args — `--args` is all-or-nothing: omit any (even the "optional" description) and
  plop falls back to an interactive prompt that **crashes** (`readline was closed`) in a
  non-interactive shell, creating nothing (and may still exit 0). If the user gave no
  description, infer one. Don't hand-write `apps/sandbox/src/prototypes/<slug>/` files — the
  generator owns the prototype contract (`index.tsx` default-export page + `meta.ts`
  default-export `{ title, description }`); replace the starter body *after* scaffolding.
- **Don't run git history commands** (commit, push, pull, rebase) unless the user explicitly asks.
- New tokens go through `tokens.tsx` + the style guide + a draft PR — never invent ad-hoc values.
