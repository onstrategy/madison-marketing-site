import { Play } from "lucide-react";
import { z } from "zod";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const WebinarFullSessionPropsSchema = z
  .object({
    heading: NonEmptyStringSchema,
    videoTitle: NonEmptyStringSchema,
    wistiaId: z.string().regex(/^[a-z0-9]+$/),
  })
  .strict();

type WebinarFullSessionProps = z.infer<typeof WebinarFullSessionPropsSchema>;

export function parseProps(input: unknown): WebinarFullSessionProps {
  return WebinarFullSessionPropsSchema.parse(input);
}

export default function WebinarFullSessionSection({
  heading,
  videoTitle,
  wistiaId,
}: WebinarFullSessionProps) {
  return (
    <section className="dark border-b border-default bg-app px-gutter py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="mb-8 flex items-center gap-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg">
              <Play className="size-4 fill-current" aria-hidden="true" />
            </span>
            <h2 className="text-balance font-serif text-3xl font-medium tracking-tight text-primary">
              {heading}
            </h2>
          </div>
          <div className="light relative aspect-video overflow-hidden rounded-2xl border border-active bg-surface shadow-xl">
            <iframe
              src={`https://fast.wistia.net/embed/iframe/${wistiaId}?web_component=true&seo=true`}
              title={videoTitle}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
