import React from "react";
import { CheckCircle2, AlertTriangle, Info, Zap } from "lucide-react";
import { hexToHslChannels, blendHex } from "./utils";

// ============================================================================
// TOKEN DICTIONARY (The Source of Truth)
// ============================================================================
//
// ⚠️ SACRED FILE: the single source of truth for design tokens.
// Changes here regenerate dist/theme.css + dist/tailwind-tokens.css via
// `bun run build` (scripts/generate-theme.ts). Never hand-edit dist/.
//
// This dictionary governs BOTH color and the dimensional system — spacing,
// typography scale, breakpoints, radii, elevation, motion, layering, and
// interaction. If a value is repeated across components (a gap, a font size, a
// shadow), it belongs here as a token, not inline.
//
// App Customization Guide
// -----------------------
// - Brand tokens are DEFAULT NEUTRAL values. Each app overrides --brand-* in
//   its own CSS to match its identity (e.g. violet, blue).
// - Semantic tokens (success, error, warning, info) are CONSTANT across apps —
//   they signal status only, never branding.
// - Background, border, and typography tokens can also be overridden per-app
//   if the default neutral palette doesn't fit.
// - Dimensional tokens (spacing/type/radii/motion) are global design constants.
//   Override the few a brand cares about (--font-sans, --radius, --spacing).
//
// Example override in your app's CSS (HSL channels):
//   :root {
//     --brand-primary: 255 70% 55%;
//     --brand-foreground: 0 0% 100%;
//     --brand-subtle: 255 80% 97%;
//   }
//
// Color vs. dimensional emission (how the generator routes each group)
// --------------------------------------------------------------------
// - Colors + mode-aware shadows: a raw HSL/value var lands in :root and .dark
//   (theme.css), then `@theme inline` registers a Tailwind color/shadow that
//   references it. This is what makes dark mode automatic and `/40` opacity
//   work on colors.
// - Dimensional constants (spacing/type/radii/breakpoints/motion): a single
//   non-inline `@theme` block. That both generates the utilities (p-section,
//   text-display, rounded-lg, md:, ease-standard) AND emits the var to :root,
//   so `var(--spacing-section)` arbitrary values work too.
// - Z-index + interaction: plain :root vars + a few static utilities.

export interface TokenDefinition {
  name: string;
  label: string;
  light: string;
  dark: string;
  desc?: string;
}

export interface GlobalToken {
  name: string;
  label: string;
  value: string;
  desc?: string;
}

export interface SemanticToken {
  id: string;
  label: string;
  icon: React.ReactNode;
  base: string;
  fg: string;
  subtleLight: string;
  subtleDark: string;
}

/** A mode-agnostic dimensional token (spacing, radii, breakpoints, motion, …). */
export interface ScaleToken {
  name: string;
  label: string;
  value: string;
  desc?: string;
}

/** A typographic step: font-size paired with a line-height (and optional tracking/weight). */
export interface TypeScaleToken {
  name: string;
  label: string;
  value: string;
  lineHeight: string;
  tracking?: string;
  weight?: string;
  desc?: string;
}

/** An elevation token — mode-aware, so it carries a light/dark box-shadow pair. */
export interface ShadowToken {
  name: string;
  label: string;
  light: string;
  dark: string;
  desc?: string;
}

export interface TokenDictionary {
  // Color
  backgrounds: TokenDefinition[];
  borders: TokenDefinition[];
  typography: TokenDefinition[];
  brand: TokenDefinition[];
  semantics: SemanticToken[];
  globals: GlobalToken[];
  // Dimensional
  spacing: ScaleToken[];
  fontFamilies: ScaleToken[];
  fontSizes: TypeScaleToken[];
  fontWeights: ScaleToken[];
  letterSpacing: ScaleToken[];
  breakpoints: ScaleToken[];
  radii: ScaleToken[];
  shadows: ShadowToken[];
  durations: ScaleToken[];
  easings: ScaleToken[];
  zIndex: ScaleToken[];
  interaction: ScaleToken[];
}

export const TOKENS: TokenDictionary = {
  backgrounds: [
    { name: "--bg-app", label: "App / Canvas", light: "#EAE5DF", dark: "#1B2732", desc: "The absolute bottom layer — Madison Warm White (Dark Navy in dark)." },
    { name: "--bg-panel", label: "Panel / Sidebar", light: "#F2EEE8", dark: "#202E3B", desc: "Structural sidebars and headers." },
    { name: "--bg-surface", label: "Surface / Card", light: "#FBF9F6", dark: "#293845", desc: "Nested cards and popovers — lifts off the warm canvas." },
    { name: "--bg-stripe", label: "Zebra Stripe", light: "#E5E0D8", dark: "#1F2C37", desc: "Alternating row background — subtle offset from bg-surface." },
    { name: "--bg-hover", label: "Hover State", light: "#E1DBD1", dark: "#33424F", desc: "Subtle background for interactive elements." },
    { name: "--bg-depth", label: "Depth (Deep Dust)", light: "#8A3A28", dark: "#9C4835", desc: "RESTRICTED — Deep Dust depth accent for hover/focus fills. Never a primary surface; max 10%; never paired with Terracotta or Neon." },
    { name: "--bg-row-selected", label: "Row Selected", light: blendHex("#202E3B", "#FBF9F6", 0.05), dark: blendHex("#EAE5DF", "#293845", 0.05), desc: "Selected row — 5% foundation over surface." },
    { name: "--bg-row-selected-stripe", label: "Row Selected Stripe", light: blendHex("#202E3B", "#E5E0D8", 0.05), dark: blendHex("#EAE5DF", "#1F2C37", 0.05), desc: "Selected row stripe — 5% foundation over stripe." },
    { name: "--bg-row-selected-hover", label: "Row Selected Hover", light: blendHex("#202E3B", "#E1DBD1", 0.1), dark: blendHex("#EAE5DF", "#33424F", 0.1), desc: "Selected row hover — 10% foundation over hover." },
    { name: "--bg-row-active", label: "Row Active", light: blendHex("#202E3B", "#FBF9F6", 0.1), dark: blendHex("#EAE5DF", "#293845", 0.1), desc: "Active row — 10% foundation over surface." },
    { name: "--bg-row-active-stripe", label: "Row Active Stripe", light: blendHex("#202E3B", "#E5E0D8", 0.1), dark: blendHex("#EAE5DF", "#1F2C37", 0.1), desc: "Active row stripe — 10% foundation over stripe." },
    // Deliberately OUTSIDE the warm-neutral family and identical in both themes:
    // a true #FFF plate for hosting third-party artwork (client logos, partner
    // marks) that was authored against white. Warm White would tint it. Use only
    // to host foreign media — never as a general page or card surface.
    { name: "--bg-plate", label: "Plate (pure white)", light: "#FFFFFF", dark: "#FFFFFF", desc: "Pure white in BOTH themes — hosts third-party logos/artwork authored on white. Not a general surface." },
  ],
  borders: [
    { name: "--border-default", label: "Default", light: "#DBD5CB", dark: "#33414D", desc: "Standard structural dividers — warm taupe." },
    { name: "--border-active", label: "Active / Hover", light: "#B9B0A1", dark: "#4B5A67", desc: "Hovered inputs or active states." },
    { name: "--border-depth", label: "Depth (Deep Dust)", light: "#8A3A28", dark: "#9C4835", desc: "RESTRICTED — Deep Dust rule lines / thin dividers only; use at low opacity. Never paired with Terracotta or Neon." },
  ],
  typography: [
    { name: "--text-primary", label: "Primary", light: "#2C2925", dark: "#EAE5DF", desc: "Headings and main body text — Madison warm near-black." },
    { name: "--text-secondary", label: "Secondary", light: "#5D564C", dark: "#B7B0A5", desc: "Metadata and secondary labels." },
    { name: "--text-muted", label: "Muted / Tertiary", light: "#8B8377", dark: "#8A8378", desc: "Disabled states and subtle hints." },
  ],
  brand: [
    // Madison brand: Neon Blue is the single hero accent (15% of any layout).
    // #147AC2 is deliberately a darker mid-blue than the brighter cyan the brand
    // reads as: it is tuned so WHITE clears WCAG AA on primary CTAs (4.58:1).
    // Don't lighten it toward the cyan without re-measuring — at #2B8FD6 white
    // falls to 3.50:1 and every primary button fails the 4.5:1 normal-text
    // minimum. -foreground is white in both themes (Neon Blue doesn't invert).
    // -subtle is a pale-blue ghost derived from the same hue.
    { name: "--brand-primary", label: "Primary Accent", light: "#147AC2", dark: "#147AC2", desc: "Neon Blue — the single hero accent. Primary CTAs and emphasis." },
    { name: "--brand-primary-hover", label: "Primary Hover", light: "#10629B", dark: "#10629B", desc: "Primary CTA hover — same hue, 8% darker (white stays 6.48:1)." },
    // --brand-primary is tuned to be a FILL (white on it = 4.58:1) and so is too
    // mid-toned to be legible as TEXT: as ink it only reaches 3.71:1 on the warm-
    // white canvas and 2.99:1 on Dark Navy — both fail AA. This is the same hue
    // re-tuned per theme for use as ink: darkened in light mode (4.67:1 on the
    // worst light surface), lightened in dark mode (5.04:1 on Dark Navy).
    { name: "--brand-accent", label: "Brand Accent (text-safe)", light: "#1169A6", dark: "#3DA3EB", desc: "Brand blue as TEXT — theme-aware, clears WCAG AA on every surface in its theme. Use for brand-colored copy/links; use --brand-primary for fills." },
    { name: "--brand-foreground", label: "Brand Foreground", light: "#FFFFFF", dark: "#FFFFFF", desc: "Text on Neon Blue surfaces — white, 4.58:1 contrast." },
    { name: "--brand-subtle", label: "Brand Subtle", light: "#DDF0FD", dark: "#193243", desc: "Ghost buttons — pale blue." },
    // Palette expansion: two tints (lighter than primary) and two shades
    // (darker than primary), same hue family. Theme-invariant, like
    // --brand-primary itself — these are fixed points on the Neon Blue
    // ladder, not adaptive per-theme roles. Named tint/shade (not a numbered
    // scale) per governance — pick by role as you use them, e.g. --brand-tint
    // for a soft highlight, --brand-shade-deep for a near-navy accent.
    { name: "--brand-tint", label: "Brand Tint", light: "#AAD2EF", dark: "#AAD2EF", desc: "Light tint of Neon Blue — soft highlights, chart fills, decorative accents." },
    { name: "--brand-tint-pale", label: "Brand Tint (Pale)", light: "#D5E9F7", dark: "#D5E9F7", desc: "Palest tint of Neon Blue — subtle background washes, faint highlights." },
    { name: "--brand-shade", label: "Brand Shade", light: "#143D5B", dark: "#143D5B", desc: "Dark shade of Neon Blue — deep accents, hover states needing more contrast than --brand-primary-hover." },
    { name: "--brand-shade-deep", label: "Brand Shade (Deep)", light: "#0D2232", dark: "#0D2232", desc: "Deepest shade of Neon Blue — near-navy accents, dark decorative fills." },
  ],
  semantics: [
    { id: "success", label: "Success", icon: <CheckCircle2 className="w-4 h-4" />, base: "#10B981", fg: "#FFFFFF", subtleLight: "#D1FAE5", subtleDark: "#064E3B" },
    { id: "error", label: "Error", icon: <AlertTriangle className="w-4 h-4" />, base: "#EF4444", fg: "#FFFFFF", subtleLight: "#FEE2E2", subtleDark: "#7F1D1D" },
    { id: "warning", label: "Warning", icon: <Zap className="w-4 h-4" />, base: "#F59E0B", fg: "#FFFFFF", subtleLight: "#FEF3C7", subtleDark: "#78350F" },
    // Info = Madison Terracotta (#C75A3B) — reserved, the smallest signal moments
    // (~5% of any layout). Warm-white foreground, same in both themes (a saturated
    // mid-tone, like Neon Blue, that doesn't invert).
    //
    // CONTRAST CEILING — measured, and a real constraint on how this is used.
    // Terracotta is a true mid-tone, so NO foreground clears AA (4.5:1) on it
    // except pure black (4.95:1), which is off-palette here:
    //   warm-white #FBF9F6 on #C75A3B → 4.03:1   white → 4.24:1
    //   text-info #C75A3B on bg-info-subtle      → 3.32:1 light / 3.26:1 dark
    // All of these clear the 3:1 floor for large text (≥24px, or ≥19px bold) and
    // for icons and other non-text graphics — which is exactly the "smallest
    // signal moments" role. So: `bg-info` behind an icon, a dot, a rule, or a
    // large label is fine; `bg-info` + `text-info-fg` behind normal-size body
    // copy is not, and a small `text-info` label on `bg-info-subtle` is not.
    // This is inherited from Madison's palette (the same 4.03:1 applied when
    // Terracotta was --brand-primary), NOT introduced by the brand swap — but
    // it moved somewhere less scrutinised, so it is written down here. Fixing it
    // properly means darkening the base to ~#B4502F (4.84:1), which is a brand
    // decision, not an engineering one.
    { id: "info", label: "Info", icon: <Info className="w-4 h-4" />, base: "#C75A3B", fg: "#FBF9F6", subtleLight: "#F2E0D8", subtleDark: "#3C2823" },
  ],
  globals: [
    { name: "--radius", label: "Global Radius", value: "0.375rem", desc: "Base border radius the radius scale derives from (rounded-md)." },
    { name: "--container-page", label: "Page Container", value: "86rem", desc: "Max width of centered page content — nav, hero, and sections align to it. Apply with `max-w-[var(--container-page)] mx-auto` (wide, but not edge-to-edge)." },
  ],

  // --------------------------------------------------------------------------
  // DIMENSIONAL TOKENS (mode-agnostic unless noted)
  // --------------------------------------------------------------------------

  // Spacing — Tailwind's numeric scale (p-4, gap-2) is derived from the
  // --spacing base below. These NAMED steps add layout-intent utilities
  // (p-card, px-gutter, gap-section) so rhythm is governed, not guessed.
  spacing: [
    { name: "--spacing", label: "Spacing Base", value: "0.25rem", desc: "Unit the numeric scale multiplies (p-4 = base × 4). Shrink for a denser UI." },
    { name: "--spacing-inline", label: "Inline Gap", value: "0.5rem", desc: "Gap between inline siblings — icon + label, chips (gap-inline)." },
    { name: "--spacing-stack", label: "Stack Gap", value: "1rem", desc: "Default vertical gap between stacked blocks (gap-stack, space-y-stack)." },
    { name: "--spacing-card", label: "Card Padding", value: "1.5rem", desc: "Default inner padding for cards and panels (p-card)." },
    { name: "--spacing-gutter", label: "Page Gutter", value: "1.5rem", desc: "Horizontal page padding (px-gutter)." },
    { name: "--spacing-section", label: "Section Rhythm", value: "4rem", desc: "Vertical spacing between page sections (py-section, gap-section)." },
  ],

  // Font families. Madison pairs Lora (display/large headings) with Inter (body + UI).
  // JetBrains Mono is retired — Madison is a two-family system now (Lora +
  // Inter only). Anywhere that used to be `font-mono` (token names, numeric
  // tags, dense labels) is `font-sans` at `text-2xs` instead — see the
  // no-font-mono lint rule, which bans `font-mono` from ever coming back.
  fontFamilies: [
    { name: "--font-sans", label: "Sans (UI / Body)", value: "'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", desc: "Body + UI typeface (Inter). Also h5/h6, subtitles, and dense/tag labels at text-2xs." },
    { name: "--font-serif", label: "Serif (Display / Headings)", value: "'Lora', Georgia, 'Times New Roman', serif", desc: "Madison display + large headings (Lora). HERO through h4 — apply with font-serif." },
  ],

  // Type scale — size + paired line-height. Mirrors common steps so existing
  // text-* usage is stable, plus a `display` step for hero headings.
  // Madison type scale (exact px from Figma Dev Mode, expressed in rem). The large
  // steps (2xl–display, 24–72px) are the Lora heading ramp — pair them with
  // `font-serif`; their -1% tracking (-0.01em) is baked in. h5/h6 and everything
  // below (text-xl and down) are Inter (font-sans).
  fontSizes: [
    { name: "--text-2xs", label: "2X Small", value: "0.625rem", lineHeight: "0.875rem", desc: "Micro labels (10px) — overlines, swatch captions, dense mono tags. Below text-xs." },
    { name: "--text-xs", label: "Caption", value: "0.75rem", lineHeight: "1rem", desc: "Madison CAPTION (12px) — captions, overlines, dense metadata." },
    { name: "--text-sm", label: "Body 2 / Subtitle 2", value: "0.875rem", lineHeight: "1.25rem", desc: "Madison body2 / subtitle2 (14px) — secondary text, labels, table cells." },
    { name: "--text-base", label: "Body 1 / Subtitle 1", value: "1rem", lineHeight: "1.5rem", desc: "Madison body1 / subtitle1 (16px) — default body copy." },
    { name: "--text-lg", label: "h6", value: "1.125rem", lineHeight: "1.75rem", desc: "Madison h6 (18px, Inter 600) — small headings, lead paragraphs." },
    { name: "--text-xl", label: "h5", value: "1.25rem", lineHeight: "1.875rem", desc: "Madison h5 (20px, Inter 600) — subheadings." },
    { name: "--text-2xl", label: "h4", value: "1.5rem", lineHeight: "2.25rem", tracking: "-0.01em", desc: "Madison h4 (24px, Lora 500) — use with font-serif." },
    { name: "--text-3xl", label: "h3", value: "2rem", lineHeight: "3rem", tracking: "-0.01em", desc: "Madison h3 (32px, Lora 500) — use with font-serif." },
    { name: "--text-4xl", label: "h2", value: "3rem", lineHeight: "4rem", tracking: "-0.01em", desc: "Madison h2 (48px, Lora 500) — use with font-serif." },
    { name: "--text-5xl", label: "h1", value: "4rem", lineHeight: "5rem", tracking: "-0.01em", desc: "Madison h1 (64px, Lora 500) — use with font-serif." },
    { name: "--text-display", label: "HERO", value: "4.5rem", lineHeight: "1.05", tracking: "-0.01em", weight: "500", desc: "Madison HERO (72px, Lora 500) — hero / landing display; use with font-serif." },
  ],

  fontWeights: [
    { name: "--font-weight-normal", label: "Normal", value: "400", desc: "Body copy." },
    { name: "--font-weight-medium", label: "Medium", value: "500", desc: "Labels, emphasized inline text." },
    { name: "--font-weight-semibold", label: "Semibold", value: "600", desc: "Headings, buttons." },
    { name: "--font-weight-bold", label: "Bold", value: "700", desc: "Strong emphasis, display." },
  ],

  letterSpacing: [
    { name: "--tracking-tighter", label: "Tighter", value: "-0.04em", desc: "Large display headings." },
    { name: "--tracking-tight", label: "Tight", value: "-0.03em", desc: "Headings (tracking-tight)." },
    { name: "--tracking-normal", label: "Normal", value: "0em", desc: "Body default." },
    { name: "--tracking-wide", label: "Wide", value: "0.04em", desc: "Buttons, short labels." },
    { name: "--tracking-widest", label: "Widest", value: "0.1em", desc: "Uppercase overlines / eyebrows." },
  ],

  // Responsive breakpoints (min-width). Drives md:, lg:, … Override to shift a
  // client's responsive thresholds in one place.
  breakpoints: [
    { name: "--breakpoint-sm", label: "Small", value: "40rem", desc: "≥ 640px — large phone / small tablet." },
    { name: "--breakpoint-md", label: "Medium", value: "48rem", desc: "≥ 768px — tablet." },
    { name: "--breakpoint-lg", label: "Large", value: "64rem", desc: "≥ 1024px — laptop." },
    { name: "--breakpoint-xl", label: "Extra Large", value: "80rem", desc: "≥ 1280px — desktop." },
    { name: "--breakpoint-2xl", label: "2XL", value: "96rem", desc: "≥ 1536px — wide desktop." },
  ],

  // Corner radii — all derived from the --radius base, so "soften every corner"
  // is a one-token change.
  radii: [
    { name: "--radius-sm", label: "Small", value: "calc(var(--radius) - 2px)", desc: "Inputs, badges, small controls." },
    { name: "--radius-md", label: "Medium", value: "var(--radius)", desc: "Buttons, default (rounded-md)." },
    { name: "--radius-lg", label: "Large", value: "calc(var(--radius) + 2px)", desc: "Cards, popovers (rounded-lg)." },
    { name: "--radius-xl", label: "Extra Large", value: "calc(var(--radius) + 6px)", desc: "Modals, large surfaces." },
    { name: "--radius-2xl", label: "2XL", value: "calc(var(--radius) + 10px)", desc: "Hero cards, feature panels." },
    { name: "--radius-full", label: "Full / Pill", value: "9999px", desc: "Pills, avatars, circular controls." },
  ],

  // Elevation — MODE-AWARE. Dark surfaces need heavier shadows to read, so each
  // step carries its own light/dark value (like colors). Drives shadow-*.
  shadows: [
    { name: "--shadow-xs", label: "Extra Small", light: "0 1px 2px 0 rgb(0 0 0 / 0.05)", dark: "0 1px 2px 0 rgb(0 0 0 / 0.45)", desc: "Hairline lift — inputs, ghost buttons." },
    { name: "--shadow-sm", label: "Small", light: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)", dark: "0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)", desc: "Cards, buttons at rest." },
    { name: "--shadow-md", label: "Medium", light: "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)", dark: "0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5)", desc: "Raised cards, dropdowns, hover lift." },
    { name: "--shadow-lg", label: "Large", light: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", dark: "0 10px 15px -3px rgb(0 0 0 / 0.6), 0 4px 6px -4px rgb(0 0 0 / 0.6)", desc: "Popovers, menus." },
    { name: "--shadow-xl", label: "Extra Large", light: "0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.12)", dark: "0 20px 25px -5px rgb(0 0 0 / 0.7), 0 8px 10px -6px rgb(0 0 0 / 0.7)", desc: "Modals, dialogs." },
    { name: "--shadow-2xl", label: "2X Large", light: "0 25px 50px -12px rgb(0 0 0 / 0.18)", dark: "0 25px 50px -12px rgb(0 0 0 / 0.85)", desc: "Strongest lift — a single spotlight widget, not page chrome." },
  ],

  // Motion — durations + easings. Setting the Tailwind defaults (in the
  // generator) makes every transition-* utility adopt these automatically.
  durations: [
    { name: "--duration-fast", label: "Fast", value: "150ms", desc: "Hover/focus tints, small state changes." },
    { name: "--duration-base", label: "Base", value: "200ms", desc: "Default transition (Tailwind default duration)." },
    { name: "--duration-slow", label: "Slow", value: "300ms", desc: "Larger movements — popovers, dialogs entering." },
  ],
  easings: [
    { name: "--ease-standard", label: "Standard", value: "cubic-bezier(0.2, 0, 0, 1)", desc: "Default in/out — most transitions." },
    { name: "--ease-out", label: "Decelerate", value: "cubic-bezier(0, 0, 0.2, 1)", desc: "Entering elements." },
    { name: "--ease-in", label: "Accelerate", value: "cubic-bezier(0.4, 0, 1, 1)", desc: "Exiting elements." },
  ],

  // Layering — a named z-index scale so stacking is intentional, not magic
  // numbers. Emitted as static .z-* utilities.
  zIndex: [
    { name: "--z-base", label: "Base", value: "0", desc: "Default flow." },
    { name: "--z-dropdown", label: "Dropdown", value: "1000", desc: "Menus, select popovers." },
    { name: "--z-sticky", label: "Sticky", value: "1100", desc: "Sticky headers, toolbars." },
    { name: "--z-overlay", label: "Overlay", value: "1200", desc: "Dialog/drawer scrims." },
    { name: "--z-modal", label: "Modal", value: "1300", desc: "Dialog, drawer content." },
    { name: "--z-popover", label: "Popover", value: "1400", desc: "Popovers, tooltips over modals." },
    { name: "--z-toast", label: "Toast", value: "1500", desc: "Toasts / notifications." },
    { name: "--z-tooltip", label: "Tooltip", value: "1600", desc: "Always-on-top tooltips." },
  ],

  // Interaction — the focus ring, disabled affordance, and cursor convention.
  // Standardizes what was hardcoded per-primitive (ring-1 / ring-2 / ring-[3px]).
  interaction: [
    { name: "--ring-width", label: "Focus Ring Width", value: "2px", desc: "Focus ring thickness (focus-visible:ring-[length:var(--ring-width)])." },
    { name: "--ring-offset", label: "Focus Ring Offset", value: "2px", desc: "Gap between element and focus ring." },
    { name: "--disabled-opacity", label: "Disabled Opacity", value: "0.5", desc: "Opacity applied to disabled controls." },
  ],
};

const FLAT_CATEGORIES = ["backgrounds", "borders", "typography", "brand"] as const;

/** Generate a raw CSS string of all token variables (light + dark). Used by the style guide's export action. */
export function generateCSS(tokens: TokenDictionary): string {
  let css = `/* ==========================================
   MADISON DESIGN TOKENS
   ========================================== */

:root {
`;

  // Globals
  tokens.globals.forEach((t) => {
    css += `  ${t.name}: ${t.value};\n`;
  });
  css += `\n`;

  // Light mode
  FLAT_CATEGORIES.forEach((category) => {
    tokens[category].forEach((t) => {
      css += `  ${t.name}: ${hexToHslChannels(t.light)};\n`;
    });
  });
  tokens.semantics.forEach((t) => {
    css += `  --semantic-${t.id}: ${hexToHslChannels(t.base)};\n`;
    css += `  --semantic-${t.id}-fg: ${hexToHslChannels(t.fg)};\n`;
    css += `  --semantic-${t.id}-subtle: ${hexToHslChannels(t.subtleLight)};\n`;
  });

  // Dimensional constants (mode-agnostic)
  css += `\n`;
  const SCALE_GROUPS = [
    "spacing", "fontFamilies", "fontWeights", "letterSpacing",
    "breakpoints", "radii", "durations", "easings", "zIndex", "interaction",
  ] as const;
  SCALE_GROUPS.forEach((group) => {
    tokens[group].forEach((t) => {
      css += `  ${t.name}: ${t.value};\n`;
    });
  });
  tokens.fontSizes.forEach((t) => {
    css += `  ${t.name}: ${t.value};\n`;
    css += `  ${t.name}--line-height: ${t.lineHeight};\n`;
    if (t.tracking) css += `  ${t.name}--letter-spacing: ${t.tracking};\n`;
    if (t.weight) css += `  ${t.name}--font-weight: ${t.weight};\n`;
  });
  tokens.shadows.forEach((t) => {
    css += `  --elevation-${t.name.replace("--shadow-", "")}: ${t.light};\n`;
  });

  // Dark mode
  css += `}\n\n.dark {\n`;
  FLAT_CATEGORIES.forEach((category) => {
    tokens[category].forEach((t) => {
      css += `  ${t.name}: ${hexToHslChannels(t.dark)};\n`;
    });
  });
  tokens.semantics.forEach((t) => {
    css += `  --semantic-${t.id}: ${hexToHslChannels(t.base)};\n`;
    css += `  --semantic-${t.id}-fg: ${hexToHslChannels(t.fg)};\n`;
    css += `  --semantic-${t.id}-subtle: ${hexToHslChannels(t.subtleDark)};\n`;
  });
  tokens.shadows.forEach((t) => {
    css += `  --elevation-${t.name.replace("--shadow-", "")}: ${t.dark};\n`;
  });
  css += `}`;
  return css;
}
