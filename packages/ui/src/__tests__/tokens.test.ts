import { describe, it, expect } from "vitest";
import { hexToHslChannels, blendHex } from "../ui/utils";
import { TOKENS } from "../ui/tokens";

describe("hexToHslChannels", () => {
  it("converts pure colors to HSL channels", () => {
    expect(hexToHslChannels("#FFFFFF")).toBe("0 0% 100%");
    expect(hexToHslChannels("#000000")).toBe("0 0% 0%");
    expect(hexToHslChannels("#FF0000")).toBe("0 100% 50%");
    expect(hexToHslChannels("#00FF00")).toBe("120 100% 50%");
    expect(hexToHslChannels("#0000FF")).toBe("240 100% 50%");
  });

  it("supports 3-digit shorthand hex", () => {
    expect(hexToHslChannels("#FFF")).toBe("0 0% 100%");
    expect(hexToHslChannels("#000")).toBe("0 0% 0%");
  });

  it("produces space-separated channels with no commas (native opacity support)", () => {
    const channels = hexToHslChannels("#18181B");
    expect(channels).toMatch(/^\d+ \d+% \d+%$/);
  });
});

describe("blendHex", () => {
  it("returns the foreground at alpha=1", () => {
    expect(blendHex("#FFFFFF", "#000000", 1)).toBe("#ffffff");
  });

  it("returns the background at alpha=0", () => {
    expect(blendHex("#FFFFFF", "#000000", 0)).toBe("#000000");
  });

  it("blends evenly at alpha=0.5", () => {
    expect(blendHex("#000000", "#FFFFFF", 0.5)).toBe("#808080");
  });
});

describe("TOKENS dictionary", () => {
  it("defines exactly four semantic triads, each with base/fg/subtle", () => {
    const ids = TOKENS.semantics.map((s) => s.id);
    expect(ids).toEqual(["success", "error", "warning", "info"]);
    for (const s of TOKENS.semantics) {
      expect(s.base).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(s.fg).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(s.subtleLight).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(s.subtleDark).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("provides light and dark values for every neutral token", () => {
    for (const category of ["backgrounds", "borders", "typography", "brand"] as const) {
      for (const token of TOKENS[category]) {
        expect(token.light).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(token.dark).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    }
  });
});

describe("TOKENS dimensional system", () => {
  // Every group whose tokens are plain { name, value } scale entries.
  const SCALE_GROUPS = [
    "spacing",
    "fontFamilies",
    "lineHeights",
    "fontWeights",
    "letterSpacing",
    "breakpoints",
    "radii",
    "durations",
    "easings",
    "zIndex",
    "interaction",
  ] as const;

  it("defines every dimensional group with at least one token", () => {
    for (const group of SCALE_GROUPS) {
      expect(TOKENS[group].length).toBeGreaterThan(0);
    }
    expect(TOKENS.fontSizes.length).toBeGreaterThan(0);
    expect(TOKENS.shadows.length).toBeGreaterThan(0);
  });

  it("gives every scale token a `--` CSS variable name and a non-empty value", () => {
    for (const group of SCALE_GROUPS) {
      for (const token of TOKENS[group]) {
        expect(token.name.startsWith("--")).toBe(true);
        expect(token.value.length).toBeGreaterThan(0);
      }
    }
  });

  it("pairs every type-scale step with a font-size and a line-height", () => {
    for (const token of TOKENS.fontSizes) {
      expect(token.name.startsWith("--text-")).toBe(true);
      expect(token.value).toMatch(/(rem|px|em)$/);
      expect(token.lineHeight.length).toBeGreaterThan(0);
    }
  });

  // Any step left undeclared silently falls back to Tailwind's own --leading-* default,
  // which is exactly the ungoverned value the token system exists to prevent.
  it("covers Tailwind's whole --leading-* namespace with unitless ratios", () => {
    const names = TOKENS.lineHeights.map((t) => t.name);
    expect(names).toEqual([
      "--leading-tight",
      "--leading-snug",
      "--leading-normal",
      "--leading-relaxed",
      "--leading-loose",
    ]);
    // Unitless, so a line-height scales with whatever font-size it lands on.
    for (const token of TOKENS.lineHeights) {
      expect(token.value).toMatch(/^\d+(\.\d+)?$/);
    }
  });

  it("makes every elevation token mode-aware (distinct light/dark shadows)", () => {
    for (const token of TOKENS.shadows) {
      expect(token.name.startsWith("--shadow-")).toBe(true);
      expect(token.light.length).toBeGreaterThan(0);
      expect(token.dark.length).toBeGreaterThan(0);
      // Dark surfaces need heavier shadows — the pair must not be identical.
      expect(token.light).not.toBe(token.dark);
    }
  });

  it("derives the radius scale from the --radius base", () => {
    const names = TOKENS.radii.map((t) => t.name);
    expect(names).toContain("--radius-md");
    const md = TOKENS.radii.find((t) => t.name === "--radius-md");
    expect(md?.value).toBe("var(--radius)");
  });

  it("keeps every CSS variable name unique across the whole dictionary", () => {
    const named = [
      ...TOKENS.backgrounds,
      ...TOKENS.borders,
      ...TOKENS.typography,
      ...TOKENS.brand,
      ...TOKENS.globals,
      ...TOKENS.spacing,
      ...TOKENS.fontFamilies,
      ...TOKENS.fontSizes,
      ...TOKENS.lineHeights,
      ...TOKENS.fontWeights,
      ...TOKENS.letterSpacing,
      ...TOKENS.breakpoints,
      ...TOKENS.radii,
      ...TOKENS.shadows,
      ...TOKENS.durations,
      ...TOKENS.easings,
      ...TOKENS.zIndex,
      ...TOKENS.interaction,
    ];
    const names = named.map((t) => t.name);
    const duplicates = names.filter((name, i) => names.indexOf(name) !== i);
    expect(duplicates).toEqual([]);
  });
});
