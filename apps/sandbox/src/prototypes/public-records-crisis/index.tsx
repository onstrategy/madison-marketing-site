import { requireNewsArticle } from "../../content/news/collection";
import { NewsArticlePage } from "../../content/news/page";

const article = requireNewsArticle("public-records-crisis");

export default function PublicRecordsCrisisPrototype() {
  return <NewsArticlePage article={article} />;
}
