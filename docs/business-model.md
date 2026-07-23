# Business Model — Design System as Code (Kit)

> **Status: idea-level, not committed.** Captured from the strategy appendix in
> [`../PLAN.md`](../PLAN.md) for later refinement. These are commercial *options*,
> intentionally de-emphasized while the technical kit and enablement motion are
> proven in production.
>
> **Repo note:** this repo has since been **specialized into Madison** (a real client's design
> system); it began as a **neutral reference kit** (codenamed "Northwind"). Where the text below
> says "kit," "template," "neutral," or "clone-per-client," that describes the productized
> *approach* and the kit's origin — not this repo's current single-client state.

The product is a **repeatable, productized kit approach** — sold to many clients, not a
one-off. A **neutral reference kit** is the **sales demo**, the **clone-per-client
template**, and the source of the **installable overlay** for existing client repos.
**This repo is one concrete instance of that approach — specialized into Madison's design
system** (see the repo note above).

The moat is **governance-as-code**: non-technical people (designers, PMs,
marketing) ship *real components into the real repo* via PRs engineers merge,
made safe by guardrails (skill gates + `bun run check` CI). Almost nobody else
offers this — the closest competitor (Supernova) keeps non-technical people *out*
of the real repo, recreating the two-places/handoff problem.

---

## Three-phase engagement

The core services motion. Each phase stands alone but composes into a funnel
toward recurring revenue.

| Phase | What it is | Pricing shape |
|-------|------------|---------------|
| **1. Setup / Migration** | Make code the source of truth: establish `tokens.tsx` (DTCG-aligned), generate CSS, map the client's Figma variables → semantic tokens, stand up Storybook + MCP, install the `.claude/` overlay (gates + skills + generators), wire `bun run check` CI. | **Fixed-fee**, scoped after a discovery call. |
| **2. Enablement Workshop** | Half-day, ~30% watch / 70% build. Each non-technical attendee ships a real component through the promote path → PR. Leaves behind the kit + a recorded walkthrough + a 30-60-90 enablement roadmap. | **Fixed per-cohort fee**, includes the leave-behind kit. |
| **3. Governance-as-code Retainer** | The recurring-revenue engine. Quarterly drift audits, token lifecycle (requests / review / deprecation), gate + CI upkeep, office hours, champion support. | **Monthly recurring.** |

The **retainer is the recurring-revenue engine** — Setup and Enablement are the
on-ramps that make it land.

---

## Productized tiers

A ladder from low-touch/self-serve to high-touch/done-for-you:

1. **Starter** — self-serve template + docs. Low-touch, open-core. Top-of-funnel.
2. **Done-with-you** — Enablement Workshop + overlay install on the client's repo.
3. **Done-for-you + retainer** — high-touch setup, migration, enablement, and an
   ongoing governance retainer.

---

## Open-core lead generation

Open-source the neutral **reference kit** as:

- a **credibility magnet** (a working, opinionated reference others can inspect), and
- **top-of-funnel** for the paid motion.

Monetize the layers *around* the open core: install/migration, enablement,
the governance retainer, and **premium skills/generators** (e.g. advanced
`promote` flows, vertical token packs).

---

## Retainer pricing levers

Price the retainer against the variables that drive ongoing governance cost:

- **Repo size** (surface area to audit for drift).
- **Number of components / tokens** under management.
- **Audit cadence** (monthly vs quarterly drift sweeps).
- **Number of enabled non-technical seats** (contributors using the gated flow).

---

## v2 / optional SaaS

A hosted **"governance dashboard"** — drift audits, token-usage reports, and
hosted Storybook MCP. This is a **bigger build** and should be pursued **only if
the services motion proves demand**. The services-first sequence de-risks it:
the dashboard productizes work already being done by hand in the retainer.

---

## Adjacent product lines

- **Verticalized templates** — pre-branded kits for common stacks (e.g.
  Next.js / shadcn shops) to shorten setup time and widen the addressable market.
- **Training-as-product** — a recorded "design-system-as-code" course plus a
  **contributor certification** for non-technical seats.
- **Ecosystem partnerships** — Storybook / Chromatic (MCP hosting), and
  AI-tooling communities, for distribution and hosted-MCP credibility.

---

## Ideal customer profile (ICP)

- **Scale-ups** with an existing **Figma design system** *and* a **real codebase**,
  plus **AI-curious leadership**.
- **Design-system teams** already feeling **Figma ↔ code drift** pain
  (the canonical failure mode — e.g. Shopify reported ~14% of admin UI drifted
  off Polaris in a year).
