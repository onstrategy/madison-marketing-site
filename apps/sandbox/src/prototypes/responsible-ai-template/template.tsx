import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";

// ============================================================================
// ResponsibleAiTemplate — the reusable structure for "Responsible AI" guide
// pages, recreated from madisonai.com/resources/how-to-develop-your-
// governments-ai-guiding-principles. One template, one shape of data — a new
// guide is a new data object, not new layout code.
// ============================================================================

export interface GuideStep {
  step: string;
  title: string;
  description: string;
}

export interface GuidePrincipleSet {
  org: string;
  principles: string[];
}

export interface RelatedResource {
  title: string;
  href?: string;
}

export interface ResponsibleAiData {
  hero: {
    kicker: string;
    title: string;
    author: string;
    date: string;
  };
  intro: {
    heading: string;
    paragraphs: string[];
  };
  reasonsEyebrow: string;
  reasonsTitle: string;
  reasons: { icon: LucideIcon; title: string; description: string }[];
  stepsTitle: string;
  steps: GuideStep[];
  examplesTitle: string;
  examples: GuidePrincipleSet[];
  closing: {
    title: string;
    paragraphs: string[];
  };
  related: RelatedResource[];
  cta: {
    title: string;
    description: string;
    primaryCta: string;
  };
}

function HeroSection({ data }: { data: ResponsibleAiData["hero"] }) {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow className="mb-6 text-brand-accent">{data.kicker}</Eyebrow>
          <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            {data.title}
          </h1>
          <p className="font-sans text-sm text-secondary">
            {data.author} · {data.date}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function IntroSection({ data }: { data: ResponsibleAiData["intro"] }) {
  return (
    <section className="border-b border-default bg-app px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="mb-6 text-balance text-3xl font-medium tracking-tight text-primary">
            {data.heading}
          </h2>
          <div className="space-y-4">
            {data.paragraphs.map((p) => (
              <p key={p} className="text-pretty leading-relaxed text-secondary">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ReasonsSection({ data }: { data: ResponsibleAiData }) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow className="mb-4">{data.reasonsEyebrow}</Eyebrow>
          <h2 className="mb-10 text-balance text-3xl font-medium tracking-tight text-primary">
            {data.reasonsTitle}
          </h2>
        </Reveal>
        <div className="space-y-4">
          {data.reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 60}>
              <div className="flex gap-4 rounded-2xl border border-default bg-panel p-6">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg">
                  <reason.icon className="size-4" />
                </span>
                <div>
                  <h3 className="font-sans text-lg font-semibold tracking-tight text-primary">
                    {reason.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                    {reason.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepsSection({ data }: { data: ResponsibleAiData }) {
  return (
    <section className="border-b border-default bg-app px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="mb-10 text-balance text-3xl font-medium tracking-tight text-primary">
            {data.stepsTitle}
          </h2>
        </Reveal>
        <div className="relative">
          <div className="absolute inset-y-4 left-4 border-l border-default" aria-hidden />
          <div className="space-y-8">
            {data.steps.map((step, i) => (
              <Reveal key={step.step} delay={i * 60}>
                <div className="flex gap-6">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-fg">
                    {i + 1}
                  </span>
                  <div className="flex-1 rounded-2xl border border-default bg-surface p-5">
                    <div className="font-sans text-sm uppercase tracking-widest text-muted">
                      {step.step}
                    </div>
                    <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExamplesSection({ data }: { data: ResponsibleAiData }) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="mb-10 text-balance text-3xl font-medium tracking-tight text-primary">
            {data.examplesTitle}
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {data.examples.map((set, i) => (
            <Reveal key={set.org} delay={i * 60}>
              <div className="h-full rounded-2xl border border-default bg-panel p-6">
                <h3 className="font-sans text-lg font-semibold tracking-tight text-primary">
                  {set.org}
                </h3>
                <ul className="mt-3 space-y-2">
                  {set.principles.map((p) => (
                    <li key={p} className="text-sm leading-relaxed text-secondary">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingSection({ data }: { data: ResponsibleAiData["closing"] }) {
  return (
    <section className="border-b border-default bg-app px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="mb-6 text-balance text-3xl font-medium tracking-tight text-primary">
            {data.title}
          </h2>
          <div className="space-y-4">
            {data.paragraphs.map((p) => (
              <p key={p} className="text-pretty leading-relaxed text-secondary">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function RelatedSection({ data }: { data: RelatedResource[] }) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="mb-8 text-balance text-2xl font-medium tracking-tight text-primary">
            Similar resources
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {data.map((resource, i) => (
            <Reveal key={resource.title} delay={i * 60}>
              {resource.href ? (
                <a
                  href={resource.href}
                  className="block h-full rounded-2xl border border-default bg-panel p-5 text-sm font-semibold text-primary transition-transform hover:-translate-y-1"
                >
                  {resource.title}
                </a>
              ) : (
                <div className="h-full rounded-2xl border border-default bg-panel p-5 text-sm font-semibold text-primary">
                  {resource.title}
                  <span className="mt-3 block text-xs font-normal text-muted">Coming soon</span>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ data }: { data: ResponsibleAiData["cta"] }) {
  return (
    <section className="dark bg-app px-gutter py-30 text-center">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="mb-4 text-balance text-4xl font-medium tracking-tight text-primary">
            {data.title}
          </h2>
          <p className="mb-8 text-pretty text-lg text-secondary">{data.description}</p>
          <Button size="lg" asChild>
            <a href="/demo/">
              {data.primaryCta} <ArrowRight className="size-4" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

export function ResponsibleAiTemplate({ data }: { data: ResponsibleAiData }) {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroSection data={data.hero} />
        <IntroSection data={data.intro} />
        <ReasonsSection data={data} />
        <StepsSection data={data} />
        <ExamplesSection data={data} />
        <ClosingSection data={data.closing} />
        <RelatedSection data={data.related} />
        <CtaSection data={data.cta} />
      </main>
      <Footer />
    </div>
  );
}
