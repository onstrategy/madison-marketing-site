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
            <TabsList className="light h-auto flex-wrap gap-1 rounded-full border border-default bg-hover p-1.5 shadow-xl">
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
                    className="grid gap-8 rounded-2xl border border-default bg-app p-8 md:grid-cols-2 md:items-center"
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

// Fixed spread of x-positions the cables fan out to, in the 240×56 viewBox
// below — decorative, not tied 1:1 to `data.items` (that list runs 11–15
// items deep and wraps across lines, so there's no stable per-item point to
// route a real line to). Reads as "many systems," not a literal wiring diagram.
const CABLE_XS = [14, 52, 90, 120, 150, 188, 226];

/** The converging "cables" between the Madison hub and the source chips below it. */
function ConnectorCables() {
  return (
    <svg
      viewBox="0 0 240 56"
      className="h-14 w-60 text-brand/25"
      aria-hidden="true"
    >
      {CABLE_XS.map((x, i) => (
        <path
          key={x}
          id={`cable-${i}`}
          d={`M120 0 Q ${(x + 120) / 2} 22 ${x} 56`}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      ))}
      {/* A few traveling pulses along a subset of the cables — data flowing
          up into the hub, not just static wires. Hidden under reduced motion. */}
      <g className="motion-reduce:hidden">
        {[1, 3, 5].map((i, dotIndex) => (
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
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow={data.eyebrow}
            title={data.title}
            align="center"
            className="mx-auto mb-8 max-w-2xl"
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
            <div className="-mt-1 flex max-w-2xl flex-wrap justify-center gap-3">
              {data.items.map((name) => (
                <LogoMark key={name} name={name} />
              ))}
            </div>
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
                : "border border-default transition-transform hover:-translate-y-1",
            );
            const content = (
              <>
                {item.current ? (
                  <span className="dark absolute left-4 top-0 -translate-y-1/2 rounded-full bg-app px-2 py-0.5 font-serif text-sm font-semibold uppercase tracking-widest text-brand-accent shadow-sm">
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
                    Explore <ArrowRight className="size-3.5" />
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
        {/* Hero (dark) */}
        <section className="dark relative flex min-h-[70vh] items-center overflow-hidden border-b border-default bg-app">
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
              <div className="rounded-2xl border border-[hsl(var(--border-default)/0.5)] bg-surface/10 p-8">
                <Eyebrow className="text-secondary">{data.hero.card.eyebrow}</Eyebrow>
                <div className="mt-4 font-serif text-3xl font-medium tracking-tight text-primary">
                  {data.hero.card.statement}
                </div>
                <p className="mt-5 text-secondary">{data.hero.card.description}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Media placeholder — a real animation/demo drops in here later */}
        {data.media ? (
          <section className="dark bg-app px-gutter pt-16 pb-30 lg:pt-20">
            <div className="mx-auto max-w-6xl">
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
