import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { ThemeProvider } from "@madison/ui/theme";
import App from "./App";
// Self-hosted Inter (variable) — registers the `Inter Variable` family that --font-sans leads with.
import "@fontsource-variable/inter";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element "#root" not found in index.html');
}

// Must match entry-server.tsx's tree exactly, minus the router.
const tree = (
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);

// `bun run build` prerenders every route to real HTML (scripts/prerender.ts), so
// in a built site #root already holds the page: hydrate it, don't re-render it.
// A `createRoot().render()` here would discard the markup that crawlers, social
// unfurls and the first paint all depend on. `vite dev` serves the bare
// template, so an empty #root falls back to a plain client render.
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, tree);
} else {
  createRoot(rootElement).render(tree);
}
