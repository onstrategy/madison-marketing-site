import { CheckCircle2, Download } from "lucide-react";
import { Nav, Footer, ClientLogos } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";
import { HubSpotForm } from "../../content/forms/HubSpotForm";

// ============================================================================
// AI in Action Webinar — Registration, published at /peer-share-invite (see
// meta.ts). The form is the real HubSpot "webinar-registration" form (see
// content/forms/hubspot.ts), embedded client-side inside the card shell.
//
// Structured after madisonai.com/peer-share-invite: a light hero pairing the invite copy with
// a dark registration form card — the inverse of ../book-a-demo/index.tsx's
// hero+form coloring, by explicit request for this page — then a "next
// session" agenda card, the standard client-logo strip, and footer. Copy
// here is written fresh for this build, not copied from the live page.
// ============================================================================

const VALUE_PROPS = [
  "Peer-led walkthroughs from local government leaders and staff.",
  "Step-by-step training on real workflows, not just features.",
  "AI upskilling — prompting, patterns, and power tips.",
];

function HeroAndFormSection() {
  return (
    <section className="bg-app px-gutter pb-24 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div>
            <Eyebrow className="mb-6 text-brand-accent">AI in Action Webinar</Eyebrow>
            <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
              Get your calendar invitation to the AI in Action series.
            </h1>
            <p className="mb-8 text-pretty text-lg text-secondary">
              A live, twice-monthly session where local government teams show how they're
              actually putting Madison to work — register once for a standing invite to every
              session.
            </p>
            <dl className="space-y-2 text-secondary">
              <div className="flex gap-2">
                <dt className="font-semibold text-primary">Date:</dt>
                <dd>1st &amp; 3rd Thursdays of every month</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-primary">Time:</dt>
                <dd>10:00 a.m. PT | 1:00 p.m. ET</dd>
              </div>
            </dl>
          </div>
        </Reveal>
        <Reveal delay={100}>
          {/* bg-panel, not bg-surface — one tint darker on the dark elevation
              ladder (bg-app → bg-panel → bg-elevated → bg-surface), by
              request for this card specifically. */}
          <div className="dark rounded-2xl border border-default bg-panel p-8">
            <h2 className="mb-1 text-2xl font-medium tracking-tight text-primary">
              Reserve your spot
            </h2>
            <p className="mb-6 text-sm text-secondary">
              Fill in the form below and we'll send a standing calendar invite to every session.
            </p>
            <HubSpotForm form="webinar-registration" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function NextSessionSection() {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="rounded-2xl border border-default bg-panel p-8 lg:p-10">
            <Eyebrow className="mb-4">AI in Action — Our Next Agenda</Eyebrow>
            <p className="mb-1 text-sm font-semibold text-secondary">
              Next session: August 20, 2026 — 10:00 a.m. PT
            </p>
            <h2 className="mb-6 text-balance font-serif text-2xl font-medium tracking-tight text-primary">
              Data Layer, Part 2: Records &amp; Document Search
            </h2>
            <ul className="space-y-3.5">
              {VALUE_PROPS.map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-brand-accent"
                    aria-hidden="true"
                  />
                  <span className="text-pretty text-secondary">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <p className="mt-6 text-center">
            <a
              href="/resources"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent"
            >
              Missed a session? Browse past recaps <Download className="size-3.5" />
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function AiInActionWebinarRegistrationPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroAndFormSection />
        <NextSessionSection />
      </main>
      <ClientLogos />
      <Footer />
    </div>
  );
}
