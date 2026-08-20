import { ShieldCheck, FileCheck2, ScrollText, ArrowRight } from "lucide-react";
import { Nav, Footer, ClientLogos } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";
import { HubSpotForm } from "../../content/forms/HubSpotForm";

// ============================================================================
// Book a Security Review. Same shape as
// ../ai-in-action-webinar-registration/index.tsx by explicit request — a
// light hero pairing the pitch copy with a dark registration form card, then
// a supporting value-prop card, the standard client-logo strip, and footer.
// Linked to from the Security page's final CTA ("Schedule a security
// review" — see ../security/index.tsx's FinalCtaSection). Copy is adapted
// from madisonai.com/book-a-security-review.
//
// The form is the same real HubSpot form ../book-a-demo and the platform pages
// use (one form, many pages — see content/forms/hubspot.ts), carrying the
// "demo-routing" Calendly routing form, so submitting it opens Calendly's
// scheduling modal instead of ending at HubSpot's thank-you.
// ============================================================================

const VALUE_PROPS = [
  "Your own dedicated and isolated Azure environment.",
  "Enterprise compliance: SOC 2 Type II, FedRAMP Moderate, HIPAA-eligible.",
  "Every answer cited, every interaction audit-logged.",
];

function HeroAndFormSection() {
  return (
    <section className="bg-app px-gutter pb-24 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div>
            <Eyebrow className="mb-6 text-brand-accent">Book a Security Review</Eyebrow>
            <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
              Speak to our team about your security needs.
            </h1>
            <p className="mb-8 text-pretty text-lg text-secondary">
              We protect your agency&rsquo;s data with dedicated environments,
              enterprise-grade compliance, and AI that&rsquo;s traceable end-to-end. Tell us
              a bit about your agency and we&rsquo;ll set up time to walk through it together.
            </p>
            <dl className="space-y-2 text-secondary">
              <div className="flex gap-2">
                <dt className="font-semibold text-primary">Typical session:</dt>
                <dd>30 minutes, with your IT or security lead</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-primary">What you&rsquo;ll get:</dt>
                <dd>Architecture walkthrough, compliance docs, and Q&amp;A</dd>
              </div>
            </dl>
          </div>
        </Reveal>
        <Reveal delay={100}>
          {/* bg-panel intentionally reads as a darker inset card here, matching
              ../ai-in-action-webinar-registration/index.tsx's form card. */}
          <div className="dark rounded-2xl border border-default bg-panel p-8">
            <h2 className="mb-1 text-2xl font-medium tracking-tight text-primary">
              Request your review
            </h2>
            <p className="mb-6 text-sm text-secondary">
              Fill in the form below and you&rsquo;ll be able to pick a time that suits
              you right away.
            </p>
            <HubSpotForm
              form="book-a-demo"
              calendlyRouting="demo-routing"
              fieldBackground="white"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ResponsibleByDesignSection() {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="rounded-2xl border border-default bg-panel p-8 lg:p-10">
            <Eyebrow className="mb-4">Responsible by Design</Eyebrow>
            <h2 className="mb-6 text-balance font-serif text-2xl font-medium tracking-tight text-primary">
              How Madison AI keeps your agency&rsquo;s data secure
            </h2>
            <ul className="space-y-3.5">
              {VALUE_PROPS.map((text, i) => {
                const Icon = [ShieldCheck, FileCheck2, ScrollText][i];
                return (
                  <li key={text} className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0 text-brand-accent" aria-hidden="true" />
                    <span className="text-pretty text-secondary">{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <p className="mt-6 text-center">
            <a
              href="/security/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent"
            >
              See our full security &amp; compliance overview <ArrowRight className="size-3.5" />
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function BookASecurityReviewPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroAndFormSection />
        <ResponsibleByDesignSection />
      </main>
      <ClientLogos />
      <Footer />
    </div>
  );
}
