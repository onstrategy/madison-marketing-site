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
  const [scrolled, setScrolled] = React.useState(false);
  const [sectionIsDark, setSectionIsDark] = React.useState(overDarkHero);
  const headerRef = React.useRef<HTMLHeadElement>(null);

  React.useEffect(() => {
    if (!sectionAware) return;

    // Detect which section (dark/light) occupies the viewport.
    // We sample the top-center of the viewport (below the fixed nav).
    const detectSection = () => {
      const el = document.elementFromPoint(window.innerWidth / 2, 100);
      if (!el) return;
      let section: Element | null = el.closest("section") || el.closest("[class*='dark']");
      while (section && !section.classList.contains("dark")) {
        section = section.parentElement?.closest("section") ?? null;
      }
      setSectionIsDark(!!section);
    };

    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      detectSection();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionAware]);

  React.useEffect(() => {
    if (sectionAware) return;
    // Non-section-aware: use the old overDarkHero logic.
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionAware]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-sticky border-b transition-colors",
        scrolled
          ? "border-default bg-app/95 backdrop-blur"
          : "border-transparent",
        sectionAware && sectionIsDark ? "dark" : sectionAware ? "light" : "",
        !sectionAware && overDarkHero && !scrolled && "dark",
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
