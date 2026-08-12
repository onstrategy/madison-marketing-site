import { sitePrototypes, siteSummaries } from "@madison/sandbox/prototypes";
import { NewsArticlePage } from "@madison/sandbox/content/news/page";
import { newsArticleRouteData } from "@madison/sandbox/content/news/server";
import { AppRoutes } from "./App";
import { notFoundMeta, pageMeta } from "./site-meta";
import { siteOrigin } from "./site-origin.server";
import type { Route } from "./+types/framework-route";

function routePath(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

function findPage(pathname: string) {
  const normalizedPath = routePath(pathname);
  return siteSummaries.find(({ slug, path }) =>
    slug === "landing" ? normalizedPath === "/" : path === normalizedPath,
  );
}

export function loader({ request }: Route.LoaderArgs) {
  const pathname = new URL(request.url).pathname;
  const page = findPage(pathname);
  const origin = siteOrigin();
  const articleData = newsArticleRouteData(pathname, origin);
  return {
    page: page ?? null,
    article: articleData?.article ?? null,
    articleOgImage: articleData?.ogImage,
    origin,
  };
}

/**
 * In static SPA development, an arbitrary URL has no generated `.data` file.
 * Known prototypes can request their generated data directly. Dynamic content
 * attempts the same request, then falls back to the local 404 when no generated
 * data file exists.
 */
export async function clientLoader({
  request,
  serverLoader,
}: Route.ClientLoaderArgs) {
  const pathname = new URL(request.url).pathname;
  const page = findPage(pathname);
  if (page) {
    return serverLoader();
  }
  try {
    return await serverLoader();
  } catch {
    return {
      page: null,
      article: null,
      articleOgImage: undefined,
      origin: new URL(request.url).origin,
    };
  }
}
clientLoader.hydrate = true as const;

export function meta({ data: loaderData }: Route.MetaArgs) {
  if (loaderData?.article) {
    const { metadata, path } = loaderData.article;
    return pageMeta(
      { ...metadata, ogImage: loaderData.articleOgImage },
      path,
      loaderData.origin,
    );
  }
  if (!loaderData?.page) return notFoundMeta();
  const canonicalPath =
    loaderData.page.slug === "landing"
      ? "/"
      : `${loaderData.page.path.replace(/\/+$/, "")}/`;
  return pageMeta(loaderData.page, canonicalPath, loaderData.origin);
}

export default function FrameworkRoute({ loaderData }: Route.ComponentProps) {
  if (loaderData.article) {
    return <NewsArticlePage article={loaderData.article} />;
  }
  return <AppRoutes pages={sitePrototypes} />;
}
