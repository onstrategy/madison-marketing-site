---
name: design-system
description: REQUIRED before editing any file under packages/ui/ or any .module.css — a PreToolUse skill-gate blocks the Edit/Write tool on those paths until this skill is loaded. Also load it proactively before setting any className or choosing colors/spacing/borders/Tailwind classes (that content-level usage is advisory + CI-enforced, not gated). Covers the Madison token dictionary (warm neutral backgrounds/borders/typography, Terracotta brand, Neon-Blue info, restricted Deep Dust depth, semantic triads), the Lora + Inter type scale, the dimensional system (spacing, radii, elevation, motion, z-index, interaction), the Tailwind utility vocabulary, Madison's color-usage governance (approved pairings, the Deep Dust restriction), and migrating legacy shadcn-style variables.
---

# Madison Design System

All styling in this repo is driven by `packages/ui` — a centralized token system that generates CSS
variables and Tailwind utility classes from a single source of truth (`packages/ui/src/ui/tokens.tsx`).
This repo *is* the Madison design system: the tokens are Madison's brand (Terracotta), warm neutrals,
Lora + Inter type, and the disciplined 5-color palette. This file contains the rules and vocabulary.
Consult references when needed:

- **Migrating shadcn-style inline CSS** (legacy `--background`, `--card`, `--primary`, `--destructive-*` variables) to the kit tokens: read `references/migration.md`
- **Wiring a new app** in the monorepo to use the design system: read `references/setup.md`

## Core Philosophy

1. **Neutral-first, and warm.** 90%+ of the UI uses Madison's warm neutral backgrounds (Warm White),
   borders (taupe), and typography (warm near-black) tokens. Color is a signal, not decoration.
2. **Disciplined palette.** Five colors in fixed roles. **Terracotta is the *single* hero accent**;
   **Deep Dust is depth-only and restricted**; Neon Blue is a reserved digital signal. See
   "Madison Color — Usage Governance" below — usage matters as much as the values.
3. **Semantic triads.** Each status color (success, error, warning, info) has exactly three levels:
   base, subtle, and fg. No numbered scales. (Madison's `info` is Neon Blue.)
4. **Opacity for fine-tuning.** Tokens are stored as raw HSL channels. See "Opacity Modifiers" below —
   static CSS utilities do NOT support `/40` shorthand.
5. **No hardcoded colors.** Never use raw Tailwind colors (`bg-gray-800`, `text-blue-500`) or hex/rgb
   values in components.

## Token Dictionary

These are the utility classes available via `packages/ui/dist/theme.css`. Dark mode is automatic (the
same class works in both themes) — Madison's dark mode is the Dark Navy family.

### Backgrounds

| Class | Purpose |
|-------|---------|
| `bg-app` | Absolute bottom layer (page canvas) — Warm White (Dark Navy in dark mode) |
| `bg-panel` | Structural sidebars and headers |
| `bg-surface` | Nested cards, popovers, inputs — lifts off the warm canvas |
| `bg-hover` | Subtle background for interactive elements on hover |
| `bg-depth` | **RESTRICTED** — Deep Dust depth fill (hover/focus). See governance below. Never a primary surface. |

Elevation nesting: `bg-app` → `bg-panel` → `bg-surface` → `bg-hover`. Each layer is visually distinct
in both light and dark mode. `bg-depth` is **not** an elevation layer — it's a restricted accent.

### Borders

| Class | Purpose |
|-------|---------|
| `border-default` | Standard structural dividers (warm taupe) |
| `border-active` | Hovered inputs or active states |
| `border-depth` | **RESTRICTED** — Deep Dust rule lines / thin dividers only; use at low opacity. See governance. |

### Typography

| Class | Purpose |
|-------|---------|
| `text-primary` | Headings and main body text (Madison warm near-black `#2C2925`) |
| `text-secondary` | Metadata, descriptions, labels |
| `text-muted` | Disabled states, hints, placeholders |

### Brand — Terracotta

Madison's brand color is **Terracotta**, the single hero accent (~15% of any layout). It is the token
default — you do **not** override `--brand-*` per app.

| Class | Purpose |
|-------|---------|
| `bg-brand` / `text-brand` | Primary CTAs and the one hero accent per view (Terracotta) |
| `text-brand-fg` / `bg-brand-fg` | Text/bg on Terracotta surfaces (warm white, in both themes) |
| `bg-brand-subtle` / `text-brand-subtle` | Ghost buttons only (pale terracotta). **Not for row/item selection** — use `bg-row-selected`. In dark mode `bg-brand-subtle` collides with `bg-hover`. |

Note: the shorthand is `bg-brand`, not `bg-brand-primary`. Terracotta is a *saturated mid-tone*, so
its foreground stays warm-white in **both** themes (it does not invert like a neutral brand would).

### Row / Item Selection

Use these for selected rows in lists, grids, trees, sidebars. Mathematically derived as N% foundation
(Dark Navy) blended over the parent surface, so the contrast delta is identical in both themes.

| Class | Purpose |
|-------|---------|
| `bg-row-selected` | Selected row over `bg-surface` (5% blend) |
| `bg-row-selected-stripe` | Selected row over `bg-stripe` (5% blend) |
| `hover:bg-row-selected-hover` | Selected + hovered (10% blend) |
| `bg-row-active` | Focused/active row (10% blend) — use when "active" is distinct from "selected" |

Pair with `text-primary`. Do NOT use `text-brand` for selected rows — the bg signals selection, the
text stays neutral.

### Semantic Colors (Status Only)

Each semantic has a **triad** — three levels that cover all use cases. Madison's `info` is Neon Blue
(`#00B4FF`, the "digital signal") — status only, **not** a brand accent (that's Terracotta).

| Base | Subtle | Foreground | Use |
|------|--------|------------|-----|
| `bg-success` / `text-success` / `border-success` | `bg-success-subtle` | `text-success-fg` | Positive outcomes |
| `bg-error` / `text-error` / `border-error` | `bg-error-subtle` | `text-error-fg` | Failures, destructive actions |
| `bg-warning` / `text-warning` / `border-warning` | `bg-warning-subtle` | `text-warning-fg` | Caution states |
| `bg-info` / `text-info` / `border-info` | `bg-info-subtle` | `text-info-fg` | Informational highlights (Neon Blue) |

**Pattern:** a status badge uses `bg-success-subtle` + `text-success` for the label. A destructive
button uses `bg-error` + `text-error-fg`. Need 10% opacity? Use `bg-success/10` — the HSL channel
format supports this natively.

All classes also have `hover:` variants (e.g. `hover:bg-brand`, `hover:text-success`) and semantic
borders have `group-hover:` variants.

### Global

| Token | Value | Purpose |
|-------|-------|---------|
| `--radius` | `0.375rem` | Base radius the `rounded-*` scale derives from |

## Madison Color — Usage Governance

Madison's palette is disciplined: five colors in fixed roles. Getting the *usage* right matters as much
as the values — these rules come straight from Madison's design system and are what keep a layout
on-brand.

**The five roles (and their share of any composition):**

| Color | Tokens | Role | Budget |
|-------|--------|------|--------|
| Warm White `#EAE5DF` | `bg-app` + surfaces | Primary surface | ~40% |
| Dark Navy `#202E3B` | dark-mode surfaces / foundation | Foundation | ~35% |
| Terracotta `#C75A3B` | `bg-brand` / `text-brand` | **Single** hero accent | ~15% |
| Deep Dust `#8A3A28` | `bg-depth` / `border-depth` | Depth (restricted) | ~5%, **max 10%** |
| Neon Blue `#00B4FF` | `bg-info` / `text-info` | Digital signal (reserved) | ~5% |

**Approved background + text pairings — the only legal ones:**

- **Primary Dark** — Dark Navy background + Warm White text (foundation pairing, max contrast).
- **Primary Light** — Warm White background + Dark Navy / near-black text.
- **Digital Dark** — Dark Navy background + Neon Blue accent (digital-first energy).

**Prohibited pairings:** Deep Dust as a background surface · Terracotta + Neon Blue together (they
fight visually) · Neon Blue as body text on white (low contrast) · Neon Blue as a background (it's an
accent, never a surface).

**Terracotta is the sole hero accent** — one accent per view, used sparingly (`bg-brand` CTAs, a key
emphasis). Don't spread it across a layout; that's what dilutes the system.

**Deep Dust is depth, not presence** (`bg-depth` / `border-depth`):

- ✅ Hover/focus states · thin dividers and rule lines · depth shadows · secondary micro-labels —
  always on light (Warm White / White) backgrounds; **≤10% of the surface**.
- ❌ Page/section backgrounds · primary CTAs or buttons · headlines or body copy · the logo —
  and **never paired with Terracotta or Neon Blue** (Deep Dust and Terracotta are sibling warm rusts;
  side by side they flatten the palette).
- When in doubt, reach for **Terracotta**. Deep Dust is a last resort.

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

### Type Scale — Lora + Inter

Madison pairs **two families**. Family is applied with a class (`font-serif` / `font-sans`); the size
tokens carry the size, line-height, and (for headings) the baked-in **−1% tracking**.

- **Lora** (`font-serif`) — display + large headings, weight **500** (`font-medium`):
  `text-display` HERO (72px) · `text-5xl` h1 (64px) · `text-4xl` h2 (48px) · `text-3xl` h3 (32px) ·
  `text-2xl` h4 (24px). Their `-0.01em` tracking is already in the token.
- **Inter** (`font-sans`, the body default) — everything else:
  `text-xl` h5 (20px) & `text-lg` h6 (18px) at weight **600** (`font-semibold`); subtitles at **500**;
  `text-base` body (16px) & `text-sm` (14px) & `text-xs` caption (12px) at **400**.

So: a hero is `text-display font-serif`; an h2 is `text-4xl font-serif font-medium`; an h5 is
`text-xl font-semibold`; body copy is just `text-base` (Inter, inherited from `body`). The `<h1>`–`<h4>`
HTML tags already default to `font-serif` in the app base layer — for a non-heading element styled *as*
a large heading, add `font-serif` explicitly.

Families: `font-sans` (Inter, default body) · `font-serif` (Lora, display/headings) · `font-mono`.
Weights: `font-normal / medium / semibold / bold`. Tracking: `tracking-tight` … `tracking-widest`.

**Line height — the type scale carries the default; `leading-*` is the override.** Every step
above already pairs a size with a line-height, and that pairing is the right answer most of the
time. When copy genuinely needs to breathe (or tighten) *at the same size*, use the override
scale: `leading-tight` (1.15, large display headings set as one block) · `leading-snug` (1.3,
smaller headings and two-line labels) · `leading-normal` (1.5, body) · `leading-relaxed` (1.75,
long-form paragraphs) · `leading-loose` (2, maximum air). Those five declare every name in
Tailwind's `--leading-*` namespace, so each step's *value* is Madison's rather than inherited —
three of them (tight, snug, relaxed) deliberately differ from Tailwind's defaults.

Plus one utility outside that namespace: **`leading-none`** (exactly 1) for text that must sit
flush on a single line — button labels, card titles, alert titles. It's a Tailwind *static*
utility, so no token governs it, but it also never reads the theme and therefore can't drift.
It is on-system; reach for it deliberately, not as a way to dodge the scale.

Never `leading-[1.4]` or `leading-[28px]`, and never the numeric form `leading-7` — all
**lint-blocked** (`no-raw-dimensions`). `leading-7` looks like the on-token numeric spacing scale
but resolves to a *fixed* `1.75rem`, pinning line-height against the font-size instead of scaling
with it. Line-height stays a unitless ratio. Changing the *default* line-height of a heading is a
different act: that edits the step's `lineHeight` in `tokens.tsx` and lands as a draft PR.

Don't use arbitrary sizes (`text-[40px]`, `text-[10px]`) — **lint-blocked** (`no-raw-dimensions`);
reach for a step (`text-2xs` through `text-display`). The micro step `text-2xs` (10px) sits just below
`text-xs` — overlines, swatch captions, dense mono labels.

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

Since CSS variables store raw HSL channels (e.g. `--border-default: 38 18% 83%`), use the arbitrary
value syntax to inject alpha. This is also how you use **Deep Dust as a divider** (it should be subtle):

```
border-[hsl(var(--border-default)/0.5)]
divide-[hsl(var(--border-default)/0.3)]
border-[hsl(var(--border-depth)/0.15)]   /* Deep Dust rule line, low opacity */
```

This is the **only reliable way** to apply opacity to border/divide tokens.

## Border Contrast — CRITICAL

The border tokens are intentionally subtle (warm taupe). Always consider the actual contrast before
choosing a border token.

### Contrast reference (against `bg-surface`)

| Token | Light | Dark | Guideline |
|-------|-------|------|-----------|
| `border-default` | `#DBD5CB` | `#33414D` | **Very subtle.** Fine for row dividers. Can be invisible on small elements (circles/checkboxes), especially in dark mode. |
| `border-active` | `#B9B0A1` | `#4B5A67` | **Visible.** Use for small interactive elements (circles, rings, input focus). |

### Dark mode collision

`border-default` dark (`#33414D`) and `bg-hover` dark (`#33424F`) are **nearly identical**. A
`border-default` element on a hovered surface has almost zero contrast — use `border-active` or lean on
elevation shadow instead.

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
- Using semantic colors for branding (e.g. `bg-info`/Neon Blue for a primary CTA — use `bg-brand`/Terracotta)
- **Spreading Terracotta around** — it's the *single* hero accent (~15%). One accent per view, used sparingly.
- **Misusing Deep Dust** (`bg-depth`/`border-depth`): as a background surface, a CTA, headline/body text, or paired with Terracotta or Neon Blue. It is depth-only, ≤10%, on light backgrounds. See the governance section.
- **An unapproved bg/text pairing** — only Primary Dark, Primary Light, and Digital Dark are legal (see governance). Never Neon Blue as body text on white or as a background.
- Using `bg-brand-subtle` for selected rows/items — collides with `bg-hover` in dark mode. Use `bg-row-selected` + `hover:bg-row-selected-hover`
- Using `border-default/40` or `divide-default/40` — static utilities don't support opacity modifiers. Use `border-[hsl(var(--border-default)/0.4)]`
- Using `border-default` for small interactive elements (circles, checkboxes, toggle rings) — invisible in dark mode. Use `border-active`
- Assuming border visibility without checking both light AND dark mode contrast
- Hand-rolling shadows (`shadow-[0_1px_2px_...]`) instead of `shadow-xs…xl` (which are theme-aware)
- Magic z-index (`z-50`) for overlays/modals/toasts — use the named `z-*` layer scale
- Hardcoding focus-ring width (`ring-[3px]`, `ring-1`, `ring-2`) — use `ring-[length:var(--ring-width)]`
- Raw length literals for spacing/layout — `p-[17px]`, `gap-[13px]`, `mt-[20px]` — **lint-blocked** (`no-raw-dimensions`). Use the numeric scale (`p-4`, `py-24`) or a named step (`p-card`, `px-gutter`, `gap-section`). The numeric scale is on-token; only arbitrary literals are banned.
- Arbitrary font sizes — `text-[40px]`, `text-[10px]` — **lint-blocked** (`no-raw-dimensions`). Use the type scale (`text-2xs` through `text-5xl`, `text-display`).
- Arbitrary line heights — `leading-[1.4]`, `leading-[28px]` — and the numeric form `leading-7` (a fixed rem, not a ratio) — **lint-blocked** (`no-raw-dimensions`). Use `leading-tight` … `leading-loose`, `leading-none` for flush single-line text, or leave the type step's default alone.
- **Large headings in the wrong family** — HERO/h1–h4 are Lora (`font-serif`); a big heading left in `font-sans` (Inter) is off-brand. h5/h6 and body stay Inter.
