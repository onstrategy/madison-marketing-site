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

## Commands

```bash
bun run check          # typecheck + test + lint — the gate (run before concluding)
bun run build          # regenerate token CSS + build apps
bun run dev            # Storybook (:6007) + sandbox (:5173)  — the user starts servers
bun run gen:prototype  # scaffold a new on-token prototype in apps/sandbox
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
- **Don't run git history commands** (commit, push, pull, rebase) unless the user explicitly asks.
- New tokens go through `tokens.tsx` + the style guide + a draft PR — never invent ad-hoc values.
