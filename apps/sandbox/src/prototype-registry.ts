import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type StructuredData =
  | null
  | string
  | number
  | boolean
  | StructuredData[]
  | { [key: string]: StructuredData };

// The single source of truth for "which folders are pages".
//
// Prototypes live in src/prototypes/<slug>/ with:
//   - index.tsx  → default-exported page component (lazy-loaded, code-split)
//   - meta.ts    → default-exported PrototypeMeta (eager, tiny — powers the
//                  gallery AND the published page's <head>)
// New folders self-register here via import.meta.glob — no manual edits to this file.
// Run `bun run gen:prototype` to scaffold one.
//
// This lives in its own module (rather than inline in App.tsx) because
// @madison/site consumes it too, via the `./prototypes` export: the sandbox is
// the playground, the site is the published surface, and both render the same
// components. Keeping the glob here means the registration rule can't drift
// between the two apps.
//
// The globs are relative to THIS file, so they resolve to
// apps/sandbox/src/prototypes/* no matter which app's Vite root is compiling.
//
// Lazy on purpose: this module is imported by the client bundle, so every page
// stays code-split. React Router resolves these modules while prerendering.

export type PrototypeMeta = {
  /** Shown in the sandbox gallery, and the basis of the published <title>. */
  title: string;
  /** One line. Doubles as the page's meta description and OG description. */
  description?: string;
  /**
   * Public URL, when it differs from the folder name. Leading slash, no trailing
   * slash — e.g. "/client-stories/city-of-corona". Folder names are flat; real
   * URLs are not, and a live URL we're replacing must be matched exactly rather
   * than redirected. Defaults to "/<slug>".
   */
  path?: string;
  /** <title> for search results and the browser tab. Defaults to `${title} — Madison AI`. */
  seoTitle?: string;
  /** Absolute URL of the social share image. Omitted when unset. */
  ogImage?: string;
  /** JSON-LD emitted into the prerendered document head. */
  structuredData?: StructuredData;
  /** Keep out of sitemap.xml and mark noindex — kit demos and internal surfaces. */
  noindex?: boolean;
  /** Keep the prototype in the sandbox gallery without publishing it as a site route. */
  publish?: boolean;
};

export type PrototypeSummary = {
  /** The folder name. Identity, not URL — use `path` for links. */
  slug: string;
  /** Resolved public URL path, always leading-slashed. */
  path: string;
  title: string;
  description?: string;
  seoTitle?: string;
  ogImage?: string;
  structuredData?: StructuredData;
  noindex?: boolean;
  publish?: boolean;
};

export interface Prototype extends PrototypeSummary {
  Component: LazyExoticComponent<ComponentType>;
}

const metas = import.meta.glob<PrototypeMeta>("./prototypes/*/meta.ts", {
  eager: true,
  import: "default",
});

const loaders = import.meta.glob<{ default: ComponentType }>(
  "./prototypes/*/index.tsx",
);

function slugFrom(path: string): string {
  return path.replace("./prototypes/", "").replace(/\/(index\.tsx|meta\.ts)$/, "");
}

/**
 * Both apps must agree on a page's route identity, so normalisation lives here
 * rather than at each call site. The Netlify deployment's public URL adds a
 * trailing slash because React Router emits directory-index HTML.
 */
export function resolvePath(slug: string, meta?: PrototypeMeta): string {
  const raw = meta?.path?.trim();
  if (!raw) return `/${slug}`;
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.length > 1 ? withLeading.replace(/\/+$/, "") : "/";
}

const metaBySlug = new Map<string, PrototypeMeta>(
  Object.entries(metas).map(([path, meta]) => [slugFrom(path), meta]),
);

// A folder only becomes a route if it has an index.tsx — template-only dirs
// (webinar-template, client-story-template, …) are intentionally left out.
export const prototypes: Prototype[] = Object.keys(loaders)
  .map((file) => {
    const slug = slugFrom(file);
    const meta = metaBySlug.get(slug);
    return {
      slug,
      path: resolvePath(slug, meta),
      title: meta?.title || slug,
      description: meta?.description,
      seoTitle: meta?.seoTitle,
      ogImage: meta?.ogImage,
      structuredData: meta?.structuredData,
      noindex: meta?.noindex,
      publish: meta?.publish,
      Component: lazy(loaders[file]),
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export const summaries: PrototypeSummary[] = prototypes.map(
  ({ slug, path, title, description, seoTitle, ogImage, structuredData, noindex, publish }) => ({
    slug,
    path,
    title,
    description,
    seoTitle,
    ogImage,
    structuredData,
    noindex,
    publish,
  }),
);

/** The subset mounted by the public site. Content collections own their routes separately. */
export const sitePrototypes: Prototype[] = prototypes.filter(
  ({ publish }) => publish !== false,
);

export const siteSummaries: PrototypeSummary[] = summaries.filter(
  ({ publish }) => publish !== false,
);
