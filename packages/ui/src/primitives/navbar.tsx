import * as React from "react";

import { cn } from "../ui/utils";

// Navbar — a composable top-navigation shell. It owns layout and the
// scroll-aware chrome (transparent while at the top of the page, solid once
// scrolled) and leaves all content to the caller via the compound parts below:
//
//   <Navbar>
//     <NavbarBrand href="/">…logo + wordmark…</NavbarBrand>
//     <NavbarLinks>
//       <NavbarLink href="#">Platform</NavbarLink>
//       …
//     </NavbarLinks>
//     <NavbarActions>…theme toggle · sign in · CTA…</NavbarActions>
//   </Navbar>
//
// It is fixed to the top and spans full width; pass `contentClassName` to change
// the inner row's width or gutters (e.g. `mx-auto max-w-6xl` for a centered bar).
// The row is a `1fr auto 1fr` grid, not a flex row — NavbarBrand/NavbarLinks/
// NavbarActions are pinned to columns 1/2/3, so NavbarLinks stays mathematically
// centered no matter how wide the brand or actions clusters are.

// px scrolled before the bar switches from transparent to solid.
const SCROLL_THRESHOLD = 8;
// Where we probe for the section sitting behind the bar — far enough below the
// fixed row to hit page content rather than the bar itself.
const SECTION_PROBE_Y = 100;

interface NavbarProps extends React.ComponentProps<"header"> {
  /** Extra classes for the inner <nav> row — override width/gutters here. */
  contentClassName?: string;
  /**
   * Enable theme-aware navigation. The bar detects which section (dark/light)
   * is under the viewport and switches its theme accordingly, with smooth
   * transitions. Sections are detected via their className:
   * - Contains `dark` → dark-themed nav
   * - Otherwise → light-themed nav
   */
  sectionAware?: boolean;
  /**
   * For pages whose hero is a `dark`-scoped section sitting directly behind
   * the nav: scopes the (still-transparent) unscrolled bar to `dark` so its
   * text and logo read against the dark hero, then drops back to the page's
   * own theme the moment it goes solid on scroll. Superseded by `sectionAware`.
   */
  overDarkHero?: boolean;
}

function Navbar({
  className,
  contentClassName,
  sectionAware = false,
  overDarkHero = false,
  children,
  ...props
}: NavbarProps) {
  // Both values below are measurements of an external system (the window's
  // scroll position and the document under the bar) — never props mirrored
  // into state. `overDarkHero` is applied during render, in `themeScope`.
  const [scrolled, setScrolled] = React.useState(false);
  const [sectionIsDark, setSectionIsDark] = React.useState(false);

  // `sectionAware` gates the (layout-forcing) section probe. Held in a ref so
  // the listener is a plain mount-time subscription: flipping the flag must not
  // tear down and re-add a scroll listener, and the effect must not re-run just
  // because a prop changed.
  const sectionAwareRef = React.useRef(sectionAware);
  React.useEffect(() => {
    sectionAwareRef.current = sectionAware;
  }, [sectionAware]);

  React.useEffect(() => {
    // One rAF-coalesced measurement per frame. `scroll` fires far more often
    // than that, and the probe below hit-tests the document, which forces
    // layout — running it per event janks pages carrying photos, marquees and
    // animated SVG, which is most of this site.
    let frame = 0;

    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      if (!sectionAwareRef.current) return;
      const el = document.elementFromPoint(
        window.innerWidth / 2,
        SECTION_PROBE_Y,
      );
      // `.dark` as a class selector, not a `[class*='dark']` substring match:
      // a section named e.g. "darkroom" must not count, and a `dark` scope on
      // any ancestor should — not only on a <section>.
      setSectionIsDark(!!el?.closest(".dark"));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Resolved during render rather than stored: when `sectionAware`, the bar
  // follows the measured section; otherwise `overDarkHero` scopes the still-
  // transparent bar dark until it goes solid on scroll.
  const themeScope = sectionAware
    ? sectionIsDark
      ? "dark"
      : "light"
    : overDarkHero && !scrolled
      ? "dark"
      : undefined;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-sticky border-b transition-colors",
        scrolled
          ? "border-default bg-app/95 backdrop-blur"
          : "border-transparent",
        themeScope,
        className,
      )}
      {...props}
    >
      <nav
        className={cn(
          "grid grid-cols-[1fr_auto_1fr] items-center px-gutter py-4 lg:px-0",
          contentClassName,
        )}
      >
        {children}
      </nav>
    </header>
  );
}

/** The brand slot — logo mark + wordmark. Renders an anchor. Pinned to the left column. */
function NavbarBrand({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "col-start-1 flex items-center justify-self-start gap-2.5",
        className,
      )}
      {...props}
    />
  );
}

// The center link group. Hidden below the `lg` breakpoint. Pinned to the middle
// grid column, which the `1fr auto 1fr` track sizing keeps mathematically
// centered regardless of how wide the brand or actions clusters are.
function NavbarLinks({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("col-start-2 hidden items-center gap-7 lg:flex", className)}
      {...props}
    />
  );
}

/** A single nav link. Accepts a trailing icon (e.g. a chevron) as a child. */
function NavbarLink({
  className,
  active = false,
  ...props
}: React.ComponentProps<"a"> & { /** Marks the link as the current page/section — renders in brand blue. */ active?: boolean }) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium transition-colors",
        active ? "text-brand-accent" : "text-secondary hover:text-primary",
        className,
      )}
      {...props}
    />
  );
}

// The trailing actions cluster — sign-in link, CTA, theme toggle. Pinned to
// the right column explicitly (not just DOM order) so it stays flush right
// even when NavbarLinks is hidden below `lg`.
function NavbarActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-3 flex items-center justify-self-end gap-4",
        className,
      )}
      {...props}
    />
  );
}

export { Navbar, NavbarBrand, NavbarLinks, NavbarLink, NavbarActions };
