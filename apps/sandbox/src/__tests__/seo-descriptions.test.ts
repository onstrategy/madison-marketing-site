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

/**
 * Copy that means "nobody wrote this yet". Distinct from the generic-description
 * and uniqueness guards below: placeholder text is *unique* and *not* the site
 * default, so it sails past both — which is how a lorem-ipsum paragraph shipped
 * as a live <meta name="description"> on /resources/the-free-miro-template-… .
 *
 * Matched as substrings against the raw source capture's wording rather than
 * whole strings, so a re-paste that differs by a character still trips it.
 */
const PLACEHOLDER_PATTERNS: { name: string; pattern: RegExp }[] = [
  {
    name: "lorem-ipsum marketing boilerplate",
    pattern: /organically grow the holistic world view/i,
  },
  { name: "lorem ipsum", pattern: /lorem ipsum/i },
  /*
   * A bare lowercase "x" standing in for a number the author never filled in
   * ("provide you with x real-world examples"). The word boundaries keep real
   * usages safe: "10x" and "Gen X" don't match.
   */
  { name: "unfilled numeric placeholder", pattern: /\bx\b/ },
];

/**
 * The prose field on a card, whatever this collection happens to call it —
 * Responsible AI, news and webinars use `description`, client stories use
 * `summary`. Read structurally rather than per-collection so a new collection
 * is covered the day it lands.
 */
const CARD_TEXT_FIELDS = ["description", "summary"] as const;

function cardText(card: unknown, field: string): string | undefined {
  if (typeof card !== "object" || card === null) return undefined;
  if (!(field in card)) return undefined;
  const value = card[field as keyof typeof card];
  return typeof value === "string" ? value : undefined;
}

/** Every description a visitor or crawler can actually read, with its source. */
function describedStrings(): { path: string; field: string; text: string }[] {
  return CONTENT_PAGES.flatMap(({ path, metadata, card }) => [
    { path, field: "metadata.description", text: metadata.description },
    // Card copy renders in the "Similar resources" rails and on index pages, so
    // it is just as public as the meta tag — and was the half this file missed.
    ...CARD_TEXT_FIELDS.flatMap((field) => {
      const text = cardText(card, field);
      return text ? [{ path, field: `card.${field}`, text }] : [];
    }),
  ]);
}

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

  it("ships no placeholder copy in any public description", () => {
    const offenders = describedStrings().flatMap(({ path, field, text }) =>
      PLACEHOLDER_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(
        ({ name }) => ({ path, field, placeholder: name }),
      ),
    );

    expect(offenders).toEqual([]);
  });
});
