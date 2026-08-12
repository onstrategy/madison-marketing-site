import { ContentPage } from "../sections/renderer";
import type { NewsArticleDocument } from "./schema";

export function NewsArticlePage({ article }: { article: NewsArticleDocument }) {
  return (
    <ContentPage
      sections={article.sections}
      source={article.id}
      activeNavItem="newsroom"
    />
  );
}
