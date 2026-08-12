import type { MetaDescriptor } from "react-router";
import type { StructuredData } from "@madison/sandbox/prototypes";

export const SITE_NAME = "Madison AI";
export const DEFAULT_DESCRIPTION =
  "Madison Ai — the AI platform built for local government.";
/**
 * The demo deployment is intentionally hidden from search engines. At client
 * handover, flip this one switch after removing the matching Netlify header and
 * robots.txt rule. Route-specific noindex metadata then continues to work.
 */
export const SITE_WIDE_NOINDEX = true;
export const SITE_WIDE_NOINDEX_ACTIVE =
  SITE_WIDE_NOINDEX && !import.meta.env.VITE_SEO_AUDIT;

const DEFAULT_SOCIAL_IMAGE_PATH = "/og-default.png";
const DEFAULT_SOCIAL_IMAGE_ALT =
  "Madison AI — Dedicated AI for local government";

export type PageMetadata = {
  title: string;
  description?: string;
  seoTitle?: string;
  ogImage?: string;
  structuredData?: StructuredData;
  noindex?: boolean;
};

function canonicalUrl(origin: string, path: string): string {
  return path === "/" ? `${origin}/` : `${origin}${path}`;
}

export function pageMeta(
  page: PageMetadata,
  path: string,
  origin: string,
): MetaDescriptor[] {
  const title = page.seoTitle ?? `${page.title} — ${SITE_NAME}`;
  const description = page.description ?? DEFAULT_DESCRIPTION;
  const canonical = canonicalUrl(origin, path);
  const socialImage = page.ogImage ?? `${origin}${DEFAULT_SOCIAL_IMAGE_PATH}`;
  const usesDefaultSocialImage = page.ogImage === undefined;

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:url", content: canonical },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: socialImage },
    ...(usesDefaultSocialImage
      ? [
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
          { property: "og:image:alt", content: DEFAULT_SOCIAL_IMAGE_ALT },
        ]
      : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: socialImage },
    ...(usesDefaultSocialImage
      ? [{ name: "twitter:image:alt", content: DEFAULT_SOCIAL_IMAGE_ALT }]
      : []),
    ...(page.structuredData === undefined
      ? []
      : [{ "script:ld+json": page.structuredData }]),
    ...(page.noindex
      ? [{ name: "robots", content: "noindex, nofollow" }]
      : []),
  ];
}

export function notFoundMeta(): MetaDescriptor[] {
  const title = `Page not found — ${SITE_NAME}`;
  const description = "The link may be out of date, or the page may have moved.";
  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "noindex, nofollow" },
  ];
}
