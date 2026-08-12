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
    logo: { src: string; alt: string; width: number; height: number };
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
 * The card itself is `bg-surface` (near-white) rather than `bg-app` (Madison's
 * warm beige) — this floats as a white plate over the hero photo, same as the
 * always-white form cards elsewhere in the app (see contact/book-a-demo).
 */
function HeroMetaCard({ data }: { data: ClientStoryData["hero"] }) {
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
        <div className="mt-1.5 font-serif text-base text-primary">{data.clientName}</div>
      </div>
      <div className="p-6 sm:px-8">
        <div className="font-sans text-xs uppercase tracking-widest text-brand-accent">
          Agency type
        </div>
        <div className="mt-1.5 font-serif text-base text-primary">{data.agencyType}</div>
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

function HeroSection({ data }: { data: ClientStoryData["hero"] }) {
  return (
    <section className="dark relative border-b border-default bg-app">
      {/* Full-bleed background photo, confined to the hero's own box */}
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
        {/* Flat darkening pass on top of the directional gradient — the gradient alone
            leaves the upper portion of the image too bright for the eyebrow/title to read. */}
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
    // pt-44 (up from pt-32): the meta card straddles this section's top edge
    // (see HeroMetaCard) via a translate that pulls it up into the hero above,
    // so only HALF of this padding is visible as clearance below the card —
    // widening it here is what actually widens that gap.
    <section className="border-b border-default bg-app px-gutter pb-26 pt-44">
      {/* lg:items-stretch (the grid default — spelled out because IntroSection's
          sibling sections lean on lg:items-center for their two-column rows,
          so a bare grid here could read as a copy-paste omission rather than
          an intentional choice): the photo should fill the row's full height
          rather than centering at its own aspect-ratio height when the text
          column runs taller. */}
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
              // aspect-4/3 only as the single-column (mobile) fallback, where
              // there's no partner column height to fill; lg:aspect-auto lets
              // size-full take over and stretch to the parent's full height.
              className="aspect-4/3 size-full object-cover lg:aspect-auto"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Quote + results in ONE section: the numbers are no longer a full-bleed band of
 * their own but a contained, rounded dark plate sitting under the pull-quote —
 * so the results read as evidence *for* the quote rather than a separate chapter.
 */
function QuoteAndStatsSection({
  quote,
  stats,
}: {
  quote: ClientStoryData["quote"];
  stats: ClientStoryData["stats"];
}) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="text-balance font-serif text-3xl font-medium italic tracking-tight text-primary">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="mt-6 font-sans text-sm uppercase tracking-widest text-muted">
            {quote.attribution}
          </p>
        </Reveal>
      </div>
      <div className="mx-auto mt-16 max-w-6xl">
        <Reveal>
          {/* ALL padding lives on the CONTENT (the eyebrow wrapper, and each grid
              cell's own top/bottom), not on this outer box. That's what lets the
              horizontal divider run edge-to-edge, AND what lets the vertical
              divider lines between cells start flush against that horizontal
              line (no wrapper-level gap between them) and run down to the box's
              own bottom edge (no wrapper-level bottom padding below the grid). */}
          <div className="dark rounded-2xl border border-default bg-app overflow-hidden">
            <div className="px-16 pt-10 text-center">
              <Eyebrow className="text-brand-accent">{stats.eyebrow}</Eyebrow>
            </div>
            {/* Divider between the title and the numbers — full-bleed to the box's
                edges, and directly touching the grid below (no bottom margin) so
                the vertical lines connect to it with no gap. */}
            <div className="mt-8 border-t border-default" aria-hidden />
            {/* Divider lines BETWEEN the number boxes: same divide-y/divide-x
                pattern as HeroMetaCard above — no gap on the grid, spacing comes
                from each cell's own padding instead, so the rule line sits
                exactly between neighbors (and runs the cell's full height,
                top-to-bottom) rather than floating in a gap. */}
            {/* grid-cols-2/4 already gives every column an equal 1fr track — no
                grid-level horizontal padding, so the 4 boxes run edge-to-edge
                with the box (matching the horizontal/vertical divider lines);
                each cell's own px keeps its content clear of the box border. */}
            <div className="grid grid-cols-2 divide-y divide-default lg:grid-cols-4 lg:divide-x lg:divide-y-0">
              {stats.items.map((stat) => (
                <div key={stat.label} className="px-2 pt-8 pb-10 text-center lg:px-8">
                  {/* The established pattern for a stat on a dark plate: the number
                      itself is the neutral "Primary Dark" white (text-primary,
                      Warm White in dark scope) and the label under it is
                      text-secondary — which on Madison's dark scope IS the pale
                      blue (#BFD4DE), not a gray; see the --text-secondary token's
                      dark value in tokens.tsx. */}
                  <div className="font-serif text-5xl font-medium tracking-tight text-primary">
                    {stat.value}
                  </div>
                  <p className="mt-2 font-sans text-sm text-secondary">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
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
              <div className="h-full rounded-2xl border border-default bg-panel p-6">
                {/* Terracotta (bg-info) is Madison's only orange — used here as the
                    challenge signal so the problem cards read distinctly from the
                    blue solution timeline that follows. */}
                <span className="flex size-9 items-center justify-center rounded-full bg-info text-info-fg">
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
      {/* Heading and timeline share ONE column (max-w-3xl), with the heading
          centered over the cards rather than hanging off to the left. */}
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow={data.eyebrow}
            title={data.title}
            align="center"
            className="mb-12"
          />
        </Reveal>
        <div>
          {data.phases.map((phase, i) => {
            const isLast = i === data.phases.length - 1;
            return (
              <Reveal key={phase.step} delay={i * 60}>
                {/* The connecting line lives INSIDE the dot column and is omitted on
                    the last phase — that's what makes it stop at the final circle
                    instead of running past it to the bottom of the last card. The
                    row gap is a margin on the CARD (not a parent space-y): a flex
                    line's height counts its items' margins, so the stretched dot
                    column — and the line inside it — grows through that gap and
                    lands exactly on the next dot. */}
                <div className="flex gap-6">
                  <div className="flex shrink-0 flex-col items-center">
                    <span className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-fg">
                      {i + 1}
                    </span>
                    {isLast ? null : <div className="flex-1 border-l border-default" aria-hidden />}
                  </div>
                  <div
                    className={
                      isLast
                        ? "flex-1 rounded-2xl border border-default bg-surface p-7"
                        : "mb-8 flex-1 rounded-2xl border border-default bg-surface p-7"
                    }
                  >
                    <div className="font-sans text-sm uppercase tracking-widest text-muted">
                      {phase.step}
                    </div>
                    <h3 className="mt-1.5 font-serif text-2xl font-medium tracking-tight text-primary">
                      {phase.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                      {phase.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Impact + the case-study download form, side by side in one section. The
 * download form used to be a section of its own below this one, and this
 * column used to hold a pale-blue box restating a number the results plate
 * already shows — so the form takes that slot instead: one less section, and
 * the page's one remaining ask sits right where the story lands. The card is
 * dark (`dark` scope + `bg-panel`) by request, matching the registration form
 * on ../ai-in-action-webinar-registration/index.tsx.
 */
function ImpactSection({
  impact,
  download,
}: {
  impact: ClientStoryData["impact"];
  download: ClientStoryData["download"];
}) {
  return (
    <section id="download" className="border-b border-default bg-surface px-gutter py-30">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <Eyebrow className="mb-6">{impact.eyebrow}</Eyebrow>
          <h2 className="mb-6 text-balance text-4xl font-medium tracking-tight text-primary">
            {impact.title}
          </h2>
          <div className="space-y-4">
            {impact.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-pretty text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="dark rounded-2xl border border-default bg-panel p-8">
            {/* text-brand-fg — the system's one true #FFFFFF-in-both-themes ink —
                by explicit request, over text-primary's warm off-white default. */}
            <h2 className="text-balance text-2xl font-medium tracking-tight text-brand-fg">
              {download.title}
            </h2>
            {download.description ? (
              <p className="mt-3 text-pretty text-sm text-secondary">{download.description}</p>
            ) : null}
            <form className="mt-6 grid gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="story-name">Full Name</Label>
                <Input id="story-name" name="name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="story-email">Organization e-mail address*</Label>
                <Input id="story-email" name="email" type="email" required />
              </div>
              <Button type="submit" size="lg">
                {download.submitLabel} <Download className="size-4" />
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
            <a href="/demo/">
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
        <QuoteAndStatsSection quote={data.quote} stats={data.stats} />
        <ChallengeSection data={data.challenge} />
        <SolutionSection data={data.solution} />
        <ImpactSection impact={data.impact} download={data.download} />
        <ClientLogos />
        <CtaSection data={data.cta} />
      </main>
      <Footer />
    </div>
  );
}
