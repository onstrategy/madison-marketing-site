import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

import { cn } from "../ui/utils";

const alertVariants = cva(
  "relative flex w-full gap-3 rounded-lg border px-4 py-3 text-primary [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        // Color is the signal: subtle bg + soft semantic border + colored icon.
        // Title/description text stays neutral for readability (neutral-first).
        default: "bg-surface border-default [&>svg]:text-secondary",
        info: "bg-info-subtle border-info/30 [&>svg]:text-info",
        success: "bg-success-subtle border-success/30 [&>svg]:text-success",
        warning: "bg-warning-subtle border-warning/30 [&>svg]:text-warning",
        error: "bg-error-subtle border-error/30 [&>svg]:text-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const VARIANT_ICONS = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
} as const;

interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  /** Override the default per-variant icon. Pass `null` to hide it. */
  icon?: React.ReactNode;
}

function Alert({ className, variant, icon, children, ...props }: AlertProps) {
  const DefaultIcon = VARIANT_ICONS[variant ?? "default"];
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon === undefined ? <DefaultIcon /> : icon}
      <div className="flex min-w-0 flex-col gap-1">{children}</div>
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      className={cn("font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-sm text-secondary", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
