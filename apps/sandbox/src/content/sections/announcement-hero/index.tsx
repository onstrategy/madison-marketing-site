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

// The announcement family's hero — same split layout as HeroSection in
// ../../../prototypes/about-us/index.tsx (tag + title left, photo card
// right, dark), but with a landscape photo instead of About Us's portrait
// one, and no subtitle/CTA button — an announcement's subtitle is its own
// section (news-intro) right below this one.
export default function AnnouncementHeroSection({
  kicker,
  title,
  photo,
}: AnnouncementHeroProps) {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Eyebrow className="mb-6 text-brand-accent">{kicker}</Eyebrow>
          <h1 className="text-balance font-serif text-4xl font-medium tracking-tight text-primary lg:text-5xl">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={100}>
          <div className="aspect-video overflow-hidden rounded-3xl border-2 border-[hsl(var(--text-primary)/0.15)] shadow-2xl">
            <img
              src={photo.url}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
