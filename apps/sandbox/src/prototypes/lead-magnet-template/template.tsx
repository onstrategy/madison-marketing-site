import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { TestimonialCard } from "@madison/ui/testimonial-card";
import { cn } from "@madison/ui/utils";
import { Nav, Footer, ClientLogos } from "../landing/sections";
import { Reveal, Eyebrow, SectionHeading, DotGrid, useReducedMotion } from "../landing/parts";
import { HubSpotForm } from "../../content/forms/HubSpotForm";
import { type HubSpotFormName } from "../../content/forms/hubspot";
import codyEinfaltPhoto from "./testimonial-cody-einfalt.avif";
import donRochaPhoto from "./testimonial-don-rocha.avif";
import ivoNkwenjiPhoto from "./testimonial-ivo-nkwenji.png";
import peterPirnejadPhoto from "./testimonial-peter-pirnejad.avif";

// ============================================================================
// Lead-magnet template — the gated-download page shape shared by /playbook and
// /cheatsheet-responsible-ai on madisonai.com. Both pages are the same layout
// with different copy, so they live here as data (same split as
// responsible-ai-template): hero (copy left, asset preview right) → value
// callouts → insight → contents → gated form → logo wall → testimonials.
// ============================================================================

/** The form section's anchor, so the hero and insight CTAs can jump to it. */
const FORM_ANCHOR = "download";

/** How long each hero slide holds before crossfading to the next. */
const SLIDE_INTERVAL_MS = 3500;

export interface LeadMagnetMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface LeadMagnetBenefit {
  title: string;
  description: string;
}

export interface LeadMagnetContentItem {
  title: string;
  description: string;
}

export interface LeadMagnetTestimonial {
  quote: string;
  name: string;
  roleLabel: string;
  /** Headshot shown by the carousel layout. The grid layout ignores it (TestimonialCard is monogram-only). */
  image?: string;
}

export interface LeadMagnetData {
  hero: {
    /** Small uppercase line above the headline. */
    kicker: string;
    title: string;
    /** One or more lead paragraphs under the headline. */
    intro: string[];
    /** Label shared by every CTA on the page — "Get the Playbook", etc. */
    ctaLabel: string;
    /**
     * Preview of the asset being gated, shown beside the headline. More than
     * one entry crossfades on a timer, the way the playbook's three-slide
     * carousel does on the live page.
     */
    media: LeadMagnetMedia[];
  };
  /** The 2–3 "why it's worth your email" callouts, in a row under the hero. */
  benefits: LeadMagnetBenefit[];
  /** The mid-page reframe — the myth the asset busts. */
  insight: {
    title: string;
    paragraphs: string[];
  };
  contents: {
    eyebrow: string;
    /**
     * Numbered on purpose: the playbook's six steps are a sequence, and the
     * cheatsheet's three sections read fine as an ordered list too.
     */
    items: LeadMagnetContentItem[];
  };
  form: {
    title: string;
    description?: string;
    form: HubSpotFormName;
  };
  testimonialsTitle: string;
  testimonials: LeadMagnetTestimonial[];
  /**
   * Defaults to "grid" (a card per testimonial, monogram avatars — the
   * cheatsheet's layout). "carousel" shows one testimonial at a time with
   * prev/next arrows and a real headshot — the playbook's layout.
   */
  testimonialsLayout?: "grid" | "carousel";
}

function CtaButton({ label, className }: { label: string; className?: string }) {
  return (
    <Button asChild size="lg" className={className}>
      <a href={`#${FORM_ANCHOR}`}>{label}</a>
    </Button>
  );
}

/**
 * The gated asset's preview. A single image renders as a plain <img>; several
 * crossfade on a timer. Reduced-motion visitors get the first slide, held —
 * an unprompted 5-second animation is exactly what that preference is for.
 */
function HeroMedia({ media }: { media: LeadMagnetMedia[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const rotates = media.length > 1 && !reduced;

  useEffect(() => {
    if (!rotates) return;
    const id = setInterval(
      () => setIndex((current) => (current + 1) % media.length),
      SLIDE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [rotates, media.length]);

  const frame =
    "w-full rounded-2xl border border-default bg-surface shadow-2xl shadow-black/20";

  if (media.length === 1) {
    const only = media[0];
    return (
      <img
        src={only.src}
        alt={only.alt}
        width={only.width}
        height={only.height}
        className={frame}
      />
    );
  }

  return (
    // Ratio comes from the first slide, so the stack reserves its height up
    // front and the hero doesn't reflow when slide two paints.
    <div
      className="relative w-full"
      style={{ aspectRatio: `${media[0].width} / ${media[0].height}` }}
    >
      {media.map((item, itemIndex) => (
        <img
          key={item.src}
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          // Only the visible slide is announced; the rest are decorative
          // duplicates of the same asset as far as a screen reader cares.
          aria-hidden={itemIndex !== index}
          className={cn(
            frame,
            "absolute inset-0 h-full object-cover transition-opacity duration-700",
            itemIndex === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}

// Icon-free callouts in a single bordered shell — the security page hero's
// trust-badge row (rounded-xl border border-active bg-surface), collapsed to
// one container instead of one per item since there's no icon left to give
// each item its own edge.
function BenefitsRow({ benefits }: Pick<LeadMagnetData, "benefits">) {
  return (
    <div className="mt-24 rounded-xl border border-active bg-surface">
      <ul
        className={cn(
          "grid divide-y divide-border-default sm:grid-cols-2 sm:divide-x sm:divide-y-0",
          benefits.length > 2 && "lg:grid-cols-3",
        )}
      >
        {benefits.map((benefit, index) => (
          <Reveal key={benefit.title} delay={index * 60}>
            <li className="h-full p-6 text-center">
              <h2 className="mb-2 text-xl font-medium tracking-tight text-primary">
                {benefit.title}
              </h2>
              <p className="text-pretty text-secondary">{benefit.description}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

function HeroSection({ hero, benefits }: Pick<LeadMagnetData, "hero" | "benefits">) {
  return (
    <section className="dark relative bg-app px-gutter pb-17 sm:pb-24 pt-20 sm:pt-28 lg:px-0 lg:pt-40">
      <DotGrid className="opacity-60" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:items-center">
          <Reveal>
            <div>
              <Eyebrow className="mb-6 text-brand-accent">{hero.kicker}</Eyebrow>
              <h1 className="mb-6 text-balance font-serif text-2xl font-medium tracking-tight text-primary md:text-3xl">
                {hero.title}
              </h1>
              {hero.intro.map((paragraph) => (
                <p key={paragraph} className="mb-6 text-pretty text-lg text-secondary">
                  {paragraph}
                </p>
              ))}
              <CtaButton label={hero.ctaLabel} className="mt-4" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <HeroMedia media={hero.media} />
          </Reveal>
        </div>
        <BenefitsRow benefits={benefits} />
      </div>
    </section>
  );
}

function InsightSection({
  insight,
  ctaLabel,
}: {
  insight: LeadMagnetData["insight"];
  ctaLabel: string;
}) {
  return (
    <section className="light bg-plate px-gutter py-17 sm:py-24 lg:px-0">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-balance font-serif text-3xl font-medium tracking-tight text-primary md:text-4xl">
            {insight.title}
          </h2>
          {insight.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-6 text-pretty text-lg text-secondary">
              {paragraph}
            </p>
          ))}
          <CtaButton label={ctaLabel} className="mt-10" />
        </Reveal>
      </div>
    </section>
  );
}

function ContentsSection({ contents }: Pick<LeadMagnetData, "contents">) {
  return (
    <section className="bg-app px-gutter py-17 sm:py-24 lg:px-0">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading eyebrow={contents.eyebrow} title="What's inside." align="center" />
        </Reveal>
        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contents.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 60}>
              <li className="h-full rounded-2xl border border-default bg-surface p-7">
                <span className="mb-5 flex size-9 items-center justify-center rounded-full bg-brand-subtle text-sm font-medium text-brand-accent">
                  {index + 1}
                </span>
                <h3 className="mb-2 text-xl font-medium tracking-tight text-primary">
                  {item.title}
                </h3>
                <p className="text-pretty text-secondary">{item.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FormSection({ form }: Pick<LeadMagnetData, "form">) {
  return (
    <section id={FORM_ANCHOR} className="dark scroll-mt-24 bg-app px-gutter py-17 sm:py-24 lg:px-0">
      <div className="mx-auto max-w-xl">
        <Reveal>
          <div className="light rounded-2xl border border-default bg-surface p-8">
            <h2 className="mb-1 text-2xl font-medium tracking-tight text-primary">
              {form.title}
            </h2>
            {form.description ? (
              <p className="mb-6 text-sm text-secondary">{form.description}</p>
            ) : null}
            <HubSpotForm form={form.form} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** First letters of the first two words of a name, e.g. "Maya Chen" → "MC". */
function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

/**
 * One testimonial at a time, stepped with prev/next arrows (wraps at either
 * end) — the playbook's layout. No quote marks around the blockquote (the
 * card shell already frames it as a quote); a real headshot stands in for
 * TestimonialCard's monogram, falling back to initials if a testimonial
 * doesn't have one.
 */
function TestimonialsCarousel({ testimonials }: { testimonials: LeadMagnetTestimonial[] }) {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];
  const step = (delta: number) =>
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);

  return (
    <div className="mt-14 flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous testimonial"
        onClick={() => step(-1)}
      >
        <ChevronLeft />
      </Button>
      <div
        aria-live="polite"
        className="w-full max-w-2xl rounded-2xl border border-default bg-surface p-8 text-center md:p-12"
      >
        {current.image ? (
          <img
            src={current.image}
            alt=""
            className="mx-auto mb-6 size-16 rounded-full border border-default object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-default bg-app text-lg font-medium text-primary"
          >
            {initials(current.name)}
          </span>
        )}
        <blockquote className="text-pretty text-lg text-secondary">{current.quote}</blockquote>
        <figcaption className="mt-6">
          <div className="text-sm font-medium text-primary">{current.name}</div>
          <div className="text-xs text-muted">{current.roleLabel}</div>
        </figcaption>
      </div>
      <Button variant="outline" size="icon" aria-label="Next testimonial" onClick={() => step(1)}>
        <ChevronRight />
      </Button>
    </div>
  );
}

function TestimonialsSection({
  testimonialsTitle,
  testimonials,
  testimonialsLayout = "grid",
}: Pick<LeadMagnetData, "testimonialsTitle" | "testimonials" | "testimonialsLayout">) {
  return (
    <section className="bg-app px-gutter py-17 sm:py-24 lg:px-0">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading title={testimonialsTitle} align="center" />
        </Reveal>
        {testimonialsLayout === "carousel" ? (
          <Reveal delay={100}>
            <TestimonialsCarousel testimonials={testimonials} />
          </Reveal>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 60}>
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  roleLabel={testimonial.roleLabel}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function LeadMagnetTemplate({ data }: { data: LeadMagnetData }) {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroSection hero={data.hero} benefits={data.benefits} />
        <InsightSection insight={data.insight} ctaLabel={data.hero.ctaLabel} />
        <ContentsSection contents={data.contents} />
        <FormSection form={data.form} />
        <ClientLogos />
        <TestimonialsSection
          testimonialsTitle={data.testimonialsTitle}
          testimonials={data.testimonials}
          testimonialsLayout={data.testimonialsLayout}
        />
      </main>
      <Footer />
    </div>
  );
}

/**
 * Both lead-magnet pages run the identical testimonial wall on the live site,
 * so it lives here rather than being duplicated into each page's data.
 */
export const LEAD_MAGNET_TESTIMONIALS: LeadMagnetTestimonial[] = [
  {
    quote:
      "Tools like Madison AI help us retain institutional knowledge and quickly access past decisions. In a small organization like ours, that kind of support can feel like adding an experienced team member to the staff.",
    name: "Cody Einfalt",
    roleLabel: "Acting City Manager, Town of Los Altos Hills",
    image: codyEinfaltPhoto,
  },
  {
    quote:
      "There was hesitation at first, especially with AI, but once people saw it was there to support their work, not replace them, engagement increased.",
    name: "Don Rocha",
    roleLabel: "Technology Innovation Assistant Officer, Valley Water",
    image: donRochaPhoto,
  },
  {
    quote:
      "When we did the trial, within two weeks, it was a no-brainer that this was a system we were going to use.",
    name: "Ivo Nkwenji",
    roleLabel: "IT Manager, Las Virgenes Municipal Water District",
    image: ivoNkwenjiPhoto,
  },
  {
    quote:
      "For a small staff, AI lets us be nimble: adopt a policy, train the team, ingest the data, and suddenly everyone can find the answers.",
    name: "Dr. Peter Pirnejad",
    roleLabel: "City Manager (Ret.), Town of Los Altos Hills",
    image: peterPirnejadPhoto,
  },
];
