import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../ui/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-[length:var(--ring-width)] focus:ring-brand focus:ring-offset-[length:var(--ring-offset)]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand text-brand-fg hover:bg-brand/80",
        secondary:
          "border-transparent bg-brand-subtle text-brand-accent hover:bg-brand-subtle/80",
        destructive:
          "border-transparent bg-error text-error-fg hover:bg-error/80",
        outline: "text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
