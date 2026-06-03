# 30-60-90 Enablement Roadmap

What happens *after* the half-day workshop. The kit + a recorded walkthrough are the
leave-behind; this roadmap turns a one-time enablement into a self-sustaining practice. It's
also the spine of the governance retainer.

## Goals

- Non-technical contributors ship real, on-system components without hand-holding.
- Drift stays low (the opposite of the ~14% industry failure mode).
- The team becomes self-sufficient; the retainer shifts from teaching to auditing.

## First 30 days — *land it*

- **Identify 1–2 champions** per team (the people who took to the workshop). They become the
  first line of support.
- **Weekly office hours** (30–45 min) — live help promoting components and unblocking gate/check
  failures.
- **First real components promoted.** Each champion takes one validated prototype through
  [`promote.md`](./promote.md) to a `packages/ui` primitive with a green `bun run check`.
- **Confirm the guardrails fire** in the client repo: the skill-gate blocks off-system edits,
  `bun run check` runs in CI, the Storybook MCP answers component/token questions.

## Days 30–60 — *grow it*

- **Internal pattern library grows** — promoted primitives + sandbox prototypes become the
  reference catalog. Storybook (hosted via Chromatic) is the shared surface; its MCP endpoint
  is the agents' source of truth.
- **First drift audit** — run the [quarterly audit](./governance.md#quarterly-audit) early to
  baseline adherence %, then again at 60 days to show the trend.
- **Widen the contributor pool** — onboard the next wave using the champions + the recorded
  walkthrough; office hours can drop to bi-weekly as confidence rises.

## Days 60–90 — *sustain it*

- **Governance cadence established** — token request/review/deprecation lifecycle is running;
  the trust-levels matrix is second nature; quarterly audit is on the calendar.
- **Self-sufficiency** — champions handle most promotions and reviews; the retainer focuses on
  audits, token-lifecycle decisions, and gate/CI upkeep rather than day-to-day teaching.
- **Measure & report** — adherence %, # of enabled seats actively contributing, # of components
  promoted, time-to-merge for non-technical PRs. These are the retainer's value story.

## Leave-behind checklist

- ✅ The kit (this repo or the installed overlay) in the client's repo
- ✅ Recorded workshop walkthrough
- ✅ This roadmap + [`contributor-guide.md`](./contributor-guide.md) + [`governance.md`](./governance.md)
- ✅ `bun run check` wired into CI; Storybook + MCP hosted
- ✅ Named champions + a standing office-hours slot
