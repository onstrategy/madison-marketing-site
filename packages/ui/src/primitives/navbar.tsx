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

// px scrolled before the bar switches from transparent to solid.
const SCROLL_THRESHOLD = 8;

interface NavbarProps extends React.ComponentProps<"header"> {
  /** Extra classes for the inner <nav> row — override width/gutters here. */
  contentClassName?: string;
}

function Navbar({
  className,
  contentClassName,
  children,
  ...props
}: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-sticky border-b transition-colors",
        scrolled
          ? "border-default bg-app/80 backdrop-blur"
          : "border-transparent",
        className,
      )}
      {...props}
    >
      <nav
        className={cn(
          "flex items-center justify-between px-6 py-4 lg:px-12",
          contentClassName,
        )}
      >
        {children}
      </nav>
    </header>
  );
}

/** The brand slot — logo mark + wordmark. Renders an anchor. */
function NavbarBrand({ className, ...props }: React.ComponentProps<"a">) {
  return <a className={cn("flex items-center gap-2.5", className)} {...props} />;
}

/** The center link group. Hidden below the `lg` breakpoint. */
function NavbarLinks({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("hidden items-center gap-7 lg:flex", className)}
      {...props}
    />
  );
}

/** A single nav link. Accepts a trailing icon (e.g. a chevron) as a child. */
function NavbarLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-primary",
        className,
      )}
      {...props}
    />
  );
}

/** The trailing actions cluster — sign-in link, CTA, theme toggle. */
function NavbarActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-4", className)} {...props} />
  );
}

export { Navbar, NavbarBrand, NavbarLinks, NavbarLink, NavbarActions };
