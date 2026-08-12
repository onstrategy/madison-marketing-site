import { describe, expect, it } from "vitest";
import cityOfCorona from "../content/client-stories/entries/city-of-corona.json";
import { buildClientStoryCollection } from "../content/client-stories/schema";
import { parseProps as parseClientStoryChallengeProps } from "../content/sections/client-story-challenge";

function withOverride(
  override: Record<string, unknown>,
): Record<string, unknown> {
  return { ...cityOfCorona, ...override };
}

describe("client story collection", () => {
  describe("buildClientStoryCollection", () => {
    it("preserves the explicit public path from a valid document", () => {
      const result = buildClientStoryCollection([
        { source: "city-of-corona.json", value: cityOfCorona },
      ]);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[0]?.path).toBe(
          "/client-stories/city-of-corona/",
        );
      }
    });

    it("rejects a path without the public trailing slash", () => {
      const result = buildClientStoryCollection([
        {
          source: "invalid-path.json",
          value: withOverride({
            path: "/client-stories/city-of-corona",
          }),
        },
      ]);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.join("\n")).toContain("path:");
      }
    });

    it("rejects duplicate public paths", () => {
      const result = buildClientStoryCollection([
        { source: "first.json", value: cityOfCorona },
        {
          source: "second.json",
          value: withOverride({ id: "another-corona-story" }),
        },
      ]);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.join("\n")).toContain("duplicate public path");
      }
    });

    it("identifies both source files when ids are duplicated", () => {
      const result = buildClientStoryCollection([
        { source: "first.json", value: cityOfCorona },
        {
          source: "second.json",
          value: withOverride({ path: "/client-stories/another-corona-story/" }),
        },
      ]);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.join("\n")).toContain(
          "duplicate client story id in first.json and second.json",
        );
      }
    });

    it("preserves the authored section order", () => {
      const result = buildClientStoryCollection([
        { source: "city-of-corona.json", value: cityOfCorona },
      ]);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[0]?.sections.map(({ type }) => type)).toEqual([
          "client-story-hero-intro",
          "client-story-quote-stats",
          "client-story-challenge",
          "client-story-solution-timeline",
          "client-story-impact-download",
          "client-logos",
          "client-story-cta",
        ]);
      }
    });

    it("requires intrinsic logo dimensions", () => {
      const card = Object.fromEntries(
        Object.entries(cityOfCorona.card).filter(
          ([key]) => key !== "logoWidth",
        ),
      );
      const result = buildClientStoryCollection([
        {
          source: "missing-logo-width.json",
          value: withOverride({ card }),
        },
      ]);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.join("\n")).toContain("card.logoWidth");
      }
    });
  });

  describe("section prop validation", () => {
    it("rejects unsupported challenge icon names", () => {
      expect(() =>
        parseClientStoryChallengeProps({
          eyebrow: "The challenge",
          title: "A challenge",
          intro: "Challenge context",
          items: [
            {
              icon: "unsupported-icon",
              title: "Challenge item",
              description: "Challenge description",
            },
          ],
        }),
      ).toThrow();
    });
  });
});
