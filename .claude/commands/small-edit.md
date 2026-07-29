---
description: Make one small, bounded change — a size, a spacing, a word, a line height — in one pass.
argument-hint: one specific change, e.g. "increase the line height of the H1 on the landing page"
model: sonnet
effort: medium
allowed-tools: Read, Grep, Glob, Edit, Skill, Bash(bun run check*)
disable-model-invocation: true
---

A non-technical contributor wants one small thing changed. Their request: **$ARGUMENTS**

Do all the technical work yourself. Hold the non-technical-contributor contract in `AGENTS.md`.

This is the **fast lane**: one property, one file, one pass, cheap model. Its whole value is that
it finishes in a single turn. If you find yourself exploring, you are in the wrong command.

The pages that exist right now:

!`ls apps/sandbox/src/prototypes`

1. **One change, one place.** If the request needs more than one file, or you genuinely can't
   tell which element they mean, **stop and say so** — then hand off: `/restyle` for a broader
   look-and-feel change, `/build` for anything new. Ask at most one short question. Never survey
   the codebase to figure it out.
2. **Go straight to the target.** You already have the page list above. Grep that one prototype
   directory for the element (the heading text, the component name) — don't read the whole tree.
3. **Swap a token class, never a raw value.** `leading-relaxed`, `text-lg`, `p-card`, `p-4`,
   `text-secondary` — never `leading-[1.6]`, `text-[40px]`, `leading-7`, a hex, or a numbered
   **color** scale (`text-success-700`, `bg-neutral-200`). Note the numeric *spacing* scale
   (`p-4`, `py-24`, `gap-8`) **is** on-token and fine — only arbitrary literals and numbered
   color scales are banned. The vocabulary is in the **design-system** skill; load it if you're
   unsure which token applies.
4. **Refuse to escalate silently.** If the only real fix lives in `packages/ui/` or
   `tokens.tsx`, **stop**. Say plainly that it's a change to the shared design system — it
   affects every page and needs an engineer — and offer `/restyle` instead. Don't edit it here,
   and don't trip the skill gate to find that out.
5. **Check.** Run `bun run check`. Fix anything red that you caused; if it was already red,
   say so rather than widening the change.
6. **Report in one line** — what changed, on which page, where to look. Then offer the follow-up
   vocabulary so their next prompt can be one word: **"a bit more"**, **"a bit less"**, or
   **"undo"** (`/undo` puts it back).

A tweak like this stays in the sandbox and goes live on its own once the checks pass. Anything
that reaches the shared system is a different job — that's `/restyle`.
