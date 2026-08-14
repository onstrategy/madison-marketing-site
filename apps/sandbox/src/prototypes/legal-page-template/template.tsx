import type { ReactNode } from "react";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";

// ============================================================================
// LegalPageTemplate — the reusable structure for policy/legal documents
// (Privacy Policy, Terms & Conditions): a plain numbered-section reader, not
// a marketing layout. One template, one shape of data — a new policy doc is
// a new data object, not new layout code. Mirrors the other *-template
// prototypes (../webinar-recap-template/template.tsx, etc.), but
// deliberately simpler — no cards, quotes, or CTAs, just a readable document.
//
// `paragraphs`/`list` items are ReactNode (not string) so a section can embed
// an inline link or a bold lead-in label (e.g. "Registration: ...") directly
// in its own data, without the template inventing a rich-text format.
// ============================================================================

export interface LegalSection {
  /** Full heading text as it should render, e.g. "1. Overview" or "Contact Us" (unnumbered sections just omit the number). */
  heading: string;
  paragraphs?: ReactNode[];
  list?: ReactNode[];
}

export interface LegalPageData {
  kicker: string;
  title: string;
  /** e.g. "Last updated August 2026" — omit if not applicable. */
  updated?: string;
  intro?: ReactNode[];
  sections: LegalSection[];
}

/** Reusable inline styling for a link inside policy prose — external legal/reference links (Microsoft's DPA, pricing pages, etc.) as well as internal ones. */
export function LegalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-brand-accent underline-offset-2 hover:underline"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

/** A "Label: description" line — the dominant pattern in both source documents (e.g. "Registration:", "Permitted Use:"). */
export function LegalLabel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <>
      <strong className="font-semibold text-primary">{label}:</strong> {children}
    </>
  );
}

function HeroSection({ data }: { data: LegalPageData }) {
  return (
    <section className="border-b border-default bg-app px-gutter pb-16 pt-28 lg:pt-40">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow className="mb-6">{data.kicker}</Eyebrow>
          <h1 className="mb-4 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            {data.title}
          </h1>
          {data.updated ? <p className="text-sm text-muted">{data.updated}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}

function IntroSection({ intro }: { intro: ReactNode[] }) {
  return (
    <section className="border-b border-default bg-app px-gutter pb-16">
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal>
          {intro.map((paragraph, i) => (
            <p key={i} className="text-pretty leading-relaxed text-secondary">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function SectionBlock({ section }: { section: LegalSection }) {
  return (
    <div className="border-b border-default py-10">
      <h2 className="mb-4 text-balance text-2xl font-medium tracking-tight text-primary">
        {section.heading}
      </h2>
      {section.paragraphs ? (
        <div className="space-y-4">
          {section.paragraphs.map((paragraph, i) => (
            <p key={i} className="text-pretty leading-relaxed text-secondary">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
      {section.list ? (
        <ul className={section.paragraphs ? "mt-4 space-y-3" : "space-y-3"}>
          {section.list.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              <span className="text-pretty leading-relaxed text-secondary">{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SectionsSection({ sections }: { sections: LegalSection[] }) {
  return (
    <section className="bg-app px-gutter py-4">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="[&>div:last-child]:border-b-0">
            {sections.map((section) => (
              <SectionBlock key={section.heading} section={section} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function LegalPageTemplate({ data }: { data: LegalPageData }) {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroSection data={data} />
        {data.intro ? <IntroSection intro={data.intro} /> : null}
        <SectionsSection sections={data.sections} />
        <div className="h-24 bg-app" aria-hidden="true" />
      </main>
      <Footer />
    </div>
  );
}
