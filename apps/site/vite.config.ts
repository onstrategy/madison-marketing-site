import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 5174,
    host: true,
  },
  preview: {
    port: 4174,
  },
  // The pages live in @madison/sandbox, a symlinked workspace package, so bare
  // imports inside them resolve from apps/sandbox/node_modules. Two copies of
  // react-router-dom would make sections.tsx throw "useLocation() may be used
  // only in the context of a <Router>" even though a BrowserRouter is mounted
  // here — and the sandbox would keep working, so it'd look like a deploy bug.
  resolve: {
    dedupe: ["react", "react-dom", "react-router-dom"],
  },
  // The prerender build (`vite build --ssr src/entry-server.tsx`) runs in bun,
  // which cannot import the workspace packages directly: their `exports` maps
  // point at raw .ts/.tsx source, on purpose, so the consuming app compiles
  // them. Vite externalises bare specifiers in an SSR build by default, so they
  // have to be opted back in or the prerender fails on the first import.
  ssr: {
    noExternal: [/^@madison\//],
  },
  plugins: [react(), tailwindcss()],
});
