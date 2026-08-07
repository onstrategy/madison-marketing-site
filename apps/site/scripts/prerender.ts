import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { StructuredData } from "@madison/sandbox/prototypes";
import {
  escapeAttribute,
  isStructuredData,
  socialImageMetadata,
  stripAuditRobotsMeta,
  structuredDataTag,
} from "../src/prerender-metadata";

// Turns the built SPA into one real HTML file per route.
//
// Runs last in `@madison/site`'s build, after the client bundle and the SSR
// bundle. Why it exists: the site replaces a Webflow site that serves complete
// HTML with a per-page <title>, description and OG tags. A bare Vite SPA serves
// an empty <div id="root"> and one global title to every URL, which breaks
// social unfurls, gives AI crawlers nothing to read, and turns every unknown
// path into a soft 404. See docs/publishing.md.
//
// The route list and every page's <head> data both come from the prototypes'
// own meta.ts files, so a contributor who scaffolds a page gets correct SEO
// without knowing the word "SEO".

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = scriptPath.includes("bun:")
  ? join(process.cwd(), "scripts")
  : dirname(scriptPath);
const siteRoot = join(scriptDir, "..");
const seoAudit = process.env.SEO_AUDIT === "true";
const distDir = join(siteRoot, seoAudit ? "dist-seo-audit" : "dist");
const ssrEntry = join(siteRoot, "dist-ssr", "entry-server.js");

const SITE_NAME = "Madison AI";

// Netlify sets URL to the canonical site address. SITE_ORIGIN overrides it for
// local runs. Canonicals must point at production even from a preview build.
const origin = (
  process.env.SITE_ORIGIN ??
  process.env.URL ??
  "https://madison-design-system.netlify.app"
).replace(/\/+$/, "");

// A path no route claims, so render() resolves to the <Route path="*"> 404.
const NOT_FOUND_PROBE = "/__prerender_not_found__";

interface PrerenderRoute {
  slug: string;
  path: string;
  title: string;
  description?: string;
  seoTitle?: string;
  ogImage?: string;
  structuredData?: StructuredData;
  noindex?: boolean;
}

interface SsrModule {
  render: (url: string) => string;
  routes: PrerenderRoute[];
}

function isPrerenderRoute(value: unknown): value is PrerenderRoute {
  return (
    typeof value === "object" &&
    value !== null &&
    "slug" in value &&
    typeof value.slug === "string" &&
    "path" in value &&
    typeof value.path === "string" &&
    "title" in value &&
    typeof value.title === "string" &&
    (!("structuredData" in value) ||
      value.structuredData === undefined ||
      isStructuredData(value.structuredData))
  );
}

function isSsrModule(value: unknown): value is SsrModule {
  return (
    typeof value === "object" &&
    value !== null &&
    "render" in value &&
    typeof value.render === "function" &&
    "routes" in value &&
    Array.isArray(value.routes) &&
    value.routes.every(isPrerenderRoute)
  );
}

/** Load the SSR bundle. It's built JS, so validate its shape at the boundary. */
const imported: unknown = await import(pathToFileURL(ssrEntry).href);
if (!isSsrModule(imported)) {
  throw new Error(
    `${ssrEntry} did not export render(url) and routes[] — run \`vite build --ssr src/entry-server.tsx\` before this script.`,
  );
}
const { render, routes } = imported;

const templateSource = readFileSync(join(distDir, "index.html"), "utf8");
// The source template and every deployed build remain noindexed. Only the
// dedicated localhost audit output removes the site-wide meta directive; pages
// explicitly marked `noindex` in meta.ts still receive their page-level tag.
const template = seoAudit
  ? stripAuditRobotsMeta(templateSource)
  : templateSource;

// The demo deploy carries a site-wide `noindex` robots meta (see netlify.toml
// and docs/publishing.md). When it's present it already covers every page, so
// never emit a second, weaker robots tag beside it — page-level noindex only
// adds a tag once that site-wide one is gone, at handover.
const templateHasRobots = /<meta\s[^>]*name="robots"/i.test(template);

const templateDescription =
  template.match(/<meta\s[^>]*name="description"[^>]*content="([^"]*)"/)?.[1] ??
  "";

// The landing prototype is /landing in the sandbox gallery but the site's
// homepage. netlify.toml 301s /landing → /, so only / gets a file.
const pages: PrerenderRoute[] = routes.map((route) =>
  route.slug === "landing" ? { ...route, path: "/" } : route,
);

function titleFor(page: PrerenderRoute): string {
  return page.seoTitle ?? `${page.title} — ${SITE_NAME}`;
}

function headFor(page: PrerenderRoute, canonical: string | null): string {
  const title = titleFor(page);
  const description = page.description ?? templateDescription;
  const socialImage = socialImageMetadata(page.ogImage, origin);

  // No canonical for the 404 document: it is served at every unknown path, so
  // claiming one URL would point an unbounded class of URLs at a single page.
  const tags = [
    ...(canonical
      ? [
          `<link rel="canonical" href="${escapeAttribute(canonical)}" />`,
          `<meta property="og:url" content="${escapeAttribute(canonical)}" />`,
        ]
      : []),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttribute(SITE_NAME)}" />`,
    `<meta property="og:title" content="${escapeAttribute(title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(description)}" />`,
    `<meta property="og:image" content="${escapeAttribute(socialImage.url)}" />`,
    ...(socialImage.alt !== undefined &&
    socialImage.width !== undefined &&
    socialImage.height !== undefined
      ? [
          `<meta property="og:image:width" content="${socialImage.width}" />`,
          `<meta property="og:image:height" content="${socialImage.height}" />`,
          `<meta property="og:image:alt" content="${escapeAttribute(socialImage.alt)}" />`,
        ]
      : []),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttribute(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(description)}" />`,
    `<meta name="twitter:image" content="${escapeAttribute(socialImage.url)}" />`,
    ...(socialImage.alt !== undefined
      ? [
          `<meta name="twitter:image:alt" content="${escapeAttribute(socialImage.alt)}" />`,
        ]
      : []),
    ...(page.structuredData === undefined
      ? []
      : [structuredDataTag(page.structuredData)]),
  ];

  if (page.noindex && !templateHasRobots) {
    tags.push(`<meta name="robots" content="noindex, nofollow" />`);
  }

  return tags.map((tag) => `    ${tag}`).join("\n");
}

/**
 * Every .replace here uses a function replacer: page markup and copy routinely
 * contain `$`, which a string replacement would interpret as a capture-group
 * reference and silently corrupt.
 */
function documentFor(
  page: PrerenderRoute,
  appHtml: string,
  canonical: string | null,
): string {
  const title = titleFor(page);
  const description = page.description ?? templateDescription;

  return template
    .replace(/<html([^>]*)>/, (_match, attrs: string) => `<html${attrs} data-prerendered>`)
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeAttribute(title)}</title>`)
    .replace(
      /<meta\s[^>]*name="description"[^>]*\/>/,
      () => `<meta name="description" content="${escapeAttribute(description)}" />`,
    )
    .replace("</head>", () => `${headFor(page, canonical)}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`);
}

/**
 * `<path>.html`, NOT `<path>/index.html`.
 *
 * Netlify serves a directory index by 301-ing to the trailing-slash form:
 * dist/about-us/index.html makes /about-us redirect to /about-us/. That would
 * put a redirect hop on every link in the site (every href here is slash-less)
 * and quietly change the canonical URL of every page — while the Webflow site
 * being replaced serves /about-us directly with a 200. A sibling .html file is
 * served at the slash-less path as-is.
 *
 * A page and a section can coexist: /client-stories writes client-stories.html
 * and /client-stories/city-of-corona writes client-stories/city-of-corona.html.
 */
function writePage(routePath: string, html: string): void {
  const file =
    routePath === "/"
      ? join(distDir, "index.html")
      : join(distDir, `${routePath.replace(/^\//, "")}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

function canonicalFor(routePath: string): string {
  return routePath === "/" ? `${origin}/` : `${origin}${routePath}`;
}

for (const page of pages) {
  writePage(
    page.path,
    documentFor(page, render(page.path), canonicalFor(page.path)),
  );
}

// A real 404 document. Netlify serves dist/404.html with an actual 404 status
// for any path with no file behind it — which is every path now that the SPA
// catch-all redirect is gone.
const notFound: PrerenderRoute = {
  slug: "__not-found__",
  path: NOT_FOUND_PROBE,
  title: "Page not found",
  description: "The link may be out of date, or the page may have moved.",
  seoTitle: `Page not found — ${SITE_NAME}`,
  noindex: true,
};
writeFileSync(
  join(distDir, "404.html"),
  documentFor(notFound, render(NOT_FOUND_PROBE), null),
);

const indexable = pages.filter((page) => !page.noindex);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map(
    (page) =>
      `  <url>\n    <loc>${escapeAttribute(canonicalFor(page.path))}</loc>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;
writeFileSync(join(distDir, "sitemap.xml"), sitemap);

if (seoAudit) {
  writeFileSync(
    join(distDir, "robots.txt"),
    "User-agent: *\nAllow: /\nSitemap: http://127.0.0.1:4174/sitemap.xml\n",
  );
  console.log(
    "✅ Local SEO audit build is isolated in dist-seo-audit, crawlable, and includes source maps",
  );
}

const excluded = pages.length - indexable.length;
console.log(
  `✅ Prerendered ${pages.length} pages + 404.html at ${origin}`,
);
console.log(
  `✅ sitemap.xml lists ${indexable.length} URLs (${excluded} marked noindex in meta.ts)`,
);
