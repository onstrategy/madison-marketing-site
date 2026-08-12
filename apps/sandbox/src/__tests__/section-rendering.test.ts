import { describe, expect, it } from "vitest";
import {
  formatSectionFailure,
  sectionFailureMode,
} from "../content/sections/renderer";
import { sectionTypeFromModulePath } from "../content/sections/registry";

describe("content section rendering", () => {
  describe("sectionTypeFromModulePath", () => {
    it("derives the section type from its convention-based folder", () => {
      expect(
        sectionTypeFromModulePath("./client-story-hero-intro/index.tsx"),
      ).toBe("client-story-hero-intro");
    });

    it("rejects a module outside the section folder convention", () => {
      expect(() =>
        sectionTypeFromModulePath("./client-story-hero-intro.tsx"),
      ).toThrow("Invalid section module path");
    });
  });

  describe("sectionFailureMode", () => {
    it("renders a visible placeholder during development", () => {
      expect(
        sectionFailureMode({ development: true, browser: true }),
      ).toBe("placeholder");
    });

    it("fails production prerendering", () => {
      expect(
        sectionFailureMode({ development: false, browser: false }),
      ).toBe("throw");
    });

    it("omits an unreachable failure in an already-built client", () => {
      expect(
        sectionFailureMode({ development: false, browser: true }),
      ).toBe("omit");
    });
  });

  describe("formatSectionFailure", () => {
    it("includes the source, type, and one-based position", () => {
      expect(
        formatSectionFailure({
          source: "city-of-corona.json",
          type: "missing-section",
          position: 2,
        }),
      ).toBe(
        'city-of-corona.json: section 3 ("missing-section"): unsupported section type',
      );
    });
  });
});
