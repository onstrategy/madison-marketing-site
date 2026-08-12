import {
  buildNewsArticleCollection,
  type NewsArticleDocument,
} from "./schema";

const documents = import.meta.glob<unknown>("./entries/*.json", {
  eager: true,
  import: "default",
});

const result = buildNewsArticleCollection(
  Object.entries(documents).map(([source, value]) => ({ source, value })),
);

if (!result.ok) {
  throw new Error(
    `Invalid news collection:\n${result.errors.map((error) => `- ${error}`).join("\n")}`,
  );
}

export const newsArticles: NewsArticleDocument[] = result.value;

function normalizedPath(path: string): string {
  if (path === "/") return path;
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

export function findNewsArticleByPath(
  path: string,
): NewsArticleDocument | undefined {
  const normalized = normalizedPath(path);
  return newsArticles.find((article) => article.path === normalized);
}

export function requireNewsArticle(id: string): NewsArticleDocument {
  const article = newsArticles.find((entry) => entry.id === id);
  if (!article) {
    throw new Error(`Missing news article entry: ${id}`);
  }
  return article;
}
