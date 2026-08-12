const DEFAULT_ORIGIN = "https://madison-design-system.netlify.app";

export function siteOrigin(): string {
  return (
    process.env.SITE_ORIGIN ??
    process.env.URL ??
    DEFAULT_ORIGIN
  ).replace(/\/+$/, "");
}
