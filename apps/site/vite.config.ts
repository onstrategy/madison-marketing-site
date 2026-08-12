import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";

const seoAudit = process.env.SEO_AUDIT === "true";

export default defineConfig({
  server: {
    port: 5174,
    host: true,
  },
  preview: {
    port: 4174,
  },
  // Local Lighthouse audits get source attribution without publishing source
  // maps in normal Netlify builds. Audit output is isolated so a local audit
  // can never leave the production publish directory crawlable.
  build: {
    outDir: seoAudit ? "dist-seo-audit" : "dist",
    sourcemap: seoAudit,
  },
  // The pages live in @madison/sandbox, a symlinked workspace package, so bare
  // imports inside them resolve from apps/sandbox/node_modules. Two copies of
  // react-router would make sections.tsx throw "useLocation() may be used
  // only in the context of a <Router>" even though a BrowserRouter is mounted
  // here — and the sandbox would keep working, so it'd look like a deploy bug.
  resolve: {
    dedupe: ["react", "react-dom", "react-router"],
  },
  // React Router creates a temporary server bundle while prerendering. The
  // workspace packages export raw source on purpose, so Vite must compile them
  // into that bundle instead of externalising the bare package specifiers.
  ssr: {
    noExternal: [/^@madison\//],
  },
  plugins: [reactRouter(), tailwindcss()],
});
