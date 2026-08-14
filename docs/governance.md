# Governance-as-Code

The hard part of a design system isn't building it — it's keeping a whole organization *on* it
as people (and agents) ship UI every day. The repeatedly-cited failure mode is **drift, not
tooling**: Shopify reported ~14% of its admin UI drifted off Polaris in a single year. When
code is the source of truth, governance can be **executable** — encoded in the repo and run on
every change, instead of living in a wiki nobody reads. That executable governance is the moat.

## The three-layer context model

Every contribution — human or agent — is shaped by three layers of context, from broad to
machine-enforced:

1. **Constitution — [`AGENTS.md`](../AGENTS.md).** The always-loaded, high-level mandate:
   what the repo is, how code flows, the on-token rule, the verification loop. It sets
   intent and points to the deeper layers.

2. **Skills — [`.agents/skills/`](../.agents/skills/).** Detailed recipes loaded *on demand*:
   `design-system` (token vocabulary + rules), `react`, `typescript`, `testing`. They carry the
   specifics that would bloat the constitution, and they load exactly when relevant.

3. **Enforcement — gates + CI.** Machines, not vibes:
   - **Skill-gate hooks** (`.claude/hooks/`) *block* edits to guarded paths until the right
     skill is loaded — so an agent can't touch `packages/ui` without first reading the
     design-system rules.
   - A **freshness gate** (same hook bundle) auto-syncs the workspace with `origin/main` at
     session start and *blocks* edits while it's behind — so no one builds on stale code.
   - **`bun run check`** (typecheck + test + lint) is the merge gate. `className`/token
     discipline the path-gate can't see is enforced here (lint / `react-doctor` in CI).

The layers reinforce each other: the constitution tells you the rule, the skill teaches you how
to follow it, and the gate makes sure you did. Non-technical contributors get the same
guarantees as engineers because the guarantees are in the repo, not in someone's head.

## Token lifecycle

Tokens are the system's vocabulary; changing them is high-leverage and therefore governed.

**Request.** A token is missing? Don't invent an ad-hoc value. Propose it in
`packages/ui/src/ui/tokens.tsx`, show it in the style guide (`src/ui/style-guide.tsx`), and open
a **draft PR**. Run `bun run build` to regenerate `dist/*`.

**Review.** A maintainer checks the proposal against the system's invariants:
- Warm neutral-first — is this actually neutral structure, or are you reaching for color as decoration?
- Palette discipline — Madison is five colors in fixed roles: Neon Blue is the *single* hero accent,
  Deep Dust is depth-only and restricted (`bg-depth`/`border-depth`, ≤10%, never a surface or paired
  with Terracotta), Terracotta is the reserved status signal (`info`). New brand-ish colors are a
  red flag. (Full rules: the `design-system` skill's color-usage governance.)
- Semantic triad — status colors come as base / subtle / fg, no numbered scales.
- HSL channels — stored as raw channels so opacity modifiers work.
- Contrast — verified in *both* light and dark mode.
If it doesn't fit, the answer is usually an existing token or an opacity modifier, not a new one.

**Deprecation.** Removing/renaming a token is **suggest-only** (a maintainer applies it):
1. Announce + mark deprecated (keep it working).
2. Provide a migration mapping (extend `references/migration.md`) so agents can rewrite usages.
3. Give a migration window; sweep remaining usages (lint / `react-doctor`).
4. Remove, regenerate `dist/*`, and note it in the changelog.

## Quarterly audit

Run drift control on a cadence (the retainer's heartbeat):

- **Drift scan** — lint / `react-doctor` across the codebase for off-system classes (raw colors,
  hex, legacy shadcn names). Track an adherence % over time; the goal is the opposite of
  Shopify's 14%.
- **Token usage report** — which tokens are used where; surface unused or over-used tokens and
  candidates for deprecation.
- **Guardrail health** — confirm the gates fire, `bun run check` is green on `main`, and the MCP
  manifest is current.
- **Enablement** — how many non-technical seats are actively (and safely) contributing?

Today this is a checklist a human runs by hand; automating it as an `/audit` command is
[roadmap §3](./roadmap.md#3-audit--the-drift-scan-as-a-command).

## Trust levels

| Change | Trust level | Who acts |
|---|---|---|
| Sandbox prototype content / copy | **auto-merge** | green check merges |
| Any `packages/ui/` or token change (incl. promotions) | **draft PR** | engineer reviews |
| Token deprecations, `scripts/generate-theme.ts`, editing the gates/hooks | **suggest-only** | maintainer applies |

The matrix is itself governance-as-code: it maps *blast radius* to *required oversight*, so speed
on low-risk work doesn't cost safety on high-risk work.

**Merging now publishes.** `apps/site` deploys from `main`, so the top row's "auto-merge" is also
an auto-deploy. Two things keep that safe: every PR gets a Netlify Deploy Preview, so the change is
reviewable *as a live page* before it lands; and the Netlify check is a merge gate like any other.
Nobody pushes to `main` directly. See [`docs/publishing.md`](./publishing.md).
