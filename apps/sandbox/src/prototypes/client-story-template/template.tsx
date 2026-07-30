import { ArrowRight, Download, type LucideIcon } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Input } from "@madison/ui/input";
import { Label } from "@madison/ui/label";
import { Nav, Footer, ClientLogos } from "../landing/sections";
import { Reveal, Eyebrow, SectionHeading } from "../landing/parts";
import type { StockPhoto } from "../landing/photos";

// ============================================================================
// ClientStoryTemplate — the reusable structure for every Client Story detail
// page (City of Corona, Washoe County, Carson City, …). One template, one
// shape of data (`ClientStoryData`) — a new story is a new data object, not
// new layout code. Mirrors the same pattern as ../platform-page/template.tsx.
// Built entirely from existing primitives + the landing prototype's shared
// Nav/Footer/ClientLogos and Reveal/Eyebrow/SectionHeading parts.
// ============================================================================

export interface ClientStoryStat {
  value: string;
  label: string;
}

export interface ClientStoryChallenge {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ClientStoryPhase {
  /** e.g. "Day 1", "Day 60", "Month 6". */
  step: string;
  title: string;
  description: string;
}

export interface ClientStoryData {
  hero: {
    kicker: string;
    title: string;
    clientName: string;
    agencyType: string;
    modelsUsed: string[];
    photo: StockPhoto;
    /** The client's real logo mark (transparent PNG) — shown on a `bg-plate` chip so it isn't tinted by the warm canvas. */
    logo: { src: string; alt: string };
  };
  intro: {
    headline: string;
    paragraphs: string[];
    photo: StockPhoto;
  };
  quote: {
    text: string;
    attribution: string;
  };
  stats: {
    eyebrow: string;
    items: ClientStoryStat[];
  };
  challenge: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ClientStoryChallenge[];
  };
  solution: {
    eyebrow: string;
    title: string;
    phases: ClientStoryPhase[];
  };
  impact: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    highlight: string;
  };
  download: {
    title: string;
    description?: string;
    submitLabel: string;
  };
  cta: {
    title: string;
    description: string;
    primaryCta: string;
  };
}

/**
 * The floating client-metadata block — logo, client name, agency type, and
 * AI models employed, in one full-width card that straddles the hero image
 * and the section below (`absolute` + `translate-y-1/2` off the hero's own
 * bottom edge, so it self-centers on that boundary at any card height).
 * The logo sits in a circular `bg-plate` badge (true white in both themes,
 * since these marks carry their own ink colors and would tint against the
 * warm canvas) with an outline so it reads as a mark, not a stray image.
 */
function HeroMetaCard({ data }: { data: ClientStoryData["hero"] }) {
  return (
    <div className="light grid grid-cols-1 divide-y divide-default rounded-2xl border border-default bg-app shadow-xl sm:grid-cols-[auto_1fr_1fr_1.6fr] sm:divide-x sm:divide-y-0">
      <div className="flex items-center justify-center p-6 sm:px-10">
        <span className="flex size-20 items-center justify-center rounded-full border border-default bg-plate p-4">
          <img src={data.logo.src} alt={data.logo.alt} className="size-full object-contain" />
        </span>
      </div>
      <div className="p-6 sm:px-8">
        <div className="font-sans text-sm uppercase tracking-widest text-brand-accent">
          Client name
        </div>
        <div className="mt-1.5 font-serif text-lg text-primary">{data.clientName}</div>
      </div>
      <div className="p-6 sm:px-8">
        <div className="font-sans text-sm uppercase tracking-widest text-brand-accent">
          Agency type
        </div>
        <div className="mt-1.5 font-serif text-lg text-primary">{data.agencyType}</div>
      </div>
      <div className="p-6 sm:px-8">
        <div className="font-sans text-sm uppercase tracking-widest text-brand-accent">
          AI models employed
        </div>
        <div className="mt-1.5 space-y-0.5">
          {data.modelsUsed.map((model) => (
            <div key={model} className="font-serif text-lg text-primary">
              {model}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSection({ data }: { data: ClientStoryData["hero"] }) {
  return (
    <section className="dark relative border-b border-default bg-app">
      {/* Full-bleed background photo, confined to the hero's own box */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={data.photo.url}
          alt={data.photo.alt}
          loading="lazy"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-app via-app/70 to-app/30" />
        {/* Flat darkening pass on top of the directional gradient — the gradient alone
            leaves the upper portion of the image too bright for the eyebrow/title to read. */}
        <div className="absolute inset-0 bg-app/60" />
      </div>
      <div className="relative mx-auto max-w-6xl px-gutter pt-28 pb-32 lg:px-0 lg:pt-40">
        <Reveal>
          <Eyebrow className="mb-6 text-brand-accent">{data.kicker}</Eyebrow>
          <h1 className="mb-8 max-w-4xl text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            {data.title}
          </h1>
          <Button size="lg" variant="outline" asChild>
            <a href="#download">
              Download case study <Download className="size-4" />
            </a>
          </Button>
        </Reveal>
      </div>
      {/* Metadata card — pinned to the hero's bottom edge, shifted down by
          half its own height so it straddles the image/content boundary. */}
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

function IntroSection({ data }: { data: ClientStoryData["intro"] }) {
  return (
    <section className="border-b border-default bg-app px-gutter pb-26 pt-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
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
          <div className="overflow-hidden rounded-2xl border border-default">
            <img
              src={data.photo.url}
              alt={data.photo.alt}
              loading="lazy"
              className="aspect-4/3 size-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function QuoteSection({ data }: { data: ClientStoryData["quote"] }) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-24 text-center">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-balance font-serif text-3xl font-medium italic tracking-tight text-primary">
            &ldquo;{data.text}&rdquo;
          </p>
          <p className="mt-6 font-sans text-sm uppercase tracking-widest text-muted">
            {data.attribution}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function StatsSection({ data }: { data: ClientStoryData["stats"] }) {
  return (
    <section className="dark border-b border-default bg-app px-gutter py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow className="mb-10">{data.eyebrow}</Eyebrow>
        </Reveal>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {data.items.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60}>
              <div className="text-center lg:text-left">
                <div className="font-serif text-5xl font-medium tracking-tight text-brand-accent">
                  {stat.value}
                </div>
                <p className="mt-2 font-sans text-sm uppercase tracking-widest text-muted">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChallengeSection({ data }: { data: ClientStoryData["challenge"] }) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading eyebrow={data.eyebrow} title={data.title} className="mb-6 max-w-2xl" />
        </Reveal>
        <Reveal delay={40}>
          <p className="mb-12 max-w-3xl text-pretty text-lg text-secondary">{data.intro}</p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {data.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-default bg-app p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-fg">
                  <item.icon className="size-4" />
                </span>
                <h3 className="mt-4 font-sans text-xl font-semibold tracking-tight text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection({ data }: { data: ClientStoryData["solution"] }) {
  return (
    <section className="border-b border-default bg-app px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading eyebrow={data.eyebrow} title={data.title} className="mb-12 max-w-2xl" />
        </Reveal>
        <div className="relative mx-auto max-w-3xl">
          {/* Connecting line, centered on the numbered dots — drawn once,
              behind every row (DOM order alone puts the dots on top, no
              z-index needed). */}
          <div className="absolute inset-y-4 left-4 border-l border-default" aria-hidden />
          <div className="space-y-8">
            {data.phases.map((phase, i) => (
              <Reveal key={phase.step} delay={i * 60}>
                <div className="flex gap-6">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-fg">
                    {i + 1}
                  </span>
                  <div className="flex-1 rounded-2xl border border-default bg-surface p-5">
                    <div className="font-sans text-sm uppercase tracking-widest text-muted">
                      {phase.step}
                    </div>
                    <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-primary">
                      {phase.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                      {phase.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactSection({ data }: { data: ClientStoryData["impact"] }) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-30">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <Eyebrow className="mb-6">{data.eyebrow}</Eyebrow>
          <h2 className="mb-6 text-balance text-4xl font-medium tracking-tight text-primary">
            {data.title}
          </h2>
          <div className="space-y-4">
            {data.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-pretty text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="rounded-2xl bg-brand-subtle p-10 text-center">
            <div className="font-serif text-4xl font-medium tracking-tight text-brand-accent">
              {data.highlight}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DownloadSection({ data }: { data: ClientStoryData["download"] }) {
  return (
    <section id="download" className="border-b border-default bg-app px-gutter py-30">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <div className="light rounded-2xl border border-default bg-surface p-8 text-center">
            <h2 className="text-balance text-3xl font-medium tracking-tight text-primary">
              {data.title}
            </h2>
            {data.description ? (
              <p className="mt-4 text-pretty text-secondary">{data.description}</p>
            ) : null}
            <form className="mt-8 grid gap-4 text-left sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="story-name">Full Name</Label>
                <Input id="story-name" name="name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="story-email">Organization e-mail address*</Label>
                <Input id="story-email" name="email" type="email" required />
              </div>
              <Button type="submit" size="lg" className="sm:col-span-2">
                {data.submitLabel} <Download className="size-4" />
              </Button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CtaSection({ data }: { data: ClientStoryData["cta"] }) {
  return (
    <section className="dark bg-app px-gutter py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-balance text-4xl font-medium tracking-tight text-primary">
            {data.title}
          </h2>
          <p className="mt-4 text-pretty text-lg text-secondary">{data.description}</p>
          <Button size="lg" className="mt-8" asChild>
            <a href="#top">
              {data.primaryCta} <ArrowRight className="size-4" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

export function ClientStoryTemplate({ data }: { data: ClientStoryData }) {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroSection data={data.hero} />
        <IntroSection data={data.intro} />
        <QuoteSection data={data.quote} />
        <StatsSection data={data.stats} />
        <ChallengeSection data={data.challenge} />
        <SolutionSection data={data.solution} />
        <ImpactSection data={data.impact} />
        <DownloadSection data={data.download} />
        <ClientLogos />
        <CtaSection data={data.cta} />
      </main>
      <Footer />
    </div>
  );
}
