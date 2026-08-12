import { siteSummaries } from "@madison/sandbox/prototypes";
import { clientStories } from "@madison/sandbox/content/client-stories";
import { siteOrigin } from "../site-origin.server";

function trailingSlash(path: string): string {
  if (path === "/") return path;
  return `${path.replace(/\/+$/, "")}/`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function loader() {
  const origin = siteOrigin();
  const prototypePaths = siteSummaries
    .filter((page) => !page.noindex)
    .map((page) => (page.slug === "landing" ? "/" : trailingSlash(page.path)));
  const storyPaths = clientStories
    .filter((story) => !story.metadata.noindex)
    .map((story) => story.path);
  const paths = [...new Set([...prototypePaths, ...storyPaths])].sort();
  const urls = paths
    .map((path) => {
      const url = path === "/" ? `${origin}/` : `${origin}${path}`;
      return `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`;
    })
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
