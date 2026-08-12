import { ArrowRight } from "lucide-react";
import { clientStories } from "../../content/client-stories/collection";
import { clientStoryLogo } from "../../content/client-stories/page";
import type { ClientStoryDocument } from "../../content/client-stories/schema";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow, SectionHeading } from "../landing/parts";
import washoeCountyLogo from "../landing/logos/washoe-county.png";
import renoLogo from "../landing/logos/reno.png";
import carsonCityLogo from "../landing/logos/carson-city.png";
import aspenLogo from "../landing/logos/aspen.png";
import pasadenaLogo from "../landing/logos/pasadena.png";

// Client Stories — the index page every "Client Stories" nav link points to.
// A dark hero features the strongest story (currently the only one with a
// full detail page — City of Corona); the rest are on-token summary cards
// below, each with the real client logo already used in the homepage's logo
// marquee (see ../landing/logos.ts) rather than a fabricated mark.

interface ClientStorySummary {
  title: string;
  oneLiner: string;
  logo: { src: string; alt: string; width: number; height: number };
  href: string;
}

function requireFeaturedStory(): ClientStoryDocument {
  const featured = clientStories.find((story) => story.featured);
  if (!featured) {
    throw new Error("Client story collection must contain a featured entry");
  }
  return featured;
}

function toSummary(story: ClientStoryDocument): ClientStorySummary {
  return {
    title: story.card.title,
    oneLiner: story.card.summary,
    logo: clientStoryLogo(story),
    href: story.path,
  };
}

const featuredStory = requireFeaturedStory();

const FEATURED = {
  kicker: featuredStory.card.kicker,
  clientName: featuredStory.card.clientName,
  title: featuredStory.card.title,
  oneLiner: featuredStory.card.summary,
  logo: clientStoryLogo(featuredStory),
  photo: featuredStory.card.photo,
  href: featuredStory.path,
};

const LEGACY_EXTERNAL_STORIES: ClientStorySummary[] = [
  {
    title: "Washoe County, NV",
    oneLiner: "Saving $41K+ in staff time every month.",
    logo: { src: washoeCountyLogo, alt: "Washoe County, Nevada", width: 215, height: 252 },
    href: "https://www.madisonai.com/client-stories/washoe-county",
  },
  {
    title: "City of Reno",
    oneLiner: "Cut time spent on staff reports by 75%.",
    logo: { src: renoLogo, alt: "City of Reno, Nevada", width: 304, height: 252 },
    href: "https://www.madisonai.com/client-stories",
  },
  {
    title: "Carson City, NV",
    oneLiner: "“Exactly what I need, faster.”",
    logo: { src: carsonCityLogo, alt: "Carson City, Nevada", width: 541, height: 252 },
    href: "https://www.madisonai.com/client-stories/carson-city-client-story",
  },
  {
    title: "Aspen, CO",
    oneLiner: "Reclaiming 140 staff hours every month.",
    logo: { src: aspenLogo, alt: "City of Aspen, Colorado", width: 237, height: 252 },
    href: "https://www.madisonai.com/client-stories",
  },
  {
    title: "Pasadena, CA",
    oneLiner: "One source of truth for the City Attorney's office.",
    logo: { src: pasadenaLogo, alt: "City of Pasadena, California", width: 273, height: 252 },
    href: "https://www.madisonai.com/client-stories",
  },
];

const OTHER_STORIES: ClientStorySummary[] = [
  ...clientStories
    .filter((story) => story.id !== featuredStory.id)
    .map(toSummary),
  ...LEGACY_EXTERNAL_STORIES,
];

function FeaturedHero({ data }: { data: typeof FEATURED }) {
  return (
    <section className="dark relative overflow-hidden border-b border-default bg-app">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={data.photo.url}
          alt={data.photo.alt}
          width={data.photo.width}
          height={data.photo.height}
          loading="lazy"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-app via-app/70 to-app/30" />
      </div>
      <div className="relative mx-auto max-w-6xl px-gutter pt-28 pb-24 lg:px-0 lg:pt-40">
        <Reveal>
          <Eyebrow className="mb-6 text-brand-accent">{data.kicker}</Eyebrow>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-20 items-center justify-center rounded-full border border-default bg-plate p-4">
              <img
                src={data.logo.src}
                alt={data.logo.alt}
                width={data.logo.width}
                height={data.logo.height}
                className="size-full object-contain"
              />
            </span>
            <span className="font-sans text-sm font-semibold text-secondary">
              {data.clientName}
            </span>
          </div>
          <h1 className="mb-8 max-w-3xl text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            {data.title}
          </h1>
          <a
            href={data.href}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6.5 py-3.75 text-base font-medium text-brand-fg transition-colors hover:bg-brand-hover"
          >
            Read the story <ArrowRight className="size-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function StoryCard({ story, delay }: { story: ClientStorySummary; delay: number }) {
  const isInternal = story.href.startsWith("/");
  return (
    <Reveal delay={delay}>
      <a
        href={story.href}
        {...(isInternal ? {} : { target: "_blank", rel: "noopener" })}
        className="group flex h-full flex-col rounded-2xl border border-default bg-surface p-6 transition-transform hover:-translate-y-1"
      >
        <span className="mb-5 flex size-20 items-center justify-center rounded-full border border-default bg-plate p-4">
          <img
            src={story.logo.src}
            alt={story.logo.alt}
            width={story.logo.width}
            height={story.logo.height}
            className="size-full object-contain"
          />
        </span>
        <h3 className="font-sans text-xl font-semibold tracking-tight text-primary">{story.title}</h3>
        <p className="mt-2 flex-1 text-secondary">{story.oneLiner}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent">
          Read the story{" "}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </a>
    </Reveal>
  );
}

function OtherStories({ data }: { data: ClientStorySummary[] }) {
  return (
    <section className="bg-app px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="More client stories"
            title="Every customer is a community we serve."
            className="mb-12 max-w-2xl"
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((story, i) => (
            <StoryCard key={story.title} story={story} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function ClientStoriesPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <FeaturedHero data={FEATURED} />
        <OtherStories data={OTHER_STORIES} />
      </main>
      <Footer />
    </div>
  );
}
