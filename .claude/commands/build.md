---
description: Build a new page or section as an on-token prototype, end to end.
argument-hint: a page in plain words, e.g. "a pricing page with three plans"
---

A non-technical contributor wants to build something. Their request: **$ARGUMENTS**

Do all the technical work yourself — they never touch tooling, commands, file paths, or git.
Hold the non-technical-contributor contract in `AGENTS.md` throughout.

1. **Settle a name + description.** Derive a short page **name** and a one-line **description**
   from their request. If either is genuinely unclear, ask in plain language ("What should we
   call this page?") — never ask for a "slug." Infer sensible defaults rather than interrogating.
2. **Scaffold with the generator** (all three args non-empty — `--args` is all-or-nothing):
   `bun run gen:prototype -- --args <slug> "<title>" "<description>"`
   Don't hand-write the prototype files; the generator owns the contract.
3. **Build it on-token.** Load the **design-system** skill, then replace the starter body in
   `apps/sandbox/src/prototypes/<slug>/index.tsx` by composing `@madison/ui` primitives.
   Token classes only (`bg-surface`, `text-primary`, `bg-success-subtle`) — never raw Tailwind
   colors or hex/rgb. If the Storybook MCP is available, use it for real component APIs + tokens.
4. **Check.** Run `bun run check` and fix anything red, including off-system colors.
5. **Report outcomes only.** Give them the preview URL (`http://localhost:5173/<slug>`) and that
   it's on-brand with checks passing — not raw command output, unless they ask.

This stays in the sandbox (the auto-merge tier). When they want it reviewed, that's `/submit`.
