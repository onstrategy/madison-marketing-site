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
    { name: "--bg-app", label: "App / Canvas", light: "#F8F9FA", dark: "#0E0E11", desc: "The absolute bottom layer." },
    { name: "--bg-panel", label: "Panel / Sidebar", light: "#FFFFFF", dark: "#121214", desc: "Structural sidebars and headers." },
    { name: "--bg-surface", label: "Surface / Card", light: "#FFFFFF", dark: "#18181B", desc: "Nested cards and popovers." },
    { name: "--bg-stripe", label: "Zebra Stripe", light: "#F8F9FA", dark: "#16161A", desc: "Alternating row background — subtle offset from bg-surface." },
    { name: "--bg-hover", label: "Hover State", light: "#F1F3F5", dark: "#27272A", desc: "Subtle background for interactive elements." },
    { name: "--bg-row-selected", label: "Row Selected", light: blendHex("#09090B", "#FFFFFF", 0.05), dark: blendHex("#EDEDED", "#18181B", 0.05), desc: "Selected row — 5% brand over surface." },
    { name: "--bg-row-selected-stripe", label: "Row Selected Stripe", light: blendHex("#09090B", "#F8F9FA", 0.05), dark: blendHex("#EDEDED", "#16161A", 0.05), desc: "Selected row stripe — 5% brand over stripe." },
    { name: "--bg-row-selected-hover", label: "Row Selected Hover", light: blendHex("#09090B", "#F1F3F5", 0.1), dark: blendHex("#EDEDED", "#27272A", 0.1), desc: "Selected row hover — 10% brand over hover." },
    { name: "--bg-row-active", label: "Row Active", light: blendHex("#09090B", "#FFFFFF", 0.1), dark: blendHex("#EDEDED", "#18181B", 0.1), desc: "Active row — 10% brand over surface." },
    { name: "--bg-row-active-stripe", label: "Row Active Stripe", light: blendHex("#09090B", "#F8F9FA", 0.1), dark: blendHex("#EDEDED", "#16161A", 0.1), desc: "Active row stripe — 10% brand over stripe." },
  ],
  borders: [
    { name: "--border-default", label: "Default", light: "#E4E4E7", dark: "#27272A", desc: "Standard structural dividers." },
    { name: "--border-active", label: "Active / Hover", light: "#A1A1AA", dark: "#3F3F46", desc: "Hovered inputs or active states." },
  ],
  typography: [
    { name: "--text-primary", label: "Primary", light: "#18181B", dark: "#EDEDED", desc: "Headings and main body text." },
    { name: "--text-secondary", label: "Secondary", light: "#52525B", dark: "#A1A1AA", desc: "Metadata and secondary labels." },
    { name: "--text-muted", label: "Muted / Tertiary", light: "#71717A", dark: "#71717A", desc: "Disabled states and subtle hints." },
  ],
  brand: [
    // DEFAULT NEUTRAL values. Each app overrides these with its own brand color.
    // -foreground always contrasts with -primary (usually white or near-black).
    // -subtle is a light/faded version for ghost buttons.
    { name: "--brand-primary", label: "Primary Accent", light: "#09090B", dark: "#EDEDED", desc: "Primary CTAs. Override per-app with brand color." },
    { name: "--brand-foreground", label: "Brand Foreground", light: "#FFFFFF", dark: "#09090B", desc: "Text on brand backgrounds. Invert when overriding --brand-primary." },
    { name: "--brand-subtle", label: "Brand Subtle", light: "#E4E4E7", dark: "#27272A", desc: "Ghost buttons. Derive from --brand-primary at 10-20% opacity." },
  ],
  semantics: [
    { id: "success", label: "Success", icon: <CheckCircle2 className="w-4 h-4" />, base: "#10B981", fg: "#FFFFFF", subtleLight: "#D1FAE5", subtleDark: "#064E3B" },
    { id: "error", label: "Error", icon: <AlertTriangle className="w-4 h-4" />, base: "#EF4444", fg: "#FFFFFF", subtleLight: "#FEE2E2", subtleDark: "#7F1D1D" },
    { id: "warning", label: "Warning", icon: <Zap className="w-4 h-4" />, base: "#F59E0B", fg: "#FFFFFF", subtleLight: "#FEF3C7", subtleDark: "#78350F" },
    { id: "info", label: "Info", icon: <Info className="w-4 h-4" />, base: "#3B82F6", fg: "#FFFFFF", subtleLight: "#DBEAFE", subtleDark: "#1E3A8A" },
  ],
  globals: [
    { name: "--radius", label: "Global Radius", value: "0.375rem", desc: "Base border radius the radius scale derives from (rounded-md)." },
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

  // Font families. Override --font-sans per brand; the app body inherits it.
  fontFamilies: [
    { name: "--font-sans", label: "Sans (UI / Body)", value: "'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", desc: "Primary UI + body typeface (self-hosted Inter variable, system fallback)." },
    { name: "--font-mono", label: "Mono (Code)", value: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", desc: "Code, token names, numeric tables." },
  ],

  // Type scale — size + paired line-height. Mirrors common steps so existing
  // text-* usage is stable, plus a `display` step for hero headings.
  fontSizes: [
    { name: "--text-2xs", label: "2X Small", value: "0.625rem", lineHeight: "0.875rem", desc: "Micro labels (10px) — overlines, swatch captions, dense mono tags. Below text-xs." },
    { name: "--text-xs", label: "Extra Small", value: "0.75rem", lineHeight: "1rem", desc: "Captions, overlines, dense metadata." },
    { name: "--text-sm", label: "Small", value: "0.875rem", lineHeight: "1.25rem", desc: "Secondary text, labels, table cells." },
    { name: "--text-base", label: "Base", value: "1rem", lineHeight: "1.5rem", desc: "Default body copy." },
    { name: "--text-lg", label: "Large", value: "1.125rem", lineHeight: "1.75rem", desc: "Lead paragraphs, card titles." },
    { name: "--text-xl", label: "Extra Large", value: "1.25rem", lineHeight: "1.75rem", desc: "Subheadings." },
    { name: "--text-2xl", label: "2XL", value: "1.5rem", lineHeight: "2rem", desc: "Section headings." },
    { name: "--text-3xl", label: "3XL", value: "1.875rem", lineHeight: "2.25rem", desc: "Page titles." },
    { name: "--text-4xl", label: "4XL", value: "2.25rem", lineHeight: "2.5rem", desc: "Major headings." },
    { name: "--text-5xl", label: "5XL", value: "3rem", lineHeight: "1", desc: "Large display headings." },
    { name: "--text-display", label: "Display", value: "3.75rem", lineHeight: "1.05", tracking: "-0.02em", weight: "600", desc: "Hero / landing display type." },
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
   NORTHWIND DESIGN TOKENS
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
