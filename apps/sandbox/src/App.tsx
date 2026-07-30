import { lazy, Suspense, useEffect, useState, type ComponentType } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { cn } from "@madison/ui/utils";
import { PrototypesIndex, type PrototypeSummary } from "./PrototypesIndex";

type PrototypeMeta = { title: string; description?: string };

// Prototypes live in src/prototypes/<slug>/ with:
//   - index.tsx  → default-exported page component (lazy-loaded, code-split)
//   - meta.ts    → default-exported { title, description } (eager, tiny — powers the gallery)
// New folders self-register here via import.meta.glob — no manual edits to this file.
// Run `bun run gen:prototype` to scaffold one.
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

const metaBySlug = new Map<string, PrototypeMeta>(
  Object.entries(metas).map(([path, meta]) => [slugFrom(path), meta]),
);

const prototypes = Object.keys(loaders)
  .map((path) => {
    const slug = slugFrom(path);
    const meta = metaBySlug.get(slug);
    return {
      slug,
      title: meta?.title || slug,
      description: meta?.description,
      Component: lazy(loaders[path]),
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

const summaries: PrototypeSummary[] = prototypes.map(
  ({ slug, title, description }) => ({ slug, title, description }),
);

/** Mirrors the exit half of `.page-shell`'s transition (--duration-fast) in index.css. */
const EXIT_MS = 150;

/**
 * Holds the rendered route back until the outgoing page has faded out, so a
 * navigation reads as fade-out → swap → fade-in rather than an instant cut.
 *
 * The effect here is not prop-mirroring: the lag *is* the feature, so the
 * displayed location can't be derived during render — it's synchronized to a
 * timer. Don't "simplify" it into a render-time computation.
 */
function usePageTransition() {
  const location = useLocation();
  const [displayed, setDisplayed] = useState(location);

  useEffect(() => {
    if (location.key === displayed.key) return;

    const swap = () => {
      setDisplayed(location);
      // Reset scroll while the shell is still invisible, so the incoming page
      // fades in from its own top instead of landing mid-scroll.
      window.scrollTo(0, 0);
    };

    // Reduced motion: theme.css zeroes the CSS side, so skip the delay too.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      swap();
      return;
    }

    const timer = setTimeout(swap, EXIT_MS);
    return () => clearTimeout(timer);
  }, [location, displayed.key]);

  return { displayed, leaving: location.key !== displayed.key };
}

function AnimatedRoutes() {
  const { displayed, leaving } = usePageTransition();

  return (
    // `key` remounts the shell on each swap, which restarts the enter animation.
    <div
      key={displayed.key}
      className={cn("page-shell", leaving && "page-shell-leaving")}
    >
      {/* Rendering the deferred location keeps the old page on screen while it fades. */}
      <Routes location={displayed}>
        <Route path="/" element={<PrototypesIndex prototypes={summaries} />} />
        {prototypes.map(({ slug, Component }) => (
          <Route
            key={slug}
            path={`/${slug}/*`}
            element={
              // A bare canvas, not "Loading…" — a text flash mid-fade undoes the
              // transition. Chunks are small and usually land inside the fade-out.
              <Suspense fallback={<div className="min-h-screen bg-app" />}>
                <Component />
              </Suspense>
            }
          />
        ))}
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
