import { z } from "zod";
import { Reveal } from "../../../prototypes/landing/parts";

const AnnouncementSubtitlePropsSchema = z
  .object({
    text: z.string().trim().min(1),
  })
  .strict();

type AnnouncementSubtitleProps = z.infer<typeof AnnouncementSubtitlePropsSchema>;

export function parseProps(input: unknown): AnnouncementSubtitleProps {
  return AnnouncementSubtitlePropsSchema.parse(input);
}

// The announcement's lead statement, right under the hero — styled as a
// heading (Lora serif, on the h4 step) rather than plain body copy like
// news-intro's, and deliberately carries no border-b: it sits directly
// above the first announcement-quote card, which is its own contained
// card and doesn't want a divider line cutting across the gap above it.
export default function AnnouncementSubtitleSection({
  text,
}: AnnouncementSubtitleProps) {
  return (
    <section className="bg-app px-gutter py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-balance font-serif text-xl font-medium tracking-tight text-primary lg:text-2xl">
            {text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
