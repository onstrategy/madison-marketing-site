import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../ui/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-[var(--disabled-opacity)] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-brand focus-visible:ring-brand/50 focus-visible:ring-[length:var(--ring-width)] aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error [&_[class*='lucide-arrow']]:transition-transform hover:[&_[class*='lucide-arrow']]:translate-x-0.5",
  {
    variants: {
      variant: {
        // PRIMARY: brand background — use ONLY for main CTAs (~10% of buttons)
        default: "bg-brand text-brand-fg hover:bg-brand-hover shadow-sm",

        // DESTRUCTIVE: red background — use ONLY for destructive actions
        destructive:
          "bg-error text-error-fg hover:bg-error/90 shadow-sm focus-visible:border-error focus-visible:ring-error/50",

        // SUCCESS: green background
        success:
          "bg-success text-success-fg hover:bg-success/90 shadow-sm focus-visible:border-success focus-visible:ring-success/50",

        // WARNING: amber background
        warning:
          "bg-warning text-warning-fg hover:bg-warning/90 shadow-sm focus-visible:border-warning focus-visible:ring-warning/50",

        // OUTLINE: neutral with border — use for secondary actions (~30% of buttons)
        // border-active (not border-default) + explicit text-primary: buttons are small
        // interactive elements, and text color must not rely on inheritance — a button
        // nested in a `dark`/`light`-scoped section needs its own color resolved locally.
        outline:
          "border border-active bg-transparent text-primary hover:bg-hover hover:text-primary shadow-xs",

        // SEMANTIC OUTLINES: match semantic intent with borders and focus rings
        "outline-destructive":
          "border border-error/30 bg-transparent text-error hover:bg-error-subtle focus-visible:border-error focus-visible:ring-error/50 shadow-xs",
        "outline-success":
          "border border-success/30 bg-transparent text-success hover:bg-success-subtle focus-visible:border-success focus-visible:ring-success/50 shadow-xs",
        "outline-warning":
          "border border-warning/30 bg-transparent text-warning hover:bg-warning-subtle focus-visible:border-warning focus-visible:ring-warning/50 shadow-xs",

        // SECONDARY: subtle brand background — use for tertiary actions
        secondary: "bg-brand-subtle text-brand hover:bg-brand-subtle/80",

        // GHOST: minimal — use for low-emphasis actions (navigation, icons)
        ghost: "bg-transparent text-primary hover:bg-hover hover:text-primary",

        // SEMANTIC GHOSTS: subtle backgrounds on hover
        "ghost-destructive":
          "bg-transparent text-error hover:bg-error-subtle focus-visible:border-error focus-visible:ring-error/50",
        "ghost-success":
          "bg-transparent text-success hover:bg-success-subtle focus-visible:border-success focus-visible:ring-success/50",
        "ghost-warning":
          "bg-transparent text-warning hover:bg-warning-subtle focus-visible:border-warning focus-visible:ring-warning/50",

        // LINK: text-only — use for inline links
        link: "text-primary underline-offset-4 hover:underline bg-transparent",
      },
      // The design system offers exactly two general-purpose sizes —
      // `default` and `lg` — both set at 16px (`text-base`) so button copy
      // reads at the same size as body text. `sm` is NOT one of the two: it's
      // reserved for the one compact spot that needs it (the fixed site nav's
      // CTA), kept at the smaller 14px (`text-sm`) it always had so it doesn't
      // look oversized in that bar. Icon-only buttons mirror the same "two
      // sizes" rule with `icon` / `icon-lg`.
      size: {
        default: "h-9 rounded-full px-4 py-2 text-base has-[>svg]:px-3",
        sm: "h-8 rounded-full gap-1.5 px-3 text-sm has-[>svg]:px-2.5",
        // Marketing CTA proportions from the Madison site: pill radius, generous
        // padding (15px / 26px), and — unlike the compact sizes — no padding
        // reduction when an icon is present.
        lg: "rounded-full px-6.5 py-3.75 text-base",
        icon: "size-9 rounded-md",
        "icon-lg": "size-10 rounded-md",
      },
      rounded: {
        default: "",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, rounded, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
