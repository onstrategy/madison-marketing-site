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
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Override the default per-variant icon. Pass `null` to hide it. */
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    const DefaultIcon = VARIANT_ICONS[variant ?? "default"];
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon === undefined ? <DefaultIcon /> : icon}
        <div className="flex min-w-0 flex-col gap-1">{children}</div>
      </div>
    );
  },
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-secondary", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
