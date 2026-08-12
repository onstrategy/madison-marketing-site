import { ArrowRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Nav, Footer, ClientLogos } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";

// ============================================================================
// NewsItemTemplate — the reusable structure for individual Newsroom articles,
// recreated from madisonai.com/proof-ai-works-in-the-public-sector. One
// template, one shape of data — a new article is a new data object, not new
// layout code.
// ============================================================================

export interface NewsStat {
  value: string;
  label: string;
}

export interface NewsLesson {
  title: string;
  paragraphs: string[];
  stats?: NewsStat[];
}

export interface NewsItemData {
  hero: {
    kicker: string;
    title: string;
    author: string;
    role: string;
    opener: string;
  };
  intro: string;
  lessons: NewsLesson[];
  closing: string;
  cta: {
    title: string;
    description: string;
    primaryCta: string;
  };
}

function HeroSection({ data }: { data: NewsItemData["hero"] }) {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow className="mb-6 text-brand-accent">{data.kicker}</Eyebrow>
          <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            {data.title}
          </h1>
          <p className="mb-6 font-sans text-sm text-secondary">
            {data.author}, {data.role}
          </p>
          <p className="text-pretty font-serif text-2xl italic tracking-tight text-primary">
            &ldquo;{data.opener}&rdquo;
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function IntroSection({ intro }: { intro: string }) {
  return (
    <section className="border-b border-default bg-app px-gutter py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-pretty leading-relaxed text-secondary">{intro}</p>
        </Reveal>
      </div>
    </section>
  );
}

function LessonsSection({ lessons }: { lessons: NewsLesson[] }) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-3xl space-y-16">
        {lessons.map((lesson, i) => (
          <Reveal key={lesson.title} delay={i * 60}>
            <div>
              <h2 className="mb-4 text-balance text-3xl font-medium tracking-tight text-primary">
                Lesson {i + 1}: {lesson.title}
              </h2>
              <div className="space-y-4">
                {lesson.paragraphs.map((p) => (
                  <p key={p} className="text-pretty leading-relaxed text-secondary">
                    {p}
                  </p>
                ))}
              </div>
              {lesson.stats ? (
                <div className="mt-6 grid grid-cols-2 gap-6 rounded-2xl border border-default bg-panel p-6 sm:grid-cols-4">
                  {lesson.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="font-serif text-3xl font-medium tracking-tight text-brand-accent">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-xs text-secondary">{stat.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ClosingSection({ closing }: { closing: string }) {
  return (
    <section className="border-b border-default bg-app px-gutter py-20 text-center">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <p className="text-balance font-serif text-2xl font-medium tracking-tight text-primary">
            {closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function CtaSection({ data }: { data: NewsItemData["cta"] }) {
  return (
    <section className="dark bg-app px-gutter py-30 text-center">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="mb-4 text-balance text-4xl font-medium tracking-tight text-primary">
            {data.title}
          </h2>
          <p className="mb-8 text-pretty text-lg text-secondary">{data.description}</p>
          <Button size="lg" asChild>
            <a href="/demo">
              {data.primaryCta} <ArrowRight className="size-4" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

export function NewsItemTemplate({ data }: { data: NewsItemData }) {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroSection data={data.hero} />
        <IntroSection intro={data.intro} />
        <LessonsSection lessons={data.lessons} />
        <ClosingSection closing={data.closing} />
        <CtaSection data={data.cta} />
        <ClientLogos />
      </main>
      <Footer />
    </div>
  );
}
