import { z } from "zod";
import { Eyebrow, Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const WebinarHeroPropsSchema = z
  .object({
    category: NonEmptyStringSchema,
    title: NonEmptyStringSchema,
    subtitle: NonEmptyStringSchema.optional(),
  })
  .strict();

type WebinarHeroProps = z.infer<typeof WebinarHeroPropsSchema>;

export function parseProps(input: unknown): WebinarHeroProps {
  return WebinarHeroPropsSchema.parse(input);
}

export default function WebinarHeroSection({
  category,
  title,
  subtitle,
}: WebinarHeroProps) {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-brand-accent">
            {category}
          </Eyebrow>
          <h1 className="text-balance font-serif text-4xl font-medium tracking-tight text-primary lg:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-secondary">
              {subtitle}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
