import { z } from "zod";
import { cn } from "@madison/ui/utils";
import { resolveClientStoryImage } from "../../client-stories/assets";
import { ClientStoryImageInputSchema } from "../../client-stories/image";
import { clientStoryQuoteSize } from "../../client-stories/quote-scale";
import { Reveal, Eyebrow } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ClientStoryQuoteStatsPropsSchema = z
  .object({
    quote: z
      .object({
        text: NonEmptyStringSchema,
        attribution: NonEmptyStringSchema,
        photo: ClientStoryImageInputSchema.optional(),
      })
      .strict(),
    stats: z
      .object({
        eyebrow: NonEmptyStringSchema,
        items: z
          .array(
            z
              .object({
                /**
                 * The headline figure — digits and symbols only, no unit words.
                 *
                 * Two house rules, so Results reads consistently across every
                 * client story:
                 *
                 * 1. Round thousands abbreviate: "$108K", not "$108,000";
                 *    "50K+", not "50,000+". A figure that is NOT a round
                 *    thousand keeps its exact digits ("$10,107", "2,857") —
                 *    abbreviating those would round away real precision.
                 * 2. Units live in `label`, not here. "1,075 Hours" becomes
                 *    value "1,075" with the unit moved to the front of the
                 *    label, so the number itself renders at full display size
                 *    and every tile's figure is the same shape. A trailing
                 *    "%" or "+" is part of the figure, not a unit, and stays.
                 */
                value: NonEmptyStringSchema,
                label: NonEmptyStringSchema,
              })
              .strict(),
          )
          .min(1),
      })
      .strict(),
  })
  .strict()
  .transform(({ quote, stats }) => ({
    quote: {
      ...quote,
      photo: quote.photo
        ? resolveClientStoryImage(quote.photo)
        : undefined,
    },
    stats,
  }));

type ClientStoryQuoteStatsProps = z.infer<
  typeof ClientStoryQuoteStatsPropsSchema
>;

export function parseProps(input: unknown): ClientStoryQuoteStatsProps {
  return ClientStoryQuoteStatsPropsSchema.parse(input);
}

/**
 * How the Results metrics lay out at `lg`, by how many there are.
 *
 * Up to four sit inline on one row. Beyond that they split into two balanced
 * rows — `ceil(n / 2)` columns, so five reads 3+2 and six reads 3+3 rather
 * than filling a fixed four-wide grid and leaving a stubby orphan row.
 *
 * Both divider rules are written as selectors rather than Tailwind's `divide-*`
 * helpers, which can't express this: `divide-x` puts a left border on every
 * child but the first, so in a wrapped grid the item starting row two gets a
 * stray vertical line hanging off the grid's left edge. Keying off the column
 * count instead puts verticals only between real neighbours, and the
 * horizontal rule only under a genuine row break.
 *
 * Mobile is deliberately untouched: one continuous two-up grid at every count,
 * because a row of three would either orphan an item or squeeze the large
 * serif figures past their column.
 */
const STAT_LAYOUTS = [
  { upTo: 2, cols: "lg:grid-cols-2", between: "lg:[&>*:not(:nth-child(2n+1))]:border-l", rowRule: "" },
  { upTo: 3, cols: "lg:grid-cols-3", between: "lg:[&>*:not(:nth-child(3n+1))]:border-l", rowRule: "" },
  { upTo: 4, cols: "lg:grid-cols-4", between: "lg:[&>*:not(:nth-child(4n+1))]:border-l", rowRule: "" },
  // Two rows from here down — hence a horizontal rule under the first.
  {
    upTo: 6,
    cols: "lg:grid-cols-3",
    between: "lg:[&>*:not(:nth-child(3n+1))]:border-l",
    rowRule: "lg:[&>*:nth-child(n+4)]:border-t",
  },
  {
    upTo: 8,
    cols: "lg:grid-cols-4",
    between: "lg:[&>*:not(:nth-child(4n+1))]:border-l",
    rowRule: "lg:[&>*:nth-child(n+5)]:border-t",
  },
] as const;

function statLayout(count: number) {
  return STAT_LAYOUTS.find((l) => count <= l.upTo) ?? STAT_LAYOUTS[STAT_LAYOUTS.length - 1];
}

export default function ClientStoryQuoteStatsSection({
  quote,
  stats,
}: ClientStoryQuoteStatsProps) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          {quote.photo ? (
            <img
              src={quote.photo.url}
              alt={quote.photo.alt}
              width={quote.photo.width}
              height={quote.photo.height}
              loading="lazy"
              className="mx-auto mb-8 size-28 rounded-full border border-active object-cover shadow-md"
            />
          ) : null}
          {/* Size steps down as the quote gets longer — see quote-scale.ts. */}
          <p
            className={cn(
              "text-balance font-serif font-medium italic tracking-tight text-primary",
              clientStoryQuoteSize(quote.text, "3xl"),
            )}
          >
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="mt-6 font-sans text-sm uppercase tracking-widest text-muted">
            {quote.attribution}
          </p>
        </Reveal>
      </div>
      <div className="mx-auto mt-16 max-w-6xl">
        <Reveal>
          <div className="dark overflow-hidden rounded-2xl border border-default bg-app">
            <div className="px-16 pt-10 text-center">
              <Eyebrow className="text-brand-accent">{stats.eyebrow}</Eyebrow>
            </div>
            <div className="mt-8 border-t border-default" aria-hidden />
            <div
              className={cn(
                "grid grid-cols-2 divide-y divide-default border-default lg:divide-y-0",
                statLayout(stats.items.length).cols,
                statLayout(stats.items.length).between,
                statLayout(stats.items.length).rowRule,
              )}
            >
              {stats.items.map((stat) => (
                <div
                  key={stat.label}
                  className="px-2 pt-8 pb-10 text-center lg:px-8"
                >
                  <div className="font-serif text-5xl font-medium tracking-tight text-primary">
                    {stat.value}
                  </div>
                  <p className="mt-2 font-sans text-sm text-secondary">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
