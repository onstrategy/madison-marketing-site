import { ArrowRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Badge } from "@madison/ui/badge";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";
import { newsArticles } from "../../content/news/collection";
import { resolveNewsAsset } from "../../content/news/assets";

// ============================================================================
// Newsroom — recreated from madisonai.com/updates. Every card and article route
// is driven by the validated News article collection.
// ============================================================================

type Category = "Insights" | "Team" | "Company";

interface NewsCard {
  order: number;
  title: string;
  category: Category;
  description: string;
  href: string;
  photo: string;
  imageAlt: string;
}

const NEWS: NewsCard[] = newsArticles
  .map((article) => ({
    order: article.order,
    title: article.card.title,
    category: article.category,
    description: article.card.description,
    href: article.path,
    photo: resolveNewsAsset(article.card.imageAsset),
    imageAlt: article.card.imageAlt,
  }))
  .sort((left, right) => left.order - right.order);

function NewsCardItem({ item }: { item: NewsCard }) {
  return (
    <a
      href={item.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-default bg-surface transition-transform hover:-translate-y-1"
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={item.photo}
          alt={item.imageAlt}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4">
          <Badge variant="secondary">{item.category}</Badge>
        </div>
        <h2 className="font-sans text-lg font-semibold leading-normal tracking-tight text-primary">{item.title}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary">{item.description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent">
          Read more
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

function HeroSection() {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-brand-accent">Newsroom</Eyebrow>
          <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            Newsroom
          </h1>
          <p className="text-pretty text-lg text-secondary">
            Recent announcements, product releases, and partnerships.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function NewsGridSection() {
  return (
    <section className="bg-app px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-2">
          {NEWS.map((item, i) => (
            <Reveal key={item.title} delay={i * 40}>
              <NewsCardItem item={item} />
            </Reveal>
          ))}
        </div>
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
export default function NewsroomPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroSection />
        <NewsGridSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
