import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
// react-router-dom v7 is a shim over react-router (`export * from "react-router"`),
// so StaticRouter comes from the main entry — the v6 "react-router-dom/server"
// subpath no longer exists.
import { StaticRouter } from "react-router-dom";
import { ThemeProvider } from "@madison/ui/theme";
import { serverPrototypes } from "@madison/sandbox/prototypes/server";
import { AppRoutes } from "./App";

// The prerender entry. Built separately (`vite build --ssr`) and driven by
// scripts/prerender.ts, which calls render() once per route and writes the
// result to disk. Nothing here ships to the browser.
//
// The tree below must match main.tsx exactly apart from the router — same
// StrictMode, same ThemeProvider, same AppRoutes — or hydration discards the
// HTML we just paid to generate. ThemeProvider is already SSR-safe: it guards
// every window/localStorage read and resolves to the light theme server-side.

/** Every page the prerender step should emit, in registry order. */
export const routes = serverPrototypes.map(
  ({ slug, path, title, description, seoTitle, ogImage, noindex }) => ({
    slug,
    path,
    title,
    description,
    seoTitle,
    ogImage,
    noindex,
  }),
);

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <ThemeProvider>
        <StaticRouter location={url}>
          <AppRoutes pages={serverPrototypes} />
        </StaticRouter>
      </ThemeProvider>
    </StrictMode>,
  );
}
