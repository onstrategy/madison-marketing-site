import { z } from "zod";
import { resolveClientStoryImage } from "../../client-stories/assets";
import { ClientStoryImageInputSchema } from "../../client-stories/image";
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
          <p className="text-balance font-serif text-3xl font-medium italic tracking-tight text-primary">
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
            <div className="grid grid-cols-2 divide-y divide-default lg:grid-cols-4 lg:divide-x lg:divide-y-0">
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
