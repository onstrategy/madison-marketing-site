# Team Demo Script — Northwind (facilitator runbook)

> **The promise of this demo, in one line:** watch a *non-technical* teammate ship real,
> on-brand UI into the *real* repo — and watch governance-as-code keep it safe. **Nobody types a
> command, a file path, or a hex code.** You speak in plain language; Claude does the rest.

This is a runbook for **you, the facilitator**. You'll play a designer / PM / marketer and talk to
Claude Code in plain English. The audience watches the screen. Total run time: **~12–15 minutes**
(plus optional extras). The demo surface is the **Northwind landing page** at
`http://localhost:5173/landing`.

---

## What you want the audience to walk away believing

1. **Plain language in, production UI out.** A non-technical person describes an outcome; a real,
   on-brand component lands in the real codebase.
2. **One source of truth is real.** Change one token and the *entire* product re-skins, live —
   no two-places drift.
3. **The guardrails are code, not trust.** An agent (or a person) *cannot* drift off-system —
   the gates and `bun run check` catch it every time. **That's the moat.**

Keep coming back to these three. Everything you type is in service of one of them.

---

## Before you start (pre-flight — do this once, ideally a dry run the day before)

- [ ] **Servers running.** In a terminal: `bun run dev` (starts Storybook on `:6007` and the
      sandbox on `:5173`). Leave it running.
- [ ] **Browser open** to `http://localhost:5173/landing`, zoomed so the room can read it.
- [ ] **Terminal + browser side by side** (or quick to alt-tab). The audience should see *both*
      the conversation with Claude and the page updating.
- [ ] **Clean git state** so your demo edits are visible and resettable: `git status` should be
      tidy. (See **Reset between runs** below to undo edits after rehearsing.)
- [ ] **Pick your theme.** Light mode usually reads better on a projector. The nav has a toggle.
- [ ] **Do one full dry run.** It warms the dev server's cache (so refreshes are instant) and you'll
      know the cadence. **Tip:** if a change ever doesn't show up, **hard-refresh** the tab
      (`Cmd/Ctrl + Shift + R`) — the dev server updates live but an open tab can hold a stale render.
- [ ] **For the guardrail moment (Scenario 4),** start that part in a **fresh Claude Code session**
      so the skill-gate fires cleanly (gate markers reset per session). Optional but punchy.

**Casting note:** stay in character as a non-technical contributor. Resist jargon. If you catch
yourself about to say "slug" or "token" or "PR" — *that's the point*, you don't need to.

---

## The 12–15 minute arc

| # | Beat | You say (plain language) | Point at… | ~min |
|---|------|--------------------------|-----------|------|
| 0 | Frame | *(talk, no typing)* | the landing page | 1 |
| 1 | "What can I ask?" | `/prompts` | the menu Claude lists | 1 |
| 2 | Build | "Add a section to our landing page with three customer testimonials." | the new section appearing | 3 |
| 3 | Restyle (the showstopper) | "Make our brand color a deep forest green." | the whole page re-skinning | 3 |
| 4 | The guardrail (centerpiece) | "Make the main button this exact purple: #7C3AED." | the check turning red, then green | 3 |
| 5 | Submit | "This looks great — send it for review." | the PR link + trust tier | 2 |
| 6 | *(optional)* Promote | "Make that testimonial card an official, reusable component." | the draft PR | 2 |

---

## The scenarios, in detail

### 0 · Frame it (1 min, no typing)

Open on the landing page. Say something like:

> "Everyone wants their design system in code — but then only engineers can touch it. Northwind
> lets *anyone* on the team ship real UI into the real repo, in plain language, and makes it safe
> with guardrails written *as code*. I'm going to play our marketer. I won't type a single command
> or color code. Watch what the system lets me do — and what it *won't*."

---

### 1 · "What can I even ask for?" (1 min)

**Say:** `/prompts`

**Watch for:** Claude lists four plain-language workflows — **build, restyle, submit, promote** —
and asks which you'd like. No commands to memorize.

**The point:** zero learning curve. You talk in outcomes; the harness maps it to the right workflow.

---

### 2 · Build something real (3 min)

**Say:**
> "Can you add a section to our landing page with three short customer testimonials?"

**Watch for (narrate this):**
- Claude doesn't ask you for a file path or a component name — it just gets to work.
- Behind the scenes it composes the system's building blocks (`@northwind/ui` primitives) using
  **only design-system tokens** — no off-brand colors — and runs the quality check.
- It reports back a preview link and "it's on-brand, checks pass" — not raw command output.

**Payoff:** **hard-refresh `/landing`.** A real testimonials section appears — neutral-first,
properly spaced, in your brand. *A marketer just built production-quality UI.* Point out it doesn't
look "AI-generated" — because the design system constrains it to look designed.

> **Variant — build from nothing:** prefer a blank-canvas moment? Say *"Build a careers page with a
> few open roles."* Claude scaffolds a brand-new page you can preview at its own URL.

---

### 3 · Restyle — the live rebrand (3 min) — *the visual showstopper*

**Say:**
> "Make our brand color a deep forest green."

**Watch for (narrate this):**
- Claude works at the **right altitude** — it changes the app's *brand* color in one place
  (~3 lines), not by hunting through the page.
- **You said "green" — it uses a brand *token*, never a raw hex.** That's why the change stays
  on-system.

**Payoff:** **refresh.** The **entire page re-skins at once** — every call-to-action, the logo
mark, the featured pricing card, the links — all from one change. Toggle light/dark in the nav;
the new brand holds in both. **This is "one source of truth" you can see.**

> Want a second restyle? Try *"The page feels a little cramped — give it more breathing room."*
> Claude adjusts the spacing rhythm, on-token.

---

### 4 · The guardrail — governance catches drift (3 min) — *the centerpiece*

This is the moment that sells the product. Do it in two beats.

**Beat A — the agent won't drift.**

**Say:**
> "I really want the main button to be this exact purple: #7C3AED."

**Watch for:** Claude *declines to hardcode the hex* and instead explains it'll use the on-system
brand/semantic token — color is a signal, not decoration. The **constitution** (`AGENTS.md`) keeps
it on-brand even when you ask for a literal color.

**Beat B — and the machine enforces it.** (The dramatic part.)

**Say:**
> "Okay — just to show the team the guardrail, put that exact hex in anyway and run the check."

**Watch for:**
- Claude adds the raw `#7C3AED`, runs **`bun run check`**, and the **on-token lint fails** — a red
  ❌ naming the off-system color. It reports it *can't ship that* and reverts to the token.
- *(Optional, in a fresh session)* ask it to change something in the **shared design system** —
  the **skill-gate blocks the edit** until Claude loads the `design-system` rules, then retries
  on-token. *"An agent literally cannot touch the design system without first reading its rules."*

**The point — say it out loud:**
> "Everyone else keeps non-technical people *out* of the repo to stay safe. We let them *in* — and
> *this* is what makes it safe. The guardrails are code. They run on every change. They don't get
> tired or forget."

---

### 5 · Submit — a real pull request (2 min)

**Say:**
> "This looks great — send it for review."

**Watch for (narrate this):**
- Claude runs the full check, then **branches, commits, and opens a pull request** — and hands you
  the **link**. You never touched git.
- It tells you **where the work goes**, decided automatically by the **trust matrix** (you don't
  choose): a sandbox page tweak can merge on a green check; anything touching the **shared design
  system** goes to an engineer as a **draft PR**.

**Payoff:** a non-technical teammate just produced a **real PR your engineers merge** — not a
throwaway mockup. That's the whole differentiator.

> **Demo logistics:** opening a *real* PR needs a GitHub remote + `gh` login. If you'd rather not
> open one live, stop at "the check passes — here's exactly what it would do," or run it on a
> throwaway branch you delete after.

---

### 6 · *(Optional)* Promote to the system (2 min)

**Say:**
> "Let's make that testimonial card an official, reusable component."

**Watch for:** Claude follows the **promote** flow — it turns the one-off into a shared
`@northwind/ui` building block (with a Storybook story) and opens a **draft PR**. **Promotions
always get a human review** (trust matrix), never auto-merge.

**The point:** the path from "a non-technical person's prototype" to "a primitive every app reuses"
is real, governed, and one sentence away.

---

## Close (1 min)

Recap the three beliefs, pointing back at what they just saw:

1. *Plain language in, real UI out* — the testimonials section.
2. *One source of truth* — the live green rebrand.
3. *Guardrails as code* — the check going red on a raw hex.

> "That loop — describe it, the system builds it on-brand, governance keeps it safe, an engineer
> merges it — is the entire product. It's how a whole team ships a design system without it drifting."

---

## Reset between runs (so you can rehearse and re-run)

Your demo edits are local. To get back to a clean slate:

```bash
# Undo edits to existing files (brand color, landing sections, etc.)
git checkout -- .

# Remove any brand-new prototype the "build" step scaffolded (e.g. a careers page)
git clean -fdn apps/sandbox/src/prototypes   # dry run — see what would be removed
git clean -fd  apps/sandbox/src/prototypes    # actually remove it

# If a restyle touched shared tokens, regenerate the CSS back to baseline
bun run build
```

Then **hard-refresh** the browser. (If you committed during a `/submit` rehearsal, delete the
branch: `git branch -D <branch>` and close the test PR.)

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| **A change doesn't show on the page** | Hard-refresh the tab (`Cmd/Ctrl + Shift + R`). The dev server updates live, but an open tab can hold a stale render — especially after a token/brand change. |
| **Page looks broken / unstyled after a token change** | Same cause. Hard-refresh; if it persists, restart the dev server (`Ctrl + C`, then `bun run dev`) — token/`@theme` changes are read at startup. |
| **Claude "takes a while" on a build** | That's it doing the real work (scaffold → compose → check). Narrate it — the wait *is* the value. |
| **The skill-gate didn't fire in Scenario 4** | You're in a session that already loaded the skill. Start a fresh Claude Code session for that beat — markers reset per session. The `bun run check` lint failure (Beat B) fires regardless, so lead with that. |
| **`/submit` can't open a PR** | Needs a GitHub remote + `gh auth login`. Either set that up beforehand or use the "here's what it would do" framing. |

---

## Appendix A — copy-paste prompt bank

Pick and mix. All plain language; no slash command required (the `/shortcut` is just faster).

**Build**
- "Add a section to our landing page with three customer testimonials."
- "Build a careers page with a few open roles." *(new page)*
- "Add a frequently-asked-questions section to the landing page."

**Restyle**
- "Make our brand color a deep forest green."
- "Make our brand color a warm orange." / "…a confident blue."
- "The page feels cramped — give it more breathing room."
- "Make the corners a bit softer across the whole system."

**Guardrail (to demonstrate the gate)**
- "I want the main button to be this exact purple: #7C3AED."
- *(then)* "Force that exact hex in anyway and run the check, so the team can see the guardrail."

**Submit**
- "This looks great — send it for review."
- "Ship the landing page."

**Promote**
- "Make that testimonial card an official, reusable component."

---

## Appendix B — the four commands & the trust matrix

| Command | Plain-language trigger | What it does |
|---|---|---|
| `/build` | "build / make me a page or section" | Scaffolds an on-token prototype, composed from `@northwind/ui`, checks green. |
| `/restyle` | "change the color / spacing / look" | Edits at the right altitude (prototype · app brand · shared token), stays on-token. |
| `/submit` | "send for review / ship / publish this" | Runs `bun run check`, branches, commits, opens a PR, returns the link. |
| `/promote` | "make this an official / reusable component" | Turns a prototype component into a `@northwind/ui` primitive — always a draft PR. |
| `/prompts` | "what can I ask for?" | Shows this menu of approved workflows. |

**Where work goes (decided automatically — the contributor never picks):**

| Change | Trust level | Who acts |
|---|---|---|
| Sandbox prototype content / copy | **auto-merge** | green check merges |
| Any `packages/ui/` or token change (incl. promotions) | **draft PR** | an engineer reviews |
| The gates/hooks, the token engine, token deprecations | **suggest-only** | a maintainer applies |

> Deeper reading for the curious: [`prompts.md`](./prompts.md) (the contributor menu),
> [`governance.md`](./governance.md) (the three-layer model + trust matrix),
> [`contributor-guide.md`](./contributor-guide.md), and [`promote.md`](./promote.md).
