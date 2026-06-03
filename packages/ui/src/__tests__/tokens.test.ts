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
