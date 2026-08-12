import { sitePrototypes, siteSummaries } from "@madison/sandbox/prototypes";
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
  const page = findPage(new URL(request.url).pathname);
  return { page: page ?? null, origin: siteOrigin() };
}

/**
 * In static SPA development, an arbitrary URL has no generated `.data` file.
 * Avoid requesting one for an unknown page so the local browser can render the
 * same 404 view that Netlify serves with status 404 in deployment.
 */
export async function clientLoader({
  request,
  serverLoader,
}: Route.ClientLoaderArgs) {
  const page = findPage(new URL(request.url).pathname);
  if (!page) {
    return { page: null, origin: new URL(request.url).origin };
  }
  return serverLoader();
}
clientLoader.hydrate = true as const;

export function meta({ data: loaderData }: Route.MetaArgs) {
  if (!loaderData?.page) return notFoundMeta();
  const canonicalPath =
    loaderData.page.slug === "landing"
      ? "/"
      : `${loaderData.page.path.replace(/\/+$/, "")}/`;
  return pageMeta(loaderData.page, canonicalPath, loaderData.origin);
}

export default function FrameworkRoute() {
  return <AppRoutes pages={sitePrototypes} />;
}
