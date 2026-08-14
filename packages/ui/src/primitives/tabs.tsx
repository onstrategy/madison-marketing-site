import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../ui/utils";

const Tabs = TabsPrimitive.Root;

// Set on TabsList and read by every TabsTrigger underneath it, so a consumer
// sets `variant` once on the list instead of repeating it on each trigger
// (which would let list and trigger drift out of sync). A trigger can still
// override its own variant explicitly if it ever needs to.
const TabsVariantContext = React.createContext<"default" | "brand">("default");

const tabsListVariants = cva(
  "inline-flex h-9 items-center justify-center rounded-lg p-1",
  {
    variants: {
      variant: {
        // NEUTRAL (default): the system's standard switcher — a muted track,
        // the active tab lifts to a plain white/surface pill.
        default: "bg-hover text-muted",

        // BRAND: a blue-toned switcher for light backgrounds — a pale-blue
        // track (bg-brand-subtle) with blue ink on the inactive tabs, and
        // the active tab as a solid Neon Blue pill (see tabsTriggerVariants).
        // Only the active tab carries the solid fill, so this still reads as
        // "one accent, sparingly" rather than a wall of blue.
        brand: "bg-brand-subtle text-brand-accent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

function TabsList({ className, variant, ...props }: TabsListProps) {
  const resolved = variant ?? "default";
  return (
    <TabsVariantContext.Provider value={resolved}>
      <TabsPrimitive.List
        className={cn(tabsListVariants({ variant: resolved }), className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  );
}

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-[length:var(--ring-width)] focus-visible:ring-brand focus-visible:ring-offset-[length:var(--ring-offset)] disabled:pointer-events-none disabled:opacity-[var(--disabled-opacity)]",
  {
    variants: {
      variant: {
        default:
          "data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow",
        // Matches Button's primary CTA pairing (bg-brand + text-brand-fg) for
        // the active tab — the same "solid Neon Blue fill, white text" legal
        // pairing, just applied to a selection state instead of a click.
        brand:
          "hover:bg-brand/10 data-[state=active]:bg-brand data-[state=active]:text-brand-fg data-[state=active]:shadow-sm",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

function TabsTrigger({ className, variant, ...props }: TabsTriggerProps) {
  const contextVariant = React.useContext(TabsVariantContext);
  const resolved = variant ?? contextVariant;
  return (
    <TabsPrimitive.Trigger
      className={cn(tabsTriggerVariants({ variant: resolved }), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-2 focus-visible:outline-none focus-visible:ring-[length:var(--ring-width)] focus-visible:ring-brand focus-visible:ring-offset-[length:var(--ring-offset)]",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
