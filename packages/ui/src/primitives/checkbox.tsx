import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "../ui/utils";

function Checkbox({
  className,
  checked,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      className={cn(
        "grid place-content-center h-4 w-4 shrink-0",
        "rounded-sm border border-default bg-surface shadow",
        "focus:outline-none focus:ring-2 focus:ring-muted/50 focus:ring-offset-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-muted/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:!bg-brand data-[state=checked]:!text-brand-fg data-[state=checked]:!border-transparent",
        "data-[state=indeterminate]:!bg-brand data-[state=indeterminate]:!text-brand-fg data-[state=indeterminate]:!border-transparent",
        "peer",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("grid place-content-center text-current")}
      >
        {checked === "indeterminate" ? (
          <div className="h-0.5 w-2 rounded bg-current" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
