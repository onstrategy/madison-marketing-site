---
description: Change how something looks (color, spacing, density) — on-token, at the right altitude.
argument-hint: what to change, e.g. "make the main color green" or "more spacing on the pricing page"
---

A non-technical contributor wants to change how something looks. Their request: **$ARGUMENTS**

Do all the technical work yourself. Hold the non-technical-contributor contract in `AGENTS.md`.

1. **Pick the altitude** — act in the narrowest place that satisfies the request:
   - one prototype's look → edit that prototype's `index.tsx`.
   - the app's brand color → the brand override in `apps/sandbox/src/index.css` (~3 lines).
   - the shared design system → a token in `packages/ui/src/ui/tokens.tsx` (load the
     **design-system** skill first; the gate requires it), then `bun run build`.
2. **Stay on-token.** Even if they say "make it red," use the semantic token (`text-error`,
   `bg-brand`, …) — never a raw hex, rgb, numbered scale, or shadcn-style legacy class.
3. **Check.** Run `bun run check`; fix anything red.
4. **Flag the trust tier in plain words.** A prototype tweak can go live on its own; anything
   touching `tokens.tsx` or `packages/ui/` goes to an engineer as a draft PR. Tell them which.
5. **Report outcomes only** — what changed and where they can see it, not raw command output.
