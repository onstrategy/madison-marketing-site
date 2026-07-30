import type { ComponentType } from "react";
import {
  resolvePath,
  type PrototypeMeta,
  type PrototypeSummary,
} from "./prototype-registry";

// The same registry as ./prototype-registry.ts, but EAGER.
//
// Why a second module: `renderToString` cannot resolve a `React.lazy` component —
// it throws a promise the synchronous renderer has no way to await. The prerender
// step therefore needs every page loaded up front. Eager-globbing in the client
// registry instead would defeat the code-splitting the browser depends on, so the
// two consumers get two modules over one glob rule.
//
// Only @madison/site's SSR build imports this (via the `./prototypes/server`
// export), so the eager imports never reach a browser bundle.

export interface ServerPrototype extends PrototypeSummary {
  Component: ComponentType;
}

const metas = import.meta.glob<PrototypeMeta>("./prototypes/*/meta.ts", {
  eager: true,
  import: "default",
});

const components = import.meta.glob<ComponentType>("./prototypes/*/index.tsx", {
  eager: true,
  import: "default",
});

function slugFrom(file: string): string {
  return file.replace("./prototypes/", "").replace(/\/(index\.tsx|meta\.ts)$/, "");
}

const metaBySlug = new Map<string, PrototypeMeta>(
  Object.entries(metas).map(([file, meta]) => [slugFrom(file), meta]),
);

export const serverPrototypes: ServerPrototype[] = Object.entries(components)
  .map(([file, Component]) => {
    const slug = slugFrom(file);
    const meta = metaBySlug.get(slug);
    return {
      slug,
      path: resolvePath(slug, meta),
      title: meta?.title || slug,
      description: meta?.description,
      seoTitle: meta?.seoTitle,
      ogImage: meta?.ogImage,
      noindex: meta?.noindex,
      Component,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));
