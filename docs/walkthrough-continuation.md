# Walkthrough — Continuation Plan

> A guided, step-by-step tour of **how non-technical people use this kit to ship real UI** — and
> how to **resume it in a fresh Claude Code session**. Written for the demo / enablement motion
> (CTO + PM workshops). Doubles as a walkthrough script you can reuse with each new audience.

## How we run it (the working agreement)

- **Narrated, conceptual.** Claude explains each step with the exact commands + what happens; the
  user runs them. Live demos only when explicitly asked (e.g. the skill-gate demo in Step 4).
- **Lens: the non-technical contributor** (PM / designer / marketing). Governance is surfaced at
  the moments it actually fires.
- **Mental-model first**, then hands-on.
- **Plain-language prompts only.** Contributor prompts never contain tool names, file paths,
  slugs, or git — the agent does all the technical work. This contract lives in
  [`AGENTS.md`](../AGENTS.md) → "Working with non-technical contributors".
- **One step per turn**, ending with a copy-paste **Markdown notes block** for the user's Obsidian
  file (`VB AI/AI KIT.md`).

## Where we left off — ✅ done

| Step | Status |
|---|---|
| 0 — Mental model (token river, the 4 nouns, governance) | ✅ |
| 1 — Get on the system (Claude Code, design-system skill, Storybook + MCP) | ✅ |
| 2 — Build a prototype (`gen:prototype`, self-registration) | ✅ — also surfaced the `gen:prototype` non-interactive footgun → **Option A** applied (the `--args` guidance in `AGENTS.md`); **Option C** (harden the generator) attempted + reverted because turbo gen can't bypass conditional prompts |
| 3 — Change things (component · brand re-skin · token) | ✅ |
| 4 — Hit the gate on purpose (`SKILL GATE BLOCKED` → load skill → retry) | ✅ demoed live |
| 5 — Ship it (check → branch → commit → push → PR) | ✅ demoed live on **PR #1** (this PR) |

Also shipped in **PR #1**: the `AGENTS.md` non-technical-contributor contract + the `gen:prototype --args` guidance.

## What's next — ▶ to do

- **Step 6 — Promote.** Turn a validated, reused prototype piece into an official `packages/ui`
  primitive (`gen:promote` → port the real component → on-token → draft PR → it appears in the MCP
  manifest). Candidates already surfaced in the `settings` prototype: a **"Verified" badge** (Badge
  has no success/warning variant) and a missing **`Switch`** primitive (notification toggles
  currently reuse `Checkbox`). See [`promote.md`](./promote.md).
- **Step 7 — The overlay.** Install this governance layer into a client's *existing* repo
  (`overlay/install.sh <repo> "<components-path>"`), then adapt tokens / ESLint / Storybook / CI.
  The "inject into a real repo" piece. See [`../overlay/README.md`](../overlay/README.md).
- **Step 8 — Govern over time.** Trust levels in practice, quarterly drift audits, token lifecycle
  — the retainer's heartbeat. See [`governance.md`](./governance.md).

## How to resume in a new session

In a couple of days, from the repo root:

1. `git switch main && git pull` — get this merged plan + the `AGENTS.md` changes.
2. `claude` — start a fresh session. `AGENTS.md` and the project memory auto-load, so the approach
   is already known.
3. Paste the kickoff prompt below.

### Kickoff prompt (copy-paste)

```
We're resuming the guided walkthrough of how non-technical people use this kit. Read
docs/walkthrough-continuation.md for where we left off and how we work together. Continue from
Step 6 (Promote), keeping the same approach: narrated (you explain, I run the commands), the
non-technical-contributor lens, plain-language prompts (you do all the technical work), and end
each step with a clean Markdown notes block I can paste into Obsidian. Start with a 30-second
recap of Steps 0–5, then begin Step 6.
```

That's it — the new session picks up exactly here.
