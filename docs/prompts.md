# What to say to Claude

You don't need to know any commands, file paths, or git. **Say what you want in plain words** and
Claude does all the technical work — scaffolding, styling on-brand, running the checks, and opening
the pull request. This page is the menu of what you can ask for.

Each workflow also has a shortcut you can type instead of describing it: `/build`, `/small-edit`,
`/restyle`, `/undo`, `/submit`, `/promote`. And `/prompts` shows this menu any time.

---

## Build something

Make a new page or section. Claude scaffolds it as a live, on-brand prototype you can preview, then
fills it in by composing the system's building blocks.

**Just say:**
- "Build a pricing page with three plans — Starter, Team, Enterprise."
- "Make me a settings screen with a profile section and notification toggles."
- "Add a marketing hero with a headline, subtext, and a call-to-action button."

**Behind the scenes:** Claude names the page, scaffolds it, composes `@madison/ui` components
using only design-system tokens (no off-brand colors), runs the checks, and gives you a preview link.

**Shortcut:** `/build a pricing page with three plans`

---

## Change one small thing

One specific tweak on one page — a heading that needs more air, a word that's wrong, something a
size too big. This is the quick lane: Claude makes the single change and comes straight back,
without asking you a round of questions first.

**Just say:**
- "Increase the line height of the H1 on the landing page."
- "Make the pricing page subtitle one size smaller."
- "Change the button on the welcome page to say 'Get started'."

**Behind the scenes:** Claude goes straight to that one page, makes exactly one change using a
brand token, runs the checks, and reports back in a line. If it turns out the change belongs to
the shared design system instead, it says so rather than quietly making a much bigger edit.

**Shortcut:** `/small-edit increase the line height of the H1 on the landing page`

---

## Undo something

Changed your mind, or it looked better before? Put it back. Nothing you try in the sandbox is
permanent, so it's safe to experiment.

**Just say:**
- "Undo that."
- "Put it back the way it was."
- "That was worse — go back."

**Behind the scenes:** Claude shows you what it's about to undo in plain words and waits for your
yes before touching anything. It only ever undoes work you haven't submitted yet — once something
has been sent for review, unwinding it is an engineer's call.

**Shortcut:** `/undo`

---

## Restyle something

Change how something looks — a color, more or less spacing, a different feel. Claude makes the change
in the right place and keeps it on-brand, even if you describe a literal color. This is the one to
use when the change is broader than a single tweak, or when it might affect more than one page.

**Just say:**
- "Make our main color green."
- "Give the pricing page more breathing room."
- "The danger button should feel more serious."

**Behind the scenes:** Claude changes it at the right level — just this page, the app's brand color,
or the shared design system — and always uses a brand token, never a raw color value. A change to the
shared system goes to an engineer first (see trust levels below).

**Shortcut:** `/restyle make the main color green`

---

## Submit for review

When something's ready, hand it off. Claude runs the full quality check, then opens a pull request and
gives you the link. This is your explicit go-ahead — Claude won't push anything until you ask.

**Just say:**
- "This is ready — send it for review."
- "Ship the pricing page."
- "Submit this."

**Behind the scenes:** Claude runs the checks, fixes anything off-brand, and opens the pull request.
You get a link back. Where it lands (straight in, or to an engineer) is decided by the trust levels —
you don't have to think about it.

**Shortcut:** `/submit`

---

## Promote to the system

When a component you built is good enough to reuse everywhere, make it official. Claude turns it into a
shared building block that every page and app can use.

**Just say:**
- "Make this card an official, reusable component."
- "Turn the stat box from the dashboard into a real component."

**Behind the scenes:** Claude follows the promote process and opens a draft pull request for an
engineer to review before it goes live — promotions always get a human check.

**Shortcut:** `/promote the stat card from the pricing page`

---

## Where your work goes (trust levels)

You don't decide this — it's automatic — but it helps to know:

- **Small page tweaks go live on their own** once the checks pass (new prototypes, copy, layout).
- **Anything touching the shared design system goes to an engineer first**, as a draft pull request
  (brand tokens, reusable components, promotions).
- **The deepest plumbing** (the guardrails themselves, the token engine) is suggested for a maintainer
  to apply — never changed automatically.

The full version lives in [`governance.md`](./governance.md).

## You'll never need to

- Type a command, remember a file path, or use git — Claude does all of it.
- Pick a hex color or a Tailwind class — just describe the look; Claude stays on-brand.
- Know what a "slug," "primitive," or "token" is — say it in everyday words.

New here? Start with the [contributor guide](./contributor-guide.md). Then just say what you want — or type `/prompts`.
