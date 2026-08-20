import * as React from "react";

import { cn } from "../ui/utils";

type TextareaProps = React.ComponentProps<"textarea">;

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        // `light` — a textarea is always a white field, regardless of whether
        // it sits on a light or dark-scoped section/card. Matches `Input`:
        // without it, bg-surface would resolve to the dark value wherever the
        // field is nested in a dark-scoped subtree, and it would lose its
        // "this is a field" affordance.
        "light flex min-h-24 w-full rounded-md border border-default bg-surface px-3 py-2 text-base text-primary shadow-sm outline-none transition-colors placeholder:text-muted focus-visible:ring-[length:var(--ring-width)] focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-[var(--disabled-opacity)] md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
export type { TextareaProps };
