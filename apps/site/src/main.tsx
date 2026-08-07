import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { ThemeProvider } from "@madison/ui/theme";
import App from "./App";
// The published shell preloads its exact Latin brand-font files before CSS is
// evaluated. The sandbox keeps Fontsource's full language-subset imports.
import "./fonts.css";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element "#root" not found in index.html');
}

// Must match entry-server.tsx's tree exactly, minus the router.
//
// `forcedTheme="light"` pins the PUBLISHED site to Madison's Warm White brand
// look. The design system supports dark mode fully (every token carries a dark
// value), but these marketing pages have never been designed or reviewed in it —
// so following the visitor's OS setting served an un-vetted dark rendering to
// anyone whose machine sits in dark mode. The sandbox and Storybook are
// unaffected and still exercise both themes.
const tree = (
  <StrictMode>
    <ThemeProvider forcedTheme="light">
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
