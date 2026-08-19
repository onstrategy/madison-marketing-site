import { useState } from "react";
import { Play, ChevronDown, UserRound, Mail, ArrowRight } from "lucide-react";
import { cn } from "@madison/ui/utils";
import { Button } from "@madison/ui/button";
import { Nav, Footer, ClientLogos } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";

// ============================================================================
// WebinarRecapTemplate — the reusable structure for narrative "AI in Action
// Webinar" recap posts (a running session write-up with pull quotes and
// embedded segment videos), as distinct from ../webinar-template/template.tsx
// (a flat "N tasks" playbook). One template, one shape of data — a new recap
// is a new data object, not new layout code. Mirrors the other *-template
// prototypes: ../platform-page/template.tsx and content-driven section pages.
//
// Body sections alternate bg-surface/bg-app (both light) rather than dark —
// the only dark section in the whole article is the closing "What's next"
// block, which also carries the demo CTA. Hero and Footer stay dark as the
// site-wide chrome every page already uses; they aren't part of that count.
// ============================================================================

export interface WebinarRecapQuote {
  text: string;
  attribution: string;
}

export interface WebinarRecapListItem {
  label: string;
  description: string;
}

export interface WebinarRecapSegment {
  title: string;
  body: string[];
  list?: WebinarRecapListItem[];
  quote?: WebinarRecapQuote;
  /** Shows a video accordion, collapsed by default, after this segment's content. */
  video?: string;
  /** Wistia media hashed ID (the id in fast.wistia.net/embed/iframe/<id>) — renders a real embed instead of the placeholder when the accordion opens. */
  wistiaId?: string;
}

export interface WebinarRecapData {
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  intro: string;
  segments: WebinarRecapSegment[];
  whyItMatters: {
    title: string;
    body: string[];
  };
  whatsNext: {
    title: string;
    bullets: string[];
    video?: string;
    /** Wistia media hashed ID for the full-session video accordion. */
    wistiaId?: string;
  };
  cta: {
    title: string;
    description: string;
    primaryCta: string;
    contactEmail: string;
  };
}

function HeroSection({ data }: { data: WebinarRecapData["hero"] }) {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-brand-accent">{data.kicker}</Eyebrow>
          <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary lg:text-5xl">
            {data.title}
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-secondary">{data.subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}

function IntroSection({ intro }: { intro: string }) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-pretty text-center text-lg leading-relaxed text-secondary">
            {intro}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * The pull-quote design: a colored card (not a plain bordered box, so it
 * reads as a distinct "someone said this" moment breaking up the article
 * copy) with a placeholder photo spot for the speaker next to their name —
 * we don't have real headshots on hand, so it's a generic avatar circle
 * rather than a fabricated photo, same call as the site's other stand-ins
 * for real-world people/logos we don't hold rights to.
 */
function QuoteBox({ quote }: { quote: WebinarRecapQuote }) {
  return (
    <div className="dark flex items-start gap-5 rounded-2xl bg-brand-subtle p-6 lg:p-8">
      <span className="flex size-20 shrink-0 items-center justify-center rounded-full border border-default bg-surface text-secondary">
        <UserRound className="size-9" aria-hidden="true" />
      </span>
      <div>
        <p className="text-pretty font-serif text-lg italic leading-snug tracking-tight text-secondary lg:text-xl">
          {quote.text}
        </p>
        <p className="mt-3 font-sans text-sm font-semibold text-brand-accent">{quote.attribution}</p>
      </div>
    </div>
  );
}

/**
 * The session's embedded segment clip. Collapsed by default behind a plain
 * disclosure row; deliberately not the browser-chrome (traffic-light dots +
 * title bar) treatment used for product-screenshot placeholders elsewhere,
 * since this is a video, not a screen.
 *
 * Forced to `light` + `bg-surface` so the accordion always reads as a white
 * card, regardless of whether it's sitting in a light or `dark`-scoped
 * section (mirrors the always-white treatment on form containers elsewhere
 * in the kit). Pass `wistiaId` (the hashed id from a Wistia embed URL) to
 * play a real Wistia video when opened; without it, opening shows a plain
 * placeholder.
 */
function VideoCallout({
  label,
  wistiaId,
}: {
  label: string;
  wistiaId?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="light overflow-hidden rounded-xl border border-default bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-3.5 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-3.5 text-sm font-semibold text-primary">
          <span className="flex size-10 shrink-0 scale-100 items-center justify-center rounded-full bg-brand text-brand-fg transition-transform duration-200 group-hover:scale-110">
            <Play className="size-4.5 fill-current" aria-hidden="true" />
          </span>
          {label}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 text-muted transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open ? (
        wistiaId ? (
          <div className="relative aspect-video border-t border-default">
            <iframe
              src={`https://fast.wistia.net/embed/iframe/${wistiaId}?web_component=true&seo=true`}
              title={label}
              allow="autoplay; fullscreen"
              allowTransparency
              frameBorder={0}
              scrolling="no"
              className="wistia_embed absolute inset-0 size-full"
            />
          </div>
        ) : (
          <div className="flex h-56 items-center justify-center border-t border-default bg-panel text-sm text-muted">
            Video placeholder
          </div>
        )
      ) : null}
    </div>
  );
}

// Alternates the two light neutral surfaces (never dark) so segments still
// read as distinct bands without adding another dark section to the page.
function SegmentSection({ segment, alt }: { segment: WebinarRecapSegment; alt: boolean }) {
  return (
    <section
      className={cn(
        "border-b border-default px-gutter py-20",
        alt ? "bg-app" : "bg-surface",
      )}
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="mb-6 text-balance text-3xl font-medium tracking-tight text-primary">
            {segment.title}
          </h2>
          <div className="space-y-4">
            {segment.body.map((paragraph) => (
              <p key={paragraph} className="text-pretty leading-relaxed text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
        {segment.list ? (
          <Reveal delay={60}>
            {/* More than 3 cards stop fitting a row cleanly (a lone 4th card
                orphaned on its own line), so they stack as a single column
                instead of wrapping into an uneven grid. */}
            <dl className={cn("mt-6 grid gap-4", segment.list.length > 3 ? "grid-cols-1" : "sm:grid-cols-3")}>
              {segment.list.map((item) => (
                <div key={item.label} className="rounded-xl border border-default bg-panel p-5">
                  <dt className="font-sans text-base font-semibold text-primary">{item.label}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-secondary">
                    {item.description}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}
        {segment.quote ? (
          <Reveal delay={100}>
            <div className="mt-8">
              <QuoteBox quote={segment.quote} />
            </div>
          </Reveal>
        ) : null}
        {segment.video ? (
          <Reveal delay={140}>
            <div className="mt-8">
              <VideoCallout label={segment.video} wistiaId={segment.wistiaId} />
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

function WhyItMattersSection({ data, alt }: { data: WebinarRecapData["whyItMatters"]; alt: boolean }) {
  return (
    <section
      className={cn("border-b border-default px-gutter py-20", alt ? "bg-app" : "bg-surface")}
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="mb-6 text-balance text-3xl font-medium tracking-tight text-primary">
            {data.title}
          </h2>
          <div className="space-y-4">
            {data.body.map((paragraph) => (
              <p key={paragraph} className="text-pretty leading-relaxed text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// The one deliberately dark section in the article: "What's next" plus the
// demo CTA, merged into a single block so the page ends on exactly one dark
// close rather than two back-to-back dark bands.
function WhatsNextAndCtaSection({
  whatsNext,
  cta,
}: {
  whatsNext: WebinarRecapData["whatsNext"];
  cta: WebinarRecapData["cta"];
}) {
  return (
    <section className="dark bg-app px-gutter py-30">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="mb-6 text-balance text-3xl font-medium tracking-tight text-primary">
            {whatsNext.title}
          </h2>
          <ul className="space-y-3">
            {whatsNext.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                <span className="text-pretty text-secondary">{bullet}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        {whatsNext.video ? (
          <Reveal delay={60}>
            <div className="light mt-8">
              <VideoCallout label={whatsNext.video} wistiaId={whatsNext.wistiaId} />
            </div>
          </Reveal>
        ) : null}
        <Reveal delay={100}>
          <div className="mt-14 rounded-2xl border border-active bg-surface p-8 text-center lg:p-10">
            <h3 className="mb-3 text-balance text-2xl font-medium tracking-tight text-primary">
              {cta.title}
            </h3>
            <p className="mb-6 text-pretty text-secondary">{cta.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Button size="lg" asChild>
                <a href="/demo/">
                  {cta.primaryCta} <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={`mailto:${cta.contactEmail}`}>
                  <Mail className="size-4" /> {cta.contactEmail}
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function WebinarRecapTemplate({ data }: { data: WebinarRecapData }) {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroSection data={data.hero} />
        <IntroSection intro={data.intro} />
        {data.segments.map((segment, i) => (
          <SegmentSection key={segment.title} segment={segment} alt={i % 2 === 1} />
        ))}
        <WhyItMattersSection data={data.whyItMatters} alt={data.segments.length % 2 === 1} />
        <ClientLogos />
        <WhatsNextAndCtaSection whatsNext={data.whatsNext} cta={data.cta} />
      </main>
      <Footer />
    </div>
  );
}
