import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { resolveResponsibleAiAsset } from "../../responsible-ai/assets";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ResourceRelatedPropsSchema = z
  .object({
    title: NonEmptyStringSchema.default("Similar resources"),
    cards: z
      .array(
        z
          .object({
            title: NonEmptyStringSchema,
            description: NonEmptyStringSchema.optional(),
            href: z.string().regex(/^\/resources\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/),
            imageAsset: NonEmptyStringSchema,
            imageAlt: NonEmptyStringSchema,
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

type ResourceRelatedProps = z.infer<typeof ResourceRelatedPropsSchema>;

export function parseProps(input: unknown): ResourceRelatedProps {
  return ResourceRelatedPropsSchema.parse(input);
}

export default function ResourceRelatedSection({
  title,
  cards,
}: ResourceRelatedProps) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="mb-8 text-balance font-serif text-3xl font-medium tracking-tight text-primary">
            {title}
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <Reveal key={card.href}>
              <a
                href={card.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-default bg-panel transition-transform hover:-translate-y-1"
              >
                <img
                  src={resolveResponsibleAiAsset(card.imageAsset)}
                  alt={card.imageAlt}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-card">
                  <h3 className="font-sans text-lg font-semibold text-primary">
                    {card.title}
                  </h3>
                  {card.description ? (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary">
                      {card.description}
                    </p>
                  ) : (
                    <span className="flex-1" aria-hidden="true" />
                  )}
                  <span className="mt-4 inline-flex items-center gap-inline text-sm font-semibold text-brand-accent">
                    Read more <ArrowRight className="size-4" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
