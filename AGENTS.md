# Agent Guidelines — Madison Design System Kit

High-level mandate for all AI agents working in this repo. Detailed recipes live in
**Skills** under `.agents/skills/`; load them before editing.

## What this project is

**Madison** is an AI-native, **code-first design system**. Code is the single source
of truth for design tokens and components; non-technical contributors (designers, PMs,
marketing) ship real components into the real repo through Claude Code, made safe by
**governance-as-code** (skill gates + `bun run check`). This repo is **Madison's design
system** — specialized from a neutral reference kit.

## Architecture

Code flows downward — apps depend on packages, never the reverse.

```
apps/site      (@madison/site)     the PUBLISHED site (Netlify); owns no page content
      │  depends on
      ▼
apps/sandbox   (@madison/sandbox)  on-system Vite app; hosts on-token prototypes
      │  depends on
      ▼
packages/ui    (@madison/ui)       the design system: tokens → CSS, primitives, Storybook
```

- **`packages/ui`** — the system. Token dictionary `src/ui/tokens.tsx` (source of truth) →
  `scripts/generate-theme.ts` generates `dist/theme.css` + `dist/tailwind-tokens.css`.
  Primitives in `src/primitives/`. Theme provider in `src/theme/`. Storybook in `.storybook/`
  (port 6007) with the MCP manifest (`componentsManifest`).
- **`apps/sandbox`** — prototypes live in `src/prototypes/<slug>/` (`index.tsx` + `meta.ts`)
  and self-register via `src/prototype-registry.ts` (`import.meta.glob`). Wired to the system
  via the canonical 4-line CSS header in `src/index.css`.
- **`apps/site`** — the production shell deployed to Netlify. It **owns no page content**: it
  mounts the sandbox's prototypes at their public slugs, with the landing page at `/` and no
  gallery. Page content is always edited in `apps/sandbox/src/prototypes/`, never copied here —
  so anything a contributor builds shows up on the site automatically.
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
- **Start from the latest main (session freshness).** A SessionStart hook fetches `origin/main`
  and fast-forwards the local `main` when that's safe. If the workspace is behind and can't
  auto-sync, a **sync gate** blocks Edit/Write on repo files until the tree contains
  `origin/main`'s head. Running the remediation the gate prints — fetching and merging
  `origin/main` into the current branch, or rescuing stray commits off `main` — is
  **pre-authorized**; it's the one standing exception to the "don't run git commands unasked"
  rule. If the merge conflicts beyond confident resolution, stop and tell the contributor an
  engineer needs to help.
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
  - *"build / make me a [page/section]"* → scaffold a prototype, then compose `@madison/ui`
    primitives on-token.
  - *"change the [color / spacing / look]"* → act at the right altitude (prototype edit · brand
    override in the app CSS · token in `tokens.tsx`) and stay on-token — even if they say "make
    it red," use the semantic token, never a raw hex.
  - *"one specific tweak on one page"* ("increase the line height of the H1", "make that subtitle
    one size smaller") → the **fast lane**: one property, one file, one pass, no exploring, no
    round of clarifying questions. Escalate out loud instead of quietly editing `packages/ui/`.
  - *"undo / put it back / that was worse"* → their explicit go-ahead to revert **uncommitted**
    work only: show what would be undone in plain words, confirm, then `git stash push -u` those
    specific paths — `-u` also catches a whole new page left untracked by `/build`, and a stash
    keeps the undo itself reversible. Never rewrite history; anything already submitted is an
    engineer's call.
  - *"submit / send for review / ship / publish this"* → their **explicit go-ahead** for the
    commit→PR flow: run `bun run check`, fix any failures or off-system colors, branch, commit,
    push, open a PR, wait for its Netlify Deploy Preview, and return **both links** — the PR and
    the live preview URL. (The trust matrix decides auto-merge vs draft — they don't specify it.)
    See *Publishing and previews* below.
  - *"add a form / put the demo form on this page / here's the form code from HubSpot"* → load the
    **`hubspot-forms`** skill. Forms are referenced by friendly registry name; a pasted embed
    snippet becomes a one-line registry entry (the script tag itself is discarded, never inlined).
  - *"make this an official / reusable component"* → the promote flow ([`docs/promote.md`](./docs/promote.md)).
  - *"what components can I use / what's available / what can I change about X"* → answer from the
    **Storybook MCP as the primary source of truth when it's connected** (`list-all-documentation`
    → `get-documentation`; offer `preview-stories` URLs so they can *see* the variants). Only if the
    Storybook MCP is unavailable, fall back to reading the primitives source (`packages/ui/src/primitives/`,
    `componentsManifest`). Either way, present it in plain language — names and what each does, not prop tables.
- **Ask in plain language, never jargon.** Need a page name? Ask "what should we call this
  page?" — not "what slug?". Infer sensible defaults (including a one-line description) rather
  than interrogating.
- **Report only what they care about** — a live preview URL, a PR link, "it's on-brand and the
  checks pass" — not raw command output, unless they ask or you need a decision from them.
- **The phrasing→action map above is also encoded as slash commands** — `/build`, `/small-edit`,
  `/restyle`, `/undo`, `/submit`, `/promote` (and `/prompts` for the menu), defined in
  `.claude/commands/` and cataloged in [`docs/prompts.md`](./docs/prompts.md). Treat them as
  canonical entry points; a free-typed request maps to the same workflows.
- **Match the effort to the size of the ask.** `/small-edit` and `/undo` pin a cheaper model and
  a narrow tool set in their frontmatter precisely so a one-line change doesn't cost what a page
  build does. Don't turn a bounded tweak into a survey of the codebase.

## Publishing and previews

`apps/site` is deployed to Netlify from [`netlify.toml`](./netlify.toml). Full detail —
including the handover checklist for the client — is in [`docs/publishing.md`](./docs/publishing.md).

- **`main` is production.** Never commit or push to `main` directly. Merging a PR is what
  publishes.
- **Every pull request gets a Deploy Preview** at `deploy-preview-<number>--madison-marketing-site.netlify.app`.
  This is the link a non-technical contributor actually cares about — it's their work, live.
  Read it from the PR's Netlify check or comment (`gh pr checks <number>`). **Never guess or
  construct the URL**, and never substitute a one-off deploy-ID permalink.
- **The `preview` branch** has a stable URL at `preview--madison-marketing-site.netlify.app`, for a persistent
  staging link that doesn't churn per PR.
- **A red Netlify check is a red gate.** Treat it exactly like a failing `bun run check`: fix it,
  don't report the work as done.
- **Don't infer production authority from repo access.** "Publish this" / "share this" means a
  branch + PR. Going straight to production takes an explicit maintainer request.
- **The site is deliberately not indexable** — it runs on a demo Netlify account. Don't "fix" the
  `noindex` header in `netlify.toml` or the `Disallow` in `apps/site/public/robots.txt`; they come
  off during handover, together.

## Commands

```bash
bun run check          # typecheck + test + lint — the gate (run before concluding)
bun run build          # regenerate token CSS + build apps
bun run dev            # Storybook (:6007) + sandbox (:5173)  — the user starts servers
bun run dev:site       # the published site (:5174)           — the user starts servers
bun run gen:prototype  # scaffold a prototype — use --args <slug> "<title>" "<desc>" (all 3 required)
```

## Workflows

- **Onboard a non-technical contributor:** [`docs/getting-started.md`](./docs/getting-started.md) —
  setup, the build→tweak→submit→live loop, and which link to send. Point newcomers there, not at the
  engineer docs.
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
- **Don't run git history commands** (commit, push, pull, rebase) unless the user explicitly asks —
  with one exception: syncing the workspace with `origin/main` at session start or when the sync
  gate blocks (see *Core mandates*) is expected and pre-authorized.
- New tokens go through `tokens.tsx` + the style guide + a draft PR — never invent ad-hoc values.
- **`apps/site` is a shell, not a page store.** It holds routing, the 404 and the deploy wiring.
  Page content lives in `apps/sandbox/src/prototypes/` and is rendered by both apps — if you find
  yourself copying a page into `apps/site/src/`, stop; that's the drift this design exists to
  prevent.
- **Never remove the two `@source` lines in `apps/site/src/index.css`.** Tailwind roots its
  automatic source detection at the Vite root, so without them it emits a near-empty stylesheet
  and the site ships unstyled — with typecheck, lint and the build all green.
