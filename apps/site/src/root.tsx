import type { ReactNode } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
  type MetaFunction,
} from "react-router";
import { ThemeProvider } from "@madison/ui/theme";
import { SITE_WIDE_NOINDEX_ACTIVE } from "./site-meta";
import "./fonts.css";
import "./index.css";

export const meta: MetaFunction = () => [
  { title: "Madison Ai" },
  {
    name: "description",
    content: "Madison Ai — the AI platform built for local government.",
  },
];

export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  {
    rel: "preconnect",
    href: "https://images.unsplash.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/inter-latin-variable.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/lora-latin-variable.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-prerendered>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        {/* The demo deployment is intentionally non-indexable. Leaf route meta
            replaces root route meta in React Router, so this invariant lives
            directly in the document rather than relying on meta composition. */}
        {SITE_WIDE_NOINDEX_ACTIVE ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : null}
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <ThemeProvider forcedTheme="light">
      <Outlet />
    </ThemeProvider>
  );
}
