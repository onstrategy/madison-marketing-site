import { ArrowRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@madison/ui/tabs";
import { webinars } from "../../content/webinars/collection";
import { resolveWebinarAsset } from "../../content/webinars/assets";
import { responsibleAiResources } from "../../content/responsible-ai/collection";
import { resolveResponsibleAiAsset } from "../../content/responsible-ai/assets";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";

// ============================================================================
// Resources — recreated from madisonai.com/resources. Two tabs, per spec:
// "AI in Action Webinar" (2-column cards) and "Responsible AI" (3-column
// cards). Both tabs now come from validated local content collections.
// ============================================================================

interface ResourceCard {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
}

const WEBINAR_RESOURCES: ResourceCard[] = webinars.map((webinar) => ({
  title: webinar.card.title,
  description: webinar.card.description ?? webinar.metadata.description,
  imageUrl: resolveWebinarAsset(webinar.card.imageAsset),
  imageAlt: webinar.card.imageAlt,
  href: webinar.path,
}));

const RESPONSIBLE_AI_RESOURCES: ResourceCard[] = responsibleAiResources.map(
  (resource) => ({
    title: resource.card.title,
    description: resource.card.description ?? resource.metadata.description,
    imageUrl: resolveResponsibleAiAsset(resource.card.imageAsset),
    imageAlt: resource.card.imageAlt,
    href: resource.path,
  }),
);

function ResourceCardItem({ resource }: { resource: ResourceCard }) {
  const content = (
    <>
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={resource.imageUrl}
          alt={resource.imageAlt}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-sans text-lg font-semibold tracking-tight text-primary">
          {resource.title}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary">
          {resource.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent">
          Read more
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </>
  );

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
    // client story hero section's metadata card.
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
            {WEBINAR_RESOURCES.map((resource) => (
              <ResourceCardItem key={resource.href} resource={resource} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="responsible">
          <div className="grid gap-4 sm:grid-cols-3">
            {RESPONSIBLE_AI_RESOURCES.map((resource) => (
              <ResourceCardItem key={resource.href} resource={resource} />
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
