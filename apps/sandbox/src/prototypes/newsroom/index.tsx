import { ArrowRight, type LucideIcon, Sparkles, Users, Building2 } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Badge } from "@madison/ui/badge";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";

// ============================================================================
// Newsroom — recreated from madisonai.com/updates. 2-column card grid per
// spec (the source itself lays these out as a single stacked column, but the
// request called for 2 columns, so that's what's built here). One card links
// to a real article page (Proof AI Works in the Public Sector); the rest link
// to "#" since they don't have full pages yet.
// ============================================================================

type Category = "Insights" | "Team" | "Company";

interface NewsCard {
  title: string;
  category: Category;
  description: string;
  href: string;
}

const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Insights: Sparkles,
  Team: Users,
  Company: Building2,
};

const NEWS: NewsCard[] = [
  {
    title: "1,204 Hours Reclaimed: Proof AI Works in the Public Sector",
    category: "Insights",
    description: "Three lessons that separate AI that delivers from AI that disappoints.",
    href: "/proof-ai-works",
  },
  {
    title: "Peter Pirnejad Joins Madison AI as Strategic Advisor",
    category: "Team",
    description: "Bringing municipal leadership experience to the organization.",
    href: "#",
  },
  {
    title: "The Public Records Crisis Is Real",
    category: "Insights",
    description: "Charging citizens is the wrong way to solve it.",
    href: "#",
  },
  {
    title: "Madison AI Welcomes Senior Software Engineer Reid Weber",
    category: "Team",
    description: "Leading data systems, acquisition, and AI initiatives.",
    href: "#",
  },
  {
    title: "Tom Spangler Joins Madison AI as Board Member and Advisor",
    category: "Team",
    description: "Advancing company growth and impact efforts.",
    href: "#",
  },
  {
    title: "Named GovTech's Most Innovative Solution, Madison AI Secures Funding",
    category: "Company",
    description: "Scaling to transform local government operations.",
    href: "#",
  },
  {
    title: "Mark Wheeler Joins Madison AI as Chief Public Data Officer",
    category: "Team",
    description: "Adds trusted government AI expertise.",
    href: "#",
  },
  {
    title: "Dana Searcy Joins Madison AI as a Principal Strategist",
    category: "Team",
    description: "Brings public-sector leadership background.",
    href: "#",
  },
  {
    title: "Madison AI Awarded Most Innovative Solution at 2025 State of GovTech PitchFest",
    category: "Company",
    description: "Recognition during an active client deployment phase.",
    href: "#",
  },
];

function NewsCardItem({ item }: { item: NewsCard }) {
  const isInternal = item.href.startsWith("/");
  const Icon = CATEGORY_ICON[item.category];
  return (
    <a
      href={item.href}
      {...(isInternal ? {} : { target: "_blank", rel: "noopener" })}
      className="group flex h-full flex-col rounded-2xl border border-default bg-surface p-6 transition-transform hover:-translate-y-1"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-full bg-brand-subtle text-brand-accent">
          <Icon className="size-4" />
        </span>
        <Badge variant="secondary">{item.category}</Badge>
      </div>
      <h6 className="font-sans text-lg font-semibold tracking-tight text-primary">{item.title}</h6>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary">{item.description}</p>
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
            <a href="/book-a-demo">
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
