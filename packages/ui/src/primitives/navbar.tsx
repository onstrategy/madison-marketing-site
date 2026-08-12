import * as React from "react";
import { Menu, X } from "lucide-react";

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

// Below `lg`, NavbarLinks (the center link cluster) is hidden outright with no
// substitute — a caller who never adds the pieces below simply loses every
// link but the brand and NavbarActions on mobile/tablet. NavbarMobileTrigger
// + NavbarMobileMenu are that substitute: a hamburger toggle and the panel it
// opens, sharing open/close state through this context so they can be placed
// independently (trigger inside NavbarActions, menu as a sibling of
// NavbarLinks) while staying in sync.
const NavbarMobileContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function useNavbarMobile() {
  const ctx = React.useContext(NavbarMobileContext);
  if (!ctx) {
    throw new Error(
      "NavbarMobileTrigger and NavbarMobileMenu must be rendered inside <Navbar>.",
    );
  }
  return ctx;
}

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
  // The mobile menu's own open/closed state — see NavbarMobileContext above.
  const [mobileOpen, setMobileOpen] = React.useState(false);

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
      const darkAncestor = el?.closest(".dark");
      // A `dark` scope alone isn't enough: a small contained card (a quote
      // box, a stats plate) can carry `dark` while sitting on an otherwise
      // light section, and the bar shouldn't flip for that — only for an
      // actual full-bleed dark section passing underneath. Distinguish the
      // two by width: a real section spans (near enough) the layout viewport;
      // a contained card doesn't. `clientWidth` excludes the browser scrollbar,
      // while `window.innerWidth` includes it and rejects an otherwise full-
      // bleed section whenever a vertical scrollbar is present. `-2` absorbs
      // sub-pixel rounding.
      const isFullBleed =
        !!darkAncestor &&
        darkAncestor.getBoundingClientRect().width >= document.documentElement.clientWidth - 2;
      setSectionIsDark(isFullBleed);
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

  // Lock page scroll behind the open mobile menu — otherwise the page content
  // scrolls underneath the (non-full-height) panel, which reads as broken.
  React.useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

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
    <NavbarMobileContext.Provider value={{ open: mobileOpen, setOpen: setMobileOpen }}>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-sticky border-b transition-colors",
          scrolled || mobileOpen
            ? "border-default bg-app/95 backdrop-blur"
            : "border-transparent",
          themeScope,
          className,
        )}
        {...props}
      >
        <nav
          className={cn(
            "relative grid grid-cols-[1fr_auto_1fr] items-center px-gutter py-4 lg:px-0",
            contentClassName,
          )}
        >
          {children}
        </nav>
      </header>
    </NavbarMobileContext.Provider>
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

/**
 * The hamburger/close toggle for the mobile menu below. Place it inside
 * `<NavbarActions>` (after the CTA is the usual spot) — it's `lg:hidden`
 * itself, so it only ever shows up where NavbarLinks is actually missing.
 */
function NavbarMobileTrigger({ className, ...props }: React.ComponentProps<"button">) {
  const { open, setOpen } = useNavbarMobile();
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md text-primary transition-colors hover:bg-hover lg:hidden",
        className,
      )}
      {...props}
    >
      {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
    </button>
  );
}

interface NavbarMobileMenuProps extends React.ComponentProps<"div"> {
  /**
   * Theme scope for the open panel. Defaults to `"light"` — same call as
   * NavDropdown's `contentTheme`: the nav sits over dark heroes and flips
   * itself dark, but its menus (this one included) stay a consistent light
   * floating surface. Pass `"dark"` or `"inherit"` to opt out.
   */
  contentTheme?: "light" | "dark" | "inherit";
}

/**
 * The panel NavbarMobileTrigger opens — the mobile/tablet substitute for
 * NavbarLinks. Renders as a sibling of NavbarLinks inside `<Navbar>`; only
 * mounts while open, and is `lg:hidden` itself so it can never show up
 * alongside the desktop link row. A click anywhere inside on an `<a>` closes
 * it (event delegation, so callers don't have to wire `onClick` on every
 * link they pass in), and so does Escape.
 */
function NavbarMobileMenu({
  className,
  contentTheme = "light",
  children,
  ...props
}: NavbarMobileMenuProps) {
  const { open, setOpen } = useNavbarMobile();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) setOpen(false);
      }}
      className={cn(
        contentTheme !== "inherit" && contentTheme,
        "absolute inset-x-0 top-full max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-default bg-app px-gutter py-4 shadow-lg lg:hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  Navbar,
  NavbarBrand,
  NavbarLinks,
  NavbarLink,
  NavbarActions,
  NavbarMobileTrigger,
  NavbarMobileMenu,
};
