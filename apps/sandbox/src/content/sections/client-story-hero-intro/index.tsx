import { Download } from "lucide-react";
import { z } from "zod";
import { Button } from "@madison/ui/button";
import { cn } from "@madison/ui/utils";
import { resolveClientStoryImage } from "../../client-stories/assets";
import { ClientStoryImageInputSchema } from "../../client-stories/image";
import { Reveal, Eyebrow } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const LogoAssetSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:png|jpe?g|webp|avif)$/);

const ClientStoryHeroIntroInputSchema = z
  .object({
    hero: z
      .object({
        kicker: NonEmptyStringSchema,
        title: NonEmptyStringSchema,
        clientName: NonEmptyStringSchema,
        agencyType: NonEmptyStringSchema,
        modelsUsed: z.array(NonEmptyStringSchema).min(1),
        // The hero backdrop. A story gets either a `collage` (a transparent
        // landscape illustration that sits along the bottom of the hero,
        // behind the white details card) or, until its collage exists, a
        // `photo` (full-bleed, darkened and blurred behind the title).
        photo: ClientStoryImageInputSchema.optional(),
        collage: ClientStoryImageInputSchema.optional(),
        logoAsset: LogoAssetSchema,
        logoAlt: NonEmptyStringSchema,
        logoWidth: z.number().int().positive(),
        logoHeight: z.number().int().positive(),
        // The "Download case study" button jumps to the download section lower
        // on the page. Stories that have no PDF set this to false so the hero
        // does not carry a button that goes nowhere.
        showDownloadButton: z.boolean().default(true),
      })
      .strict()
      .refine(({ photo, collage }) => photo !== undefined || collage !== undefined, {
        message: "hero needs a photo or a collage",
      }),
    intro: z
      .object({
        headline: NonEmptyStringSchema,
        paragraphs: z.array(NonEmptyStringSchema).min(1),
        // Optional so a story can go live before the featured person's
        // headshot arrives; the intro then reads as a single column of text.
        photo: ClientStoryImageInputSchema.optional(),
        // "feature" is the large image frame beside the text, for a scene or
        // office photo. "portrait" is a small round headshot next to the
        // heading, for a single person's photo that should not dominate.
        photoStyle: z.enum(["feature", "portrait"]).default("feature"),
      })
      .strict(),
  })
  .strict();

const logoAssets = import.meta.glob<string>(
  "../../../prototypes/landing/logos/*.{png,jpg,jpeg,webp,avif}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);

function resolveLogo(asset: string): string {
  const path = `../../../prototypes/landing/logos/${asset}`;
  const resolved = logoAssets[path];
  if (!resolved) {
    throw new Error(`Client story logo asset not found: ${asset}`);
  }
  return resolved;
}

const ClientStoryHeroIntroPropsSchema = ClientStoryHeroIntroInputSchema.transform(
  ({ hero, intro }) => ({
    hero: {
      ...hero,
      photo: hero.photo ? resolveClientStoryImage(hero.photo) : undefined,
      collage: hero.collage ? resolveClientStoryImage(hero.collage) : undefined,
      logo: {
        src: resolveLogo(hero.logoAsset),
        alt: hero.logoAlt,
        width: hero.logoWidth,
        height: hero.logoHeight,
      },
    },
    intro: {
      ...intro,
      photo: intro.photo ? resolveClientStoryImage(intro.photo) : undefined,
    },
  }),
);

type ClientStoryHeroIntroProps = z.output<
  typeof ClientStoryHeroIntroPropsSchema
>;

export function parseProps(input: unknown): ClientStoryHeroIntroProps {
  return ClientStoryHeroIntroPropsSchema.parse(input);
}

function HeroMetaCard({
  data,
}: {
  data: ClientStoryHeroIntroProps["hero"];
}) {
  return (
    <div className="light grid grid-cols-1 divide-y divide-border-default rounded-2xl border border-default bg-surface shadow-xl sm:grid-cols-[auto_1fr_1fr_1.6fr] sm:divide-x sm:divide-y-0">
      <div className="flex items-center justify-center p-6 sm:px-10">
        <span className="flex size-20 items-center justify-center rounded-full border border-default bg-plate p-4">
          <img
            src={data.logo.src}
            alt={data.logo.alt}
            width={data.logo.width}
            height={data.logo.height}
            className="size-full object-contain"
          />
        </span>
      </div>
      <div className="p-6 sm:px-8">
        <div className="font-sans text-xs uppercase tracking-widest text-brand-accent">
          Client name
        </div>
        <div className="mt-1.5 font-serif text-base text-primary">
          {data.clientName}
        </div>
      </div>
      <div className="p-6 sm:px-8">
        <div className="font-sans text-xs uppercase tracking-widest text-brand-accent">
          Agency type
        </div>
        <div className="mt-1.5 font-serif text-base text-primary">
          {data.agencyType}
        </div>
      </div>
      <div className="p-6 sm:px-8">
        <div className="font-sans text-xs uppercase tracking-widest text-brand-accent">
          AI models employed
        </div>
        <div className="mt-1.5 space-y-0.5">
          {data.modelsUsed.map((model) => (
            <div key={model} className="font-serif text-base text-primary">
              {model}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSection({
  data,
}: {
  data: ClientStoryHeroIntroProps["hero"];
}) {
  return (
    <section className="dark relative border-b border-default bg-app">
      {data.photo && !data.collage ? (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={data.photo.url}
            alt={data.photo.alt}
            width={data.photo.width}
            height={data.photo.height}
            loading="lazy"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-app via-app/70 to-app/30" />
          <div className="absolute inset-0 bg-app/60" />
        </div>
      ) : null}
      <div
        className={
          data.collage
            ? "relative mx-auto max-w-6xl px-gutter pt-28 pb-8 lg:px-0 lg:pt-40"
            : "relative mx-auto max-w-6xl px-gutter pt-28 pb-16 sm:pb-40 lg:px-0 lg:pt-40"
        }
      >
        <Reveal>
          <Eyebrow className="mb-6 text-brand-accent">{data.kicker}</Eyebrow>
          {/* Long, benefit-driven titles ("Reclaiming $11,000 in Staff Time
              Monthly with...") run 60-80 characters — at a flat text-4xl
              that's 5-6 wrapped lines on a phone, same failure shape as the
              H2 bug fixed sitewide. Client-story titles are long enough
              often enough that this gets its own step-down rather than
              relying on the global heading rule (which only catches
              text-5xl h1s — this is text-4xl, and most OTHER text-4xl h1s in
              the kit are short taglines that read fine at that size).
              text-3xl on phones (one step up from the old text-2xl) so it
              reads as the page's primary headline against IntroSection's
              now-smaller headline below; unchanged from md up. */}
          <h1 className="mb-8 max-w-4xl text-balance font-serif text-3xl font-medium tracking-tight text-primary md:text-4xl">
            {data.title}
          </h1>
          {data.showDownloadButton ? (
            <Button size="lg" asChild>
              <a href="#download">
                Download case study <Download className="size-4" />
              </a>
            </Button>
          ) : null}
        </Reveal>
      </div>
      {data.collage ? (
        // Decorative scene along the bottom of the hero. It sits in normal
        // flow after the title so it can never cover it; the pull-up lets the
        // artwork's empty sky tuck behind the title block. The details card
        // below straddles this image's bottom edge (see the card wrapper).
        <img
          src={data.collage.url}
          alt={data.collage.alt}
          width={data.collage.width}
          height={data.collage.height}
          className="relative block h-auto w-full sm:-mt-8 lg:-mt-16"
        />
      ) : null}
      {/* Below `sm`, HeroMetaCard stacks to 4 rows (see its own
          `sm:grid-cols-...`) and its total height then depends on this
          story's own content — how many AI models are listed, whether
          agency type wraps a line, etc. — so it varies story to story. A
          `translate-y-1/2` overhang (half of the card's own, variable
          height) paired with a fixed reserved padding on this section
          can never clear every story's card at once: tuning the padding
          for one story's height leaves a taller card from another story
          overlapping the intro text below, which is exactly the bug this
          replaced. Below `sm`, the card is back in normal flow instead —
          `mt-8` pushes it down (further from the Download button above,
          leaving room for it to sit lower against the section boundary;
          paired with IntroSection's reduced `pt-12` below so the card
          reads as sitting closer to/over that boundary instead of
          floating in the middle of a wide gap) — but however tall the
          card actually renders, the browser pushes IntroSection down by
          that exact amount, so overlap is structurally impossible
          regardless of content. `relative` (all sizes) keeps the card
          painting above the absolutely-positioned photo behind it — see
          the equivalent `relative` on the text block above. At `sm` and
          up the card is a single row (predictable height), so the
          original straddle mechanics (`absolute` + `translate-y-1/2`)
          are unchanged there. */}
      <div
        className={
          data.collage
            ? "relative -mt-4 px-gutter sm:absolute sm:inset-x-0 sm:bottom-0 sm:mt-0 sm:translate-y-1/2 lg:px-0"
            : "relative mt-8 px-gutter sm:absolute sm:inset-x-0 sm:bottom-0 sm:mt-0 sm:translate-y-1/2 lg:px-0"
        }
      >
        <div className="mx-auto max-w-6xl">
          <Reveal delay={100}>
            <HeroMetaCard data={data} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function IntroSection({
  data,
  closerToCard,
}: {
  data: ClientStoryHeroIntroProps["intro"];
  // With a collage hero the details card sits tight against the artwork, so
  // the intro text is brought closer beneath it. Tablet widths keep the full
  // gap, because the card is tallest (and overhangs furthest) there.
  closerToCard: boolean;
}) {
  const showFeaturePhoto = Boolean(data.photo) && data.photoStyle === "feature";
  return (
    <section
      className={cn(
        "border-b border-default bg-app px-gutter pb-18 sm:pb-26 pt-12 sm:pt-44",
        closerToCard && "pt-8 lg:pt-36",
      )}
    >
      <div
        className={
          showFeaturePhoto
            ? "mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-stretch"
            : "mx-auto max-w-3xl"
        }
      >
        <Reveal>
          {/* text-2xl on phones (one step down from text-3xl) so this reads
              as secondary to the hero h1 above, which just moved up to
              text-3xl on phones too; unchanged from sm up. */}
          <div
            className={
              data.photo && !showFeaturePhoto
                ? "mb-6 flex items-center gap-5"
                : undefined
            }
          >
            {data.photo && !showFeaturePhoto ? (
              <img
                src={data.photo.url}
                alt={data.photo.alt}
                width={data.photo.width}
                height={data.photo.height}
                loading="lazy"
                className="size-20 shrink-0 rounded-full border border-default object-cover sm:size-24"
              />
            ) : null}
            <h2
              className={
                data.photo && !showFeaturePhoto
                  ? "text-balance text-2xl sm:text-3xl font-medium tracking-tight text-primary"
                  : "mb-6 text-balance text-2xl sm:text-3xl font-medium tracking-tight text-primary"
              }
            >
              {data.headline}
            </h2>
          </div>
          <div className="space-y-5">
            {data.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-pretty text-base sm:text-lg text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
        {showFeaturePhoto && data.photo ? (
          <Reveal delay={100}>
            <div className="h-full overflow-hidden rounded-2xl border border-default">
              <img
                src={data.photo.url}
                alt={data.photo.alt}
                width={data.photo.width}
                height={data.photo.height}
                loading="lazy"
                className="aspect-4/3 size-full object-cover lg:aspect-auto"
              />
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

export default function ClientStoryHeroIntroSection({
  hero,
  intro,
}: ClientStoryHeroIntroProps) {
  return (
    <>
      <HeroSection data={hero} />
      <IntroSection data={intro} closerToCard={Boolean(hero.collage)} />
    </>
  );
}
