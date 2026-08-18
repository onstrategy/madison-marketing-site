import { describe, expect, it } from "vitest";
import cityOfCorona from "../content/client-stories/entries/city-of-corona.json";
import grandPrairie from "../content/client-stories/entries/welcoming-the-city-of-grand-prairie-texas.json";
import indianWells from "../content/client-stories/entries/indian-wells-implements-madison-ai.json";
import losAltosHills from "../content/client-stories/entries/los-altos-hills.json";
import { clientStories } from "../content/client-stories/collection";
import { buildClientStoryCollection } from "../content/client-stories/schema";
import { parseProps as parseClientStoryAnnouncementBodyProps } from "../content/sections/client-story-announcement-body";
import { parseProps as parseClientStoryChallengeProps } from "../content/sections/client-story-challenge";
import { parseProps as parseClientStoryImpactDownloadProps } from "../content/sections/client-story-impact-download";
import { parseProps as parseClientStoryNarrativeProps } from "../content/sections/client-story-narrative";
import { parseProps as parseClientStorySolutionProps } from "../content/sections/client-story-solution-timeline";

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

    it("publishes Los Altos Hills at the source site's canonical path", () => {
      const result = buildClientStoryCollection([
        { source: "city-of-corona.json", value: cityOfCorona },
        { source: "los-altos-hills.json", value: losAltosHills },
      ]);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.map(({ id, path }) => ({ id, path }))).toEqual([
          {
            id: "city-of-corona",
            path: "/client-stories/city-of-corona/",
          },
          {
            id: "los-altos-hills",
            path: "/client-stories/los-altos-hills/",
          },
        ]);
      }
    });

    it("publishes every captured story at its exact source pathname", () => {
      expect(clientStories.map(({ id, path }) => ({ id, path }))).toEqual([
        {
          id: "city-of-corona",
          path: "/client-stories/city-of-corona/",
        },
        {
          id: "newark-california-kicks-off-madison-ai",
          path: "/newark-california-kicks-off-madison-ai/",
        },
        {
          id: "los-altos-hills",
          path: "/client-stories/los-altos-hills/",
        },
        {
          id: "wrcog-client-story",
          path: "/client-stories/wrcog-client-story/",
        },
        {
          id: "indian-wells-implements-madison-ai",
          path: "/indian-wells-implements-madison-ai/",
        },
        {
          id: "welcoming-the-city-of-grand-prairie-texas",
          path: "/welcoming-the-city-of-grand-prairie-texas/",
        },
        {
          id: "carson-city-client-story",
          path: "/client-stories/carson-city-client-story/",
        },
        {
          id: "washoe-county",
          path: "/client-stories/washoe-county/",
        },
        {
          id: "lvmwd",
          path: "/client-stories/lvmwd/",
        },
        {
          id: "madison-ai-for-the-city-of-castle-pines",
          path: "/madison-ai-for-the-city-of-castle-pines/",
        },
        {
          id: "herriman-city-implements-madison-ai",
          path: "/herriman-city-implements-madison-ai/",
        },
        {
          id: "town-of-fort-myers-beach-taps-madison-ai",
          path: "/town-of-fort-myers-beach-taps-madison-ai/",
        },
        {
          id: "cooper-city-launches-pilot-program",
          path: "/cooper-city-launches-pilot-program/",
        },
        {
          id: "culver-city-partners-with-madison-ai",
          path: "/culver-city-partners-with-madison-ai/",
        },
        {
          id: "newport-beach-pilots-ai-assistant",
          path: "/newport-beach-pilots-ai-assistant/",
        },
        {
          id: "city-of-dublin-launches-madison-ai",
          path: "/city-of-dublin-launches-madison-ai/",
        },
        {
          id: "the-city-of-aspen-co-taps-madison-ai",
          path: "/the-city-of-aspen-co-taps-madison-ai/",
        },
        {
          id: "milpitas-pilot",
          path: "/milpitas-pilot/",
        },
        {
          id: "chanhassen-success-story",
          path: "/chanhassen-success-story/",
        },
        {
          id: "addison-success-story",
          path: "/addison-success-story/",
        },
      ]);

      for (const story of clientStories) {
        const sourcePath = new URL(story.sourceUrl).pathname.replace(
          /\/?$/,
          "/",
        );
        expect(story.path).toBe(sourcePath);
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

    it("preserves the Los Altos Hills narrative in its authored position", () => {
      const result = buildClientStoryCollection([
        { source: "los-altos-hills.json", value: losAltosHills },
      ]);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[0]?.sections.map(({ type }) => type)).toEqual([
          "client-story-hero-intro",
          "client-story-narrative",
          "client-story-quote-stats",
          "client-story-challenge",
          "client-story-solution-timeline",
          "client-story-impact-download",
          "client-logos",
          "client-story-cta",
        ]);
      }
    });

    it("keeps deployment announcements on the shorter article-shaped template", () => {
      const result = buildClientStoryCollection([
        { source: "indian-wells.json", value: indianWells },
        { source: "grand-prairie.json", value: grandPrairie },
      ]);

      expect(result.ok).toBe(true);
      if (result.ok) {
        for (const story of result.value) {
          expect(story.sections.map(({ type }) => type)).toEqual([
            "client-story-announcement-hero",
            "client-story-announcement-body",
            "client-logos",
            "client-story-cta",
          ]);
        }
      }
    });

    it("requires intrinsic logo dimensions", () => {
      const logo = Object.fromEntries(
        Object.entries(cityOfCorona.card.logo).filter(
          ([key]) => key !== "width",
        ),
      );
      const card = { ...cityOfCorona.card, logo };
      const result = buildClientStoryCollection([
        {
          source: "missing-logo-width.json",
          value: withOverride({ card }),
        },
      ]);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.join("\n")).toContain("card.logo.width");
      }
    });
  });

  describe("section prop validation", () => {
    it("accepts rich success-story body blocks", () => {
      expect(() =>
        parseClientStoryAnnouncementBodyProps({
          blocks: [
            {
              type: "image",
              photo: {
                asset: "chanhassen-workflows.jpg",
                alt: "Workflow diagram",
                width: 1920,
                height: 955,
              },
            },
            {
              type: "bullets",
              title: "The old way",
              items: ["Search files manually"],
            },
            {
              type: "stats",
              title: "Results",
              items: [{ value: "158+", label: "Hours saved" }],
            },
          ],
        }),
      ).not.toThrow();
    });

    it("accepts a local PDF asset for a client-story download", () => {
      expect(() =>
        parseClientStoryImpactDownloadProps({
          impact: {
            eyebrow: "The impact",
            title: "Measurable results",
            paragraphs: ["The story's outcome."],
          },
          download: {
            title: "Download the case study",
            asset: "city-of-corona-one-page.pdf",
            form: "book-a-demo",
          },
        }),
      ).not.toThrow();
    });

    it("rejects a remote or non-PDF client-story download", () => {
      expect(() =>
        parseClientStoryImpactDownloadProps({
          impact: {
            eyebrow: "The impact",
            title: "Measurable results",
            paragraphs: ["The story's outcome."],
          },
          download: {
            title: "Download the case study",
            asset: "https://example.com/case-study.pdf",
            form: "book-a-demo",
          },
        }),
      ).toThrow();
    });

    it("rejects an unregistered HubSpot form for a client-story download", () => {
      expect(() =>
        parseClientStoryImpactDownloadProps({
          impact: {
            eyebrow: "The impact",
            title: "Measurable results",
            paragraphs: ["The story's outcome."],
          },
          download: {
            title: "Download the case study",
            asset: "city-of-corona-one-page.pdf",
            form: "unregistered-form",
          },
        }),
      ).toThrow(/registered HubSpot form name.*book-a-demo/);
    });

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

    it("rejects an empty client-story narrative", () => {
      expect(() =>
        parseClientStoryNarrativeProps({
          title: "Search for a solution",
          paragraphs: [],
        }),
      ).toThrow();
    });

    it("accepts solution phases without invented timeline labels", () => {
      expect(() =>
        parseClientStorySolutionProps({
          eyebrow: "The solution",
          title: "A solution",
          phases: [
            {
              title: "Implementation",
              description: "Implementation details",
            },
          ],
        }),
      ).not.toThrow();
    });
  });
});
