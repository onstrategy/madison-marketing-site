import { describe, expect, it } from "vitest";
import { clientStories } from "../content/client-stories/collection";
import { newsArticles } from "../content/news/collection";
import { responsibleAiResources } from "../content/responsible-ai/collection";
import { webinars } from "../content/webinars/collection";

const GENERIC_DESCRIPTION =
  "The Madison AI™ platform unites your agency’s scattered data and systems into knowledge AI to research anything and draft staff reports/memos in minutes.";

const CONTENT_PAGES = [
  ...clientStories,
  ...newsArticles,
  ...responsibleAiResources,
  ...webinars,
];

describe("content page SEO descriptions", () => {
  it("does not reuse the generic site description", () => {
    expect(
      CONTENT_PAGES.filter(
        ({ metadata }) => metadata.description === GENERIC_DESCRIPTION,
      ).map(({ path }) => path),
    ).toEqual([]);
  });

  it("uses a unique description for every content page", () => {
    const pathsByDescription = new Map<string, string[]>();

    for (const { metadata, path } of CONTENT_PAGES) {
      const paths = pathsByDescription.get(metadata.description) ?? [];
      paths.push(path);
      pathsByDescription.set(metadata.description, paths);
    }

    const duplicates = [...pathsByDescription.entries()]
      .filter(([, paths]) => paths.length > 1)
      .map(([description, paths]) => ({ description, paths }));

    expect(duplicates).toEqual([]);
  });
});
