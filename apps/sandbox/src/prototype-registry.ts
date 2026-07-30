import { lazy, type ComponentType, type LazyExoticComponent } from "react";

// The single source of truth for "which folders are pages".
//
// Prototypes live in src/prototypes/<slug>/ with:
//   - index.tsx  → default-exported page component (lazy-loaded, code-split)
//   - meta.ts    → default-exported { title, description } (eager, tiny — powers the gallery)
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

export type PrototypeMeta = { title: string; description?: string };

export type PrototypeSummary = {
  slug: string;
  title: string;
  description?: string;
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

const metaBySlug = new Map<string, PrototypeMeta>(
  Object.entries(metas).map(([path, meta]) => [slugFrom(path), meta]),
);

// A folder only becomes a route if it has an index.tsx — template-only dirs
// (webinar-template, client-story-template, …) are intentionally left out.
export const prototypes: Prototype[] = Object.keys(loaders)
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

export const summaries: PrototypeSummary[] = prototypes.map(
  ({ slug, title, description }) => ({ slug, title, description }),
);
