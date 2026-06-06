---
description: Turn a validated prototype component into an official, reusable @northwind/ui primitive.
argument-hint: which component, e.g. "the stat card from the pricing page"
---

A non-technical contributor wants to make something official and reusable. Their request: **$ARGUMENTS**

This is the **promote** flow — follow [`docs/promote.md`](../../docs/promote.md) end to end. It
always lands as a **draft PR** for an engineer (never auto-merge). Do all the technical work yourself.

1. **Load skills:** `design-system` (required by the gate on `packages/ui/`), plus `react` and
   `typescript`.
2. **Confirm it's promotable** — real, validated work; reusable; no domain coupling.
3. **Scaffold** with `bun run gen:promote -- --args <slug> "<one-line description>"` (creates the
   primitive, the export wiring, and the story). Don't hand-write those files.
4. **Port + clean up** — move the real JSX in, rewrite any off-system classes via the
   design-system skill's `references/migration.md`, and point the prototype + consumers at the
   new primitive.
5. **Check + build.** `bun --filter @northwind/ui build` if tokens changed, then `bun run check`
   (must be green).
6. **Open a draft PR** and return the link. Tell them an engineer will review before it's live.
