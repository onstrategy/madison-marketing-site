import { resolveNewsAsset } from "./assets";
import { findNewsArticleByPath } from "./collection";

export function newsArticleRouteData(pathname: string, origin: string) {
  const article = findNewsArticleByPath(pathname);
  if (!article) return null;

  const ogImage = article.metadata.ogImageAsset
    ? new URL(resolveNewsAsset(article.metadata.ogImageAsset), origin).toString()
    : undefined;

  return { article, ogImage };
}
