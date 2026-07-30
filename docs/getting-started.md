# Getting started (no code required)

This is the day-one guide for **designers, PMs, and marketing** — anyone who wants to build real
pages in this repo without writing code or touching tooling.

The deal: **you say what you want in plain words; Claude does all the technical work** — creating
files, styling on-brand, running the quality checks, making a branch, committing, pushing to GitHub,
opening the pull request, and coming back with a **live web link** you can open on your phone or
send to anyone.

You will never need to type a command, know a file path, or use git.

> Lost at any point? Type **`/prompts`** in Claude Code. It shows the whole menu of what you can ask
> for, in plain language.

---

## 1. What you'll need, once

This part is setup, and it happens **once per computer**. If it feels like a lot, ask an engineer to
sit with you for ten minutes — after this you never repeat it.

| # | What | Why you need it |
|---|---|---|
| 1 | **Git** and **Bun** installed | Bun runs the project. [README steps 1–2](../README.md#getting-started) has the click-by-click version. |
| 2 | **Claude Code** installed | This is the thing you talk to. |
| 3 | **GitHub CLI** (`gh`), signed in with `gh auth login` | This is what lets Claude open pull requests *for you*. Without it, Claude can build pages but can't publish them. |
| 4 | **Write access to the repo** | Ask a maintainer to add you as a collaborator, or your branches can't be pushed. |
| 5 | The project on your machine | Clone it once and run `bun install` — [README steps 3–4](../README.md#step-3--clone-the-repository). |

That's the whole setup. Everything after this is conversation.

---

## 2. Every working session: two windows

**Window 1 — the local preview.** In the project folder:

```bash
bun run dev
```

Leave it running. It gives you two local addresses:

- **http://localhost:5173** — the sandbox: a gallery of every page, so you can click into yours
- **http://localhost:6007** — Storybook: every building block and its variants

To stop it, press `Ctrl + C`. To restart it, run the same command again. **Claude will never start
or stop these for you** — that's deliberate, so it can't kill a server you're using.

**Window 2 — Claude.** In the same folder:

```bash
claude
```

Then just talk.

> **Is the local preview required?** No. You can work entirely from real web links (§4) and never
> open `localhost` at all. But local is the fastest loop — changes appear in a second or two, with
> no deploy to wait for.
>
> `localhost` addresses only work **on your computer, while that server is running**. They are not
> shareable — don't send one to anyone, and if Claude ever hands you one as "the preview link," that's
> a bug. The shareable link comes from submitting (§3, step 4).

---

## 3. The loop: build → look → tweak → submit → live

### Step 1 — Build it

Describe the page or section you want, in outcomes, the way you'd brief a colleague:

> "Build a careers page with a short intro and three open roles."

Claude names the page, creates it, composes it from the design system's real components, keeps every
color and spacing on-brand, runs the quality checks, and tells you where to look. Nothing is
published yet — this lives only on your machine.

### Step 2 — Look at it

Open the sandbox gallery (`localhost:5173`) and click your page. Or skip ahead to step 4 and look at
it as a real web page.

### Step 3 — Tweak it

Say what's off, one thing at a time:

> "Make the headline a bit bigger."
> "The intro needs more breathing room."
> "Change the button to say 'See open roles'."

Don't like a change? **"Put it back."** Claude shows you what it's about to undo in plain words and
waits for your yes. It's reversible — ask for it back and you get it back. (This only covers work
you haven't submitted yet.)

### Step 4 — Submit it

When you're happy, say:

> "This is ready — send it for review."

This is your **explicit go-ahead**, and it's the only thing that makes Claude touch GitHub. Behind
the scenes it: runs the full quality check → fixes anything red or off-brand → creates a branch →
commits → pushes to GitHub → opens a pull request → waits for the site to build → and hands you
**two links**:

1. **A live web link** — your page, actually deployed. Open it on your phone. Send it to your boss.
2. **The pull request link** — the record of the change, for whoever reviews it.

The live link keeps working and **updates itself every time you change the page**, right up until
the work is merged.

### Step 5 — It goes live

- **A page or copy change** can merge as soon as the checks are green — and merging is what publishes
  it to the real site.
- **Anything that touches the shared design system** (brand colors, reusable components) opens as a
  **draft** pull request for an engineer to review first.

You don't choose which one — it's automatic, based on how far the change reaches. The full rules are
in [`governance.md`](./governance.md).

### A real example

> **You:** Build a careers page with a short intro and three open roles.
>
> **Claude:** Built it as **Careers** at `/careers` — intro, three role cards, and a "See open roles"
> button. On-brand, checks passing. It's in your sandbox gallery. Want a shareable link?
>
> **You:** Make the intro a bit shorter and the headline bigger.
>
> **Claude:** Done — tighter intro, headline one size up on the `/careers` page.
>
> **You:** This is ready — send it for review.
>
> **Claude:** Checks are green. Here it is live: `https://deploy-preview-24--madison-design-system.netlify.app/careers`
> — and the pull request: `https://github.com/…/pull/24`.
>
> **You:** *(sends the first link to three people)*

---

## 4. The links, and which one to send

There are exactly three kinds of real link, and they never expire into something confusing:

| Link | What it is | When to send it |
|---|---|---|
| **`madison-design-system.netlify.app`** | **The site.** What everyone sees. | When the work is merged and done. |
| **`deploy-preview-<number>--madison-design-system.netlify.app`** | **Your work in review.** One per pull request; refreshes on every change you make; goes away when the work merges. | For feedback — this is the link you'll use most. |
| **`preview--madison-design-system.netlify.app`** | **A stable staging link** that doesn't change per piece of work. | When someone needs one address to bookmark. |

Two things worth knowing:

- **New pages show up on the site by themselves.** Nobody has to "add it to the site" — the moment
  the page exists, it's routed at its address. That's by design.
- **The site is hidden from Google on purpose** (it runs on a demo account). Anyone with the link can
  open it; it just won't turn up in search. Don't ask anyone to "fix" that — it comes off at handover,
  all at once. See [`publishing.md`](./publishing.md).

And once more, because it's the most common mistake: **`localhost` is not a link.** It works only on
your machine, only while your preview is running. Every link you send someone comes from the table
above.

---

## 5. How branches and GitHub work (you never type git)

You don't ask for a branch. You say **"submit this"** — and the branch, the commit, the push, and the
pull request all happen as one step.

If you'd like to know what's happening while you wait:

- **A branch** is a private copy of the project where your work sits, so it can't disturb the live
  site. Claude names it after what you built.
- **A pull request** is that work, proposed. It's what gets the preview link and the review.
- **`main` is the live site.** Nobody — not you, not Claude — pushes to it directly. Merging a pull
  request is what publishes.

### Adding more after you've submitted

Keep going and say so:

> "Add a fourth role to the careers page and update the review."

Claude commits onto the **same branch**, and **the same live link refreshes** — no new link to
re-send.

### If you don't want it merged yet

Say it plainly:

> "Submit it, but don't merge it — I want to show it around first."

You'll get the preview link and the pull request, and it stays open until you say otherwise.

### If it's already submitted and you want it undone

Say so, but know the boundary: **"put it back" only covers work you haven't submitted.** Once
something is pushed, unwinding it is an engineer's call — Claude will tell you that rather than
quietly rewriting history.

---

## 6. What Claude won't do without you

Guardrails you can rely on, so you can experiment freely:

- **It won't push anything to GitHub** until you say submit / ship / send for review.
- **It won't push to the live site** directly, ever.
- **It won't use an off-brand color**, even if you name one. Say "make it red" and you'll get the
  brand's red, not a random one.
- **It won't quietly change the shared design system** to satisfy a one-page request. It'll tell you
  that's a bigger change and needs an engineer.
- **It won't start or stop your preview servers.**
- **It won't undo something already submitted.**

---

## 7. When something looks off

| What you see | What to say / do |
|---|---|
| The live link says **page not found** | The site is probably still building. Ask: *"is the preview ready yet?"* |
| Claude says **the checks are red** | It fixes them before submitting. Nothing red should ever be merged — if it can't fix it, it'll say so. |
| Your page **isn't in the local gallery** | The preview server needs a restart: `Ctrl + C` in window 1, then `bun run dev`. |
| The live site looks **completely unstyled** | That's a real bug, not you. Tell an engineer and point them at the troubleshooting section of [`publishing.md`](./publishing.md). |
| You **closed your terminal** | Nothing is lost — your work is saved on disk. Reopen it and run the two commands from §2. |
| You have no idea what to say | Type **`/prompts`**. |

---

## 8. Words you'll hear

| Word | What it means to you |
|---|---|
| **Prototype** | A page you built. Real code, real page — "prototype" just means it lives in the sandbox, not the shared system. |
| **Token** | A named brand value (a color, a spacing, a text size). Using tokens is what keeps everything on-brand. |
| **Primitive / component** | A reusable building block (a button, a card) that every page shares. |
| **Pull request (PR)** | Your work, proposed for review. It's what produces the live preview link. |
| **Deploy preview** | The live web link for a pull request. |
| **`main`** | The live site. |
| **Check** | The automatic quality test (does it build, is it on-brand). Green means good to go. |

---

## Next

- [`prompts.md`](./prompts.md) — the full menu of what you can ask for, with example phrasings
- [`publishing.md`](./publishing.md) — how the site deploys and where the links come from
- [`governance.md`](./governance.md) — what merges on its own vs. what an engineer reviews, and why
- [`contributor-guide.md`](./contributor-guide.md) — the more technical version of this same loop
