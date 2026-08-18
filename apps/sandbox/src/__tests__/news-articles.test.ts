import { describe, expect, it } from "vitest";
import publicRecordsCrisis from "../content/news/entries/public-records-crisis.json";
import {
  findNewsArticleByPath,
  newsArticles,
} from "../content/news/collection";
import { buildNewsArticleCollection } from "../content/news/schema";
import { parseProps as parseArticleCopyProps } from "../content/sections/article-copy";
import { sectionRegistry } from "../content/sections/registry";

const EXPECTED_ARTICLE_PATHS = [
  "/peter-pirnejad/",
  "/public-records-crisis/",
  "/welcome-reid-weber/",
  "/tom-spangler/",
  "/madison-ai-growth-momentum/",
  "/mark-wheeler/",
  "/dana-searcy/",
  "/most-innovative-solution/",
];

function withOverride(
  override: Record<string, unknown>,
): Record<string, unknown> {
  return { ...publicRecordsCrisis, ...override };
}

describe("news article collection", () => {
  it("preserves the article's flat public path", () => {
    const result = buildNewsArticleCollection([
      { source: "public-records-crisis.json", value: publicRecordsCrisis },
    ]);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value[0]?.path).toBe("/public-records-crisis/");
    }
  });

  it("finds the article with or without a trailing slash", () => {
    expect(findNewsArticleByPath("/public-records-crisis")?.id).toBe(
      "public-records-crisis",
    );
    expect(findNewsArticleByPath("/public-records-crisis/")?.id).toBe(
      "public-records-crisis",
    );
  });

  it("exposes every JSON-driven Newsroom article as a local route", () => {
    expect(newsArticles.map(({ path }) => path)).toEqual(
      EXPECTED_ARTICLE_PATHS,
    );
    for (const path of EXPECTED_ARTICLE_PATHS) {
      expect(findNewsArticleByPath(path)).toBeDefined();
    }
  });

  it("uses only registered section types across the Newsroom collection", () => {
    const sectionTypes = newsArticles.flatMap(({ sections }) =>
      sections.map(({ type }) => type),
    );

    expect(sectionTypes.every((type) => sectionRegistry.has(type))).toBe(true);
  });

  it("rejects nested Newsroom paths", () => {
    const result = buildNewsArticleCollection([
      {
        source: "nested.json",
        value: withOverride({ path: "/updates/public-records-crisis/" }),
      },
    ]);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join("\n")).toContain("path:");
    }
  });

  it("rejects duplicate public paths", () => {
    const result = buildNewsArticleCollection([
      { source: "first.json", value: publicRecordsCrisis },
      {
        source: "second.json",
        value: withOverride({ id: "another-article" }),
      },
    ]);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join("\n")).toContain("duplicate public path");
    }
  });

  it("preserves the authored section order", () => {
    const result = buildNewsArticleCollection([
      { source: "public-records-crisis.json", value: publicRecordsCrisis },
    ]);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value[0]?.sections.map(({ type }) => type)).toEqual([
        "article-hero-split",
        "article-copy",
        "article-copy",
        "article-copy",
        "article-copy",
        "article-copy",
        "client-logos",
        "news-cta",
      ]);
    }
  });
});

describe("article copy validation", () => {
  it("supports heading-only and paragraph-only announcement sections", () => {
    expect(parseArticleCopyProps({ heading: "A section" })).toEqual({
      variant: "editorial",
      heading: "A section",
      paragraphs: [],
    });
    expect(parseArticleCopyProps({ paragraphs: ["A continuation."] })).toEqual({
      variant: "editorial",
      paragraphs: ["A continuation."],
    });
  });

  it("rejects an empty article copy section", () => {
    expect(() => parseArticleCopyProps({})).toThrow();
  });

  it("rejects unsafe inline link URLs", () => {
    expect(() =>
      parseArticleCopyProps({
        heading: "A section",
        paragraphs: [
          {
            content: [
              {
                type: "link",
                text: "Unsafe link",
                href: "javascript:alert('unsafe')",
              },
            ],
          },
        ],
      }),
    ).toThrow();
  });
});
