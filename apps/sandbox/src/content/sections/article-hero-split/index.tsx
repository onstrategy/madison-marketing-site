import { z } from "zod";
import { resolveNewsAsset } from "../../news/assets";
import { Eyebrow, Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ArticleHeroSplitInputSchema = z
  .object({
    category: NonEmptyStringSchema,
    title: NonEmptyStringSchema,
    author: NonEmptyStringSchema,
    role: NonEmptyStringSchema,
    authorAvatarAsset: NonEmptyStringSchema,
    authorAvatarAlt: NonEmptyStringSchema,
    heroAsset: NonEmptyStringSchema,
    heroAlt: NonEmptyStringSchema,
  })
  .strict();

const ArticleHeroSplitPropsSchema = ArticleHeroSplitInputSchema.transform(
  ({ authorAvatarAsset, heroAsset, ...props }) => ({
    ...props,
    authorAvatarUrl: resolveNewsAsset(authorAvatarAsset),
    heroUrl: resolveNewsAsset(heroAsset),
  }),
);

type ArticleHeroSplitProps = z.infer<typeof ArticleHeroSplitPropsSchema>;

export function parseProps(input: unknown): ArticleHeroSplitProps {
  return ArticleHeroSplitPropsSchema.parse(input);
}

export default function ArticleHeroSplitSection({
  category,
  title,
  author,
  role,
  authorAvatarUrl,
  authorAvatarAlt,
  heroUrl,
  heroAlt,
}: ArticleHeroSplitProps) {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <Eyebrow className="mb-6 text-brand-accent">{category}</Eyebrow>
          <h1 className="text-balance font-serif text-4xl font-medium tracking-tight text-primary lg:text-5xl">
            {title}
          </h1>
          <div className="mt-8 flex items-center gap-3">
            <img
              src={authorAvatarUrl}
              alt={authorAvatarAlt}
              className="size-12 rounded-full border border-default object-cover"
            />
            <p className="text-sm text-secondary">
              By <span className="font-semibold text-primary">{author}</span>, {role}
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <img
            src={heroUrl}
            alt={heroAlt}
            className="aspect-[16/10] w-full rounded-2xl border border-default object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
