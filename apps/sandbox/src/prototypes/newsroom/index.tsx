import { ArrowRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Badge } from "@madison/ui/badge";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";
import { PHOTOS } from "../landing/photos";
import { newsArticles } from "../../content/news/collection";
import { resolveNewsAsset } from "../../content/news/assets";

// Cards don't have real per-post photography — cycling through the shared
// generic civic/at-work stock set (see landing/photos.ts) gives each card a
// distinct 16:9 image without inventing per-title art direction.
const CARD_PHOTOS = Object.values(PHOTOS);

// ============================================================================
// Newsroom — recreated from madisonai.com/updates. 2-column card grid per
// spec (the source itself lays these out as a single stacked column, but the
// request called for 2 columns, so that's what's built here). Cards with a
// real article page (Proof AI Works, plus the JSON-driven News entries) link
// to it; the rest render as non-interactive "Coming soon" cards until their
// pages exist.
// ============================================================================

type Category = "Insights" | "Team" | "Company";

interface NewsCard {
  order: number;
  title: string;
  category: Category;
  description: string;
  href?: string;
  photo?: string;
  imageAlt?: string;
}

const LEGACY_NEWS: NewsCard[] = [
  {
    order: 10,
    title: "1,204 Hours Reclaimed: Proof AI Works in the Public Sector",
    category: "Insights",
    description: "Three lessons that separate AI that delivers from AI that disappoints.",
    href: "/proof-ai-works-in-the-public-sector/",
  },
  {
    order: 20,
    title: "Peter Pirnejad Joins Madison AI as Strategic Advisor",
    category: "Team",
    description: "Bringing municipal leadership experience to the organization.",
  },
  {
    order: 40,
    title: "Madison AI Welcomes Senior Software Engineer Reid Weber",
    category: "Team",
    description: "Leading data systems, acquisition, and AI initiatives.",
  },
  {
    order: 50,
    title: "Tom Spangler Joins Madison AI as Board Member and Advisor",
    category: "Team",
    description: "Advancing company growth and impact efforts.",
  },
  {
    order: 60,
    title: "Named GovTech's Most Innovative Solution, Madison AI Secures Funding",
    category: "Company",
    description: "Scaling to transform local government operations.",
  },
  {
    order: 70,
    title: "Mark Wheeler Joins Madison AI as Chief Public Data Officer",
    category: "Team",
    description: "Adds trusted government AI expertise.",
  },
  {
    order: 80,
    title: "Dana Searcy Joins Madison AI as a Principal Strategist",
    category: "Team",
    description: "Brings public-sector leadership background.",
  },
  {
    order: 90,
    title: "Madison AI Awarded Most Innovative Solution at 2025 State of GovTech PitchFest",
    category: "Company",
    description: "Recognition during an active client deployment phase.",
  },
];

const NEWS: NewsCard[] = [
  ...LEGACY_NEWS,
  ...newsArticles.map((article) => ({
    order: article.order,
    title: article.card.title,
    category: article.category,
    description: article.card.description,
    href: article.path,
    photo: resolveNewsAsset(article.card.imageAsset),
    imageAlt: article.card.imageAlt,
  })),
].sort((left, right) => left.order - right.order);

function NewsCardItem({ item, index }: { item: NewsCard; index: number }) {
  const fallbackPhoto = CARD_PHOTOS[index % CARD_PHOTOS.length];
  const photo = item.photo ?? fallbackPhoto.url;
  const content = (
    <>
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={photo}
          alt={item.imageAlt ?? ""}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4">
          <Badge variant="secondary">{item.category}</Badge>
        </div>
        <h2 className="font-sans text-lg font-semibold tracking-tight text-primary">{item.title}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary">{item.description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent">
          {item.href ? (
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

  if (!item.href) {
    return (
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-default bg-surface">
        {content}
      </article>
    );
  }

  const isInternal = item.href.startsWith("/");
  return (
    <a
      href={item.href}
      {...(isInternal ? {} : { target: "_blank", rel: "noopener" })}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-default bg-surface transition-transform hover:-translate-y-1"
    >
      {content}
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
              <NewsCardItem item={item} index={i} />
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
