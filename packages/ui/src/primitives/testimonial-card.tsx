import * as React from "react";
import { Quote } from "lucide-react";
import { cn } from "../ui/utils";
import { Card, CardContent } from "./card";

interface TestimonialCardProps extends React.ComponentProps<typeof Card> {
  /** The testimonial text. Rendered inside a blockquote, wrapped in quote marks. */
  quote: string;
  /** Author's full name. Its initials become the monogram avatar. */
  name: string;
  /**
   * Author's role / company, shown beneath the name. Named `roleLabel` (not
   * `role`) so it doesn't shadow the reserved ARIA `role` attribute — a plain
   * `role` prop reads as an ARIA role to a11y linters and to anyone scanning the JSX.
   */
  roleLabel: string;
}

/** First letters of the first two words of a name, e.g. "Maya Chen" → "MC". */
function monogram(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

/**
 * A customer testimonial — a quote with an author monogram, name, and role.
 * Composes Card/CardContent and stays neutral-first; the only accent is the
 * brand-colored quote glyph.
 */
function TestimonialCard({
  quote,
  name,
  roleLabel,
  className,
  ...props
}: TestimonialCardProps) {
  return (
    <Card className={cn("h-full", className)} {...props}>
      <CardContent className="flex h-full flex-col gap-6 pt-card">
        <figure className="flex h-full flex-col gap-6">
          <Quote className="size-6 shrink-0 text-brand" aria-hidden />
          <blockquote className="text-pretty text-secondary">
            “{quote}”
          </blockquote>
          <figcaption className="mt-auto flex items-center gap-3">
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-default bg-app text-sm font-medium text-primary"
            >
              {monogram(name)}
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium text-primary">{name}</span>
              <span className="text-xs text-muted">{roleLabel}</span>
            </span>
          </figcaption>
        </figure>
      </CardContent>
    </Card>
  );
}

export { TestimonialCard };
export type { TestimonialCardProps };
