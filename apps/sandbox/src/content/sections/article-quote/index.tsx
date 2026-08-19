import { z } from "zod";
import { resolveNewsAsset } from "../../news/assets";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ArticleQuoteInputSchema = z
  .object({
    quote: NonEmptyStringSchema,
    attribution: NonEmptyStringSchema.optional(),
    portrait: z
      .object({
        asset: NonEmptyStringSchema,
        alt: NonEmptyStringSchema,
      })
      .strict()
      .optional(),
  })
  .strict();

const ArticleQuotePropsSchema = ArticleQuoteInputSchema.transform(
  ({ portrait, ...props }) => ({
    ...props,
    portrait: portrait
      ? { ...portrait, url: resolveNewsAsset(portrait.asset) }
      : undefined,
  }),
);

type ArticleQuoteProps = z.infer<typeof ArticleQuotePropsSchema>;

export function parseProps(input: unknown): ArticleQuoteProps {
  return ArticleQuotePropsSchema.parse(input);
}

export default function ArticleQuoteSection({
  quote,
  attribution,
  portrait,
}: ArticleQuoteProps) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <figure className="flex flex-col items-center gap-8 rounded-2xl border border-default bg-panel p-8 text-center sm:flex-row sm:text-left lg:p-10">
            {portrait ? (
              <img
                src={portrait.url}
                alt={portrait.alt}
                className="size-28 shrink-0 rounded-full border border-active object-cover"
              />
            ) : null}
            <div>
              <blockquote className="text-balance font-serif text-2xl font-medium italic tracking-tight text-primary">
                {quote}
              </blockquote>
              {attribution ? (
                <figcaption className="mt-4 text-sm font-semibold text-secondary">
                  {attribution}
                </figcaption>
              ) : null}
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
