import { FileSearch, Workflow, Download } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Input } from "@madison/ui/input";
import { Label } from "@madison/ui/label";
import { Nav, Footer, ClientLogos } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";

// ============================================================================
// Book a Demo — recreated from madisonai.com/demo.
// ============================================================================

const FEATURES = [
  {
    icon: FileSearch,
    title: "Knowledge assistants",
    items: [
      "Query decades of historical documents",
      "Zoning and code research",
      "Policy and issue analysis",
    ],
  },
  {
    icon: Workflow,
    title: "Smart workflows",
    items: [
      "Automated staff report generation",
      "Records request drafting",
      "Meeting minutes, drafted for you",
    ],
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
            <div className="space-y-8">
              {FEATURES.map((feature) => (
                <div key={feature.title}>
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-fg">
                    <feature.icon className="size-4" />
                  </span>
                  <h2 className="mt-4 text-2xl font-medium tracking-tight text-primary">
                    {feature.title}
                  </h2>
                  <ul className="mt-3 space-y-1.5">
                    {feature.items.map((item) => (
                      <li key={item} className="text-secondary">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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
            <form className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="demo-first-name">First name</Label>
                <Input id="demo-first-name" name="firstName" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="demo-last-name">Last name</Label>
                <Input id="demo-last-name" name="lastName" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="demo-email">Organization email address*</Label>
                <Input id="demo-email" name="email" type="email" required />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="demo-phone">Phone number</Label>
                <Input id="demo-phone" name="phone" type="tel" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="demo-org">Government name and department*</Label>
                <Input id="demo-org" name="organization" required />
              </div>
              <Button type="submit" size="lg" className="sm:col-span-2">
                Book Your Demo <Download className="size-4" />
              </Button>
            </form>
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
