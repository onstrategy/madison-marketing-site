# Northwind

An **AI-native, code-first design system kit**. Northwind is a neutral demo brand
used to develop and showcase a productized approach to running a design system
*directly in code* — usable by designers, PMs, and marketing through Claude Code,
made safe by governance-as-code.

> Northwind is the reference/template repo. See [`PLAN.md`](./PLAN.md) for the full
> strategy and build order, and [`docs/business-model.md`](./docs/business-model.md)
> for the commercial model.

## What's here

| Path | What it is |
|------|------------|
| `packages/ui` | The token engine (source of truth) + primitives + Storybook (port 6007, MCP) |
| `apps/sandbox` | On-system Vite app; on-token prototypes that self-register (`gen:prototype`) |
| `.agents/skills` | The conventions: `design-system`, `react`, `typescript`, `testing` (symlinked to `.claude/skills`) |
| `.claude/hooks` | Skill-gate bundle — blocks edits to guarded paths until the right skill is loaded |
| `turbo/generators` | `gen:prototype` (new on-token prototype) + `gen:promote` (promote a prototype to a `packages/ui` primitive) |
| `overlay/` | The **installable governance overlay** — drop the gates + skills + token-lint into an existing client repo |
| `docs/` | Contributor, promote, governance, enablement, and business-model docs |

## Docs

- [`docs/architecture.md`](docs/architecture.md) — **engineer's deep-dive: how every piece fits together (start here)**
- [`docs/prompts.md`](docs/prompts.md) — **what to say to Claude in plain language** (`/build`, `/restyle`, `/submit`, `/promote`) — non-technical contributors start here
- [`docs/contributor-guide.md`](docs/contributor-guide.md) — the 5-step recipe to ship on-system UI (incl. non-technical contributors via Claude Code)
- [`docs/promote.md`](docs/promote.md) — promote a sandbox prototype into a `packages/ui` primitive
- [`docs/governance.md`](docs/governance.md) — governance-as-code: three-layer model, token lifecycle, quarterly audit
- [`docs/enablement-roadmap.md`](docs/enablement-roadmap.md) — the 30-60-90 plan after the enablement workshop
- [`docs/business-model.md`](docs/business-model.md) — the commercial model (idea-level)
- [`AGENTS.md`](AGENTS.md) — the agent constitution (architecture, mandates, commands)
- [`overlay/README.md`](overlay/README.md) — install the governance overlay (gates + skills + token-lint) into an existing repo

## Token system

Styling is driven entirely by `packages/ui` — a centralized token dictionary
(`src/ui/tokens.tsx`) that generates CSS variables and utility classes. The system is:

- **Neutral-first** — 90%+ of the UI is neutral backgrounds/borders/typography; color is a signal, not decoration.
- **Semantic triads** — each status color (success, error, warning, info) has exactly three levels: base, subtle, foreground. No numbered scales.
- **HSL channels** — tokens are stored as raw HSL channels so opacity modifiers (`bg-success/10`) work natively.
- **Brand-overridable** — brand tokens default to neutral; each app overrides `--brand-*` in ~3 lines of CSS.

Editing `tokens.tsx` and running `bun run build` regenerates
`dist/theme.css` + `dist/tailwind-tokens.css`. Never hand-edit `dist/`.

## Getting started

```bash
bun install
bun run build      # generate dist/theme.css + dist/tailwind-tokens.css from tokens.tsx
bun run check      # typecheck + test + lint
bun run dev        # Storybook (:6007, MCP) + sandbox (:5173) — Turbo builds tokens first
bun run gen:prototype   # scaffold a new on-token prototype in apps/sandbox
```

Prefer `bun run dev` — Turbo regenerates the token CSS before starting Storybook and the sandbox.

**Not an engineer?** You don't need these commands. Open Claude Code and just say what you want —
or type `/prompts` to see the menu. See [`docs/prompts.md`](docs/prompts.md).
