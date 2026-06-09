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
   the lint gates keep it on-token, the Storybook MCP keeps it on real components, and
   `bun run check` catches what slips. **That's the moat.**
4. **(Act 2) The system grows itself.** Non-technical people don't just *use* the system — they
   *extend* it: a prototype becomes a reusable primitive, a missing piece becomes a new building
   block, all in plain language and all reviewed by a human before they go live.

Keep coming back to these. Everything you type is in service of one of them. (Belief 4 only lands
if you run **Act 2** — the optional lifecycle beats; see the arc below.)

---

## Behind the curtain: the Storybook MCP (the harness's component sense)

The governance story has **two halves** — name both and the demo lands harder:

1. **The token dictionary** — the design *vocabulary* (color, spacing, type, radii, z-index…). The
   lint gates (`no-raw-colors`, `no-raw-dimensions`, `no-raw-rings-zindex`) keep every change *on-token*.
2. **The component library** — the *building blocks* (`@northwind/ui` primitives: Button, Card,
   Badge, Tabs…), surfaced to the AI through the **Storybook MCP**.

When Storybook runs (`:6007`), it publishes a **live manifest** of every primitive — real props,
variants, and token bindings, generated from the actual TypeScript + stories. The checked-in
`.mcp.json` wires Claude Code to it (`http://localhost:6007/mcp`). So when a contributor says
*"build a pricing page,"* the AI doesn't *guess* that `Button` has a `variant` prop or invent a
`<PriceCard>` that doesn't exist — it **reads the real library** and composes the actual primitives
with their actual APIs.

**Why it matters for governance:** the lint gates stop the AI drifting *off-token*; the MCP stops
it drifting *off-component* — hallucinated props, made-up components, stale APIs. Together that's
why a non-technical person's output is real, mergeable code that doesn't look "AI-generated" — it's
on-token **and** on-component, by construction. (Governance even tracks "is the MCP manifest
current?" as a health check — see [`governance.md`](./governance.md) and [`architecture.md`](./architecture.md) §8.)

> **One-liner for the room:** *"The tokens tell the AI what our design language is; the Storybook
> MCP tells it what our actual components are. It can't make up a component any more than it can
> make up a color."*

### Show it live

This isn't just backstage theory — **Scenario 1b** ("What components can I use?") turns it into a
one-minute demo beat: ask in plain language and watch the AI answer from the live library, right
before the first Build.

---

## Before you start (pre-flight — do this once, ideally a dry run the day before)

- [ ] **Servers running.** In a terminal: `bun run dev` (starts Storybook on `:6007` and the
      sandbox on `:5173`). Leave it running.
- [ ] **Storybook MCP connected.** In your Claude Code session, confirm the `storybook` MCP server
      (from `.mcp.json`, at `:6007/mcp`) is approved/connected — a fresh session may prompt to
      approve it. This is how the AI reads the *real* component library; if it's down, Claude falls
      back to guessing. (See "Behind the curtain" above.)
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

## The arc — two acts

The demo has a tight **core arc (Act 1, ~12–15 min)** that lands the first three beliefs, and an
optional **extended act (Act 2)** that shows the design system *growing itself* — the
build → promote → reuse loop. Run Act 1 for a short demo; add as many Act 2 beats as time and room
allow (they shine with engineering-curious audiences and in enablement workshops).

### Act 1 — the core arc (~12–15 min)

| # | Beat | You say (plain language) | Point at… | ~min |
|---|------|--------------------------|-----------|------|
| 0 | Frame | *(talk, no typing)* | the landing page | 1 |
| 1 | "What can I ask?" | `/prompts` | the menu Claude lists | 1 |
| 1b | "What components can I use?" | "What components can I use here?" | Claude answering from the live library (Storybook `:6007`) | 1 |
| 2 | Build | "Add a section to our landing page with three customer testimonials." | the new section appearing | 3 |
| 3 | Restyle (the showstopper) | "Make our brand color a deep forest green." | the whole page re-skinning | 3 |
| 4 | The guardrail (centerpiece) | "Make the main button this exact purple: #7C3AED." | the check turning red on a raw color *and* a raw size | 4 |
| 5 | Submit | "This looks great — send it for review." | the PR link + trust tier | 2 |
| 6 | Promote (the bridge) | "Make that testimonial card an official, reusable component." | the draft PR | 2 |

### Act 2 — growing the system (optional; pick beats as time allows)

Each beat is a self-contained *"hit a real-life gap → fix it the governed way"* vignette. They build
on the testimonials from Scenario 2 and the promote from Scenario 6, so **run Act 1 first.**

| # | Beat | You say (plain language) | Point at… | ~min |
|---|------|--------------------------|-----------|------|
| 6b | Reuse what you promoted | "Add two more testimonials using that card." | the promoted card now in the live library | 2 |
| 7 | The variant gap | "Put a green 'Verified' badge by each testimonial author." | a new on-token Badge variant → draft PR | 3 |
| 8 | The honest gap | "Add notification toggles for email, SMS, and product updates." | a missing `Switch` → a promoted primitive | 4 |
| 9 | Grow & reuse | "Add a band of key numbers to the landing page." | a `StatCard` primitive reused across the page | 4 |

---

## The scenarios, in detail

### 0 · Frame it (1–2 min, no typing)

Open on the landing page. This is the story; tell it as a story, in your own words:

> "Every team's design system lives in two places at once — a Figma file *and* the actual code —
> and the moment someone ships, the two start to drift. The mockup says one thing, the product
> does another. That gap is where design-to-dev handoff goes to die: slow, lossy, and full of
> prototypes that look great but can't actually be shipped.
>
> Northwind closes that gap by making **code the single source of truth.** The design system *is*
> the repo — the tokens, the components, the rules. Change it in one place and it propagates
> everywhere. Design and implementation can't drift apart, because they're the same artifact.
>
> The usual catch: once your system lives in code, only *engineers* can touch it. Northwind
> removes that catch — it lets *anyone* on the team, a designer, a PM, me as a marketer, make
> real changes, in plain language, directly in the real repo.
>
> And here's the key shift — I'm not going to *write code.* I'm going to describe what I want, and
> Claude Code translates it into real, on-system components: the kind your engineers actually
> merge, not a throwaway mockup. What makes that safe isn't trust — it's **governance written as
> code.** Guardrails that run on every change and never get tired or forget.
>
> Watch what the system lets me do — and, just as important, what it *won't.*"

**Facilitator note — the frame that sells.** Don't pitch this as *"Claude replaces Figma."* Pitch
it as *"the source of truth moves into code, and non-technical people author change requests that
Claude implements."* That's the credible version: it targets the pain companies actually feel —
drift, slow handoff, un-shippable prototype code — without claiming Figma is dead. Figma stays
useful for exploration and stakeholder alignment; what moves into code is **implementation-grade
product work.** (If anyone pushes back with "so you're killing Figma?" — that distinction is your
answer.)

---

### 1 · "What can I even ask for?" (1 min)

**Say:** `/prompts`

**Watch for:** Claude lists four plain-language workflows — **build, restyle, submit, promote** —
and asks which you'd like. No commands to memorize.

**The point:** zero learning curve. You talk in outcomes; the harness maps it to the right workflow.

---

### 1b · "What components can I use?" (1 min)

**Say:**
> "What components can I use here? And what can I change about a button?"

**Watch for (narrate this):**
- Claude reaches into the **Storybook MCP** and answers from the **live component library** — the
  real primitives (Button, Card, Badge, Tabs…), their actual variants and props, and the tokens they
  bind to. Not from memory, not a guess — it's reading our real system right now.
- Flip to **Storybook at `http://localhost:6007`** as it answers: the very same components,
  documented. *"It's looking at exactly this."*

**The point:** this is the *other* guardrail. The tokens keep it on-brand; the MCP keeps it on
**real components** — so when you ask it to build next, it composes these exact parts and can't
invent a component or a prop that doesn't exist. (The "Behind the curtain" section up top explains
the wiring.)

---

### 2 · Build something real (3 min)

**Say:**
> "Can you add a section to our landing page with three short customer testimonials?"

**Watch for (narrate this):**
- Claude doesn't ask you for a file path or a component name — it just gets to work.
- Behind the scenes it composes the system's building blocks (`@northwind/ui` primitives) using
  **only design-system tokens** — no off-brand colors — and runs the quality check.
- It uses *real* components, not invented ones — it reads their actual props and variants from the
  **Storybook MCP** (the live component manifest) instead of guessing. That's the on-component half
  of governance (see "Behind the curtain").
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
> Claude opens up the spacing **on the standard scale** (`py-24`, `gap-8` — each a multiple of the
> spacing token, so it stays on-system and the check passes). This previews Scenario 4's spacing
> guardrail: the scale is allowed; a *raw* `97px` is not.

---

### 4 · The guardrail — governance catches drift (4 min) — *the centerpiece*

This is the moment that sells the product. Do it in three beats.

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

**Beat C — it's not only color: the whole vocabulary is governed.**

**Say:**
> "Just to show the team it's not only about color — force a 10-pixel text size and some 17-pixel
> padding onto that card too, then run the check."

**Watch for:**
- The same red ❌ — this time from the **spacing/type** guard (`no-raw-dimensions`), naming the
  off-system `text-[10px]` / `p-[17px]`. **Color, spacing, and type are all enforced — the whole
  on-token vocabulary, not just color.**
- Tie it back to Scenario 3: "breathing room" *passed* because `py-24` is on-token (the spacing
  scale is `token × N`); a raw `97px` *fails*. **The gate tells on-token from arbitrary.**

> **Optional — the governed escape hatch (great for a technical audience).** "But what if we
> *genuinely* need a 10-pixel size?" You don't hardcode it — you say *"add a tiny 10-pixel text size
> to our system."* Claude adds it as a **named token**, regenerates the system, and sends it to an
> engineer to review (token changes are never silent). The rule isn't "off-system is forbidden" — it's
> "make it on-system first." That's exactly how the system's smallest size, `text-2xs`, exists.

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

### 6 · Promote to the system (2 min) — *the bridge into Act 2*

**Say:**
> "Let's make that testimonial card an official, reusable component."

**Watch for:** Claude follows the **promote** flow — it turns the one-off into a shared
`@northwind/ui` building block (with a Storybook story) and opens a **draft PR**. **Promotions
always get a human review** (trust matrix), never auto-merge.

**The point:** the path from "a non-technical person's prototype" to "a primitive every app reuses"
is real, governed, and one sentence away.

> **Stop here for a tight demo.** This is a natural ending for Act 1. If you have time and the room
> is leaning in, keep going into **Act 2** below — that's where the promoted card comes *back* onto
> the page and the system visibly grows.

---

## Act 2 · Growing the system (optional — the lifecycle loop)

Act 1 ends with a *promoted* component sitting in a draft PR. Act 2 is the payoff most of the market
can't show: that component — and the whole design system — **grows** through plain language, and the
new pieces get **reused right back on the page.** Each beat below is a self-contained *"hit a
real-life gap → fix it the governed way"* story. **Pick the ones that fit your time and room** — they
don't all need to run. They build on the testimonials from Scenario 2 and the promote from
Scenario 6, so do Act 1 first.

> **Gear-shift to name for the room:** Act 1 was *using* the system; Act 2 is *extending* it.
> Everything here touches the shared library, so the strongest guardrails fire by design — the
> **skill-gate** makes Claude load the design-system rules before it can edit `packages/ui` (the same
> gate from Scenario 4; it only re-fires if that skill wasn't already loaded this session), and every
> new building block lands as a **draft PR** for an engineer (the trust matrix). *That's* the point:
> non-technical people can grow the system, and a human still signs off on every primitive.

---

### 6b · Reuse what you just promoted (2 min) — *close the loop*

**Say:**
> "Now that the testimonial card is official, add two more testimonials using it."

**Watch for (narrate this):**
- Claude pulls in the **freshly-promoted primitive** from the shared library instead of the inline
  copy — the section now renders from the real building block.
- Re-ask **"what components can I use here?"** — the testimonial card **now appears in the live
  library** (Storybook MCP) that didn't have it ten minutes ago.

**Payoff:** the prototype a marketer built at the *start* of the demo is now a governed, reusable
primitive *and* it's already back in use on the page. **That's the whole loop on one screen:** a
plain-language prototype → a promoted primitive → reused everywhere, discoverable to the AI.

---

### 7 · The variant gap — a new Badge variant (3 min)

**Say:**
> "Put a little green 'Verified' badge next to each testimonial author."

**Watch for (narrate this):**
- The system's `Badge` has no "verified/success" look, and Claude **won't fake green with a raw
  color** — the on-token gate would catch it anyway (tie this straight back to Scenario 4).
- Give the governed go-ahead in plain language: *"Then add a proper 'verified' style to our badge."*
  Claude adds an **on-token variant** to the Badge primitive (bound to the success token, dark-mode
  handled automatically) and opens a **draft PR**.

**The point:** Scenario 4's escape hatch was a *token*; this is the same rule for a *component
variant* — "make it on-system first," never hardcode. The vocabulary **and** the component library
grow the exact same governed way.

---

### 8 · The honest gap — promote a missing primitive (4 min)

**Say:**
> "Add a notifications section to the landing page with on/off toggles for email, SMS, and product
> updates."

**Watch for (narrate this):**
- Claude builds the section but **tells you honestly** the system has no real on/off switch yet — it
  can only reuse a checkbox, and it **won't invent a component that doesn't exist** (the on-component
  guardrail from "Behind the curtain").
- Give the go-ahead: *"Make those proper on/off switches, and add the switch to our system as an
  official component."* Claude follows the **promote** path and opens a **draft PR** for a brand-new
  `Switch` primitive (with a Storybook story).

**Payoff:** a non-technical person discovered a **missing building block by trying to ship real
work** — and the governed path *filled the gap* instead of the AI hallucinating a fake component.
Once it merges, "what components can I use?" includes the new switch.

---

### 9 · Grow and reuse — a stats band from a new primitive (4 min)

**Say:**
> "Add a band of key numbers to the landing page — '14% of UI drifts off-system in a year', '70% of
> the workshop is hands-on building', '3 phases to value'."

**Watch for (narrate this):**
- Claude builds the band from a repeated **number tile**, all on-token.
- Then: *"Make that number tile an official, reusable component."* → a `StatCard` primitive, draft PR.
- Close the loop again: *"And use it in the showcase section too."* — the same new primitive, reused
  elsewhere on the page.

**The point:** the build → promote → reuse loop one more time, with **hard numbers that double as the
business pitch** (drift %, hands-on %, phases-to-value). The audience watches the system get richer
*and* the sales story land in the same beat.

---

## Close (1 min)

Recap the beliefs, pointing back at what they just saw:

1. *Plain language in, real UI out* — the testimonials section.
2. *One source of truth* — the live green rebrand.
3. *Guardrails as code* — the check going red on a raw hex *and* a raw pixel size; the on-token
   vocabulary (color, spacing, type) is enforced on every change.
4. *(if you ran Act 2) The system grows itself* — a prototype became a primitive, a gap became a new
   building block, and both were reused right back on the page — every new piece reviewed by a human.

> "That loop — describe it, the system builds it on-brand, governance keeps it safe, an engineer
> merges it, and the system *grows* — is the entire product. It's how a whole team ships *and
> extends* a design system without it drifting."

---

## Reset between runs (so you can rehearse and re-run)

Your demo edits are local. To get back to a clean slate:

```bash
# Undo edits to existing files (brand color, landing sections, etc.)
git checkout -- .

# Remove any brand-new prototype the "build" step scaffolded (e.g. a careers page)
git clean -fdn apps/sandbox/src/prototypes   # dry run — see what would be removed
git clean -fd  apps/sandbox/src/prototypes    # actually remove it

# Act 2 also adds NEW files under packages/ui (a promoted primitive + its story) and edits
# package.json / the barrel. `git checkout -- .` reverts the edits; remove the new files:
git clean -fdn packages/ui/src   # dry run — see what would be removed
git clean -fd  packages/ui/src    # actually remove the promoted-primitive files

# If a restyle or a promotion touched shared tokens, regenerate the CSS back to baseline
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
| **The spacing/type guardrail (Beat C) didn't go red** | You (or Claude) used the numeric scale (`py-24`) or a named step — those are *on-token* and pass. To trip the gate you need a *raw literal*: `p-[17px]`, `text-[10px]`. That contrast is the lesson. |
| **Claude can't "see" components / invents props** | The `storybook` MCP isn't connected. Make sure Storybook is up on `:6007` and the `storybook` server (from `.mcp.json`) is approved in the session — without it, Claude falls back to guessing component APIs. |
| **`/submit` can't open a PR** | Needs a GitHub remote + `gh auth login`. Either set that up beforehand or use the "here's what it would do" framing. |
| **An Act 2 promote (7 · 8 · 9) takes a while / opens a draft PR** | Expected. Promotions touch the shared `packages/ui` library, so the **skill-gate** fires (Claude loads the design-system rules first) and the real port + `bun run check` take longer than a sandbox build — and it always lands as a **draft PR** for an engineer, never auto-merge. Narrate the wait as the governed path. To avoid opening real PRs, use the "here's what it would do" framing from Scenario 5. |
| **Act 2 says a component is "missing" (e.g. a Switch)** | That's the honest-gap beat working as designed — the system genuinely has no `Switch` primitive yet, so Claude won't fake one. Lead into the promote step ("add the switch to our system") to fill the gap on camera. |

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
- "Force a 10-pixel text size and 17-pixel padding onto that card, then run the check." *(spacing/type — the same gate)*
- "We actually need a tiny 10-pixel caption everywhere — add it to our system properly." *(the governed escape hatch: a reviewed token change)*

**Submit**
- "This looks great — send it for review."
- "Ship the landing page."

**Promote & grow the system (Act 2)**
- "Make that testimonial card an official, reusable component." *(promote)*
- "Now add two more testimonials using that card." *(reuse the promoted primitive — 6b)*
- "Put a little green 'Verified' badge next to each testimonial author." → *(then)* "Add a proper 'verified' style to our badge." *(new on-token Badge variant — 7)*
- "Add notification toggles for email, SMS, and product updates." → *(then)* "Make those proper on/off switches and add the switch to our system." *(promote a missing primitive — 8)*
- "Add a band of key numbers to the landing page." → *(then)* "Make that number tile an official component, and use it in the showcase too." *(promote + reuse — 9)*

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

> **What `bun run check` enforces on every change:** typecheck + tests + two on-token lint rules —
> `no-raw-colors` (no off-system colors) and `no-raw-dimensions` (no arbitrary spacing/type lengths).
> Both must be green to ship.

> Deeper reading for the curious: [`prompts.md`](./prompts.md) (the contributor menu),
> [`governance.md`](./governance.md) (the three-layer model + trust matrix),
> [`contributor-guide.md`](./contributor-guide.md), and [`promote.md`](./promote.md).
