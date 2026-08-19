import { describe, expect, it } from "vitest";
import erpDataThirdline from "../content/webinars/entries/erp-data-thirdline.json";
import sourceManifest from "../content/webinars/source-data/manifest.json";
import {
  findWebinarByPath,
  webinars,
} from "../content/webinars/collection";
import { buildWebinarCollection } from "../content/webinars/schema";
import { parseProps as parseWebinarFullSessionProps } from "../content/sections/webinar-full-session";
import { parseProps as parseWebinarSegmentProps } from "../content/sections/webinar-segment";
import { sectionRegistry } from "../content/sections/registry";

const EXPECTED_WEBINAR_PATHS = [
  "/erp-data-thirdline/",
  "/director-of-ai-assistant/",
  "/acfr-and-gfoa/",
  "/city-of-corona-procurement/",
  "/ai-everyones-talking-about/",
  "/valley-water-ai-in-action/",
  "/chanhassen-ai-in-action/",
  "/rtc-ai-in-action/",
  "/more-of-the-work-more-accurately/",
  "/planning-work-ai-in-action/",
  "/washoe-county-ai-in-action/",
  "/flashvote-ai-in-action/",
  "/wrcog-ai-in-action/",
];

function withOverride(
  override: Record<string, unknown>,
): Record<string, unknown> {
  return { ...erpDataThirdline, ...override };
}

describe("webinar collection", () => {
  it("exposes every live AI in Action webinar at its canonical route", () => {
    expect(webinars.map(({ path }) => path)).toEqual(EXPECTED_WEBINAR_PATHS);
    for (const path of EXPECTED_WEBINAR_PATHS) {
      expect(findWebinarByPath(path)).toBeDefined();
      expect(findWebinarByPath(path.replace(/\/$/, ""))).toBeDefined();
    }
  });

  it("uses only registered section types", () => {
    const sectionTypes = webinars.flatMap(({ sections }) =>
      sections.map(({ type }) => type),
    );

    expect(sectionTypes.every((type) => sectionRegistry.has(type))).toBe(true);
  });

  it("parses every authored section against its registered contract", () => {
    for (const webinar of webinars) {
      for (const section of webinar.sections) {
        const definition = sectionRegistry.get(section.type);
        expect(definition).toBeDefined();
        if (!definition) {
          throw new Error(`Missing section definition: ${section.type}`);
        }
        expect(() => definition.parseProps(section.props)).not.toThrow();
      }
    }
  });

  it("keeps the runtime collection aligned with the neutral source capture", () => {
    expect(
      webinars.map(({ id, path, sourceUrl }) => ({ id, path, sourceUrl })),
    ).toEqual(
      sourceManifest.items.map(({ id, path, sourceUrl }) => ({
        id,
        path,
        sourceUrl,
      })),
    );
  });

  it("requires a flat canonical route", () => {
    const result = buildWebinarCollection([
      {
        source: "nested.json",
        value: withOverride({ path: "/resources/erp-data-thirdline/" }),
      },
    ]);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join("\n")).toContain("path:");
    }
  });

  it("rejects duplicate webinar routes", () => {
    const result = buildWebinarCollection([
      { source: "first.json", value: erpDataThirdline },
      {
        source: "second.json",
        value: withOverride({ id: "another-webinar" }),
      },
    ]);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join("\n")).toContain("duplicate public path");
    }
  });
});

describe("webinar section validation", () => {
  it("accepts a segment with copy, a quote, and a Wistia clip", () => {
    const parsed = parseWebinarSegmentProps({
      heading: "A real workflow",
      paragraphs: ["The workflow starts with trusted data."],
      quotes: [{ quote: "This saved us time.", attribution: "A city leader" }],
      videos: [{ title: "Watch the segment", wistiaId: "abc123" }],
    });

    expect(parsed.heading).toBe("A real workflow");
    expect(parsed.quotes).toHaveLength(1);
    expect(parsed.videos).toHaveLength(1);
  });

  it("rejects an unsafe Wistia identifier", () => {
    expect(() =>
      parseWebinarFullSessionProps({
        heading: "Watch the full webinar",
        videoTitle: "Full session",
        wistiaId: "../unsafe",
      }),
    ).toThrow();
  });
});
