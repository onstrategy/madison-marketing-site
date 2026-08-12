import { describe, expect, it } from "vitest";
import cityOfCorona from "../content/client-stories/entries/city-of-corona.json";
import { buildClientStoryCollection } from "../content/client-stories/schema";

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

    it("rejects unsupported template icon names", () => {
      const content = {
        ...cityOfCorona.content,
        challenge: {
          ...cityOfCorona.content.challenge,
          items: [
            {
              ...cityOfCorona.content.challenge.items[0],
              icon: "unsupported-icon",
            },
          ],
        },
      };
      const result = buildClientStoryCollection([
        {
          source: "invalid-icon.json",
          value: withOverride({ content }),
        },
      ]);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.join("\n")).toContain(
          "content.challenge.items.0.icon",
        );
      }
    });

    it("requires intrinsic logo dimensions", () => {
      const hero = Object.fromEntries(
        Object.entries(cityOfCorona.content.hero).filter(
          ([key]) => key !== "logoWidth",
        ),
      );
      const result = buildClientStoryCollection([
        {
          source: "missing-logo-width.json",
          value: withOverride({
            content: { ...cityOfCorona.content, hero },
          }),
        },
      ]);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.join("\n")).toContain(
          "content.hero.logoWidth",
        );
      }
    });
  });
});
