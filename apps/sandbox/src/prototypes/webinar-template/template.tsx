import { ArrowRight, Download, type LucideIcon } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Nav, Footer, ClientLogos } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";

// ============================================================================
// WebinarTemplate — the reusable structure for "AI in Action Webinar" detail
// pages, recreated from madisonai.com/director-of-ai-assistant. One template,
// one shape of data — a new webinar recap is a new data object, not new
// layout code. Mirrors ../platform-page/template.tsx and
// content-driven section pages.
// ============================================================================

export interface WebinarTask {
  icon: LucideIcon;
  title: string;
  description: string;
  quote?: { text: string; attribution: string };
}

export interface WebinarData {
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  intro: string;
  tasksEyebrow: string;
  tasksTitle: string;
  tasks: WebinarTask[];
  bestPracticesTitle: string;
  bestPractices: string[];
  cta: {
    title: string;
    description: string;
    primaryCta: string;
  };
}

function HeroSection({ data }: { data: WebinarData["hero"] }) {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-24 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-brand-accent">{data.kicker}</Eyebrow>
          <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            {data.title}
          </h1>
          <p className="text-pretty text-lg text-secondary">{data.subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}

function IntroSection({ intro }: { intro: string }) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-pretty text-center text-lg text-secondary">{intro}</p>
        </Reveal>
      </div>
    </section>
  );
}

function TasksSection({ data }: { data: WebinarData }) {
  return (
    <section className="border-b border-default bg-app px-gutter py-30">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow className="mb-6">{data.tasksEyebrow}</Eyebrow>
          <h2 className="mb-12 text-balance text-4xl font-medium tracking-tight text-primary">
            {data.tasksTitle}
          </h2>
        </Reveal>
        <div className="space-y-6">
          {data.tasks.map((task, i) => (
            <Reveal key={task.title} delay={i * 60}>
              <div className="rounded-2xl border border-default bg-surface p-6 lg:p-8">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-fg">
                  <task.icon className="size-4" />
                </span>
                <h3 className="mt-4 font-serif text-2xl font-medium tracking-tight text-primary">
                  {i + 1}. {task.title}
                </h3>
                <p className="mt-3 text-pretty leading-relaxed text-secondary">
                  {task.description}
                </p>
                {task.quote ? (
                  <div className="mt-5 rounded-xl bg-brand-subtle p-5">
                    <p className="font-serif text-lg italic tracking-tight text-primary">
                      &ldquo;{task.quote.text}&rdquo;
                    </p>
                    <p className="mt-2 font-sans text-sm text-brand-accent">
                      {task.quote.attribution}
                    </p>
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BestPracticesSection({ data }: { data: WebinarData }) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-30">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="mb-8 text-balance text-4xl font-medium tracking-tight text-primary">
            {data.bestPracticesTitle}
          </h2>
        </Reveal>
        <ul className="space-y-4">
          {data.bestPractices.map((practice, i) => (
            <li key={practice}>
              <Reveal className="flex items-start gap-3.5" delay={i * 40}>
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-xs font-semibold text-brand-accent">
                  {i + 1}
                </span>
                <span className="text-pretty text-secondary">{practice}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CtaSection({ data }: { data: WebinarData["cta"] }) {
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
          <p className="mt-6">
            <a
              href="/resources/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent"
            >
              Download the Task Cards <Download className="size-3.5" />
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function WebinarTemplate({ data }: { data: WebinarData }) {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroSection data={data.hero} />
        <IntroSection intro={data.intro} />
        <TasksSection data={data} />
        <BestPracticesSection data={data} />
        <ClientLogos />
        <CtaSection data={data.cta} />
      </main>
      <Footer />
    </div>
  );
}
