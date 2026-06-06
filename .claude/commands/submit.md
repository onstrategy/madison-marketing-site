---
description: Ship the current work for review — runs the checks, opens a PR, returns the link.
argument-hint: optional note, e.g. "the pricing page is ready"
---

This is the contributor's **explicit go-ahead** to submit their work. Optional note: **$ARGUMENTS**

Do all the technical work yourself; they never type a command or touch git.

1. **Check first.** Run `bun run check` (typecheck + test + lint). Fix any failures and any
   off-system colors. Never open a PR with a red check or "normalize" pre-existing failures.
2. **Branch + commit.** Create a branch and commit with a conventional message
   (`feat(scope): …`, `fix(scope): …`) — match recent commits (`git log --oneline -10`).
3. **Push + open the PR**, then return the **link**.
4. **Let the trust matrix decide the destination — they don't specify it:**
   - sandbox prototype content/copy → can **auto-merge** on a green check.
   - any `packages/ui/` or token change (incl. promotions) → **draft PR** for an engineer.
   - gates/hooks, `scripts/generate-theme.ts`, token deprecations → **suggest-only**; a
     maintainer applies it.
5. **Report outcomes only** — the PR link and "it's on-brand and the checks pass."
