# Roadmap — where the harness goes next

This is the backlog for the **AI harness** (the skills, gates, router and commands that let
non-technical contributors ship into this repo), not for the design system itself. It exists
because a round of outside questions from design-systems practitioners exposed gaps that the
architecture docs describe as solved, or don't describe at all.

Each item below names the question it answers, the **honest current state**, and the shape of the
fix. Nothing here is committed — but the current-state notes are verified, and worth reading before
anyone claims these capabilities exist.

For what the harness does today, see [`architecture.md`](./architecture.md) (§6 governance
machinery, §6g the commands layer) and [`governance.md`](./governance.md).

---

## Shipped — the baseline this builds on

The first round addressed the cost of small edits:

- **`--leading-*` line-height tokens.** Line-height previously existed *only* as a required
  property of a type-scale step, so "increase the line height of a heading" meant editing
  `tokens.tsx` — a gated, draft-PR-tier change. It's now a one-class prototype edit.
- **`/small-edit`** — a bounded fast lane: one property, one file, one pass. The kit's first
  command using `model` / `effort` / `allowed-tools` frontmatter to match cost to the size of the
  ask.
- **`/undo`** — makes experimentation reversible, which removes the main reason people re-prompt.
- **§6g in `architecture.md`** — the commands layer, previously undocumented.

---

## 1. Roles as configuration

> *"Different agent rules and skills per role, or a generic setting based on user credentials?"*

**Current state — the honest version.** Neither. The three-tier trust matrix (auto-merge ·
draft PR · suggest-only) is **prose, duplicated across five files** — `prompts.md`,
`contributor-guide.md`, `governance.md`, `promote.md` and `route-prompt.sh` — and enforced by
**nothing**. The skill-gate blocks on *paths*, identically for everyone. There is no notion of a
PM versus a designer versus a maintainer anywhere in the repo.

This matters because the difference between "a PM can only produce on-system prototypes" and "a
designer can explore and decide what gets promoted" is the thing that makes governed exploration
possible at all (see §2). Right now that distinction is a claim, not a mechanism.

**Shape of the fix — both layers, not one:**

| Piece | Role |
|---|---|
| `.claude/trust-matrix.json` | Single source for the tiers. The five prose copies become renders of it. |
| `.claude/roles.json` | `contributor` (sandbox only, ceiling auto-merge) · `designer` (+ `packages/ui/` and tokens, ceiling draft PR) · `maintainer` (+ hooks, generators, token engine). |
| `CONTRIBUTOR_ROLE` in each person's `.claude/settings.local.json` | The "credentials" half — per-user, gitignored, with a safe checked-in default. |
| `.claude/hooks/enforce-role.sh` | A second PreToolUse `Edit\|Write` hook beside `enforce-skill-gates.sh`, reusing its proven shape (stdin JSON → path → `jq` rules → `exit 2`). |
| `route-prompt.sh` | Injects the active role so the agent frames its offers by tier *before* anything hits a gate. |

**Design constraints:**

- **Fail open when `CONTRIBUTOR_ROLE` is unset** — anyone who hasn't opted in keeps today's exact
  behaviour. A governance feature that breaks existing contributors on day one doesn't get adopted.
- **Plain-language refusals.** "Changing the shared design system is a designer action — I'll write
  this up as a suggestion instead," never a path glob or an exit code.
- **Same honest limit as the skill-gate: this matches paths, not content.** It governs *where*
  someone can write, not *what* they can express. Say so in `governance.md` rather than letting the
  role names imply more than they deliver.

## 2. A sanctioned divergent mode

> *"Does this work for exploratory and discovery work? For a well-established system I imagine it
> reinforces the rules — but what about expanding it and creating new patterns?"*

**Current state.** The harness is **entirely convergent by design**. Every path — `/build`,
`/restyle`, `/small-edit`, the lint rules, the skill gate — funnels toward the existing token
vocabulary. That is exactly what makes it safe for non-technical contributors, and exactly what
makes it useless for discovery. There is no sanctioned way to go off-system, so the only options
today are "stay on-token" or "work outside the repo entirely."

**Shape of the fix — one road that goes the other way, with a fence around it:**

- **`/explore`** generates N variants of a section as sibling prototypes (`explore-<slug>-a|b|c`)
  through the existing `gen:prototype` generator.
- Variants **may reach past the current token set** — but every off-system value must be recorded
  as a token request appended to a new `docs/token-requests.md`. `governance.md` already defines a
  Request → Review → Deprecation lifecycle with **no artifact behind it**; this gives it one, so
  exploration *feeds* governance instead of bypassing it.
- **A fourth trust tier, `exploration`**: never auto-merges, never leaves the sandbox, `meta.ts`
  carries `status: "exploration"`, the sandbox index badges it. `/promote` is the only way back
  on-system.
- Gated to `designer`+ via §1 — which is what makes the role distinction load-bearing rather than
  decorative.

**Open question:** expiry. Exploration branches that never get promoted or deleted become the drift
the system exists to prevent. Either a visible age badge or a periodic sweep in `/audit`.

## 3. `/audit` — the drift scan as a command

**Current state.** `governance.md` describes a quarterly audit (drift scan, token-usage report,
guardrail health, enablement). It is a **checklist a human is expected to run by hand**. Nothing
automates it, and nothing reports drift over time.

**Shape:** a command wrapping `bun run react-doctor`, the three `madison/no-raw-*` ESLint rules,
and a token-usage report (which tokens are used where, which are unused, which files carry the most
off-system pressure). Use `context: fork` so a large read-heavy scan returns a summary without
flooding the main conversation.

This is also the clearest candidate to become a recurring deliverable rather than a one-off.

## 4. `/adopt` — the 0→1 path

> *"How would this work for less mature products without a design system?"*

**Current state.** The overlay (`overlay/install.sh`) installs *guardrails* — gates, skills, lint
rules, `.mcp.json` — into an existing repo. It assumes tokens already exist. A team with no design
system gets the enforcement machinery and nothing to enforce.

**Shape:** scan a target repo's CSS and Tailwind config for de-facto colors, sizes and spacing;
cluster them; propose a starter `tokens.tsx` with the recurring values named semantically; report
what didn't cluster (the real drift). Then install the overlay on top. The output is a draft PR and
a conversation, not an automatic rewrite.

## 5. A no-AI path for trivial edits

**The underlying point:** some changes are genuinely 2–3 clicks or one line of code, and routing
them through a language model is worse than a dropdown — slower, costlier, and lossy, because a
person adjusting a value *while looking at it* is making a judgement that doesn't survive being
turned into a sentence.

`/small-edit` narrows that gap; it doesn't close it. The closing move is a **token panel**: a
sandbox route rendering `style-guide.tsx` with editable controls that write a local override —
spacing, line-height, radius, brand color picked from the sanctioned scales, with **zero AI
involvement**. The tokens are already a structured dictionary, so the panel is a view over data
that exists.

**Roadmap only** — not scheduled. Noted here so the harness isn't mistaken for the only possible
interface to the system.

## 6. Give the agent eyes

**Current state.** The agent edits pages it cannot see. It verifies with `bun run check`, which
proves the code compiles and stays on-token — and says nothing about whether the result looks
right. Every visual judgement currently round-trips through a human describing the problem in
words.

**Shape:** a `/preview` command that drives the running sandbox through the browser MCP, screenshots
the page, and reads it back — then the same step, optionally, at the end of `/build` and
`/small-edit`. Constraint: `AGENTS.md` forbids starting long-running dev servers, so the command
must **detect** that the sandbox isn't running and ask, never start it.

## 7. Overlay parity for the commands layer

**Current state.** `overlay/install.sh` deliberately ships the hooks, `skill-requirements.json`, a
gate-only `settings.json`, the four skills, the ESLint rules and `.mcp.json` — but **no commands and
no prompt router**, because both hard-code kit paths (`apps/sandbox`, `gen:prototype`). So a client
repo gets the guardrails without the contributor experience, which is the half people actually
touch.

**Shape:** a `.claude/kit.json` (`sandboxDir`, `uiPackage`, generator names) that the commands and
router read from, so the whole workflow layer becomes installable. This is the productization
unlock — the thing that turns the harness from *this repo's* setup into a product.

---

## Ordering

§1 is the keystone: §2 depends on it, and it's the item most likely to be described as already
working. §6 and §3 are small and independently valuable. §7 is the one that matters commercially.
§5 is a deliberate acknowledgement that not every problem should be solved by prompting.
