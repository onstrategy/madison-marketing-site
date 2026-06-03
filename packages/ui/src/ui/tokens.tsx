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
// App Customization Guide
// -----------------------
// - Brand tokens are DEFAULT NEUTRAL values. Each app overrides --brand-* in
//   its own CSS to match its identity (e.g. violet, blue).
// - Semantic tokens (success, error, warning, info) are CONSTANT across apps —
//   they signal status only, never branding.
// - Background, border, and typography tokens can also be overridden per-app
//   if the default neutral palette doesn't fit.
//
// Example override in your app's CSS (HSL channels):
//   :root {
//     --brand-primary: 255 70% 55%;
//     --brand-foreground: 0 0% 100%;
//     --brand-subtle: 255 80% 97%;
//   }

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

export interface TokenDictionary {
  backgrounds: TokenDefinition[];
  borders: TokenDefinition[];
  typography: TokenDefinition[];
  brand: TokenDefinition[];
  semantics: SemanticToken[];
  globals: GlobalToken[];
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
    { name: "--radius", label: "Global Radius", value: "0.375rem", desc: "Standard border radius (md)" },
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
  css += `}`;
  return css;
}
