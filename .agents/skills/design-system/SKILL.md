---
name: design-system
description: REQUIRED before editing any file under packages/ui/ or any .module.css — a PreToolUse skill-gate blocks the Edit/Write tool on those paths until this skill is loaded. Also load it proactively before setting any className or choosing colors/spacing/borders/Tailwind classes (that content-level usage is advisory + CI-enforced, not gated). Covers the Madison token dictionary (warm neutral backgrounds/borders/typography, Neon-Blue brand, Terracotta info, restricted Deep Dust depth, semantic triads), the Lora + Inter type scale, the dimensional system (spacing, radii, elevation, motion, z-index, interaction), the Tailwind utility vocabulary, Madison's color-usage governance (approved pairings, the Deep Dust restriction), and migrating legacy shadcn-style variables.
---

# Madison Design System

All styling in this repo is driven by `packages/ui` — a centralized token system that generates CSS
variables and Tailwind utility classes from a single source of truth (`packages/ui/src/ui/tokens.tsx`).
This repo *is* the Madison design system: the tokens are Madison's brand (Neon Blue), warm neutrals,
Lora + Inter type, and the disciplined 5-color palette. This file contains the rules and vocabulary.
Consult references when needed:

- **Migrating shadcn-style inline CSS** (legacy `--background`, `--card`, `--primary`, `--destructive-*` variables) to the kit tokens: read `references/migration.md`
- **Wiring a new app** in the monorepo to use the design system: read `references/setup.md`

## Core Philosophy

1. **Neutral-first, and warm.** 90%+ of the UI uses Madison's warm neutral backgrounds (Warm White),
   borders (taupe), and typography (warm near-black) tokens. Color is a signal, not decoration.
2. **Disciplined palette.** Five colors in fixed roles. **Neon Blue is the *single* hero accent**;
   **Deep Dust is depth-only and restricted**; Terracotta is the reserved status signal (`info`). See
   "Madison Color — Usage Governance" below — usage matters as much as the values.
3. **Semantic triads.** Each status color (success, error, warning, info) has exactly three levels:
   base, subtle, and fg. No numbered scales. (Madison's `info` is Terracotta.)
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
| `bg-plate` | **NARROW USE** — true `#FFF` in *both* themes. Only for hosting third-party artwork (client logos, partner marks) authored against white, which Warm White would tint. Never a general page/card surface. Pair with a `light` scope so the text on it resolves light too. |

Elevation nesting: `bg-app` → `bg-panel` → `bg-surface` → `bg-hover`. Each layer is visually distinct
in both light and dark mode. `bg-depth` is **not** an elevation layer — it's a restricted accent.

**Forcing a subtree's theme regardless of the page's actual mode:** add `className="dark"` or
`className="light"` to any element. Both mirror `:root`/`.dark` exactly, so every token used inside
that subtree (backgrounds, borders, typography, brand, semantics) resolves to that theme locally —
e.g. an always-dark footer on an otherwise-light page, or a guaranteed-white card inside an
always-dark section. Nest them to punch back out (a `light` card inside a `dark` section).

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

### Brand — Neon Blue

Madison's brand color is **Neon Blue**, the single hero accent (~15% of any layout). It is the token
default — you do **not** override `--brand-*` per app.

| Class | Purpose |
|-------|---------|
| `bg-brand` / `text-brand` | Primary CTAs and the one hero accent per view (Neon Blue). `bg-brand` is the **fill**; see the warning below before using `text-brand` as ink. |
| `text-brand-accent` | **Brand blue as TEXT.** Theme-aware (darker in light, lighter in dark) so it clears WCAG AA on every surface in its theme. Use this for brand-colored copy, links, headings, and icons. |
| `bg-brand-hover` | Hover state for primary (`bg-brand`) surfaces — same hue, ~8% darker. Use instead of an opacity modifier so the shift reads as a real shade change, not a fade. |
| `text-brand-fg` / `bg-brand-fg` | Text/bg on Neon Blue surfaces (white, in both themes) |
| `bg-brand-subtle` / `text-brand-subtle` | Ghost buttons only (pale cyan). **Not for row/item selection** — use `bg-row-selected`. In dark mode `bg-brand-subtle` collides with `bg-hover`. |

Note: the shorthand is `bg-brand`, not `bg-brand-primary`. Neon Blue is deliberately a darker mid-blue
(not the brighter electric cyan you might expect) so that **white** text on it clears WCAG AA
(4.58:1) — its foreground stays white in **both** themes (it does not invert like a neutral brand would).

**`text-brand` vs `text-brand-accent` — CRITICAL.** `--brand-primary` is tuned to be a *fill*
(white on it = 4.58:1). That same mid-tone is **not** legible as ink: `text-brand` measures only
**3.71:1** on the warm-white canvas and **2.99:1** on Dark Navy — the latter fails even the 3:1
large-text floor. So:

- **Fills** (`bg-brand`) + text on them (`text-brand-fg`) → keep using `--brand-primary`. Correct.
- **Ink** (any brand-colored text, link, heading, or icon) → use **`text-brand-accent`**, which
  re-tunes the same hue per theme (`#1169A6` light / `#3DA3EB` dark) to clear AA everywhere.

**Arrow-icon hover nudge:** any button containing a Lucide arrow icon (`ArrowRight`, `ArrowUpRight`,
etc.) gets a small rightward nudge on hover automatically — it's built into the `Button` primitive's
base classes (targets `[class*='lucide-arrow']`), not something to add per-instance. Applies to every
variant, not just primary.

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

Each semantic has a **triad** — three levels that cover all use cases. Madison's `info` is Terracotta
(`#C75A3B`, reserved) — status only, **not** a brand accent (that's Neon Blue).

| Base | Subtle | Foreground | Use |
|------|--------|------------|-----|
| `bg-success` / `text-success` / `border-success` | `bg-success-subtle` | `text-success-fg` | Positive outcomes |
| `bg-error` / `text-error` / `border-error` | `bg-error-subtle` | `text-error-fg` | Failures, destructive actions |
| `bg-warning` / `text-warning` / `border-warning` | `bg-warning-subtle` | `text-warning-fg` | Caution states |
| `bg-info` / `text-info` / `border-info` | `bg-info-subtle` | `text-info-fg` | Informational highlights (Terracotta) |

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
| Neon Blue `#147AC2` | `bg-brand` / `text-brand` | **Single** hero accent | ~15% |
| Deep Dust `#8A3A28` | `bg-depth` / `border-depth` | Depth (restricted) | ~5%, **max 10%** |
| Terracotta `#C75A3B` | `bg-info` / `text-info` | Status signal (reserved) | ~5% |

**Approved background + text pairings — the only legal ones:**

- **Primary Dark** — Dark Navy background + Warm White text (foundation pairing, max contrast).
- **Primary Light** — Warm White background + Dark Navy / near-black text.
- **Digital Dark** — Dark Navy background + Neon Blue accent (digital-first energy).

**Prohibited pairings:** Deep Dust as a background surface · Neon Blue as a page or section *surface*
(it is an accent **fill** for CTAs and emphasis — `bg-brand` on a button is correct, `bg-brand` as a
canvas is not) · `text-brand` used as ink (tuned as a fill, it fails AA as text — use
`text-brand-accent`; see the Brand section) · Terracotta next to Deep Dust (sibling warm rusts — side
by side they flatten the palette) · Terracotta as body copy (it is the reserved `info` status signal,
not a text color).

**Neon Blue is the sole hero accent** — one accent per view, used sparingly (`bg-brand` CTAs, a key
emphasis). Don't spread it across a layout; that's what dilutes the system.

**Deep Dust is depth, not presence** (`bg-depth` / `border-depth`):

- ✅ Hover/focus states · thin dividers and rule lines · depth shadows · secondary micro-labels —
  always on light (Warm White / White) backgrounds; **≤10% of the surface**.
- ❌ Page/section backgrounds · primary CTAs or buttons · headlines or body copy · the logo —
  and **never paired with Terracotta** (Deep Dust and Terracotta are sibling warm rusts; side by side
  they flatten the palette). Since Terracotta is now the `info` signal, that means: don't put
  `bg-depth`/`border-depth` and `bg-info`/`text-info` in the same component.
- When in doubt, reach for **Neon Blue**. Deep Dust is a last resort.

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

Families: `font-sans` (Inter, default body) · `font-serif` (Lora, display/headings). That's it —
**`font-mono` is retired** (JetBrains Mono is gone from the system; the `no-font-mono` lint rule
hard-fails `bun run check` if it reappears). Anywhere that used to be a small monospace tag (token
names, numeric badges, dense labels) is `font-sans` at `text-2xs` instead.
Weights: `font-normal / medium / semibold / bold`. Tracking: `tracking-tight` … `tracking-widest`.
Don't use arbitrary sizes (`text-[40px]`, `text-[10px]`) — **lint-blocked** (`no-raw-dimensions`);
reach for a step (`text-2xs` through `text-display`). The micro step `text-2xs` (10px) sits just below
`text-xs` — overlines, swatch captions, dense tag labels.

### Radii

`rounded-sm / md / lg / xl / 2xl / full` — all derived from `--radius`. Inputs/badges `rounded-sm`,
buttons `rounded-md`, cards/popovers `rounded-lg`, modals `rounded-xl`, pills/avatars `rounded-full`.

### Elevation (theme-aware)

`shadow-xs / sm / md / lg / xl / 2xl`. **Mode-aware** — heavier in dark mode automatically, so depth
still reads. Cards/buttons `shadow-sm`, dropdowns/hover-lift `shadow-md`, popovers `shadow-lg`, modals
`shadow-xl`, a single spotlight widget (not page chrome) `shadow-2xl`. Never hand-roll
`shadow-[0_1px_2px_...]`.

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

> **Enforcement:** items below tagged **lint-blocked** hard-fail `bun run check` via the governance overlay — `no-raw-colors` (off-system colors), `no-raw-dimensions` (arbitrary spacing/type lengths), and `no-font-mono` (the retired JetBrains Mono family). The rest are advisory but caught in review.

- Using raw Tailwind colors (`bg-zinc-900`, `text-slate-500`) instead of token classes — **lint-blocked**
- Using hex/rgb/hsl values in `className` or inline styles for colors
- Using numbered color scales (`text-success-700`, `bg-neutral-200`) — use semantic triads + opacity modifiers instead
- Using shadcn-style variable names (`bg-card`, `text-foreground`, `bg-destructive`) — see `references/migration.md`
- Inventing a new color token without first checking `tokens.tsx` and the style guide
- Nesting elevation layers out of order (e.g. `bg-app` inside `bg-surface`)
- Using semantic colors for branding (e.g. `bg-info`/Terracotta for a primary CTA — use `bg-brand`/Neon Blue)
- **Spreading Neon Blue around** — it's the *single* hero accent (~15%). One accent per view, used sparingly.
- **Misusing Deep Dust** (`bg-depth`/`border-depth`): as a background surface, a CTA, headline/body text, or paired with Terracotta (`bg-info`/`text-info`). It is depth-only, ≤10%, on light backgrounds. See the governance section.
- **An unapproved bg/text pairing** — only Primary Dark, Primary Light, and Digital Dark are legal (see governance). Never Neon Blue as a page/section surface (it's a CTA fill, not a canvas), and never `text-brand` as ink — use `text-brand-accent`.
- Using `bg-brand-subtle` for selected rows/items — collides with `bg-hover` in dark mode. Use `bg-row-selected` + `hover:bg-row-selected-hover`
- Using `border-default/40` or `divide-default/40` — static utilities don't support opacity modifiers. Use `border-[hsl(var(--border-default)/0.4)]`
- Using `border-default` for small interactive elements (circles, checkboxes, toggle rings) — invisible in dark mode. Use `border-active`
- Assuming border visibility without checking both light AND dark mode contrast
- Hand-rolling shadows (`shadow-[0_1px_2px_...]`) instead of `shadow-xs…2xl` (which are theme-aware)
- Magic z-index (`z-50`) for overlays/modals/toasts — use the named `z-*` layer scale
- Hardcoding focus-ring width (`ring-[3px]`, `ring-1`, `ring-2`) — use `ring-[length:var(--ring-width)]`
- Raw length literals for spacing/layout — `p-[17px]`, `gap-[13px]`, `mt-[20px]` — **lint-blocked** (`no-raw-dimensions`). Use the numeric scale (`p-4`, `py-24`) or a named step (`p-card`, `px-gutter`, `gap-section`). The numeric scale is on-token; only arbitrary literals are banned.
- Arbitrary font sizes — `text-[40px]`, `text-[10px]` — **lint-blocked** (`no-raw-dimensions`). Use the type scale (`text-2xs` through `text-5xl`, `text-display`).
- **Large headings in the wrong family** — HERO/h1–h4 are Lora (`font-serif`); a big heading left in `font-sans` (Inter) is off-brand. h5/h6 and body stay Inter.
- Using `font-mono` — **lint-blocked** (`no-font-mono`). JetBrains Mono is retired; use `font-sans` (Inter), paired with `text-2xs` for the old micro-label/tag role.
