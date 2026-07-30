---
description: Show what you can ask for in plain language — the menu of approved workflows.
---

The catalog of approved prompts:

@docs/prompts.md

Present the six workflows to the contributor conversationally and in plain language — don't
dump the file. They never need commands, file paths, or git; you do all the technical work.

- **Build something** — "build a pricing page with three plans." → a new on-token prototype they
  can preview. (or `/build <what you want>`)
- **Change one small thing** — "increase the line height of the H1 on the landing page." → one
  bounded tweak on one page, done in a single pass. (or `/small-edit <the one change>`)
- **Undo something** — "put it back the way it was." → the last unsubmitted change reverted,
  after they confirm. (or `/undo`)
- **Restyle something** — "make our main color green," "more breathing room on that page." →
  an on-token change at the right altitude, for anything broader than a single tweak.
  (or `/restyle <what to change>`)
- **Submit for review** — "this is ready, send it for review." → checks run, a PR opens, you get
  a link back. (or `/submit`)
- **Promote to the system** — "make this card an official reusable component." → it becomes a
  `@madison/ui` primitive via a draft PR an engineer reviews. (or `/promote <which component>`)

Then ask which one they'd like to start with.
