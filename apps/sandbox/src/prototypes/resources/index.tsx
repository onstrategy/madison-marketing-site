import { ArrowRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@madison/ui/tabs";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";
import { PHOTOS } from "../landing/photos";

// Cards don't have real per-post photography — cycling through the shared
// generic civic/at-work stock set (see landing/photos.ts) gives each card a
// distinct 16:9 image without inventing per-title art direction.
const CARD_PHOTOS = Object.values(PHOTOS);

// ============================================================================
// Resources — recreated from madisonai.com/resources. Two tabs, per spec:
// "AI in Action Webinar" (2-column cards) and "Responsible AI" (3-column
// cards). One card per tab links to a real detail page built this session
// (the Director's Playbook webinar, and the AI Guiding Principles guide);
// the rest render as non-interactive "Coming soon" cards.
// ============================================================================

interface ResourceCard {
  title: string;
  description: string;
  href?: string;
}

const WEBINAR_RESOURCES: ResourceCard[] = [
  {
    title: "The Director's Playbook to Put Your AI Assistant to Work",
    description: "Five real work tasks, with downloadable Task Cards for daily use.",
    href: "/director-of-ai-assistant/",
  },
  {
    title: "Turning Your ACFR into Indicators, with GFOA",
    description: "A GFOA partnership piece on turning annual financial reports into usable indicators.",
  },
  {
    title: "How the City of Corona Evolved Its Procurement Process",
    description: "A look at how Corona's procurement team put Madison to work.",
  },
  {
    title: "The AI Everyone's Talking About Is Already Inside Your Deployment",
    description: "What the latest AI headlines describe is already part of your Madison rollout.",
  },
  {
    title: "Santa Clara Valley Water's Infrastructure Deployment",
    description: "Rolling out Madison across a complex water infrastructure agency.",
  },
  {
    title: "How Chanhassen Preserved Institutional Memory",
    description: "Keeping decades of city knowledge searchable and current.",
  },
  {
    title: "RTC's Workflow, Replicated Across Departments",
    description: "Taking one team's Madison workflow citywide.",
  },
  {
    title: "Madison AI Gets Faster and Smarter",
    description: "A rundown of the latest speed and capability upgrades across the platform.",
  },
  {
    title: "Planning Work Made Simple: Parcel Lookups & Zoning",
    description: "How planning teams use Madison for day-to-day zoning questions.",
  },
  {
    title: "Two Years of Lessons from Washoe County",
    description: "What two years of daily use taught Madison's founding partner.",
  },
  {
    title: "How FlashVote Optimizes Public Meetings",
    description: "Faster meeting prep, powered by Madison.",
  },
  {
    title: "WRCOG's Real-World Applications",
    description: "A regional council of governments puts Madison into daily practice.",
  },
];

const RESPONSIBLE_AI_RESOURCES: ResourceCard[] = [
  {
    title: "AI Governance Blueprint: A Guide to Ethical AI in Local Government",
    description: "A 4-step blueprint for bringing AI into your government ethically.",
  },
  {
    title: "How to Develop Your Government's AI Guiding Principles",
    description: "A framework for articulating responsible AI principles.",
    href: "/resources/how-to-develop-your-governments-ai-guiding-principles/",
  },
  {
    title: "How to Select Your AI Governance Structure",
    description: "A practical framework for structuring AI oversight and ownership.",
  },
  {
    title: "Worksheets to Develop Your AI Guiding Principles",
    description: "A facilitation exercise your team can run together.",
  },
  {
    title: "Choose Your AI Governance Structure (Miro Template)",
    description: "A ready-made template for mapping governance options.",
  },
  {
    title: "Build Your AI Governance Policy (Free Miro Template)",
    description: "A starting point for drafting your own policy.",
  },
  {
    title: "16 AI Governance Policy Examples",
    description: "Real policies from governments already doing this work.",
  },
];

function ResourceCardItem({ resource, index }: { resource: ResourceCard; index: number }) {
  const photo = CARD_PHOTOS[index % CARD_PHOTOS.length];
  const content = (
    <>
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={photo.url}
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-sans text-lg font-semibold tracking-tight text-primary">
          {resource.title}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary">{resource.description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent">
          {resource.href ? (
            <>
              Read more
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </>
          ) : (
            "Coming soon"
          )}
        </span>
      </div>
    </>
  );

  if (!resource.href) {
    return (
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-default bg-surface">
        {content}
      </article>
    );
  }

  const isInternal = resource.href.startsWith("/");
  return (
    <a
      href={resource.href}
      {...(isInternal ? {} : { target: "_blank", rel: "noopener" })}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-default bg-surface transition-transform hover:-translate-y-1"
    >
      {content}
    </a>
  );
}

function HeroSection() {
  return (
    // `relative` gives the floating tab switcher below a positioning
    // context — same straddle-the-boundary technique as the client story
    // template's HeroMetaCard (see client-story-template/template.tsx).
    <section className="dark relative border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
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
      {/* Tab switcher — pinned to the hero's bottom edge, shifted down by
          half its own height so it straddles the hero/tabs-section boundary
          and reads as one element overlapping both. `light` is forced (like
          HeroMetaCard) so it stays a legible light pill regardless of which
          section's theme it's currently floating over. */}
      <div className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center px-gutter lg:px-0">
        <Reveal delay={100}>
          <TabsList className="light h-auto gap-1 rounded-full border border-default bg-hover p-1.5 shadow-xl">
            <TabsTrigger value="webinar" className="rounded-full px-5 py-2">
              AI in Action Webinar
            </TabsTrigger>
            <TabsTrigger value="responsible" className="rounded-full px-5 py-2">
              Responsible AI
            </TabsTrigger>
          </TabsList>
        </Reveal>
      </div>
    </section>
  );
}

function TabsSection() {
  return (
    // pt-24/pb-16 (down from the uniform py-30): half the switcher's height
    // already lands in this section's top padding via the translate above,
    // and the light section was carrying more air than the switcher + cards
    // need — tightened top AND bottom.
    <section className="bg-app px-gutter pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
        <TabsContent value="webinar">
          <div className="grid gap-4 sm:grid-cols-2">
            {WEBINAR_RESOURCES.map((resource, i) => (
              <ResourceCardItem key={resource.title} resource={resource} index={i} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="responsible">
          <div className="grid gap-4 sm:grid-cols-3">
            {RESPONSIBLE_AI_RESOURCES.map((resource, i) => (
              <ResourceCardItem key={resource.title} resource={resource} index={i} />
            ))}
          </div>
        </TabsContent>
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
            <a href="/demo/">
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
        {/* Tabs.Root just provides context + an unstyled div — safe to wrap
            around both sections even though the switcher (TabsList, in
            HeroSection) and the panels (TabsContent, in TabsSection) live in
            different <section>s further down; they only need to share this
            one React subtree, not be DOM-adjacent. */}
        <Tabs defaultValue="webinar">
          <HeroSection />
          <TabsSection />
        </Tabs>
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
