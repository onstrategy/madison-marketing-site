import { lazy, Suspense, type ComponentType } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrototypesIndex prototypes={summaries} />} />
        {prototypes.map(({ slug, Component }) => (
          <Route
            key={slug}
            path={`/${slug}/*`}
            element={
              <Suspense
                fallback={<div className="p-8 text-muted">Loading…</div>}
              >
                <Component />
              </Suspense>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
