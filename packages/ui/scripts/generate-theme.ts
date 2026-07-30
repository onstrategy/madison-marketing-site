import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { TOKENS } from "../src/ui/tokens";
import { hexToHslChannels } from "../src/ui/utils";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = scriptPath.includes("bun:")
  ? join(process.cwd(), "scripts")
  : dirname(scriptPath);

/** Strip a known prefix from a token var name (e.g. "--shadow-sm" → "sm"). */
function suffix(name: string, prefix: string): string {
  return name.replace(prefix, "");
}

function generateCSS() {
  let css = `/* ==========================================
    MADISON DESIGN TOKENS
    Generated from tokens.tsx - DO NOT EDIT MANUALLY
    ========================================== */

:root {
`;

  // Globals (the radius base the radius scale derives from)
  for (const t of TOKENS.globals) {
    css += `  ${t.name}: ${t.value};\n`;
  }
  css += `\n`;

  // Light mode colors
  const categories = ["backgrounds", "borders", "typography", "brand"] as const;
  for (const cat of categories) {
    for (const t of TOKENS[cat]) {
      css += `  ${t.name}: ${hexToHslChannels(t.light)};\n`;
    }
  }
  for (const t of TOKENS.semantics) {
    css += `  --semantic-${t.id}: ${hexToHslChannels(t.base)};\n`;
    css += `  --semantic-${t.id}-fg: ${hexToHslChannels(t.fg)};\n`;
    css += `  --semantic-${t.id}-subtle: ${hexToHslChannels(t.subtleLight)};\n`;
  }

  // Mode-aware elevation (light) — referenced by the shadow-* utilities.
  css += `\n  /* Elevation (light) */\n`;
  for (const t of TOKENS.shadows) {
    css += `  --elevation-${suffix(t.name, "--shadow-")}: ${t.light};\n`;
  }

  // Layering + interaction constants (mode-agnostic).
  css += `\n  /* Layering */\n`;
  for (const t of TOKENS.zIndex) {
    css += `  ${t.name}: ${t.value};\n`;
  }
  css += `\n  /* Interaction */\n`;
  for (const t of TOKENS.interaction) {
    css += `  ${t.name}: ${t.value};\n`;
  }

  css += `}

.dark {
`;
  for (const cat of categories) {
    for (const t of TOKENS[cat]) {
      css += `  ${t.name}: ${hexToHslChannels(t.dark)};\n`;
    }
  }
  for (const t of TOKENS.semantics) {
    css += `  --semantic-${t.id}: ${hexToHslChannels(t.base)};\n`;
    css += `  --semantic-${t.id}-fg: ${hexToHslChannels(t.fg)};\n`;
    css += `  --semantic-${t.id}-subtle: ${hexToHslChannels(t.subtleDark)};\n`;
  }
  // Mode-aware elevation (dark) — heavier shadows for dark surfaces.
  css += `\n  /* Elevation (dark) */\n`;
  for (const t of TOKENS.shadows) {
    css += `  --elevation-${suffix(t.name, "--shadow-")}: ${t.dark};\n`;
  }

  // `.light` — the mirror of `.dark`. `:root` already defaults to light values,
  // so this exists purely as a class-scope escape hatch: nested inside a `.dark`
  // ancestor (or a `.dark`-scoped subtree), applying `className="light"` forces
  // that subtree's tokens back to light, the same way `className="dark"` forces
  // a subtree dark inside an otherwise-light page.
  css += `}

.light {
`;
  for (const cat of categories) {
    for (const t of TOKENS[cat]) {
      css += `  ${t.name}: ${hexToHslChannels(t.light)};\n`;
    }
  }
  for (const t of TOKENS.semantics) {
    css += `  --semantic-${t.id}: ${hexToHslChannels(t.base)};\n`;
    css += `  --semantic-${t.id}-fg: ${hexToHslChannels(t.fg)};\n`;
    css += `  --semantic-${t.id}-subtle: ${hexToHslChannels(t.subtleLight)};\n`;
  }
  css += `\n  /* Elevation (light) */\n`;
  for (const t of TOKENS.shadows) {
    css += `  --elevation-${suffix(t.name, "--shadow-")}: ${t.light};\n`;
  }

  // Generate plain CSS utilities
  css += `}

/* ==========================================
   PLAIN CSS UTILITIES (always available)
   ========================================== */

/* Backgrounds */
`;
  for (const t of TOKENS.backgrounds) {
    const name = t.name.replace("--bg-", "");
    css += `.bg-${name} { background-color: hsl(var(--bg-${name})); }\n`;
    css += `.hover\\:bg-${name}:hover { background-color: hsl(var(--bg-${name})); }\n`;
    css += `.focus\\:bg-${name}:focus { background-color: hsl(var(--bg-${name})); }\n`;
  }

  css += `\n/* Borders */
`;
  for (const t of TOKENS.borders) {
    const name = t.name.replace("--border-", "");
    css += `.border-${name} { border-color: hsl(var(--border-${name})); }\n`;
    css += `.hover\\:border-${name}:hover { border-color: hsl(var(--border-${name})); }\n`;
    css += `.focus\\:border-${name}:focus { border-color: hsl(var(--border-${name})); }\n`;
  }

  css += `\n/* Typography */
`;
  for (const t of TOKENS.typography) {
    const name = t.name.replace("--text-", "");
    css += `.text-${name} { color: hsl(var(--text-${name})); }\n`;
    css += `.hover\\:text-${name}:hover { color: hsl(var(--text-${name})); }\n`;
    css += `.focus\\:text-${name}:focus { color: hsl(var(--text-${name})); }\n`;
  }

  css += `\n/* Brand */
`;
  // Brand utilities - emitted once, not per token
  css += `.bg-brand { background-color: hsl(var(--brand-primary)); }\n`;
  css += `.text-brand { color: hsl(var(--brand-primary)); }\n`;
  css += `.hover\\:bg-brand:hover { background-color: hsl(var(--brand-primary)); }\n`;
  css += `.hover\\:text-brand:hover { color: hsl(var(--brand-primary)); }\n`;
  css += `.focus\\:bg-brand:focus { background-color: hsl(var(--brand-primary)); }\n`;
  css += `.focus\\:text-brand:focus { color: hsl(var(--brand-primary)); }\n`;
  css += `.bg-brand-hover { background-color: hsl(var(--brand-primary-hover)); }\n`;
  css += `.hover\\:bg-brand-hover:hover { background-color: hsl(var(--brand-primary-hover)); }\n`;
  css += `.text-brand-accent { color: hsl(var(--brand-accent)); }\n`;
  css += `.hover\\:text-brand-accent:hover { color: hsl(var(--brand-accent)); }\n`;
  css += `.focus\\:text-brand-accent:focus { color: hsl(var(--brand-accent)); }\n`;
  css += `.bg-brand-accent { background-color: hsl(var(--brand-accent)); }\n`;
  css += `.bg-brand-fg { background-color: hsl(var(--brand-foreground)); }\n`;
  css += `.text-brand-fg { color: hsl(var(--brand-foreground)); }\n`;
  css += `.hover\\:bg-brand-fg:hover { background-color: hsl(var(--brand-foreground)); }\n`;
  css += `.hover\\:text-brand-fg:hover { color: hsl(var(--brand-foreground)); }\n`;
  css += `.focus\\:bg-brand-fg:focus { background-color: hsl(var(--brand-foreground)); }\n`;
  css += `.focus\\:text-brand-fg:focus { color: hsl(var(--brand-foreground)); }\n`;
  css += `.bg-brand-subtle { background-color: hsl(var(--brand-subtle)); }\n`;
  css += `.text-brand-subtle { color: hsl(var(--brand-subtle)); }\n`;
  css += `.hover\\:bg-brand-subtle:hover { background-color: hsl(var(--brand-subtle)); }\n`;
  css += `.hover\\:text-brand-subtle:hover { color: hsl(var(--brand-subtle)); }\n`;
  css += `.focus\\:bg-brand-subtle:focus { background-color: hsl(var(--brand-subtle)); }\n`;
  css += `.focus\\:text-brand-subtle:focus { color: hsl(var(--brand-subtle)); }\n`;
  // Palette expansion — two tints, two shades (see tokens.tsx brand array).
  // FILL AND BORDER ONLY, deliberately: no `text-*` utility is emitted for these.
  // The four values are theme-INVARIANT, so as ink each one is unreadable in one
  // of the two themes — measured against the canvas it would sit on:
  //   text-brand-tint       1.27:1 on light   (8.69:1 on dark)
  //   text-brand-tint-pale  1.00:1 on light  (11.10:1 on dark)
  //   text-brand-shade      1.22:1 on dark    (9.07:1 on light)
  //   text-brand-shade-deep 1.17:1 on dark   (12.98:1 on light)
  // Emitting `text-brand-tint-pale` would hand contributors a class that renders
  // literally invisible text on the default canvas. Brand-colored ink has exactly
  // one correct answer in this system: `text-brand-accent`, which is theme-aware
  // and clears AA in both. Add a `text-*` here only if these gain light/dark pairs.
  for (const [suffix, varName] of [
    ["tint", "--brand-tint"],
    ["tint-pale", "--brand-tint-pale"],
    ["shade", "--brand-shade"],
    ["shade-deep", "--brand-shade-deep"],
  ] as const) {
    css += `.bg-brand-${suffix} { background-color: hsl(var(${varName})); }\n`;
    css += `.border-brand-${suffix} { border-color: hsl(var(${varName})); }\n`;
    css += `.hover\\:bg-brand-${suffix}:hover { background-color: hsl(var(${varName})); }\n`;
  }

  css += `\n/* Semantic */
`;
  for (const t of TOKENS.semantics) {
    css += `.bg-${t.id} { background-color: hsl(var(--semantic-${t.id})); }\n`;
    css += `.text-${t.id} { color: hsl(var(--semantic-${t.id})); }\n`;
    css += `.border-${t.id} { border-color: hsl(var(--semantic-${t.id})); }\n`;
    css += `.bg-${t.id}-subtle { background-color: hsl(var(--semantic-${t.id}-subtle)); }\n`;
    css += `.text-${t.id}-fg { color: hsl(var(--semantic-${t.id}-fg)); }\n`;
    css += `.hover\\:bg-${t.id}:hover { background-color: hsl(var(--semantic-${t.id})); }\n`;
    css += `.hover\\:text-${t.id}:hover { color: hsl(var(--semantic-${t.id})); }\n`;
    css += `.hover\\:border-${t.id}:hover { border-color: hsl(var(--semantic-${t.id})); }\n`;
    css += `.focus\\:bg-${t.id}:focus { background-color: hsl(var(--semantic-${t.id})); }\n`;
    css += `.focus\\:text-${t.id}:focus { color: hsl(var(--semantic-${t.id})); }\n`;
    css += `.focus\\:bg-${t.id}-subtle:focus { background-color: hsl(var(--semantic-${t.id}-subtle)); }\n`;
    css += `.focus\\:text-${t.id}-fg:focus { color: hsl(var(--semantic-${t.id}-fg)); }\n`;
    css += `.group:hover .group-hover\\:border-${t.id} { border-color: hsl(var(--semantic-${t.id})); }\n`;
  }

  css += `\n/* Layering — named z-index scale */
`;
  for (const t of TOKENS.zIndex) {
    const name = suffix(t.name, "--z-");
    css += `.z-${name} { z-index: var(${t.name}); }\n`;
  }

  css += `\n/* Radius */
.rounded-md { border-radius: var(--radius); }

/* Browser autofill override */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px hsl(var(--bg-surface)) inset;
  -webkit-text-fill-color: hsl(var(--text-primary));
  transition: background-color 5000s ease-in-out 0s;
}
.dark input:-webkit-autofill,
.dark input:-webkit-autofill:hover,
.dark input:-webkit-autofill:focus,
.dark textarea:-webkit-autofill,
.dark textarea:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px hsl(var(--bg-surface)) inset;
  -webkit-text-fill-color: hsl(var(--text-primary));
}

/* Interactive cursor — Tailwind v4 no longer sets pointer on buttons by default. */
button:not(:disabled),
[role="button"]:not(:disabled),
label[for],
select:not(:disabled),
summary {
  cursor: pointer;
}

/* Respect reduced-motion preferences globally. */
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;

  return css;
}

function generateTailwindTokens() {
  // Block 1: colors + mode-aware shadows registered `inline` (value inlined
  // into utilities, referencing the runtime vars from theme.css).
  let css = `/* ==========================================
    MADISON TAILWIND v4 TOKEN REGISTRATIONS
    Generated from tokens.tsx - DO NOT EDIT MANUALLY
    ========================================== */

@theme inline {
`;

  // Brand tokens
  css += `  --color-brand: hsl(var(--brand-primary));\n`;
  css += `  --color-brand-hover: hsl(var(--brand-primary-hover));\n`;
  css += `  --color-brand-accent: hsl(var(--brand-accent));\n`;
  css += `  --color-brand-fg: hsl(var(--brand-foreground));\n`;
  css += `  --color-brand-subtle: hsl(var(--brand-subtle));\n`;
  css += `  --color-brand-tint: hsl(var(--brand-tint));\n`;
  css += `  --color-brand-tint-pale: hsl(var(--brand-tint-pale));\n`;
  css += `  --color-brand-shade: hsl(var(--brand-shade));\n`;
  css += `  --color-brand-shade-deep: hsl(var(--brand-shade-deep));\n`;

  // Background tokens
  for (const t of TOKENS.backgrounds) {
    const name = t.name.replace("--bg-", "");
    css += `  --color-${name}: hsl(var(${t.name}));\n`;
  }

  // Border tokens
  for (const t of TOKENS.borders) {
    css += `  --color-${t.name.slice(2)}: hsl(var(${t.name}));\n`;
  }

  // Typography tokens
  for (const t of TOKENS.typography) {
    const name = t.name.replace("--text-", "");
    css += `  --color-${name}: hsl(var(${t.name}));\n`;
  }

  // Semantic tokens
  for (const t of TOKENS.semantics) {
    css += `  --color-${t.id}: hsl(var(--semantic-${t.id}));\n`;
    css += `  --color-${t.id}-fg: hsl(var(--semantic-${t.id}-fg));\n`;
    css += `  --color-${t.id}-subtle: hsl(var(--semantic-${t.id}-subtle));\n`;
  }

  // Mode-aware shadows — the utility (shadow-sm) references the themed var.
  css += `\n  /* Elevation (theme-aware via --elevation-* in theme.css) */\n`;
  for (const t of TOKENS.shadows) {
    css += `  ${t.name}: var(--elevation-${suffix(t.name, "--shadow-")});\n`;
  }

  css += `}\n`;

  // Block 2: dimensional constants — a NON-inline @theme block. This both
  // generates the utilities (p-section, text-display, rounded-lg, md:, …) AND
  // emits each var to :root, so `var(--spacing-section)` arbitrary values work.
  css += `\n@theme {\n`;

  css += `  /* Spacing */\n`;
  for (const t of TOKENS.spacing) {
    css += `  ${t.name}: ${t.value};\n`;
  }

  css += `\n  /* Font families */\n`;
  for (const t of TOKENS.fontFamilies) {
    css += `  ${t.name}: ${t.value};\n`;
  }

  css += `\n  /* Type scale (font-size + line-height) */\n`;
  for (const t of TOKENS.fontSizes) {
    css += `  ${t.name}: ${t.value};\n`;
    css += `  ${t.name}--line-height: ${t.lineHeight};\n`;
    if (t.tracking) css += `  ${t.name}--letter-spacing: ${t.tracking};\n`;
    if (t.weight) css += `  ${t.name}--font-weight: ${t.weight};\n`;
  }

  css += `\n  /* Line heights (override scale — the type scale carries the default) */\n`;
  for (const t of TOKENS.lineHeights) {
    css += `  ${t.name}: ${t.value};\n`;
  }

  css += `\n  /* Font weights */\n`;
  for (const t of TOKENS.fontWeights) {
    css += `  ${t.name}: ${t.value};\n`;
  }

  css += `\n  /* Letter spacing */\n`;
  for (const t of TOKENS.letterSpacing) {
    css += `  ${t.name}: ${t.value};\n`;
  }

  css += `\n  /* Breakpoints */\n`;
  for (const t of TOKENS.breakpoints) {
    css += `  ${t.name}: ${t.value};\n`;
  }

  css += `\n  /* Radii (derived from --radius) */\n`;
  for (const t of TOKENS.radii) {
    css += `  ${t.name}: ${t.value};\n`;
  }

  css += `\n  /* Motion */\n`;
  for (const t of TOKENS.easings) {
    css += `  ${t.name}: ${t.value};\n`;
  }
  for (const t of TOKENS.durations) {
    css += `  ${t.name}: ${t.value};\n`;
  }
  // Make every transition-* utility adopt the tokenized base duration + easing.
  css += `  --default-transition-duration: var(--duration-base);\n`;
  css += `  --default-transition-timing-function: var(--ease-standard);\n`;

  css += `}\n`;
  return css;
}

const distDir = join(scriptDir, "..", "dist");
mkdirSync(distDir, { recursive: true });

const css = generateCSS();
writeFileSync(join(distDir, "theme.css"), css);

const tailwindTokens = generateTailwindTokens();
writeFileSync(join(distDir, "tailwind-tokens.css"), tailwindTokens);

console.log("✅ Generated dist/theme.css from tokens.tsx");
console.log("✅ Generated dist/tailwind-tokens.css from tokens.tsx");
