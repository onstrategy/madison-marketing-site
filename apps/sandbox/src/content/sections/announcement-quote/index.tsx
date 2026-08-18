import { z } from "zod";
import { Reveal } from "../../../prototypes/landing/parts";

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

const AnnouncementQuotePropsSchema = z
  .object({
    quote: z
      .object({
        text: NonEmptyStringSchema,
        attribution: NonEmptyStringSchema,
      })
      .strict(),
    // Optional — pairs the quote with a supporting photo when present;
    // falls back to a plain centered quote when omitted.
    photo: PhotoSchema.optional(),
  })
  .strict();

type AnnouncementQuoteProps = z.infer<typeof AnnouncementQuotePropsSchema>;

export function parseProps(input: unknown): AnnouncementQuoteProps {
  return AnnouncementQuotePropsSchema.parse(input);
}

function QuoteText({
  quote,
  align,
}: {
  quote: AnnouncementQuoteProps["quote"];
  align: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : undefined}>
      <p className="text-pretty font-serif text-2xl font-medium italic tracking-tight text-primary">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="mt-5 font-sans text-sm uppercase tracking-widest text-muted">
        {quote.attribution}
      </p>
    </div>
  );
}

// A pull-quote box for the announcement family. With a photo, it pairs the
// quote against a supporting image, left-aligned side by side — the same
// text+photo pairing idiom as IntroSection in ../client-story-hero-intro.
// Without one, it falls back to the plain centered quote treatment already
// established by ../client-story-quote-stats (minus the stats block).
export default function AnnouncementQuoteSection({
  quote,
  photo,
}: AnnouncementQuoteProps) {
  if (photo) {
    return (
      <section className="border-b border-default bg-surface px-gutter py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <QuoteText quote={quote} align="left" />
          </Reveal>
          <Reveal delay={100}>
            <div className="overflow-hidden rounded-2xl border border-default">
              <img
                src={photo.url}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                className="aspect-4/3 size-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <QuoteText quote={quote} align="center" />
        </Reveal>
      </div>
    </section>
  );
}
