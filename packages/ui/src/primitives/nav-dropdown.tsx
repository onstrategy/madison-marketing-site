import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown, type LucideIcon } from "lucide-react";

import { cn } from "../ui/utils";

// A single "Platform ▾"-style navigation dropdown. Self-contained: each
// instance owns its own Radix NavigationMenu.Root, so it drops into an
// existing NavbarLinks row as a sibling of plain NavbarLink anchors, with no
// shared state between dropdowns. Opens on hover/focus, closes on Escape or
// an outside click — all handled by Radix; only the on-token styling is ours.

export interface NavDropdownItem {
  label: string;
  href: string;
  /** Optional leading icon — pass the same icon used for this item elsewhere on the page. */
  icon?: LucideIcon;
  /** Marks this item as the current page — renders in brand blue inside the open menu. */
  active?: boolean;
}

interface NavDropdownProps {
  /** The trigger label, e.g. "Platform". */
  label: string;
  items: NavDropdownItem[];
  /** Classes for the root wrapper (the trigger's positioning context). */
  className?: string;
  /** Classes for the open menu panel. */
  contentClassName?: string;
  /** Marks the trigger itself as current — true when any item is the active page. */
  active?: boolean;
  /**
   * Theme scope for the open menu panel. Defaults to `"light"`: the Madison site
   * nav sits over dark heroes and flips itself dark, but its menus stay a light
   * floating surface. That is a site-design choice, not a law — a genuinely
   * dark-themed consumer passes `"dark"`, and `"inherit"` follows whatever scope
   * the panel is rendered inside.
   */
  contentTheme?: "light" | "dark" | "inherit";
}

function NavDropdown({
  label,
  items,
  className,
  contentClassName,
  active = false,
  contentTheme = "light",
}: NavDropdownProps) {
  return (
    <NavigationMenuPrimitive.Root className={cn("relative z-dropdown", className)}>
      <NavigationMenuPrimitive.List className="m-0 flex list-none items-center p-0">
        <NavigationMenuPrimitive.Item>
          <NavigationMenuPrimitive.Trigger
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-1 rounded-sm text-sm font-medium outline-none transition-colors focus-visible:ring-[length:var(--ring-width)] focus-visible:ring-brand/50 data-[state=open]:text-primary",
              active ? "text-brand-accent" : "text-secondary hover:text-primary",
            )}
          >
            {label}
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </NavigationMenuPrimitive.Trigger>
          <NavigationMenuPrimitive.Content
            className={cn(
              contentTheme !== "inherit" && contentTheme,
              "absolute left-0 top-full mt-3 min-w-52 rounded-lg border border-default bg-surface p-1.5 shadow-lg",
              contentClassName,
            )}
          >
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {items.map((item) => (
                <li key={item.label}>
                  <NavigationMenuPrimitive.Link asChild>
                    <a
                      href={item.href}
                      aria-current={item.active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-hover focus-visible:ring-[length:var(--ring-width)] focus-visible:ring-brand/50",
                        item.active ? "text-brand-accent" : "text-secondary hover:text-primary",
                      )}
                    >
                      {item.icon ? (
                        <item.icon aria-hidden="true" className="size-4 shrink-0 text-brand-accent" />
                      ) : null}
                      {item.label}
                    </a>
                  </NavigationMenuPrimitive.Link>
                </li>
              ))}
            </ul>
          </NavigationMenuPrimitive.Content>
        </NavigationMenuPrimitive.Item>
      </NavigationMenuPrimitive.List>
    </NavigationMenuPrimitive.Root>
  );
}

export { NavDropdown };
