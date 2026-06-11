import * as React from "react";

import { cn } from "../ui/utils";

interface SwitchProps extends React.ComponentProps<"button"> {
  /** Whether the switch is on. Controlled — pair with `onCheckedChange`. */
  checked: boolean;
  /** Called with the next state when the user toggles the switch. */
  onCheckedChange: (checked: boolean) => void;
}

/**
 * An on/off toggle switch, controlled via `checked` / `onCheckedChange`.
 * Neutral-first: the brand-filled track in the on state is the only color.
 * Track `bg-brand` (on) / `bg-hover` (off); the thumb is an elevated `bg-surface`
 * circle that slides exactly one spacing step (`translate-x-5`). Renders a real
 * `<button role="switch">`, so focus and keyboard (Space/Enter) work natively.
 * Label it from the consumer via `aria-label` / `aria-labelledby`.
 */
function Switch({
  checked,
  onCheckedChange,
  className,
  ...props
}: SwitchProps) {
  return (
    <button
      {...props}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "inline-flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 outline-none transition-colors focus-visible:ring-[length:var(--ring-width)] focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-[var(--disabled-opacity)]",
        checked ? "bg-brand" : "bg-hover",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-5 rounded-full bg-surface shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

export { Switch };
export type { SwitchProps };
