# Contributor Guide

You don't need to be an engineer to ship UI into this repo. Drive Claude Code, follow the
recipe below, and the guardrails keep your work on-system and safe to merge. The goal:
**real components in the real repo**, not throwaway prototypes.

> **Not sure what to say to Claude?** Type `/prompts`, or see [`prompts.md`](./prompts.md) — the
> plain-language menu of what you can ask for (`/build`, `/small-edit`, `/restyle`, `/undo`,
> `/submit`, `/promote`). For a single tweak on one page, `/small-edit` is the quick lane — and
> nothing you try is permanent, since `/undo` puts it back.

## The 5-step context recipe

Give the agent the right context, in this order, every session:

1. **Load the `design-system` skill.** It's the token vocabulary and the rules. A gate
   *blocks* edits under `packages/ui/` until it's loaded, but you should load it proactively
   for any styling work. (For components/TS, also load `react` and `typescript`.)
   > In Claude Code: it loads automatically when the gate fires, or ask "load the design-system skill."

2. **Use the Storybook MCP.** Start Storybook (`bun run dev`, port 6007) and approve the
   `storybook` MCP server (from `.mcp.json`). Now the agent knows the *real* component APIs and
   token bindings — ask "what props does `Button` take and which tokens does it use?" and it
   answers from the live manifest instead of guessing.

3. **Follow [`AGENTS.md`](../AGENTS.md).** It's the repo's constitution — architecture, the
   on-token rule, the verification loop. The agent reads it automatically; you don't have to.

4. **`bun run gen:prototype`.** Scaffold an on-token starter page in `apps/sandbox`. It
   **self-registers** in the gallery and gets a route with zero manual wiring. Build your idea
   there by composing primitives from `@madison/ui` — the agent stays on-token because the
   skill is loaded and the MCP knows the real APIs.

5. **`bun run check` → PR.** A green check (typecheck + test + lint) is the gate. When it's
   green, open a PR. Done.

Promoting a validated prototype into a reusable primitive? See [`promote.md`](./promote.md).

## Never do this

- ❌ Raw Tailwind colors (`bg-gray-800`, `text-blue-500`) or hex/rgb in `className` / inline
   styles. ✅ Use token classes (`bg-surface`, `text-primary`, `bg-success-subtle`).
- ❌ shadcn-style legacy names (`bg-card`, `text-foreground`, `bg-destructive`). ✅ See the
   migration table in the design-system skill (`references/migration.md`).
- ❌ Numbered color scales (`text-success-700`, `bg-neutral-200`). ✅ Semantic triads +
   opacity (`text-success`, `bg-success/10`).
- ❌ Arbitrary sizes — `p-[17px]`, `text-[40px]`, `leading-[1.4]`, `ring-2`, `z-50`. ✅ The
   tokenized scales (`p-4`, `py-section`, `text-xl`, `leading-snug`, the named `z-*` layers).
   These fail `bun run check` the same way off-brand colors do.
- ❌ Hand-edit `packages/ui/dist/*` — it's generated. ✅ Edit `tokens.tsx`, run `bun run build`.
- ❌ Invent a new token because one seems missing. ✅ Check `tokens.tsx` + the style guide;
   propose an addition in a draft PR.
- ❌ Skip loading the skill, then fight the gate. ✅ Load it first (once per session).
- ❌ Open a PR with a red `bun run check`, or "normalize" pre-existing failures.
- ❌ Start dev servers or run git history commands on the user's behalf without being asked.

## Trust levels

What can merge automatically vs. what needs a human:

| Change | Trust level | Who acts |
|---|---|---|
| Sandbox prototype content / copy (no `packages/ui` change) | **auto-merge** | green check merges |
| Any `packages/ui/` or token change (incl. promotions) | **draft PR** | engineer reviews |
| Token deprecations, `scripts/generate-theme.ts`, editing the gates/hooks | **suggest-only** | maintainer applies |

This matrix is the contract that lets non-technical contributors move fast on the left column
while protecting the system on the right. See [`governance.md`](./governance.md) for the why.
