import { Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { Routes, Route, Navigate } from "react-router";
import Landing from "@madison/sandbox/prototypes/landing";
import { NotFound } from "./NotFound";

// The published site renders the SAME components as the sandbox — see
// apps/sandbox/src/prototype-registry.ts. The differences are deliberate and
// live entirely here:
//   - the landing page is `/`, not `/landing`
//   - there is no prototype gallery (that stays a local, internal surface)
//   - no page transitions: every cross-page link in these pages is a plain
//     <a href>, i.e. a full browser load, so the fade would only ever run once
//     on first paint and would just delay it.
//
// Page content is never edited here. It belongs in apps/sandbox/src/prototypes/.

export type SitePage = {
  slug: string;
  path: string;
  Component: ComponentType | LazyExoticComponent<ComponentType>;
};

/**
 * The route table lives inside React Router Framework Mode's catch-all route.
 * `pages` remains injected so the shell owns routing while the sandbox registry
 * remains the source of page components and public paths.
 */
export function AppRoutes({ pages }: { pages: SitePage[] }) {
  return (
    <Routes>
      {/* Statically imported, not lazy: `/` is the LCP page and shouldn't pay
          a chunk round-trip. Rollup hoists a module that is both statically
          and dynamically imported, so this doesn't duplicate the landing code. */}
      <Route path="/" element={<Landing />} />
      {/* landing/sections.tsx links to `/landing/` on the brand mark.
          Canonicalize to `/`. Netlify serves a 301 for real requests; this
          covers dev, `vite preview`, and any client-side navigation. */}
      <Route path="/landing" element={<Navigate to="/" replace />} />
      {pages
        .filter((page) => page.slug !== "landing")
        .map(({ slug, path, Component }) => (
          <Route
            key={slug}
            // The page's real public URL — possibly nested, e.g.
            // "/client-stories/city-of-corona". Exact, with no trailing
            // wildcard: no prototype renders nested routes, and matching
            // exactly is what lets an unknown deep link fall through to the
            // 404 instead of silently rendering a page.
            path={path}
            element={
              <Suspense fallback={<div className="min-h-screen bg-app" />}>
                <Component />
              </Suspense>
            }
          />
        ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
