import { z } from "zod";
import { Reveal, Eyebrow } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const PhotoSchema = z
  .object({
    url: z.string().url().refine((url) => url.startsWith("https://"), {
      message: "must use an https URL",
    }),
    alt: NonEmptyStringSchema,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })
  .strict();

const AnnouncementHeroPropsSchema = z
  .object({
    kicker: NonEmptyStringSchema,
    title: NonEmptyStringSchema,
    photo: PhotoSchema,
  })
  .strict();

type AnnouncementHeroProps = z.infer<typeof AnnouncementHeroPropsSchema>;

export function parseProps(input: unknown): AnnouncementHeroProps {
  return AnnouncementHeroPropsSchema.parse(input);
}

// The announcement family's hero — a tag ("New Deployment", "Partnership", …)
// over a full-bleed background photo, no CTA button or meta card. Same
// background-photo treatment as HeroSection in ../client-story-hero-intro,
// stripped down to just the tag + title an announcement actually needs.
export default function AnnouncementHeroSection({
  kicker,
  title,
  photo,
}: AnnouncementHeroProps) {
  return (
    <section className="dark relative border-b border-default bg-app">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={photo.url}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-app via-app/70 to-app/30" />
        <div className="absolute inset-0 bg-app/60" />
      </div>
      <div className="relative mx-auto max-w-4xl px-gutter pb-24 pt-28 lg:px-0 lg:pt-40">
        <Reveal>
          <Eyebrow className="mb-6 text-brand-accent">{kicker}</Eyebrow>
          <h1 className="text-balance font-serif text-4xl font-medium tracking-tight text-primary lg:text-5xl">
            {title}
          </h1>
        </Reveal>
      </div>
    </section>
  );
}
