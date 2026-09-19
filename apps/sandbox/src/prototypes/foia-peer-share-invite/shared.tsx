import { Nav, Footer, ClientLogos } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";
import { HubSpotForm } from "../../content/forms/HubSpotForm";
import type { HubSpotFormName } from "../../content/forms/hubspot";

// ============================================================================
// FOIA Peer Share — shared layout for the three single-session invite pages
// (/foia-peer-share-invite_1, _2, _3 — see the sibling foia-peer-share-invite-N
// folders, each a thin wrapper passing its own date + form name). Structured
// after ../ai-in-action-webinar-registration (published at /peer-share-invite):
// the same light hero + dark form card pairing, adapted for a one-time
// session — a single date instead of a recurring cadence, FOIA-specific copy.
//
// This file has no index.tsx/meta.ts of its own, so it never self-registers
// as a route — only the three foia-peer-share-invite-N folders that import it
// do (same "template-only dir" arrangement as webinar-template,
// client-story-template).
// ============================================================================

interface FoiaPeerShareInviteProps {
  dateLabel: string;
  formName: HubSpotFormName;
}

function HeroAndFormSection({ dateLabel, formName }: FoiaPeerShareInviteProps) {
  return (
    <section className="bg-app px-gutter pb-17 sm:pb-24 pt-20 sm:pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div>
            <Eyebrow className="mb-6 text-brand-accent">FOIA Peer Share</Eyebrow>
            <h1 className="mb-6 text-balance font-serif text-3xl sm:text-4xl font-medium tracking-tight text-primary">
              Get your calendar invitation to this FOIA Peer Share session.
            </h1>
            <p className="mb-8 text-pretty text-lg text-secondary">
              A live session where local government teams share how they're using Madison AI
              to manage public records and FOIA requests — reserve your spot to get the
              calendar invite.
            </p>
            <dl className="space-y-2 text-secondary">
              <div className="flex gap-2">
                <dt className="font-semibold text-primary">Date:</dt>
                <dd>{dateLabel}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-primary">Time:</dt>
                <dd>10:00 a.m. PT | 1:00 p.m. ET</dd>
              </div>
            </dl>
          </div>
        </Reveal>
        <Reveal delay={100}>
          {/* bg-panel, not bg-surface — matches the reference page's card
              treatment (one tint darker on the dark elevation ladder). */}
          <div className="dark rounded-2xl border border-default bg-panel p-8">
            <h2 className="mb-1 text-2xl font-medium tracking-tight text-primary">
              Reserve your spot
            </h2>
            <p className="mb-6 text-sm text-secondary">
              Fill in the form below and we&rsquo;ll send you the calendar invite for this
              session.
            </p>
            <HubSpotForm form={formName} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FoiaPeerShareInvitePage({ dateLabel, formName }: FoiaPeerShareInviteProps) {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroAndFormSection dateLabel={dateLabel} formName={formName} />
      </main>
      <ClientLogos />
      <Footer />
    </div>
  );
}
