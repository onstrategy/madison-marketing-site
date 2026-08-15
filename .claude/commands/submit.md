---
description: Ship the current work for review — runs the checks, opens a PR, returns the live link.
argument-hint: optional note, e.g. "the pricing page is ready"
---

This is the contributor's **explicit go-ahead** to submit their work. Optional note: **$ARGUMENTS**

Do all the technical work yourself; they never type a command or touch git.

1. **Check first.** Run `bun run check` (typecheck + test + lint). Fix any failures and any
   off-system colors. Never open a PR with a red check or "normalize" pre-existing failures.
2. **Branch + commit — from fresh main.** Run `git fetch origin main` first. If starting a new
   branch, branch from `origin/main`. If the work is already on a branch, verify it contains the
   latest main (`git merge-base --is-ancestor origin/main HEAD`); if not, merge `origin/main`
   into it before pushing — conflicts you can't resolve confidently mean stopping and telling the
   contributor an engineer is needed. Then commit with a conventional message (`feat(scope): …`,
   `fix(scope): …`) — match recent commits (`git log --oneline -10`).
3. **Push + open the PR.**
4. **Wait for the Deploy Preview.** Netlify builds every PR. Poll `gh pr checks <number>` until
   the Netlify check finishes, then read the `deploy-preview-<number>--madison-marketing-site.netlify.app` URL
   from that check's details or the Netlify comment on the PR. **Never guess or construct the
   URL**, and never substitute a one-off deploy-ID permalink. A red Netlify check is a red gate —
   treat it exactly like a failing `bun run check`: fix it, don't report the work as done.
5. **Let the trust matrix decide the destination — they don't specify it:**
   - sandbox prototype content/copy → can **auto-merge** on a green check.
   - any `packages/ui/` or token change (incl. promotions) → **draft PR** for an engineer.
   - gates/hooks, `scripts/generate-theme.ts`, token deprecations → **suggest-only**; a
     maintainer applies it.
6. **Report outcomes only** — the **live preview link** first (that's what they actually want to
   see), then the PR link, then "it's on-brand and the checks pass."
