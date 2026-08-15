# Madison

**Madison** is an AI-native, **code-first design system** — run directly in code, usable by
designers, PMs, and marketing through Claude Code, made safe by governance-as-code.

**Live site:** [madison-marketing-site.netlify.app](https://madison-marketing-site.netlify.app) —
deployed from `main`. Every pull request gets its own preview link; the `preview` branch has a
stable one at [preview--madison-marketing-site.netlify.app](https://preview--madison-marketing-site.netlify.app).
This runs on a demo Netlify account and is deliberately not indexable — see
[`docs/publishing.md`](docs/publishing.md).

> This repo began as a **neutral reference kit** (codenamed "Northwind") and has since been
> **specialized into Madison's design system**. The productized *approach* behind it — and the
> commercial model — live in [`PLAN.md`](./PLAN.md) and
> [`docs/business-model.md`](./docs/business-model.md).

## What's here

| Path | What it is |
|------|------------|
| `packages/ui` | The token engine (source of truth) + primitives + Storybook (port 6007, MCP) |
| `apps/sandbox` | On-system Vite app; on-token prototypes that self-register (`gen:prototype`) |
| `apps/site` | The **published** site (Netlify). Renders the sandbox's prototypes at their public slugs — landing at `/`, no gallery. Owns no page content. |
| `.agents/skills` | The conventions: `design-system`, `react`, `typescript`, `testing` (symlinked to `.claude/skills`) |
| `.claude/hooks` | Skill-gate bundle — blocks edits to guarded paths until the right skill is loaded, and keeps every session on the latest `main` (freshness gate) |
| `turbo/generators` | `gen:prototype` (new on-token prototype) + `gen:promote` (promote a prototype to a `packages/ui` primitive) |
| `overlay/` | The **installable governance overlay** — drop the gates + skills + token-lint into an existing client repo |
| `docs/` | Contributor, promote, governance, and business-model docs |

## Docs

- [`docs/architecture.md`](docs/architecture.md) — **engineer's deep-dive: how every piece fits together (start here)**
- [`docs/getting-started.md`](docs/getting-started.md) — **no code required: how to run this repo, build a page, and get a live link** — non-technical contributors start here
- [`docs/prompts.md`](docs/prompts.md) — **what to say to Claude in plain language** (`/build`, `/restyle`, `/submit`, `/promote`)
- [`docs/contributor-guide.md`](docs/contributor-guide.md) — the 5-step recipe to ship on-system UI (incl. non-technical contributors via Claude Code)
- [`docs/promote.md`](docs/promote.md) — promote a sandbox prototype into a `packages/ui` primitive
- [`docs/governance.md`](docs/governance.md) — governance-as-code: three-layer model, token lifecycle, quarterly audit
- [`docs/publishing.md`](docs/publishing.md) — how the site deploys to Netlify, preview links, and the handover checklist
- [`docs/roadmap.md`](docs/roadmap.md) — where the AI harness goes next (roles, exploratory mode, audit, 0→1 adoption) — with the honest current state of each
- [`docs/business-model.md`](docs/business-model.md) — the commercial model (idea-level) - CAN BE IGNORED FOR NOW
- [`AGENTS.md`](AGENTS.md) — the agent constitution (architecture, mandates, commands)
- [`overlay/README.md`](overlay/README.md) — install the governance overlay (gates + skills + token-lint) into an existing repo

## Token system

Styling is driven entirely by `packages/ui` — a centralized token dictionary
(`src/ui/tokens.tsx`) that generates CSS variables and utility classes. This repo **is** the
Madison design system:

- **Warm neutral-first** — 90%+ of the UI is Madison's warm neutrals (Warm White surfaces, warm near-black text, taupe borders); color is a signal, not decoration.
- **Disciplined 5-color palette** — Neon Blue is the single hero accent (~15%), Deep Dust a restricted depth accent (`bg-depth`/`border-depth`, ≤10%), Terracotta the reserved status signal (mapped to `info`), over Warm White + Dark Navy. Usage governance (approved pairings, the Deep Dust restriction) lives in the `design-system` skill.
- **Lora + Inter** — Lora (`font-serif`) for display and large headings (HERO–h4); Inter (`font-sans`) for body and small headings.
- **Semantic triads** — each status color (success, error, warning, info) has exactly three levels: base, subtle, foreground. No numbered scales.
- **HSL channels** — tokens are stored as raw HSL channels so opacity modifiers (`bg-success/10`) work natively.

Editing `tokens.tsx` and running `bun run build` regenerates
`dist/theme.css` + `dist/tailwind-tokens.css`. Never hand-edit `dist/`.

## Getting started

This repo uses **[Bun](https://bun.com)** as its package manager and runtime (pinned to
`bun@1.3.9`). Bun ships with its own JavaScript runtime, so **you do not need to install Node.js
separately** — Git and Bun are the only prerequisites.

### Step 1 — Install Git (if you don't have it)

Check first by opening a terminal and running `git --version`. If you see a version number,
skip this step.

- **macOS:** run `xcode-select --install` and accept the prompt, or install from
  [git-scm.com](https://git-scm.com/download/mac).
- **Windows:** download and run the installer from [git-scm.com](https://git-scm.com/download/win)
  (accept the defaults).

### Step 2 — Install Bun

Check first with `bun --version`. If you see `1.3.x` or newer, skip ahead to Step 3.

- **macOS / Linux** — paste this into a terminal:
  ```bash
  curl -fsSL https://bun.com/install | bash
  ```
- **Windows** — paste this into **PowerShell**:
  ```powershell
  powershell -c "irm bun.com/install.ps1 | iex"
  ```

After it finishes, **close and reopen your terminal**, then confirm it worked:

```bash
bun --version
```

### Step 3 — Clone the repository

```bash
git clone https://github.com/onstrategy/madison-marketing-site.git
cd madison-marketing-site
```

### Step 4 — Install dependencies

```bash
bun install
```

This reads `bun.lock` and installs everything for all workspaces (`packages/*` + `apps/*`) in one go.

### Step 5 — Start it

```bash
bun run dev
```

This opens two local sites (Turbo regenerates the token CSS first, automatically):

- **Storybook** → http://localhost:6007 — every component and its variants (also serves the MCP at `/mcp`)
- **Sandbox** → http://localhost:5173 — the on-token prototypes / pages

Leave that terminal running. To stop the servers, press `Ctrl + C`.

To preview the **published** site as visitors see it (landing at `/`, no gallery), run
`bun run dev:site` in a second terminal → http://localhost:5174.

> **Troubleshooting:** if `bun` is "command not found" after Step 2, fully quit and reopen your
> terminal (the installer adds Bun to your PATH and the change only takes effect in a new window).

### Daily commands (for engineers)

```bash
bun run build           # regenerate dist/theme.css + dist/tailwind-tokens.css from tokens.tsx
bun run check           # typecheck + test + lint — the gate; run before opening a PR
bun run dev:site        # the published site (:5174) — what Netlify deploys
bun run seo:audit:build # crawlable localhost bundle with source maps
bun run seo:audit:serve # serve that bundle at http://127.0.0.1:4174
bun run gen:prototype   # scaffold a new on-token prototype in apps/sandbox
```

**Not an engineer?** Once `bun run dev` is running (Step 5 above), you don't need any of these
commands. Open Claude Code in this folder and just say what you want — or type `/prompts` to see
the menu. Start with [`docs/getting-started.md`](docs/getting-started.md), the no-code walkthrough
from setup to a live link.
