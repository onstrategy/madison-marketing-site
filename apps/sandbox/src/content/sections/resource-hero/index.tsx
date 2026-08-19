import { z } from "zod";
import { Eyebrow, Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ResourceHeroPropsSchema = z
  .object({
    category: NonEmptyStringSchema,
    title: NonEmptyStringSchema,
    author: NonEmptyStringSchema.optional(),
    date: NonEmptyStringSchema.optional(),
  })
  .strict();

type ResourceHeroProps = z.infer<typeof ResourceHeroPropsSchema>;

export function parseProps(input: unknown): ResourceHeroProps {
  return ResourceHeroPropsSchema.parse(input);
}

export default function ResourceHeroSection({
  category,
  title,
  author,
  date,
}: ResourceHeroProps) {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-brand-accent">
            {category}
          </Eyebrow>
          <h1 className="text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            {title}
          </h1>
          {author || date ? (
            <p className="mt-6 text-sm text-secondary">
              {[author, date].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
