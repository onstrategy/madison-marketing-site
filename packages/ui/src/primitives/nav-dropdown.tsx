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
  /** Card body copy — only rendered by `variant="mega"`'s primary grid. */
  description?: string;
}

interface NavDropdownProps {
  /** The trigger label, e.g. "Platform". */
  label: string;
  items: NavDropdownItem[];
  /**
   * Lower-emphasis items rendered as a compact link row below `items`, inside
   * the same panel — only meaningful with `variant="mega"`. For destinations
   * that belong in this menu but don't deserve full card billing.
   */
  secondaryItems?: NavDropdownItem[];
  /**
   * `"list"` (default) — the original compact single-column menu.
   * `"mega"` — a wider panel: `items` render as a 2-column card grid (icon,
   * label, description), with `secondaryItems` as a plain link row underneath.
   * Reach for this when a nav item's destinations are prominent enough to
   * deserve more visual weight than a simple list (e.g. "Platform").
   */
  variant?: "list" | "mega";
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
  secondaryItems,
  variant = "list",
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
              "absolute left-0 top-full mt-3 rounded-lg",
              // Mega panels are a fixed, slightly see-through tint of
              // `bg-surface` — no `backdrop-blur`/`backdrop-saturate`. Those
              // read differently depending on what's rendered underneath (a
              // photo vs. a plain section) and this panel opens over whatever
              // is scrolled beneath it, so a blur-based "glass" look isn't
              // reliable here. A flat opacity plus a real border and a heavy
              // shadow gives a consistent look at any scroll position instead.
              // List panels stay plain and fully opaque, which reads better
              // for a short menu.
              variant === "mega"
                ? "w-120 border border-default bg-surface/95 p-4 shadow-2xl"
                : "min-w-52 border border-default bg-surface p-1.5 shadow-lg",
              contentClassName,
            )}
          >
            {variant === "mega" ? (
              <>
                {/* Primary set — a 2-column card grid, one per featured destination. */}
                <ul className="m-0 grid grid-cols-2 gap-2.5 p-0">
                  {items.map((item) => (
                    <li key={item.label} className="list-none">
                      <NavigationMenuPrimitive.Link asChild>
                        <a
                          href={item.href}
                          aria-current={item.active ? "page" : undefined}
                          className={cn(
                            "flex h-full flex-col gap-3 rounded-lg border border-default bg-surface/60 p-4 outline-none transition-colors hover:border-active hover:bg-surface focus-visible:ring-[length:var(--ring-width)] focus-visible:ring-brand/50",
                            item.active && "border-active bg-surface",
                          )}
                        >
                          {item.icon ? (
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-hover text-brand-fg">
                              <item.icon aria-hidden="true" className="size-4.5" />
                            </span>
                          ) : null}
                          <span>
                            <span
                              className={cn(
                                "block text-sm font-semibold",
                                item.active ? "text-brand-accent" : "text-primary",
                              )}
                            >
                              {item.label}
                            </span>
                            {item.description ? (
                              <span className="mt-1 block text-xs leading-relaxed text-secondary">
                                {item.description}
                              </span>
                            ) : null}
                          </span>
                        </a>
                      </NavigationMenuPrimitive.Link>
                    </li>
                  ))}
                </ul>
                {/* Secondary set — plain link row, clearly lighter weight than the cards above. */}
                {secondaryItems && secondaryItems.length > 0 ? (
                  <ul className="m-0 mt-4 flex list-none flex-wrap gap-x-5 gap-y-2 border-t border-default p-0 pt-3.5">
                    {secondaryItems.map((item) => (
                      <li key={item.label}>
                        <NavigationMenuPrimitive.Link asChild>
                          <a
                            href={item.href}
                            aria-current={item.active ? "page" : undefined}
                            className={cn(
                              "flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-medium outline-none transition-colors hover:text-primary focus-visible:ring-[length:var(--ring-width)] focus-visible:ring-brand/50",
                              item.active ? "text-brand-accent" : "text-secondary",
                            )}
                          >
                            {item.icon ? (
                              <item.icon aria-hidden="true" className="size-3.5 shrink-0" />
                            ) : null}
                            {item.label}
                          </a>
                        </NavigationMenuPrimitive.Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : (
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
            )}
          </NavigationMenuPrimitive.Content>
        </NavigationMenuPrimitive.Item>
      </NavigationMenuPrimitive.List>
    </NavigationMenuPrimitive.Root>
  );
}

export { NavDropdown };
