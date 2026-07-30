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
  lineHeights: ScaleToken[];
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
    // Madison brand: Terracotta is the single hero accent (15% of any layout).
    // -foreground stays warm-white on Terracotta in BOTH themes (a saturated mid-tone,
    // unlike a neutral brand it does not invert). -subtle is a pale terracotta ghost.
    { name: "--brand-primary", label: "Primary Accent", light: "#C75A3B", dark: "#D46E50", desc: "Terracotta — the single hero accent. Primary CTAs and emphasis." },
    { name: "--brand-foreground", label: "Brand Foreground", light: "#FBF9F6", dark: "#FBF9F6", desc: "Text on Terracotta surfaces — warm white." },
    { name: "--brand-subtle", label: "Brand Subtle", light: "#F2E0D8", dark: "#3C2823", desc: "Ghost buttons — pale terracotta." },
  ],
  semantics: [
    { id: "success", label: "Success", icon: <CheckCircle2 className="w-4 h-4" />, base: "#10B981", fg: "#FFFFFF", subtleLight: "#D1FAE5", subtleDark: "#064E3B" },
    { id: "error", label: "Error", icon: <AlertTriangle className="w-4 h-4" />, base: "#EF4444", fg: "#FFFFFF", subtleLight: "#FEE2E2", subtleDark: "#7F1D1D" },
    { id: "warning", label: "Warning", icon: <Zap className="w-4 h-4" />, base: "#F59E0B", fg: "#FFFFFF", subtleLight: "#FEF3C7", subtleDark: "#78350F" },
    // Info = Madison Neon Blue (#00B4FF) — the "digital signal". Dark foreground for
    // legible contrast on the bright cyan. Reserved for the smallest signal moments.
    { id: "info", label: "Info", icon: <Info className="w-4 h-4" />, base: "#00B4FF", fg: "#0B2833", subtleLight: "#D6F1FF", subtleDark: "#0A3446" },
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
  fontFamilies: [
    { name: "--font-sans", label: "Sans (UI / Body)", value: "'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", desc: "Body + UI typeface (Inter). Also h5/h6 and subtitles." },
    { name: "--font-serif", label: "Serif (Display / Headings)", value: "'Lora', Georgia, 'Times New Roman', serif", desc: "Madison display + large headings (Lora). HERO through h4 — apply with font-serif." },
    { name: "--font-mono", label: "Mono (Code)", value: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", desc: "Code, token names, numeric tables." },
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

  // Each step in the type scale already carries its own line-height — that pairing
  // is the default and stays the right answer. These are the *override* scale, for
  // the cases where copy needs to breathe (or tighten) without changing its size.
  //
  // An app may additionally set its own heading-level default on top of the step
  // pairing (a rule that gives every h1–h6 a leading derived from its own rendered
  // size, rather than retuning steps that body copy shares). Where it does, these
  // five remain the explicit per-element override and still win — so `leading-tight`
  // is "tighter than this heading's default", not "the heading default".
  //
  // These names deliberately cover Tailwind's whole `--leading-*` namespace. Two
  // reasons, and it is worth being precise about both:
  //   1. A step left undeclared falls back to Tailwind's own default, so its value
  //      would be Tailwind's to change, not Madison's. `--leading-normal` (1.5) and
  //      `--leading-loose` (2) are byte-identical to Tailwind's defaults today; they
  //      are declared anyway so a future Tailwind minor cannot retune Madison's
  //      typography from underneath us.
  //   2. THREE steps deliberately DIVERGE from Tailwind's defaults:
  //      tight 1.25 → 1.15 · snug 1.375 → 1.3 · relaxed 1.625 → 1.75.
  //      `leading-relaxed` was already in use before these tokens existed, so that
  //      third divergence is a real, intended visual change at its call sites
  //      (accordion body, prompt-demo paragraph, landing mono block) — not a no-op.
  //      tokens.test.ts pins all five values so any further move shows up as a diff.
  //
  // This namespace is not the whole story: `leading-none` is a Tailwind STATIC
  // utility hardcoded to 1, outside `--leading-*` entirely, so no token governs it.
  // It cannot drift (it never reads the theme) and the kit uses it deliberately for
  // single-line labels and titles — see the design-system skill. The numeric form
  // (`leading-7`) resolves via `--spacing` into a fixed rem and IS banned by
  // `no-raw-dimensions`.
  lineHeights: [
    { name: "--leading-tight", label: "Tight", value: "1.15", desc: "Tightening override for large display headings set as one block — tighter than whatever default the heading already inherits." },
    { name: "--leading-snug", label: "Snug", value: "1.3", desc: "Smaller headings and short two-line labels." },
    { name: "--leading-normal", label: "Normal", value: "1.5", desc: "Body copy — matches the text-base pairing." },
    { name: "--leading-relaxed", label: "Relaxed", value: "1.75", desc: "Long-form paragraphs that need air." },
    { name: "--leading-loose", label: "Loose", value: "2", desc: "Maximum air — sparse editorial blocks, widely spaced lists." },
  ],

  fontWeights: [
    { name: "--font-weight-normal", label: "Normal", value: "400", desc: "Body copy." },
    { name: "--font-weight-medium", label: "Medium", value: "500", desc: "Labels, emphasized inline text." },
    { name: "--font-weight-semibold", label: "Semibold", value: "600", desc: "Headings, buttons." },
    { name: "--font-weight-bold", label: "Bold", value: "700", desc: "Strong emphasis, display." },
  ],

  letterSpacing: [
    { name: "--tracking-tighter", label: "Tighter", value: "-0.04em", desc: "Large display headings." },
    { name: "--tracking-tight", label: "Tight", value: "-0.02em", desc: "Headings (tracking-tight)." },
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
