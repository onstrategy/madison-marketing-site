import { z } from "zod";
import { Reveal, Eyebrow } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const NewsHeroPropsSchema = z
  .object({
    kicker: NonEmptyStringSchema,
    title: NonEmptyStringSchema,
    author: NonEmptyStringSchema,
    role: NonEmptyStringSchema,
    opener: NonEmptyStringSchema,
  })
  .strict();

type NewsHeroProps = z.infer<typeof NewsHeroPropsSchema>;

export function parseProps(input: unknown): NewsHeroProps {
  return NewsHeroPropsSchema.parse(input);
}

export default function NewsHeroSection({
  kicker,
  title,
  author,
  role,
  opener,
}: NewsHeroProps) {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow className="mb-6 text-brand-accent">{kicker}</Eyebrow>
          <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            {title}
          </h1>
          <p className="mb-6 font-sans text-sm text-secondary">
            {author}, {role}
          </p>
          <p className="text-pretty font-serif text-2xl italic tracking-tight text-primary">
            &ldquo;{opener}&rdquo;
          </p>
        </Reveal>
      </div>
    </section>
  );
}
