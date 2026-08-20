import { z } from "zod";
import { resolveClientStoryImage } from "../../client-stories/assets";
import { ClientStoryImageInputSchema } from "../../client-stories/image";
import { Eyebrow, Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ClientStoryAnnouncementHeroPropsSchema = z
  .object({
    category: NonEmptyStringSchema,
    title: NonEmptyStringSchema,
    photo: ClientStoryImageInputSchema,
  })
  .strict()
  .transform(({ photo, ...props }) => ({
    ...props,
    photo: resolveClientStoryImage(photo),
  }));

type ClientStoryAnnouncementHeroProps = z.infer<
  typeof ClientStoryAnnouncementHeroPropsSchema
>;

export function parseProps(input: unknown): ClientStoryAnnouncementHeroProps {
  return ClientStoryAnnouncementHeroPropsSchema.parse(input);
}

export default function ClientStoryAnnouncementHeroSection({
  category,
  title,
  photo,
}: ClientStoryAnnouncementHeroProps) {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <Eyebrow className="mb-6 text-brand-accent">{category}</Eyebrow>
          {/* text-4xl flat, no lg bump — one step down from the previous
              lg:text-5xl, and matches the "Client Story" template's h1
              (client-story-hero-intro) exactly, so a New Deployment
              announcement and a full case study read at the same title
              size. */}
          <h1 className="text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={80}>
          <img
            src={photo.url}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="aspect-[16/10] w-full rounded-2xl border border-default object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
