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
  plugins: [react(), tailwindcss()],
});
