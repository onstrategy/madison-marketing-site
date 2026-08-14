import { type ReactNode } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@madison/ui/utils";
import { Button } from "@madison/ui/button";
import { Input } from "@madison/ui/input";
import { Label } from "@madison/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@madison/ui/tabs";
import { LogoMark as MadisonMark } from "@madison/ui/logo";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow, SectionHeading, BrowserFrame, LogoMark } from "../landing/parts";

// ============================================================================
// PlatformPageTemplate — the reusable structure for every page that hangs off
// the nav's "Platform" dropdown (Community Development AI, Contracts &
// Procurement AI, FOIA / Public Records, …). One template, one shape of data
// (`PlatformPageData`) — a new vertical is a new data object, not new layout
// code. Built entirely from existing primitives: the site's own `Nav`/`Footer`,
// `@madison/ui/tabs` for the role switcher, `Reveal`/`Eyebrow`/`SectionHeading`/
// `BrowserFrame`/`LogoMark` from the landing prototype's shared parts.
// ============================================================================

export interface PlatformPageStepRow {
  label: string;
  meta?: string;
}

export interface PlatformPageStep {
  title: string;
  description: string;
  icon: LucideIcon;
  rows: PlatformPageStepRow[];
  /** A short highlighted line under the rows, e.g. "Full parcel timeline · 14 records". */
  footnote?: string;
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
    items: string[];
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
    submitLabel: string;
  };
}

/** One role's illustrative step — title/description left, a small mock panel right. */
function StepPreview({ step }: { step: PlatformPageStep }) {
  return (
    <div className="rounded-xl border border-default bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-brand-subtle text-brand">
          <step.icon className="size-4" />
        </span>
      </div>
      <div className="space-y-2">
        {step.rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 rounded-md border border-default bg-app px-3 py-2 text-sm"
          >
            <span className="truncate text-primary">{row.label}</span>
            {row.meta ? (
              <span className="shrink-0 text-xs text-muted">{row.meta}</span>
            ) : null}
          </div>
        ))}
      </div>
      {step.footnote ? (
        <div className="mt-2 rounded-md bg-brand-subtle px-3 py-2 text-center text-xs font-semibold text-brand-accent">
          {step.footnote}
        </div>
      ) : null}
    </div>
  );
}

function HowItWorksSection({ data }: { data: PlatformPageData["howItWorks"] }) {
  return (
    <section className="border-t border-default bg-surface px-gutter py-30">
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
            <TabsList className="light h-auto flex-wrap gap-1 rounded-full border border-default bg-hover p-1.5">
              {data.roles.map((role) => (
                <TabsTrigger key={role.id} value={role.id} className="rounded-full px-5 py-2">
                  {role.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {data.roles.map((role) => (
              <TabsContent key={role.id} value={role.id} className="mt-8 space-y-4">
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
                    <StepPreview step={step} />
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

// One cable per card in the logo grid's first row — at the `lg` breakpoint
// the grid is exactly 704px wide (5 tiles × 128px + 4 gaps × 16px, see the
// connector grid's `lg:w-176` below), so these x-positions are those 5
// tiles' literal horizontal centers (card i center = i×144 + 64) in a
// viewBox scaled 1:1 to that same 704 width. The SVG's rendered width tracks
// the grid's own responsive steps (`w-67 sm:w-102 lg:w-176`), so the two
// stay in lockstep at every breakpoint; below `lg` there's no 5-card row to
// line up with, so the fan just scales proportionally instead.
const CABLE_XS = [64, 208, 352, 496, 640];
const HUB_X = 352; // the grid's horizontal center at 704px — also card 3 of 5's own center, since 5 is odd.

/** The converging "cables" between the Madison hub and the source chips below it. */
function ConnectorCables() {
  return (
    <svg
      viewBox="0 0 704 56"
      className="h-14 w-67 text-brand/25 sm:w-102 lg:w-176"
      aria-hidden="true"
    >
      {CABLE_XS.map((x, i) => (
        <path
          key={x}
          id={`cable-${i}`}
          // Cubic, not quadratic: both control points sit directly under
          // their own endpoint (same x, at the vertical midpoint), so the
          // curve leaves the hub going straight down before rounding out
          // toward the card — a curly-bracket hook right at the M, instead
          // of one flat arc leaning the same way its whole length.
          d={`M${HUB_X} 0 C ${HUB_X} 28 ${x} 28 ${x} 56`}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      ))}
      {/* A few traveling pulses along a subset of the cables — data flowing
          up into the hub, not just static wires. Hidden under reduced motion. */}
      <g className="motion-reduce:hidden">
        {[0, 2, 4].map((i, dotIndex) => (
          <circle key={i} r="2.5" className="text-brand">
            <animateMotion
              dur="2.4s"
              begin={`${dotIndex * 0.8}s`}
              repeatCount="indefinite"
              keyPoints="1;0"
              keyTimes="0;1"
            >
              <mpath xlinkHref={`#cable-${i}`} />
            </animateMotion>
          </circle>
        ))}
      </g>
    </svg>
  );
}

function ConnectorsSection({ data }: { data: PlatformPageData["connectors"] }) {
  return (
    <section className="border-t border-default bg-app px-gutter py-30 text-center">
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
              {data.items.map((name) => (
                <LogoMark key={name} name={name} />
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
    <section className="border-t border-default bg-surface px-gutter py-30">
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
    <section className="border-t border-default bg-app px-gutter py-30">
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
    <section className="dark border-t border-default bg-app px-gutter py-30">
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
          <form className="light rounded-2xl border border-default bg-surface p-8">
            <Eyebrow className="mb-6">Schedule a call</Eyebrow>
            <div className="mb-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="cd-first-name">First name</Label>
                <Input id="cd-first-name" name="firstName" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cd-last-name">Last name</Label>
                <Input id="cd-last-name" name="lastName" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cd-email">Organization email address*</Label>
                <Input id="cd-email" name="email" type="email" required />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cd-phone">Phone number</Label>
                <Input id="cd-phone" name="phone" type="tel" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cd-org">Government name and department*</Label>
                <Input id="cd-org" name="organization" required />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              {data.submitLabel}
            </Button>
          </form>
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
              <h1 className="mt-6 text-balance font-serif text-5xl font-medium tracking-tight text-primary">
                {data.hero.title}
              </h1>
              <p className="mt-7 max-w-lg text-pretty text-lg text-secondary">
                {data.hero.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Button size="lg">
                  {data.hero.primaryCta} <ArrowRight className="size-4" />
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
          <section className="relative overflow-hidden bg-app px-gutter pb-30 pt-20">
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
                  <div className="flex h-80 items-center justify-center bg-app text-sm text-muted">
                    Product walkthrough
                  </div>
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
