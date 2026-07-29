---
description: Undo the last change — put it back the way it was.
argument-hint: optional, e.g. "just the heading change"
model: sonnet
effort: low
allowed-tools: Read, Bash(git status *), Bash(git diff *), Bash(git checkout -- *), Bash(git stash *)
disable-model-invocation: true
---

A contributor wants the last change reverted. What they want back: **$ARGUMENTS**

Do all the technical work yourself. Hold the non-technical-contributor contract in `AGENTS.md`.

`AGENTS.md` says never to run git commands unless the contributor explicitly asks. **Invoking
this command is that explicit ask** — but it covers reverting uncommitted work and nothing more.

1. **Look before you touch anything.** `git status` and `git diff` to see what's actually
   changed. Only **uncommitted, working-tree** changes are in scope for this command.
2. **If it's already committed or pushed, stop.** Say so in plain words — "that change is
   already saved into the project history, so undoing it is an engineer's call" — and offer to
   prepare the revert as a suggestion instead. **Never** `git reset --hard`, never rewrite
   history, never force-push.
3. **Describe what will be undone, in plain words, and wait for a yes.** Not a file list — "the
   bigger line spacing on the pricing page headline, and nothing else." If `$ARGUMENTS` names
   only part of the change, revert only the files that part touched and say what you're leaving
   alone. If nothing has changed, just say so; there's nothing to undo.
4. **Revert only what you named.** `git checkout --` the specific files. Never a bare
   `git checkout .` that sweeps in work they didn't ask you to throw away.
5. **Check.** Run `bun run check` so they're not left with a broken page.
6. **Report in one line** — what's back to how it was, and where to look. If they want it a
   different way rather than gone, point them at `/small-edit` or `/restyle`.

Undoing uncommitted work never leaves the sandbox, so nothing here needs review. The one thing
this command will not do is unwind work that's already been submitted.
