import { FileSearch, Scale, FileText, Archive } from "lucide-react";
import { Nav, Footer, ClientLogos } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";
import { HubSpotForm } from "../../content/forms/HubSpotForm";

// ============================================================================
// Book a Demo — recreated from madisonai.com/demo. The form is the real
// HubSpot "book-a-demo" form (see content/forms/hubspot.ts), embedded
// client-side inside the on-token card shell.
// ============================================================================

// The knowledge-assistant and smart-workflow feature sets, recombined from six
// points down to four, one icon per point (not one icon per group).
const FEATURES = [
  {
    icon: FileSearch,
    text: "Query decades of historical documents",
  },
  {
    icon: Scale,
    text: "Policy and issue analysis",
  },
  {
    icon: FileText,
    text: "Staff reports and meeting minutes, drafted for you",
  },
  {
    icon: Archive,
    text: "Records request drafting",
  },
];

function HeroAndFormSection() {
  return (
    <section className="dark bg-app px-gutter pb-24 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div>
            <Eyebrow className="mb-6 text-brand-accent">Book a Demo</Eyebrow>
            <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
              See a knowledge assistant built from your government's data.
            </h1>
            <p className="mb-10 text-pretty text-lg text-secondary">
              Madison turns your agency's own records into an assistant that completes real work
              in minutes, not hours.
            </p>
            <ul className="space-y-4">
              {FEATURES.map((feature) => (
                <li key={feature.text} className="flex items-start gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg">
                    <feature.icon className="size-4" />
                  </span>
                  <span className="pt-1.5 text-pretty text-secondary">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="light rounded-2xl border border-default bg-surface p-8">
            <h2 className="mb-1 text-2xl font-medium tracking-tight text-primary">
              Schedule a call
            </h2>
            <p className="mb-6 text-sm text-secondary">
              Fill in the form below, and our team will get back to you within one business day.
            </p>
            <HubSpotForm form="book-a-demo" calendlyRouting="demo-routing" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function BookADemoPrototype() {
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
