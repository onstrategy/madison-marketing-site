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

## Brand Overrides

The default brand tokens are neutral (near-black / near-white). Override them per-app to set your brand color — this is the ~3-line re-skin:

```css
:root {
  --brand-primary: 212 92% 45%;   /* Your brand color as HSL channels */
  --brand-foreground: 0 0% 100%;  /* Contrasting text on brand surfaces */
  --brand-subtle: 212 92% 95%;    /* Light version for ghost buttons */
}

.dark {
  --brand-primary: 212 92% 60%;
  --brand-foreground: 0 0% 100%;
  --brand-subtle: 212 45% 22%;
}
```

> Brand tokens are stored as raw HSL channels (no `hsl(...)` wrapper) so opacity modifiers work. Semantic tokens (success/error/warning/info) are constant across apps — never re-brand them.

## Dark mode

Dark mode is driven by a `.dark` class on `<html>`. Use the `ThemeProvider` from `@northwind/ui/theme`, or add `@custom-variant dark (&:is(.dark *));` if you need the `dark:` variant in app CSS.

## Reference

See `apps/sandbox/src/index.css` for the complete working example.
