import * as React from "react";

import { cn } from "../ui/utils";

// The Madison Ai brand logo. `LogoMark` is the standalone glyph (Neon Blue, the
// on-token `info` value #00B4FF); `Logo` is the full lockup — mark + "Madison Ai"
// wordmark. Both merge `className` last, so callers can recolor or resize the mark
// (e.g. `<LogoMark className="text-primary" />`) and wrap the lockup in a link.

/** The Madison Ai glyph on its own. Neon Blue by default; recolor via `className`. */
function LogoMark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      width="30"
      height="24"
      viewBox="20 0 280 210"
      fill="currentColor"
      aria-hidden
      className={cn("text-info", className)}
      {...props}
    >
      <path d="M 50 30 C 50 20 60 14 72 14 L 118 14 C 130 14 138 22 140 34 L 150 128 C 152 144 144 152 132 148 C 122 144 116 132 116 120 L 116 80 C 116 70 110 64 100 64 L 100 158 C 100 174 90 184 74 184 L 60 184 C 44 184 36 172 36 156 L 38 60 C 38 42 42 30 50 30 Z" />
      <path d="M 188 28 C 190 18 200 12 212 12 L 256 12 C 272 12 282 22 282 38 L 274 158 C 272 174 260 184 244 184 L 206 184 C 192 184 182 174 184 160 Z" />
      <circle cx="56" cy="168" r="34" />
    </svg>
  );
}

/** The full logo lockup — mark + "Madison Ai" wordmark. Wrap in an anchor to link it. */
function Logo({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5", className)}
      {...props}
    >
      <LogoMark />
      <span className="text-xl font-bold tracking-tight text-primary">
        Madison Ai
      </span>
    </span>
  );
}

export { Logo, LogoMark };
