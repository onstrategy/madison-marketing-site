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
// hero+form coloring, by explicit request for this page — then the
// standard client-logo strip and footer. Copy here is written fresh for
// this build, not copied from the live page. (Used to also carry a "next
// session" agenda card naming a specific upcoming date/topic; removed by
// request.)
// ============================================================================

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

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function AiInActionWebinarRegistrationPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroAndFormSection />
      </main>
      <ClientLogos />
      <Footer />
    </div>
  );
}
