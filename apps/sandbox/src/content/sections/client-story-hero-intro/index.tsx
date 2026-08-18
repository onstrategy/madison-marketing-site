import { Download } from "lucide-react";
import { z } from "zod";
import { Button } from "@madison/ui/button";
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
        photo: ClientStoryImageInputSchema,
        logoAsset: LogoAssetSchema,
        logoAlt: NonEmptyStringSchema,
        logoWidth: z.number().int().positive(),
        logoHeight: z.number().int().positive(),
      })
      .strict(),
    intro: z
      .object({
        headline: NonEmptyStringSchema,
        paragraphs: z.array(NonEmptyStringSchema).min(1),
        photo: ClientStoryImageInputSchema,
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
      photo: resolveClientStoryImage(hero.photo),
      logo: {
        src: resolveLogo(hero.logoAsset),
        alt: hero.logoAlt,
        width: hero.logoWidth,
        height: hero.logoHeight,
      },
    },
    intro: {
      ...intro,
      photo: resolveClientStoryImage(intro.photo),
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
    <div className="light grid grid-cols-1 divide-y divide-default rounded-2xl border border-default bg-surface shadow-xl sm:grid-cols-[auto_1fr_1fr_1.6fr] sm:divide-x sm:divide-y-0">
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
      <div className="relative mx-auto max-w-6xl px-gutter pt-28 pb-40 lg:px-0 lg:pt-40">
        <Reveal>
          <Eyebrow className="mb-6 text-brand-accent">{data.kicker}</Eyebrow>
          <h1 className="mb-8 max-w-4xl text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            {data.title}
          </h1>
          <Button size="lg" asChild>
            <a href="#download">
              Download case study <Download className="size-4" />
            </a>
          </Button>
        </Reveal>
      </div>
      <div className="absolute inset-x-0 bottom-0 translate-y-1/2 px-gutter lg:px-0">
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
}: {
  data: ClientStoryHeroIntroProps["intro"];
}) {
  return (
    <section className="border-b border-default bg-app px-gutter pb-26 pt-44">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-stretch">
        <Reveal>
          <h2 className="mb-6 text-balance text-3xl font-medium tracking-tight text-primary">
            {data.headline}
          </h2>
          <div className="space-y-5">
            {data.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-pretty text-lg text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
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
      <IntroSection data={intro} />
    </>
  );
}
