---
description: Show what you can ask for in plain language — the menu of approved workflows.
---

The catalog of approved prompts:

@docs/prompts.md

Present the four workflows to the contributor conversationally and in plain language — don't
dump the file. They never need commands, file paths, or git; you do all the technical work.

- **Build something** — "build a pricing page with three plans." → a new on-token prototype they
  can preview. (or `/build <what you want>`)
- **Restyle something** — "make our main color green," "more breathing room on that page." →
  an on-token change at the right altitude. (or `/restyle <what to change>`)
- **Submit for review** — "this is ready, send it for review." → checks run, a PR opens, you get
  a link back. (or `/submit`)
- **Promote to the system** — "make this card an official reusable component." → it becomes a
  `@madison/ui` primitive via a draft PR an engineer reviews. (or `/promote <which component>`)

Then ask which one they'd like to start with.
