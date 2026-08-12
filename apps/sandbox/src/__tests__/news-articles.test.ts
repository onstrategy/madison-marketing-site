import { describe, expect, it } from "vitest";
import publicRecordsCrisis from "../content/news/entries/public-records-crisis.json";
import { findNewsArticleByPath } from "../content/news/collection";
import { buildNewsArticleCollection } from "../content/news/schema";
import { parseProps as parseArticleCopyProps } from "../content/sections/article-copy";

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
