import { useEffect, type ReactNode } from "react";
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

interface CookiebotApi {
  /** False until the visitor has answered the banner, either way. */
  hasResponse: boolean;
  show: () => void;
}

declare global {
  interface Window {
    Cookiebot?: CookiebotApi;
  }
}

const COOKIEBOT_DIALOG_ID = "CybotCookiebotDialog";

/**
 * Puts the Cookiebot banner back when hydration removed it.
 *
 * These pages are prerendered and React hydrates the whole document, so it
 * deletes any <body> child it did not render itself. Cookiebot inserts its
 * dialog as the first child of <body>, and on a cold load (an incognito
 * first visit, where the bundle still has to download) it gets there before
 * hydration commits — so React deletes the banner and the visitor never
 * gets to answer it. On a warm cache hydration wins the race instead and
 * the banner survives, which is why the bug looked intermittent. Navigating
 * to another page hydrates nothing, so the banner sticks there too.
 *
 * Cookiebot has no setting that defers its own banner (checked against the
 * uc.js/cc.js it actually serves, and its React guidance), so rather than
 * stop the deletion we re-show the banner here: this effect runs after
 * hydration has committed, so what it shows now survives.
 */
function useRestoreCookiebotBanner(): void {
  useEffect(() => {
    const restoreIfRemoved = (): void => {
      const cookiebot = window.Cookiebot;
      // `hasResponse`, not `consented`: someone who declined has also
      // answered, and Cookiebot's show() clears hasResponse, so keying off
      // consent alone would re-prompt them on every cold load.
      if (!cookiebot || cookiebot.hasResponse) return;
      if (document.getElementById(COOKIEBOT_DIALOG_ID)) return;
      cookiebot.show();
    };

    restoreIfRemoved();
    // Whether hydration's cleanup of unexpected <body> children lands before
    // or after this effect depends on how React schedules the commit, so
    // check once more on the next frame before trusting the banner survived.
    const nextFrame = requestAnimationFrame(restoreIfRemoved);

    // Cookiebot can still be in flight when hydration commits. On that path
    // it draws its own banner after hydration — already safe — and this
    // listener finds the dialog present and does nothing.
    window.addEventListener("CookiebotOnLoad", restoreIfRemoved);
    return () => {
      cancelAnimationFrame(nextFrame);
      window.removeEventListener("CookiebotOnLoad", restoreIfRemoved);
    };
  }, []);
}

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
        {/* No analytics tag here on purpose. A previous gtag.js tag was
            removed: React hoists `<script async>` into the top of <head>,
            which put it ahead of the Cookiebot script above and defeated
            Cookiebot's automatic blocking (analytics cookies were set
            before consent). Any future tag must load outside this
            React-rendered <head> so Cookiebot stays the first script. */}
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
  useRestoreCookiebotBanner();

  return (
    <ThemeProvider forcedTheme="light">
      <Outlet />
    </ThemeProvider>
  );
}
