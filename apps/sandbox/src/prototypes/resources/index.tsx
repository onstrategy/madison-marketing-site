import { ArrowRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@madison/ui/tabs";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";

// ============================================================================
// Resources — recreated from madisonai.com/resources. Two tabs, per spec:
// "AI in Action Webinar" (2-column cards) and "Responsible AI" (3-column
// cards). One card per tab links to a real detail page built this session
// (the Director's Playbook webinar, and the AI Guiding Principles guide);
// the rest link out to "#" since they don't have full pages yet.
// ============================================================================

interface ResourceCard {
  title: string;
  description: string;
  href: string;
}

const WEBINAR_RESOURCES: ResourceCard[] = [
  {
    title: "The Director's Playbook to Put Your AI Assistant to Work",
    description: "Five real work tasks, with downloadable Task Cards for daily use.",
    href: "/director-of-ai-assistant",
  },
  {
    title: "How the City of Corona Evolved Its Procurement Process",
    description: "A look at how Corona's procurement team put Madison to work.",
    href: "#",
  },
  {
    title: "Santa Clara Valley Water's Infrastructure Deployment",
    description: "Rolling out Madison across a complex water infrastructure agency.",
    href: "#",
  },
  {
    title: "How Chanhassen Preserved Institutional Memory",
    description: "Keeping decades of city knowledge searchable and current.",
    href: "#",
  },
  {
    title: "RTC's Workflow, Replicated Across Departments",
    description: "Taking one team's Madison workflow citywide.",
    href: "#",
  },
  {
    title: "Two Years of Lessons from Washoe County",
    description: "What two years of daily use taught Madison's founding partner.",
    href: "#",
  },
  {
    title: "Planning Work Made Simple: Parcel Lookups & Zoning",
    description: "How planning teams use Madison for day-to-day zoning questions.",
    href: "#",
  },
  {
    title: "How FlashVote Optimizes Public Meetings",
    description: "Faster meeting prep, powered by Madison.",
    href: "#",
  },
  {
    title: "WRCOG's Real-World Applications",
    description: "A regional council of governments puts Madison into daily practice.",
    href: "#",
  },
];

const RESPONSIBLE_AI_RESOURCES: ResourceCard[] = [
  {
    title: "AI Governance Blueprint: A Guide to Ethical AI in Local Government",
    description: "A 4-step blueprint for bringing AI into your government ethically.",
    href: "#",
  },
  {
    title: "How to Develop Your Government's AI Guiding Principles",
    description: "A framework for articulating responsible AI principles.",
    href: "/resources/how-to-develop-your-governments-ai-guiding-principles",
  },
  {
    title: "How to Select Your AI Governance Structure",
    description: "A practical framework for structuring AI oversight and ownership.",
    href: "#",
  },
  {
    title: "Worksheets to Develop Your AI Guiding Principles",
    description: "A facilitation exercise your team can run together.",
    href: "#",
  },
  {
    title: "Choose Your AI Governance Structure (Miro Template)",
    description: "A ready-made template for mapping governance options.",
    href: "#",
  },
  {
    title: "Build Your AI Governance Policy (Free Miro Template)",
    description: "A starting point for drafting your own policy.",
    href: "#",
  },
  {
    title: "16 AI Governance Policy Examples",
    description: "Real policies from governments already doing this work.",
    href: "#",
  },
];

function ResourceCardItem({ resource }: { resource: ResourceCard }) {
  const isInternal = resource.href.startsWith("/");
  return (
    <a
      href={resource.href}
      {...(isInternal ? {} : { target: "_blank", rel: "noopener" })}
      className="group flex h-full flex-col rounded-2xl border border-default bg-surface p-6 transition-transform hover:-translate-y-1"
    >
      <h6 className="font-sans text-lg font-semibold tracking-tight text-primary">{resource.title}</h6>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary">{resource.description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent">
        Read more{" "}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

function HeroSection() {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-brand-accent">Resources</Eyebrow>
          <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            AI Governance Resources for Local Government
          </h1>
          <p className="text-pretty text-lg text-secondary">
            Webinars, guides, and templates for bringing AI into your government thoughtfully —
            drawn from real deployments, not theory.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function TabsSection() {
  return (
    <section className="bg-app px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Tabs defaultValue="webinar">
            <TabsList>
              <TabsTrigger value="webinar">AI in Action Webinar</TabsTrigger>
              <TabsTrigger value="responsible">Responsible AI</TabsTrigger>
            </TabsList>
            <TabsContent value="webinar" className="mt-10">
              <div className="grid gap-4 sm:grid-cols-2">
                {WEBINAR_RESOURCES.map((resource) => (
                  <ResourceCardItem key={resource.title} resource={resource} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="responsible" className="mt-10">
              <div className="grid gap-4 sm:grid-cols-3">
                {RESPONSIBLE_AI_RESOURCES.map((resource) => (
                  <ResourceCardItem key={resource.title} resource={resource} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="dark border-t border-default bg-app px-gutter py-30 text-center">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="mb-4 text-balance text-4xl font-medium tracking-tight text-primary">
            Book a demo today.
          </h2>
          <p className="mb-8 text-pretty text-lg text-secondary">
            Fill in the form and our team will get back to you within one business day.
          </p>
          <Button size="lg" asChild>
            <a href="/demo">
              Book a demo <ArrowRight className="size-4" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function ResourcesPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroSection />
        <TabsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
