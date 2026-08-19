import { z } from "zod";
import { resolveNewsAsset } from "../../news/assets";
import { Eyebrow, Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ArticleHeroInputSchema = z
  .object({
    category: NonEmptyStringSchema,
    title: NonEmptyStringSchema,
    image: z
      .object({
        asset: NonEmptyStringSchema,
        alt: NonEmptyStringSchema,
      })
      .strict()
      .optional(),
  })
  .strict();

const ArticleHeroPropsSchema = ArticleHeroInputSchema.transform(
  ({ image, ...props }) => ({
    ...props,
    image: image
      ? { ...image, url: resolveNewsAsset(image.asset) }
      : undefined,
  }),
);

type ArticleHeroProps = z.infer<typeof ArticleHeroPropsSchema>;

export function parseProps(input: unknown): ArticleHeroProps {
  return ArticleHeroPropsSchema.parse(input);
}

export default function ArticleHeroSection({
  category,
  title,
  image,
}: ArticleHeroProps) {
  if (image) {
    return (
      <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow className="mb-6 text-brand-accent">{category}</Eyebrow>
            <h1 className="text-balance font-serif text-3xl font-medium tracking-tight text-primary lg:text-4xl">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={80}>
            <img
              src={image.url}
              alt={image.alt}
              className="aspect-[16/10] w-full rounded-2xl border border-default object-cover"
            />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-brand-accent">
            {category}
          </Eyebrow>
          <h1 className="text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            {title}
          </h1>
        </Reveal>
      </div>
    </section>
  );
}
