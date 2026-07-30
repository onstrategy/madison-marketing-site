import * as React from "react";

import { cn } from "../ui/utils";

interface InputProps extends React.ComponentProps<"input"> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

function Input({
  className,
  type,
  startContent,
  endContent,
  ...props
}: InputProps) {
  const hasStartContent = !!startContent;
  const hasEndContent = !!endContent;

  return (
    <div
      className={cn(
        "flex h-9 w-full rounded-md border border-default bg-transparent text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-primary focus-within:outline-none focus-within:ring-[length:var(--ring-width)] focus-within:ring-brand disabled:cursor-not-allowed disabled:opacity-[var(--disabled-opacity)] md:text-sm",
        className,
      )}
    >
      {hasStartContent && (
        <div className="flex items-center pl-3">{startContent}</div>
      )}
      <input
        type={type}
        className={cn(
          "flex-1 min-w-0 bg-transparent text-primary outline-none py-1 placeholder:text-muted",
          // Left padding: reduce when start content exists, otherwise default.
          hasStartContent ? "pl-2" : "pl-3",
          // Right padding: reduce when end content exists, otherwise default.
          hasEndContent ? "pr-2" : "pr-3",
        )}
        {...props}
      />
      {hasEndContent && (
        <div className="flex items-center pr-3">{endContent}</div>
      )}
    </div>
  );
}

export { Input };
