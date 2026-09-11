import { type ReactNode } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@madison/ui/utils";
import { Button } from "@madison/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@madison/ui/tabs";
import { LogoMark as MadisonMark } from "@madison/ui/logo";
import { HubSpotForm } from "../../content/forms/HubSpotForm";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow, SectionHeading, BrowserFrame } from "../landing/parts";
import { StaffReportDemo } from "./demos/staff-report-demo";
import { SolicitationDemo } from "./demos/solicitation-demo";
import { PraDemo } from "./demos/pra-demo";
import { StepPreview, type StepPreviewSpec } from "./previews";
import { type IntegrationLogo } from "../integrations/logos";

// ============================================================================
// PlatformPageTemplate — the reusable structure for every page that hangs off
// the nav's "Platform" dropdown (Community Development AI, Contracts &
// Procurement AI, FOIA / Public Records, …). One template, one shape of data
// (`PlatformPageData`) — a new vertical is a new data object, not new layout
// code. Built entirely from existing primitives: the site's own `Nav`/`Footer`,
// `@madison/ui/tabs` for the role switcher, `Reveal`/`Eyebrow`/`SectionHeading`/
// `BrowserFrame` from the landing prototype's shared parts.
// ============================================================================

export interface PlatformPageStep {
  title: string;
  description: string;
  /** The product mock shown beside the step — see ./previews.tsx. */
  preview: StepPreviewSpec;
}

export interface PlatformPageRole {
  id: string;
  /** Tab label, e.g. "For planners & engineers". */
  label: string;
  steps: PlatformPageStep[];
}

export interface PlatformPageBenefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface PlatformSuiteItem {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  /** Marks the card for the page currently being viewed — "You're here". */
  current?: boolean;
}

export interface PlatformPageData {
  hero: {
    kicker: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    card: {
      eyebrow: string;
      statement: ReactNode;
      description: string;
    };
  };
  media?: {
    title: string;
    /**
     * Which animated product demo runs in the frame under the hero. Each is a
     * fixed-timeline loop of one real workflow — see ./demos/. Pages without
     * an approved demo yet fall back to the static placeholder frame.
     */
    demo?: "staff-report" | "solicitation" | "public-records";
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    description: string;
    roles: PlatformPageRole[];
  };
  connectors: {
    eyebrow: string;
    title: string;
    description: string;
    /**
     * Real vendor marks, not names — pulled from ../integrations/logos.ts
     * (the same registry and the same SVG assets the Integrations page
     * itself renders) and filtered to this page's own platform-area
     * category, so a tool showing here is guaranteed to be the same logo
     * and the same tab split as Integrations shows it under.
     */
    items: IntegrationLogo[];
    /** A trailing catch-all ("Other permitting systems") that doesn't earn a grid card — rendered as plain text under the grid instead. */
    note?: string;
    /** Overrides the title/eyebrow block's width (default `max-w-2xl`). Widening this alone would clip against the section's own wrapper, so it also needs `containerClassName` widened to match. The logo grid is unaffected either way — it's intrinsically sized, not stretched by this container. */
    titleClassName?: string;
    /** Overrides the section's outer wrapper width (default `max-w-3xl`). Only needed together with `titleClassName` when widening the title beyond the default wrapper. */
    containerClassName?: string;
  };
  whatYouGet: {
    eyebrow: string;
    title: string;
    description: string;
    benefits: PlatformPageBenefit[];
  };
  suite: {
    eyebrow: string;
    title: string;
    description: string;
    items: PlatformSuiteItem[];
  };
  cta: {
    title: string;
    description: string;
    bullets: string[];
  };
}

function HowItWorksSection({ data }: { data: PlatformPageData["howItWorks"] }) {
  return (
    <section className="border-t border-default bg-surface px-gutter py-21 sm:py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow={data.eyebrow}
            title={data.title}
            blurb={data.description}
            className="mb-12 max-w-3xl"
          />
        </Reveal>
        <Reveal delay={80}>
          <Tabs defaultValue={data.roles[0]?.id}>
            {/* A page whose steps run in sequence rather than splitting by
                audience supplies a single role — a lone tab pill would be a
                control with nothing to switch to, so the bar is dropped and
                the steps just render. */}
            {data.roles.length > 1 ? (
              // Stacked, not a horizontal segmented row: each tab is its own
              // full-width bar, one per line, so a longer label never has to
              // share a row's width or wrap mid-word. The track keeps a
              // small padding (p-1.5) so the bars sit inset from the track's
              // own border rather than touching it, with a nested radius —
              // rounded-lg on the track, rounded-md (one step down, same
              // on-token pairing cards/inputs use) on each tab — so the two
              // read as consistently, deliberately rounded rather than
              // mismatched (the old rounded-full pill vs. this track).
              <TabsList className="light flex h-auto w-full flex-col gap-1 rounded-lg border border-default bg-hover p-1.5">
                {data.roles.map((role) => (
                  <TabsTrigger
                    key={role.id}
                    value={role.id}
                    className="h-auto w-full rounded-md px-4 py-2.5 text-center"
                  >
                    {role.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            ) : null}
            {data.roles.map((role) => (
              <TabsContent
                key={role.id}
                value={role.id}
                className={cn("space-y-4", data.roles.length > 1 && "mt-8")}
              >
                {role.steps.map((step) => (
                  <div
                    key={step.title}
                    className="grid gap-8 rounded-2xl border border-default bg-panel p-8 md:grid-cols-2 md:items-center"
                  >
                    <div>
                      <h3 className="text-2xl font-medium tracking-tight text-primary">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-secondary">{step.description}</p>
                    </div>
                    <StepPreview spec={step.preview} />
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}

// One cable per card in the logo grid's first row — matched at every
// breakpoint, not just `lg`. The grid below reproduces a 2/3/5-per-row
// density (tile 128×64, gap-3 below `lg`, gap-4 at `lg`) via its own explicit
// widths (`w-67 sm:w-102 lg:w-176`); a card i's center in a row of `count`
// is i×(128+gap) + 64, and the row's own width is count×128 + (count−1)×gap
// — so `cableFan` below derives both directly from the same two numbers the
// grid uses, rather than three separately hand-tuned coordinate lists that
// could drift out of sync with it.
const TILE_W = 128; // matches the logo tiles' own w-32

function cableFan(count: number, gap: number) {
  const pitch = TILE_W + gap;
  const width = count * TILE_W + (count - 1) * gap;
  const xs = Array.from({ length: count }, (_, i) => i * pitch + TILE_W / 2);
  return { xs, width, hubX: width / 2 };
}

const MOBILE_FAN = cableFan(2, 12); // base: 2-per-row, gap-3 — mirrors w-67
const SM_FAN = cableFan(3, 12); // sm–lg: 3-per-row, gap-3 — mirrors w-102
const LG_FAN = cableFan(5, 16); // lg+: 5-per-row, gap-4 — mirrors w-176

/** One breakpoint's fan of cables between the hub and that row's source chips. */
function CableFan({
  xs,
  width,
  hubX,
  className,
}: {
  xs: number[];
  width: number;
  hubX: number;
  className: string;
}) {
  return (
    <svg viewBox={`0 0 ${width} 56`} className={cn("h-14 text-brand/25", className)} aria-hidden="true">
      {xs.map((x, i) => (
        <path
          key={x}
          id={`cable-${width}-${i}`}
          // Cubic, not quadratic: both control points sit directly under
          // their own endpoint (same x, at the vertical midpoint), so the
          // curve leaves the hub going straight down before rounding out
          // toward the card — a curly-bracket hook right at the M, instead
          // of one flat arc leaning the same way its whole length.
          d={`M${hubX} 0 C ${hubX} 28 ${x} 28 ${x} 56`}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      ))}
      {/* A traveling pulse on every cable — data flowing up into the hub
          from every source, not just wires with nothing moving on them.
          Staggered starts (not all at once) so the fan reads as continuous
          traffic rather than one synchronized blink. Hidden under reduced
          motion. */}
      <g className="motion-reduce:hidden">
        {xs.map((x, i) => (
          <circle key={x} r="2.5" className="text-brand">
            <animateMotion
              dur="2.4s"
              begin={`${i * 0.4}s`}
              repeatCount="indefinite"
              keyPoints="1;0"
              keyTimes="0;1"
            >
              <mpath xlinkHref={`#cable-${width}-${i}`} />
            </animateMotion>
          </circle>
        ))}
      </g>
    </svg>
  );
}

/** The converging "cables" between the Madison hub and the source chips below
    it — one fan per breakpoint, so the cable count always matches however
    many source chips are actually in that row (2/3/5), not a number that
    only happens to line up at one width. */
function ConnectorCables() {
  return (
    <>
      <CableFan {...MOBILE_FAN} className="w-67 sm:hidden" />
      <CableFan {...SM_FAN} className="hidden w-102 sm:block lg:hidden" />
      <CableFan {...LG_FAN} className="hidden w-176 lg:block" />
    </>
  );
}

function ConnectorsSection({ data }: { data: PlatformPageData["connectors"] }) {
  return (
    <section className="border-t border-default bg-app px-gutter py-21 sm:py-30 text-center">
      <div className={cn("mx-auto max-w-3xl", data.containerClassName)}>
        <Reveal>
          <SectionHeading
            eyebrow={data.eyebrow}
            title={data.title}
            align="center"
            className={cn("mx-auto mb-8 max-w-2xl", data.titleClassName)}
          />
        </Reveal>
        {/* The Madison mark sits right under the title as the hub every
            source "cables" into — every system feeding into one platform,
            not just a logo wall. */}
        <Reveal delay={60}>
          <div className="mx-auto flex flex-col items-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-brand text-brand-fg shadow-lg">
              <MadisonMark width={32} height={19} className="text-brand-fg" />
            </span>
            <ConnectorCables />
            {/* Flex-wrap, not CSS Grid: a grid's column tracks are shared
                across every row, so a ragged last row (2 or 3 tiles left
                over) sits left-aligned in the first N tracks instead of
                centered. Flex-wrap centers each wrapped line independently
                via `justify-center`, so a partial last row centers itself
                too. The explicit width at each breakpoint reproduces the
                grid's old 2/3/5-per-row density (tile 128×64 + gap, exactly
                sized so the Nth tile never has room to start a same-row
                N+1th) — it has to be explicit since flex-wrap has no
                `grid-cols` equivalent to size off of. */}
            <div className="-mt-1 flex w-67 flex-wrap justify-center gap-3 sm:w-102 lg:w-176 lg:gap-4">
              {/* Same fixed box LogoMark used (h-16 w-32 — that exact size is
                  what the wrap width above was tuned against), rendering the
                  logo directly rather than through LogoMark's name-matching:
                  these are already resolved IntegrationLogo objects, not
                  bare strings to look up. `light` + `bg-plate` for the same
                  reason it mattered on the Integrations grid — third-party
                  marks authored on white need a true white plate under them
                  in both themes, not the warm canvas. */}
              {data.items.map((logo) => (
                <span
                  key={logo.name}
                  title={logo.name}
                  className="light flex h-16 w-32 items-center justify-center rounded-lg border border-default bg-plate p-0.5"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </span>
              ))}
            </div>
            {data.note ? (
              <p className="mt-3 text-sm text-muted">{data.note}</p>
            ) : null}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-8 max-w-xl text-sm text-secondary">
            {data.description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function WhatYouGetSection({ data }: { data: PlatformPageData["whatYouGet"] }) {
  return (
    <section className="border-t border-default bg-surface px-gutter py-21 sm:py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow={data.eyebrow}
            title={data.title}
            blurb={data.description}
            className="mb-12 max-w-2xl"
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.benefits.map((benefit, i) => (
            <Reveal key={benefit.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-default bg-panel p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg">
                    <benefit.icon className="size-4" />
                  </span>
                  <h3 className="font-sans text-xl font-semibold tracking-tight text-primary">
                    {benefit.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  {benefit.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SuiteSection({ data }: { data: PlatformPageData["suite"] }) {
  return (
    <section className="border-t border-default bg-app px-gutter py-21 sm:py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow={data.eyebrow}
            title={data.title}
            blurb={data.description}
            className="mb-12 max-w-2xl"
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((item, i) => {
            const className = cn(
              "relative flex h-full flex-col rounded-2xl bg-surface p-4",
              item.current
                ? "border-2 border-brand"
                : "group border border-default transition-transform hover:-translate-y-1",
            );
            const content = (
              <>
                {item.current ? (
                  <span className="absolute left-4 top-0 -translate-y-1/2 rounded-full bg-brand px-3 py-1 font-serif text-xs font-semibold uppercase tracking-widest text-brand-fg shadow-sm">
                    You&rsquo;re here
                  </span>
                ) : null}
                <div className="flex h-24 items-center justify-center rounded-lg bg-brand-subtle">
                  <item.icon className="size-8 text-brand-accent" />
                </div>
                <div className="mt-4 text-lg font-semibold tracking-tight text-primary">
                  {item.title}
                </div>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-secondary">
                  {item.description}
                </p>
                {item.current ? null : (
                  <span className="mt-3.5 inline-flex items-center gap-1 text-sm font-semibold text-brand-accent">
                    Explore <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </>
            );
            return (
              <Reveal key={item.title} delay={i * 60}>
                {item.current ? (
                  // The current page's own card is a status tile, not a
                  // link — it can't navigate anywhere useful, so it's a
                  // plain <div> (no href, no hover lift) instead of an <a>.
                  <div className={className}>{content}</div>
                ) : (
                  <a href={item.href} className={className}>
                    {content}
                  </a>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ data }: { data: PlatformPageData["cta"] }) {
  return (
    <section id="book-a-demo" className="dark border-t border-default bg-app px-gutter py-21 sm:py-30">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <h2 className="text-balance text-4xl font-medium tracking-tight text-primary">
            {data.title}
          </h2>
          <p className="mt-5 max-w-md text-lg text-secondary">
            {data.description}
          </p>
          <div className="mt-8 flex flex-col gap-4">
            {data.bullets.map((bullet) => (
              <div key={bullet} className="flex items-center gap-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg">
                  <ArrowRight className="size-3.5" />
                </span>
                <span className="text-primary">{bullet}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          {/* The real HubSpot demo form — the same one /demo uses, referenced by
              registry name. Every platform page shares this card. */}
          <div className="light rounded-2xl border border-default bg-surface p-8">
            <h2 className="mb-1 text-2xl font-medium tracking-tight text-primary">
              Schedule a call
            </h2>
            <p className="mb-6 text-sm text-secondary">
              Fill in the form below, and our team will get back to you within
              one business day.
            </p>
            <HubSpotForm form="book-a-demo" calendlyRouting="demo-routing" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function PlatformPageTemplate({ data }: { data: PlatformPageData }) {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        {/* Hero (dark). No bottom border — the walkthrough frame below crosses
            this boundary, so a rule line would cut straight through it. */}
        <section className="dark relative flex min-h-[70vh] items-center overflow-hidden bg-app">
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-gutter pt-28 lg:grid-cols-2 lg:gap-16 lg:px-0 lg:pt-40">
            <Reveal>
              <Eyebrow className="text-brand-accent">
                {data.hero.kicker}
              </Eyebrow>
              <h1 className="mt-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
                {data.hero.title}
              </h1>
              <p className="mt-7 max-w-lg text-pretty text-lg text-secondary">
                {data.hero.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                {/* Scrolls to the real HubSpot demo form embedded in
                    CtaSection at the bottom of this same page — this button
                    previously had no href/onClick at all and did nothing
                    when clicked. */}
                <Button size="lg" asChild>
                  <a href="#book-a-demo">
                    {data.hero.primaryCta} <ArrowRight className="size-4" />
                  </a>
                </Button>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-brand-accent"
                >
                  {data.hero.secondaryCta} <ArrowRight className="size-4" />
                </a>
              </div>
            </Reveal>
            <Reveal delay={100}>
              {/* Glass panel: a translucent surface over the hero's dark field
                  with a backdrop blur, so the art behind it reads through. */}
              <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border-default)/0.5)] bg-surface/10 shadow-xl backdrop-blur-md">
                {/* Blue title bar — window chrome in shape only. Deliberately
                    no traffic-light dots: this is a statement panel, not a
                    mock browser (that's BrowserFrame's job, used below). */}
                <div className="bg-brand px-6 py-3.5">
                  <span className="font-sans text-sm font-semibold text-brand-fg">
                    {data.hero.card.eyebrow}
                  </span>
                </div>
                <div className="p-8">
                  <div className="font-serif text-3xl font-medium tracking-tight text-primary">
                    {data.hero.card.statement}
                  </div>
                  <p className="mt-5 text-secondary">{data.hero.card.description}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Media placeholder — a real animation/demo drops in here later.
            The frame straddles the hero boundary: its top fifth sits on the
            hero's dark field, the rest on the cream page below. */}
        {data.media ? (
          <section className="relative overflow-hidden bg-app px-gutter pb-21 sm:pb-30 pt-14 sm:pt-20">
            <div className="relative mx-auto max-w-6xl">
              {/* The dark field, carried down behind the frame's top 20%.
                  Anchored to this wrapper — which is exactly the frame's box —
                  so `bottom-[80%]` lands a true fifth down the frame whatever
                  its height, rather than a pixel guess. `-top-20` covers the
                  section's own pt-20 gap above it, and w-screen makes the band
                  full-bleed instead of stopping at the 6xl column. */}
              <div
                aria-hidden
                className="dark absolute -top-20 bottom-[80%] left-1/2 w-screen -translate-x-1/2 bg-app"
              />
              <Reveal>
                <BrowserFrame title={data.media.title}>
                  {data.media.demo === "solicitation" ? (
                    <SolicitationDemo />
                  ) : data.media.demo === "staff-report" ? (
                    <StaffReportDemo />
                  ) : data.media.demo === "public-records" ? (
                    <PraDemo />
                  ) : (
                    <div className="flex h-80 items-center justify-center bg-app text-sm text-muted">
                      Product walkthrough
                    </div>
                  )}
                </BrowserFrame>
              </Reveal>
            </div>
          </section>
        ) : null}

        <div id="how-it-works">
          <HowItWorksSection data={data.howItWorks} />
        </div>
        <ConnectorsSection data={data.connectors} />
        <WhatYouGetSection data={data.whatYouGet} />
        <SuiteSection data={data.suite} />
        <CtaSection data={data.cta} />
      </main>
      <Footer />
    </div>
  );
}
