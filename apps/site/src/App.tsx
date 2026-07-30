import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { prototypes } from "@madison/sandbox/prototypes";
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

const pages = prototypes.filter((p) => p.slug !== "landing");

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Statically imported, not lazy: `/` is the LCP page and shouldn't pay
            a chunk round-trip. Rollup hoists a module that is both statically
            and dynamically imported, so this doesn't duplicate the landing code. */}
        <Route path="/" element={<Landing />} />
        {/* landing/sections.tsx hardcodes href="/landing" on the brand mark.
            Canonicalize to `/`. Netlify serves a 301 for real requests; this
            covers dev, `vite preview`, and any client-side navigation. */}
        <Route path="/landing" element={<Navigate to="/" replace />} />
        {pages.map(({ slug, Component }) => (
          <Route
            key={slug}
            path={`/${slug}/*`}
            element={
              <Suspense fallback={<div className="min-h-screen bg-app" />}>
                <Component />
              </Suspense>
            }
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
