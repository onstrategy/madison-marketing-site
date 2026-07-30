# Design System Setup: New App Integration

Use `apps/sandbox/src/index.css` as the canonical template — it's the cleanest integration in the monorepo. (The Storybook surface uses the same header in `packages/ui/src/stories/stories.css`.)

## Prerequisites

- Tailwind v4 with the `@tailwindcss/vite` plugin (standard in this monorepo)
- No `tailwind.config.ts` needed — Tailwind v4 uses CSS-first configuration

## The canonical 4-line header

Your app's `index.css` needs four lines to wire up the design system:

```css
@import "tailwindcss";
@source "../../../packages/ui/src";
@import "../../../packages/ui/dist/theme.css" layer(design-system);
@import "../../../packages/ui/dist/tailwind-tokens.css";
```

- `@import "tailwindcss"` — loads Tailwind v4
- `@source "../../../packages/ui/src"` — tells Tailwind to scan `packages/ui` for utility classes used by the primitives
- `@import ".../dist/theme.css" layer(design-system)` — CSS variables + plain utility classes, in a named cascade layer so app utilities can override cleanly
- `@import ".../dist/tailwind-tokens.css"` — the `@theme inline` block that registers tokens as Tailwind colors (enables opacity modifiers like `bg-surface/50`)

Then set the base body styles and a default border color:

```css
@layer base {
  * {
    border-color: hsl(var(--border-default));
  }
}

body {
  background-color: hsl(var(--bg-app));
  color: hsl(var(--text-primary));
}
```

## Brand tokens

The brand is **Madison — Neon Blue**, set as the token default in
`packages/ui/src/ui/tokens.tsx` (`--brand-primary`/`--brand-foreground`/`--brand-subtle`). A normal
app does **not** override it — it inherits Madison's brand automatically through the 4-line header.

Only override `--brand-*` if a specific sub-app genuinely needs a *different* accent (rare). If you do,
mirror the token shape and keep raw HSL channels so opacity modifiers work:

```css
:root {
  --brand-primary: 205 81% 42%;   /* Neon Blue — the Madison default (HSL channels) */
  --brand-foreground: 0 0% 100%;  /* White text on Neon Blue — 4.64:1 contrast */
  --brand-subtle: 204 89% 93%;    /* Pale blue for ghost buttons */
}
```

> Brand tokens are stored as raw HSL channels (no `hsl(...)` wrapper) so opacity modifiers work.
> Semantic tokens (success/error/warning/info) are status signals — never re-brand them. Neon Blue is
> the *single* hero accent; Terracotta is the reserved `info` signal. See the `design-system` skill's
> color-usage governance.

## Dark mode

Dark mode is driven by a `.dark` class on `<html>`. Use the `ThemeProvider` from `@madison/ui/theme`, or add `@custom-variant dark (&:is(.dark *));` if you need the `dark:` variant in app CSS.

## Reference

See `apps/sandbox/src/index.css` for the complete working example.
