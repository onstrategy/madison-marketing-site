import { UserRound } from "lucide-react";
import { z } from "zod";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const AnnouncementQuotePropsSchema = z
  .object({
    quote: z
      .object({
        text: NonEmptyStringSchema,
        attribution: NonEmptyStringSchema,
      })
      .strict(),
  })
  .strict();

type AnnouncementQuoteProps = z.infer<typeof AnnouncementQuotePropsSchema>;

export function parseProps(input: unknown): AnnouncementQuoteProps {
  return AnnouncementQuotePropsSchema.parse(input);
}

// A contained pull-quote card — same design as QuoteBox in
// ../../../prototypes/webinar-recap-template/template.tsx (colored card,
// placeholder avatar circle standing in for the speaker's face since we
// don't have real headshots on hand, same call as the site's other
// stand-ins for real-world people/logos we don't hold rights to), just
// without that component's `dark` scope.
export default function AnnouncementQuoteSection({
  quote,
}: AnnouncementQuoteProps) {
  return (
    <section className="border-b border-default bg-app px-gutter py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="flex items-start gap-5 rounded-2xl bg-brand-subtle p-6 lg:p-8">
            <span className="flex size-20 shrink-0 items-center justify-center rounded-full border border-default bg-surface text-secondary">
              <UserRound className="size-9" aria-hidden="true" />
            </span>
            <div>
              <p className="text-pretty font-serif text-lg italic leading-snug tracking-tight text-primary lg:text-xl">
                {quote.text}
              </p>
              <p className="mt-3 font-sans text-sm font-semibold text-brand-accent">
                {quote.attribution}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
