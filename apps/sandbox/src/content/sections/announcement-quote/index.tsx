import { UserRound } from "lucide-react";
import { z } from "zod";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const AnnouncementQuotePropsSchema = z
  .object({
    quote: z
      .object({
        // A blank line ("\n\n") breaks the quote into separate paragraphs —
        // use it for a long quote that reads as more than one beat, the same
        // way the source copy for this quote was itself paragraphed.
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
// stand-ins for real-world people/logos we don't hold rights to), but on
// `bg-surface` — the lightest general-purpose surface token — instead of
// that component's `dark`-scoped `bg-brand-subtle`, and with no divider
// against the sections around it.
export default function AnnouncementQuoteSection({
  quote,
}: AnnouncementQuoteProps) {
  const paragraphs = quote.text.split(/\n\n+/);
  return (
    <section className="bg-app px-gutter py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="flex items-start gap-5 rounded-2xl bg-surface p-6 lg:p-8">
            <span className="flex size-20 shrink-0 items-center justify-center rounded-full border border-default bg-app text-secondary">
              <UserRound className="size-9" aria-hidden="true" />
            </span>
            <div className="space-y-4">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-pretty font-serif text-base italic leading-relaxed tracking-tight text-primary lg:text-lg"
                >
                  {paragraph}
                </p>
              ))}
              <p className="font-sans text-sm font-semibold text-brand-accent">
                {quote.attribution}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
