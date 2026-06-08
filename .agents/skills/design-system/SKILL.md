---
name: design-system
description: REQUIRED before editing any file under packages/ui/ or any .module.css — a PreToolUse skill-gate blocks the Edit/Write tool on those paths until this skill is loaded. Also load it proactively before setting any className or choosing colors/spacing/borders/Tailwind classes (that content-level usage is advisory + CI-enforced, not gated). Covers the packages/ui token dictionary (backgrounds, borders, typography, brand, semantic colors), the dimensional system (spacing, type scale, radii, elevation, motion, z-index, interaction), the Tailwind utility vocabulary, and migrating legacy shadcn-style variables.
---

# Northwind Design System

All styling in this kit is driven by `packages/ui` — a centralized token system that generates CSS variables and Tailwind utility classes from a single source of truth. This file contains the rules and vocabulary. Consult references when needed:

- **Migrating shadcn-style inline CSS** (legacy `--background`, `--card`, `--primary`, `--destructive-*` variables) to the kit tokens — common when adopting the kit in an existing client repo: read `references/migration.md`
- **Wiring a new app** in the monorepo to use the design system: read `references/setup.md`

## Core Philosophy

1. **Neutral-first.** 90%+ of the UI uses neutral backgrounds, borders, and typography tokens. Color is a signal, not decoration.
2. **Semantic triads.** Each status color (success, error, warning, info) has exactly three levels: base, subtle, and fg. No numbered scales.
3. **Opacity for fine-tuning.** Tokens are stored as raw HSL channels. See "Opacity Modifiers" below — static CSS utilities do NOT support `/40` shorthand.
4. **No hardcoded colors.** Never use raw Tailwind colors (`bg-gray-800`, `text-blue-500`) or hex/rgb values in components.

## Token Dictionary

These are the utility classes available via `packages/ui/dist/theme.css`. Dark mode is automatic — the same class works in both themes.

### Backgrounds

| Class | Purpose |
|-------|---------|
| `bg-app` | Absolute bottom layer (page canvas) |
| `bg-panel` | Structural sidebars and headers |
| `bg-surface` | Nested cards, popovers, inputs |
| `bg-hover` | Subtle background for interactive elements on hover |

Elevation nesting: `bg-app` → `bg-panel` → `bg-surface` → `bg-hover`. Each layer is visually distinct in both light and dark mode.

### Borders

| Class | Purpose |
|-------|---------|
| `border-default` | Standard structural dividers |
| `border-active` | Hovered inputs or active states |

### Typography

| Class | Purpose |
|-------|---------|
| `text-primary` | Headings and main body text |
| `text-secondary` | Metadata, descriptions, labels |
| `text-muted` | Disabled states, hints, placeholders |

### Brand

| Class | Purpose |
|-------|---------|
| `bg-brand` / `text-brand` | Primary CTAs and accents (default: neutral, override per-app) |
| `text-brand-fg` / `bg-brand-fg` | Text/bg on brand-colored surfaces (contrasting color) |
| `bg-brand-subtle` / `text-brand-subtle` | Ghost buttons only. **Not for row/item selection** — use `bg-row-selected` (below). In dark mode `bg-brand-subtle` collides with `bg-hover`. |

Note: the shorthand is `bg-brand`, not `bg-brand-primary`. Each app overrides `--brand-primary`, `--brand-foreground`, `--brand-subtle` in its CSS to set its own brand color.

### Row / Item Selection

Use these for selected rows in lists, grids, trees, sidebars. Mathematically derived as N% brand blended over the parent surface, so the contrast delta is identical in both themes.

| Class | Purpose |
|-------|---------|
| `bg-row-selected` | Selected row over `bg-surface` (5% blend) |
| `bg-row-selected-stripe` | Selected row over `bg-stripe` (5% blend) |
| `hover:bg-row-selected-hover` | Selected + hovered (10% blend) |
| `bg-row-active` | Focused/active row (10% blend) — use when "active" is distinct from "selected" |

Pair with `text-primary`. Do NOT use `text-brand` for selected rows — the bg signals selection, the text stays neutral.

### Semantic Colors (Status Only)

Each semantic has a **triad** — three levels that cover all use cases:

| Base | Subtle | Foreground | Use |
|------|--------|------------|-----|
| `bg-success` / `text-success` / `border-success` | `bg-success-subtle` | `text-success-fg` | Positive outcomes |
| `bg-error` / `text-error` / `border-error` | `bg-error-subtle` | `text-error-fg` | Failures, destructive actions |
| `bg-warning` / `text-warning` / `border-warning` | `bg-warning-subtle` | `text-warning-fg` | Caution states |
| `bg-info` / `text-info` / `border-info` | `bg-info-subtle` | `text-info-fg` | Informational highlights |

**Pattern:** a status badge uses `bg-success-subtle` + `text-success` for the label. A destructive button uses `bg-error` + `text-error-fg`. Need 10% opacity? Use `bg-success/10` — the HSL channel format supports this natively.

All classes also have `hover:` variants (e.g. `hover:bg-brand`, `hover:text-success`) and semantic borders have `group-hover:` variants.

### Global

| Token | Value | Purpose |
|-------|-------|---------|
| `--radius` | `0.375rem` | Base radius the `rounded-*` scale derives from |

## Dimensional Tokens

Color is only half the system. Spacing, type, radii, elevation, motion, and layering are tokenized
too — all real Tailwind utilities **and** runtime CSS vars (`var(--spacing-section)` works for
one-offs). Reach for the named token; never hardcode the equivalent value.

### Spacing

Tailwind's numeric scale (`p-4`, `gap-2`) derives from the `--spacing` base. Named layout-intent
steps add governed rhythm:

| Utility | Token | Value | Use |
|---------|-------|-------|-----|
| `gap-inline` / `p-inline` | `--spacing-inline` | 0.5rem | Icon + label, chips |
| `gap-stack` / `space-y-stack` | `--spacing-stack` | 1rem | Stacked blocks |
| `p-card` | `--spacing-card` | 1.5rem | Card / panel padding |
| `px-gutter` | `--spacing-gutter` | 1.5rem | Page side padding |
| `py-section` / `gap-section` | `--spacing-section` | 4rem | Between page sections |

The numeric scale is **on-token** — each step is `--spacing` × N — so `p-4`, `py-24`, `gap-8` are
on-system, and equal a named step at the same value (`py-section` is `py-16` = 4rem; the named one
just states intent). What is **off-system** is a raw length literal (`p-[17px]`, `gap-[13px]`,
`mt-[20px]`), which is **lint-blocked** (`no-raw-dimensions`). Prefer a named step when one fits the
intent; otherwise the numeric scale is correct.

### Type Scale

`text-xs … text-5xl` are the standard steps (each pairs a size + line-height). `text-display`
(3.75rem, tight tracking) is for hero headings **only**. Families: `font-sans` (default body),
`font-mono`. Weights: `font-normal / medium / semibold / bold`. Tracking: `tracking-tight`
(headings) … `tracking-widest` (uppercase eyebrows). Don't use arbitrary sizes (`text-[40px]`, `text-[10px]`) — they are **lint-blocked** (`no-raw-dimensions`); reach for a step (`text-2xs` through `text-display`). The micro step `text-2xs` (10px) sits just below `text-xs` — overlines, swatch captions, dense mono labels.

### Radii

`rounded-sm / md / lg / xl / 2xl / full` — all derived from `--radius`. Inputs/badges `rounded-sm`,
buttons `rounded-md`, cards/popovers `rounded-lg`, modals `rounded-xl`, pills/avatars `rounded-full`.

### Elevation (theme-aware)

`shadow-xs / sm / md / lg / xl`. **Mode-aware** — heavier in dark mode automatically, so depth still
reads. Cards/buttons `shadow-sm`, dropdowns/hover-lift `shadow-md`, popovers `shadow-lg`, modals
`shadow-xl`. Never hand-roll `shadow-[0_1px_2px_...]`.

### Motion

Every `transition-*` utility uses the base duration (200ms) + standard easing by default. Easing
utilities: `ease-standard` (default), `ease-out` (entering), `ease-in` (exiting). For a specific
duration, use the var: `[transition-duration:var(--duration-slow)]` (`--duration-fast` 150ms /
`-base` 200ms / `-slow` 300ms). `prefers-reduced-motion` is respected globally.

### Layering (z-index)

Named static utilities so stacking is intentional, never a magic `z-50`:
`z-dropdown` (1000) · `z-sticky` (1100) · `z-overlay` (1200) · `z-modal` (1300) · `z-popover` (1400)
· `z-toast` (1500) · `z-tooltip` (1600).

### Interaction

- **Focus ring:** `focus-visible:ring-[length:var(--ring-width)] focus-visible:ring-brand` (2px,
  standardized). Don't hardcode `ring-[3px]` / `ring-1`.
- **Disabled:** `disabled:opacity-[var(--disabled-opacity)]` plus `disabled:cursor-not-allowed` or
  `disabled:pointer-events-none`.
- **Cursor:** interactive elements get `cursor: pointer` automatically (a base rule restores it —
  Tailwind v4 dropped the default on `<button>`). For `asChild` anchors/divs, add `cursor-pointer`.

## Source of Truth

- **Token definitions:** `packages/ui/src/ui/tokens.tsx` — hex values for light/dark, descriptions, categories.
- **Generated CSS variables + plain utilities:** `packages/ui/dist/theme.css` — generated from `tokens.tsx` by `scripts/generate-theme.ts`. Do not edit manually.
- **Generated Tailwind token registrations:** `packages/ui/dist/tailwind-tokens.css` — the `@theme inline` block that maps tokens into Tailwind colors. Also generated; do not edit.
- **Visual reference:** `packages/ui/src/ui/style-guide.tsx` — living spec showing all tokens in use. If a token is missing, propose extending the style guide and `tokens.tsx` rather than inventing ad-hoc values.

To change a token: edit `tokens.tsx`, run `bun run build` (regenerates both `dist/*` files), and verify in the style guide.

## Opacity Modifiers — CRITICAL

This system has **two layers** of CSS classes that look identical but behave differently:

1. **Static utilities** (`theme.css`): `.border-default { border-color: hsl(var(--border-default)); }` — plain classes, NO alpha support. The `hsl()` is baked in with no alpha slot.
2. **Tailwind `@theme inline`** (`tailwind-tokens.css`): registers colors like `--color-border-default: hsl(var(--border-default))` — Tailwind can generate opacity variants via `color-mix()`.

**The catch:** For border tokens, the Tailwind color name is `border-default`, so the Tailwind utility for border-color would be `border-border-default` (ugly double prefix). The clean `.border-default` class is the static utility — it does NOT support `/40` modifiers.

### What works and what doesn't

| Syntax | Works? | Why |
|--------|--------|-----|
| `bg-surface/50` | Yes | `surface` is a `@theme` color; Tailwind generates `color-mix()` |
| `text-muted/60` | Yes | `muted` is a `@theme` color |
| `border-default/40` | **NO** | `.border-default` is a static class; `/40` is silently ignored |
| `divide-default/40` | **NO** | No `@theme` color named `default` exists |
| `border-[hsl(var(--border-default)/0.4)]` | **YES** | Arbitrary value with raw HSL channels + alpha |
| `divide-[hsl(var(--border-default)/0.4)]` | **YES** | Same pattern for divide |

### Correct pattern for reduced-opacity borders

Since CSS variables store raw HSL channels (e.g. `--border-default: 240 6% 90%`), use the arbitrary value syntax to inject alpha:

```
border-[hsl(var(--border-default)/0.5)]
divide-[hsl(var(--border-default)/0.3)]
```

This is the **only reliable way** to apply opacity to border/divide tokens.

## Border Contrast — CRITICAL

The border tokens have known low-contrast characteristics. Always consider the actual contrast before choosing a border token.

### Contrast reference (against `bg-surface`)

| Token | Light mode | Dark mode | Guideline |
|-------|-----------|-----------|-----------|
| `border-default` | ~1.25:1 | ~1.17:1 | **Very subtle.** Fine for row dividers. Invisible for small elements like circles/checkboxes in dark mode. |
| `border-active` | ~2.4:1 | ~1.44:1 | **Visible.** Use for small interactive elements (circles, rings, input focus). |

### Dark mode collision

`border-default` dark (`#27272A`) and `bg-hover` dark (`#27272A`) are **the same value**. A `border-default` element on a hovered surface has zero contrast.

### Rules

- **Row/list dividers:** `border-default` is fine — dividers should be subtle. For even subtler: `divide-[hsl(var(--border-default)/0.5)]`
- **Small interactive elements** (completion circles, checkbox rings, toggle outlines): always use `border-active` — `border-default` is invisible on these in dark mode
- **Card borders:** `border-default` works in light mode. In dark mode, cards may need `border-active` or rely on elevation shadow instead
- **Never assume a border is visible** — check the token's lightness delta against the parent background in BOTH themes before shipping

## Red Flags — STOP and Revise

> **Enforcement:** items below tagged **lint-blocked** hard-fail `bun run check` via the governance overlay — `no-raw-colors` (off-system colors) and `no-raw-dimensions` (arbitrary spacing/type lengths). The rest are advisory but caught in review.

- Using raw Tailwind colors (`bg-zinc-900`, `text-slate-500`) instead of token classes — **lint-blocked**
- Using hex/rgb/hsl values in `className` or inline styles for colors
- Using numbered color scales (`text-success-700`, `bg-neutral-200`) — use semantic triads + opacity modifiers instead
- Using shadcn-style variable names (`bg-card`, `text-foreground`, `bg-destructive`) — see `references/migration.md`
- Inventing a new color token without first checking `tokens.tsx` and the style guide
- Nesting elevation layers out of order (e.g. `bg-app` inside `bg-surface`)
- Using semantic colors for branding (e.g. `bg-info` for a primary CTA — use `bg-brand`)
- Using `bg-brand-subtle` for selected rows/items — collides with `bg-hover` in dark mode. Use `bg-row-selected` + `hover:bg-row-selected-hover`
- Using `border-default/40` or `divide-default/40` — static utilities don't support opacity modifiers. Use `border-[hsl(var(--border-default)/0.4)]`
- Using `border-default` for small interactive elements (circles, checkboxes, toggle rings) — invisible in dark mode. Use `border-active`
- Assuming border visibility without checking both light AND dark mode contrast
- Hand-rolling shadows (`shadow-[0_1px_2px_...]`) instead of `shadow-xs…xl` (which are theme-aware)
- Magic z-index (`z-50`) for overlays/modals/toasts — use the named `z-*` layer scale
- Hardcoding focus-ring width (`ring-[3px]`, `ring-1`, `ring-2`) — use `ring-[length:var(--ring-width)]`
- Raw length literals for spacing/layout — `p-[17px]`, `gap-[13px]`, `mt-[20px]` — **lint-blocked** (`no-raw-dimensions`). Use the numeric scale (`p-4`, `py-24`) or a named step (`p-card`, `px-gutter`, `gap-section`). The numeric scale is on-token; only arbitrary literals are banned.
- Arbitrary font sizes — `text-[40px]`, `text-[10px]` — **lint-blocked** (`no-raw-dimensions`). Use the type scale (`text-2xs` through `text-5xl`, `text-display`).
