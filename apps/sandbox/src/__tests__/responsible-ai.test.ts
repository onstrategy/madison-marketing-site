import { describe, expect, it } from "vitest";
import aiGovernanceBlueprint from "../content/responsible-ai/entries/ai-governance-blueprint.json";
import sourceManifest from "../content/responsible-ai/source-data/manifest.json";
import {
  findResponsibleAiByPath,
  responsibleAiResources,
} from "../content/responsible-ai/collection";
import { resolveResponsibleAiAsset } from "../content/responsible-ai/assets";
import { buildResponsibleAiCollection } from "../content/responsible-ai/schema";
import { parseProps as parseResourceContentProps } from "../content/sections/resource-content";
import { sectionRegistry } from "../content/sections/registry";

const EXPECTED_RESPONSIBLE_AI_PATHS = [
  "/resources/ai-governance-blueprint/",
  "/resources/how-to-develop-your-governments-ai-guiding-principles/",
  "/resources/how-to-select-your-ai-governance-structure/",
  "/resources/worksheets-to-develop-your-ai-guiding-principles/",
  "/resources/use-this-miro-template-to-choose-ai-governance-structures-in-your-government/",
  "/resources/the-free-miro-template-to-build-your-ai-governance-policy/",
  "/resources/ai-governance-policy-examples/",
];

function withOverride(
  override: Record<string, unknown>,
): Record<string, unknown> {
  return { ...aiGovernanceBlueprint, ...override };
}

describe("Responsible AI collection", () => {
  it("exposes every live Responsible AI resource at its canonical route", () => {
    expect(responsibleAiResources.map(({ path }) => path)).toEqual(
      EXPECTED_RESPONSIBLE_AI_PATHS,
    );
    for (const path of EXPECTED_RESPONSIBLE_AI_PATHS) {
      expect(findResponsibleAiByPath(path)).toBeDefined();
      expect(findResponsibleAiByPath(path.replace(/\/$/, ""))).toBeDefined();
    }
  });

  it("uses only registered section types with valid props", () => {
    for (const resource of responsibleAiResources) {
      for (const section of resource.sections) {
        const definition = sectionRegistry.get(section.type);
        expect(definition).toBeDefined();
        if (!definition) {
          throw new Error(`Missing section definition: ${section.type}`);
        }
        expect(() => definition.parseProps(section.props)).not.toThrow();
      }
    }
  });

  it("resolves every locally referenced card and content image", () => {
    for (const resource of responsibleAiResources) {
      expect(() =>
        resolveResponsibleAiAsset(resource.card.imageAsset),
      ).not.toThrow();

      for (const section of resource.sections) {
        if (section.type !== "resource-content") continue;
        const parsed = parseResourceContentProps(section.props);
        for (const block of parsed.blocks) {
          if (block.type === "image") {
            expect(() => resolveResponsibleAiAsset(block.asset)).not.toThrow();
          }
        }
      }
    }
  });

  it("keeps the runtime collection aligned with the neutral source capture", () => {
    expect(
      responsibleAiResources.map(({ id, path, sourceUrl }) => ({
        id,
        path,
        sourceUrl,
      })),
    ).toEqual(
      sourceManifest.entries.map(({ id, path, sourceUrl }) => ({
        id,
        path,
        sourceUrl,
      })),
    );
  });

  it("requires a canonical nested resource route", () => {
    const result = buildResponsibleAiCollection([
      {
        source: "flat.json",
        value: withOverride({ path: "/ai-governance-blueprint/" }),
      },
    ]);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join("\n")).toContain("path:");
    }
  });

  it("rejects duplicate resource routes", () => {
    const result = buildResponsibleAiCollection([
      { source: "first.json", value: aiGovernanceBlueprint },
      {
        source: "second.json",
        value: withOverride({ id: "another-resource" }),
      },
    ]);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join("\n")).toContain("duplicate public path");
    }
  });
});

describe("Responsible AI rich content validation", () => {
  it("accepts linked copy, lists, imagery, video, and quotes", () => {
    const parsed = parseResourceContentProps({
      blocks: [
        {
          type: "paragraph",
          content: [
            "Read the ",
            { type: "link", text: "guidance", href: "https://example.com" },
            ".",
          ],
        },
        { type: "list", style: "unordered", items: [["One action"]] },
        { type: "image", asset: "cover-blueprint.jpg", alt: "Blueprint" },
        {
          type: "video",
          provider: "youtube",
          videoId: "dL78MNdziXg",
          title: "Governance overview",
        },
        { type: "quote", content: ["Keep people accountable."] },
      ],
    });

    expect(parsed.blocks).toHaveLength(5);
  });

  it("rejects unsafe links and video identifiers", () => {
    expect(() =>
      parseResourceContentProps({
        blocks: [
          {
            type: "paragraph",
            content: [{ type: "link", text: "unsafe", href: "javascript:alert(1)" }],
          },
        ],
      }),
    ).toThrow();

    expect(() =>
      parseResourceContentProps({
        blocks: [
          {
            type: "video",
            provider: "youtube",
            videoId: "../unsafe",
            title: "Unsafe video",
          },
        ],
      }),
    ).toThrow();
  });
});
