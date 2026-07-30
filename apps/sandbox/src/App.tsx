import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { cn } from "@madison/ui/utils";
import { PrototypesIndex } from "./PrototypesIndex";
// Prototypes self-register in the registry — see prototype-registry.ts. It's a
// separate module because @madison/site renders the same pages.
import { prototypes, summaries } from "./prototype-registry";

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
        {prototypes.map(({ slug, path, Component }) => (
          <Route
            key={slug}
            // The page's real public URL, which may be nested ("/resources/…").
            // No trailing wildcard: no prototype renders nested routes, and an
            // exact path is what lets the published site 404 unknown deep links.
            path={path}
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
