# Promote Path: sandbox prototype → `packages/ui` primitive

This is what makes *"non-technical people ship real components into the real repo"* true.
A prototype validates an idea fast (in `apps/sandbox`); **promotion** turns a validated
piece into a reusable, governed primitive in `packages/ui` — made safe by the skill-gate
and `bun run check`.

> **Trust level:** any change under `packages/ui/` is a **draft PR** for engineer review
> (see the matrix at the bottom). Promotion always lands as a draft PR, never auto-merge.

## Before you start — the gate

Editing anything under `packages/ui/` trips the **design-system skill-gate** (PreToolUse).
Load the relevant skills first (once per session):

```
Skill: design-system   # REQUIRED — the gate blocks packages/ui edits until this is loaded
Skill: react           # component architecture (dumb-component rules)
Skill: typescript      # the any/unknown ban, prop typing
```

Why all three: a primitive is a React component (`react`) written in strict TypeScript
(`typescript`) using only design tokens (`design-system`).

## Checklist

> **Shortcut:** `bun run gen:promote -- --args <slug> "<description>"` scaffolds steps 2, 4, and 5
> (the primitive file, the `exports` + barrel entries, and the story stub) — see [`gen:promote`](#genpromote)
> below. You still do step 3 (the real port) and steps 6–8 by hand.

1. **Pick a validated prototype component.** It should be doing real work in a sandbox
   prototype and be genuinely reusable (passes the "Open Source Test" — copy-pasteable into
   any app, no domain/business coupling). If it's app-specific, it stays a dumb app
   component, not a `packages/ui` primitive.

2. **Create the primitive** at `packages/ui/src/primitives/<name>.tsx` and apply primitive
   rigor (see the `react` skill, dumb-components reference):
   - A plain **function component** taking `React.ComponentProps<...>` — `ref` flows through `{...props}` (React 19; no `forwardRef`/`displayName` needed).
   - Merge incoming `className` last via `cn(...)` so consumers can extend.
   - Model variants with `cva` (like `button`/`badge`/`alert`), not boolean props.
   - Props are primitives/UI shapes — **never** a domain type.
   - No `any`, no non-null assertions (narrow instead).

3. **Rewrite off-system classes** via [`.agents/skills/design-system/references/migration.md`](../.agents/skills/design-system/references/migration.md)
   and strip prototype cruft (inline styles, hardcoded hex, one-off layout):

   | Prototype-grade (cruft) | Promoted (on-token) |
   |---|---|
   | `bg-card`, `bg-background` | `bg-surface`, `bg-app` |
   | `text-muted-foreground` | `text-muted` |
   | `border-border` | `border-default` |
   | `text-green-600`, `bg-red-100` | `text-success`, `bg-error-subtle` |
   | `style={{ color: "#10B981" }}` | `text-success` |
   | `text-success-700 dark:text-success-400` | `text-success` (dark mode is automatic) |

4. **Export it.** Add a subpath to `packages/ui/package.json` `exports`
   (`"./<name>": "./src/primitives/<name>.tsx"`) and an explicit named re-export to
   `packages/ui/src/primitives/index.ts` (no `export *` — see the `typescript` skill).

5. **Add a story** at `packages/ui/src/stories/<Name>.stories.tsx` with `tags: ["autodocs"]`
   and a `parameters.docs.description.component` that lists the **token bindings**. This is
   what makes the component discoverable in the **Storybook MCP manifest** — so an agent can
   answer *"which tokens does `<Name>` use?"*.

6. **Close the loop.** Point the prototype (and any other consumer) at the new primitive:
   `import { <Name> } from "@madison/ui/<name>";` and delete the inline copy.

7. **Run the real gate.** Regenerate tokens if you added any, then run the full check:
   ```bash
   bun --filter @madison/ui build   # only needed if you changed tokens.tsx
   bun run check                      # typecheck + test + lint — must be green
   ```

8. **Open a draft PR.** An engineer reviews; once merged, the new primitive appears in the
   MCP manifest and is available to every app via `@madison/ui/<name>`.

## Worked example: `Alert`

A contributor prototyped a status callout inline in a sandbox prototype (prototype-grade:
a local function, hardcoded variants, and a stray `text-muted-foreground` copied from shadcn).
Promotion produced [`packages/ui/src/primitives/alert.tsx`](../packages/ui/src/primitives/alert.tsx):

- `cva` variants `default | info | success | warning | error`, each mapping to a semantic
  triad (`bg-<status>-subtle` + `border-<status>/30` + colored icon), text kept neutral.
- A plain function component (no `forwardRef` — see step 2), `cn` merge, and the
  `Alert` / `AlertTitle` / `AlertDescription` sub-components.
- The stray `text-muted-foreground` → `text-muted` (step 3).
- Exported via `@madison/ui/alert`, storied in `Alert.stories.tsx`, and consumed back in
  the `alerts` sandbox prototype.

`bun run check` green → ready for a draft PR.

## Trust levels (governance-as-code)

| Change | Trust level |
|---|---|
| Sandbox prototype content / copy | **auto-merge** |
| Any `packages/ui/` or token change (incl. promotions) | **draft PR** — engineer reviews |
| Token deprecations, `scripts/generate-theme.ts`, editing the gates/hooks themselves | **suggest-only** — maintainer applies |

## `gen:promote`

`bun run gen:promote` scaffolds steps 2, 4, and 5 automatically:

```bash
bun run gen:promote -- --args <slug> "<one-line description>"
# e.g. bun run gen:promote -- --args stat-card "A compact metric display"
```

It creates an on-token function-component starter at `packages/ui/src/primitives/<slug>.tsx`, a
`<Name>.stories.tsx` autodocs stub, inserts the `./<slug>` entry into `packages/ui/package.json`
`exports`, and adds the named re-export to `src/primitives/index.ts`. The generated shell passes
`bun run check` immediately — you then do step 3 (port the real JSX/props and rewrite off-system
classes) and steps 6–8 (point the prototype at it, check, PR).
