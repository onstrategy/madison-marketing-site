import { route, type RouteConfig } from "@react-router/dev/routes";

export default [
  route("sitemap.xml", "./routes/sitemap.ts"),
  route("client-stories/:slug", "./routes/client-story.tsx"),
  route("404", "./routes/not-found.tsx"),
  route("*?", "./framework-route.tsx"),
] satisfies RouteConfig;
