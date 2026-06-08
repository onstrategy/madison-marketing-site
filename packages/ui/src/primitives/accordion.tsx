import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "../ui/utils";

// Radix-backed disclosure list, following the Tabs/Select wrapper pattern. Use
// `type="single"` (optionally `collapsible`) for one-open-at-a-time, or `type="multiple"`
// for independent toggles. Keyboard nav + ARIA come from Radix; the styling is the on-token
// port of the validated FAQ prototype (neutral dividers, brand focus ring, rotating chevron).
const Accordion = AccordionPrimitive.Root;

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-default last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 items-center justify-between gap-4 px-6 py-5 text-left font-medium text-primary transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-[length:var(--ring-width)] focus-visible:ring-inset focus-visible:ring-brand/50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden="true"
          className="size-5 shrink-0 text-secondary transition-transform duration-200"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content className="overflow-hidden text-secondary" {...props}>
      <div className={cn("px-6 pb-5 leading-relaxed", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
