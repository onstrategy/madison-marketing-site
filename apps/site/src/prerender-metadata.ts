import type { StructuredData } from "@madison/sandbox/prototypes";

const DEFAULT_SOCIAL_IMAGE_PATH = "/og-default.png";
const DEFAULT_SOCIAL_IMAGE_ALT =
  "Madison AI — Dedicated AI for local government";

export interface SocialImageMetadata {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export function isStructuredData(value: unknown): value is StructuredData {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isStructuredData);
  }

  return (
    typeof value === "object" &&
    Object.values(value).every(isStructuredData)
  );
}

export function stripAuditRobotsMeta(templateSource: string): string {
  const template = templateSource.replace(
    /\s*<meta\s[^>]*name="robots"[^>]*\/?>/i,
    "",
  );

  if (template === templateSource) {
    throw new Error(
      "SEO_AUDIT build could not strip the site-wide robots meta from the client template",
    );
  }

  return template;
}

export function socialImageMetadata(
  ogImage: string | undefined,
  origin: string,
): SocialImageMetadata {
  if (ogImage !== undefined) {
    return { url: ogImage };
  }

  return {
    url: `${origin}${DEFAULT_SOCIAL_IMAGE_PATH}`,
    alt: DEFAULT_SOCIAL_IMAGE_ALT,
    width: 1200,
    height: 630,
  };
}

export function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function structuredDataTag(value: StructuredData): string {
  // Escaping `<` prevents JSON string content from terminating the script tag.
  const json = JSON.stringify(value).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}
