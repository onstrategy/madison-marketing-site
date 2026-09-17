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
        {/* Automatic consent blocking must run before any other scripts. */}
        <script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="f2ae8219-32b0-435b-b6a5-37a28e686a4d"
          data-blockingmode="auto"
          type="text/javascript"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        {/* Keep the optional site-wide guard in the document because leaf route
            metadata replaces root metadata in React Router. */}
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
