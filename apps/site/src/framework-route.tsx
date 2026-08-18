import { sitePrototypes, siteSummaries } from "@madison/sandbox/prototypes";
import { findClientStoryByPath } from "@madison/sandbox/content/client-stories";
import {
  ClientStoryPage,
  clientStoryMetadata,
} from "@madison/sandbox/content/client-stories/page";
import { NewsArticlePage } from "@madison/sandbox/content/news/page";
import { newsArticleRouteData } from "@madison/sandbox/content/news/server";
import { WebinarPage } from "@madison/sandbox/content/webinars/page";
import { webinarRouteData } from "@madison/sandbox/content/webinars/server";
import { ResponsibleAiPage } from "@madison/sandbox/content/responsible-ai/page";
import { responsibleAiRouteData } from "@madison/sandbox/content/responsible-ai/server";
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
  const story = findClientStoryByPath(pathname);
  const articleData = newsArticleRouteData(pathname, origin);
  const webinarData = webinarRouteData(pathname, origin);
  const responsibleAiData = responsibleAiRouteData(pathname, origin);
  return {
    page: page ?? null,
    story: story ?? null,
    storyMetadata: story ? clientStoryMetadata(story, origin) : null,
    article: articleData?.article ?? null,
    articleOgImage: articleData?.ogImage,
    webinar: webinarData?.webinar ?? null,
    webinarOgImage: webinarData?.ogImage,
    responsibleAiResource: responsibleAiData?.resource ?? null,
    responsibleAiOgImage: responsibleAiData?.ogImage,
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
      story: null,
      storyMetadata: null,
      article: null,
      articleOgImage: undefined,
      webinar: null,
      webinarOgImage: undefined,
      responsibleAiResource: null,
      responsibleAiOgImage: undefined,
      origin: new URL(request.url).origin,
    };
  }
}
clientLoader.hydrate = true as const;

export function meta({ data: loaderData }: Route.MetaArgs) {
  if (loaderData?.story) {
    return pageMeta(
      loaderData.storyMetadata ?? loaderData.story.metadata,
      loaderData.story.path,
      loaderData.origin,
    );
  }
  if (loaderData?.article) {
    const { metadata, path } = loaderData.article;
    return pageMeta(
      { ...metadata, ogImage: loaderData.articleOgImage },
      path,
      loaderData.origin,
    );
  }
  if (loaderData?.webinar) {
    const { metadata, path } = loaderData.webinar;
    return pageMeta(
      { ...metadata, ogImage: loaderData.webinarOgImage },
      path,
      loaderData.origin,
    );
  }
  if (loaderData?.responsibleAiResource) {
    const { metadata, path } = loaderData.responsibleAiResource;
    return pageMeta(
      { ...metadata, ogImage: loaderData.responsibleAiOgImage },
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
  if (loaderData.story) {
    return <ClientStoryPage story={loaderData.story} />;
  }
  if (loaderData.article) {
    return <NewsArticlePage article={loaderData.article} />;
  }
  if (loaderData.webinar) {
    return <WebinarPage webinar={loaderData.webinar} />;
  }
  if (loaderData.responsibleAiResource) {
    return <ResponsibleAiPage resource={loaderData.responsibleAiResource} />;
  }
  return <AppRoutes pages={sitePrototypes} />;
}
