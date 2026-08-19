import { ArrowRight } from "lucide-react";
import { clientStories } from "../../content/client-stories/collection";
import {
  clientStoryCardPhoto,
  clientStoryLogo,
} from "../../content/client-stories/page";
import type { ClientStoryDocument } from "../../content/client-stories/schema";
import { Nav, Footer } from "../landing/sections";
import { Reveal, SectionHeading } from "../landing/parts";

// Client Stories — the index page every "Client Stories" nav link points to.
// A dark hero features the strongest story; every other card is derived from
// the same validated collection entry as its detail page, so card copy, paths,
// and publication state cannot drift into a second hard-coded inventory.

interface ClientStorySummary {
  title: string;
  oneLiner: string;
  photo: { url: string; alt: string; width: number; height: number };
  // Absent for entries with no supplied client mark yet — CardLogoBadge
  // simply doesn't render for those, rather than a placeholder guess.
  logo?: { src: string; alt: string; width: number; height: number };
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
    photo: clientStoryCardPhoto(story),
    logo: clientStoryLogo(story),
    href: story.path,
  };
}

const featuredStory = requireFeaturedStory();
const featuredLogo = clientStoryLogo(featuredStory);
if (!featuredLogo) {
  throw new Error("The featured client story must include a card logo");
}

const FEATURED = {
  clientName: featuredStory.card.clientName,
  title: featuredStory.card.title,
  oneLiner: featuredStory.card.summary,
  logo: featuredLogo,
  photo: clientStoryCardPhoto(featuredStory),
  href: featuredStory.path,
};

const OTHER_STORIES: ClientStorySummary[] = clientStories
  .filter((story) => story.id !== featuredStory.id)
  .map(toSummary);

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
          <div className="mb-6 flex items-center gap-3">
            <LogoGlassBadge logo={data.logo} />
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

/**
 * The client mark — a white ("plate") disc for the mark itself (client
 * logos are authored on white, and a warm/photo background underneath
 * would tint or wash them out — same reasoning as the homepage's logo
 * marquee), floating inside a frosted "glass" ring: a translucent white
 * disc with `backdrop-blur` so whatever's behind it (a card's photo, or
 * the featured hero's own dimmed background photo) softens through it —
 * same glass idiom as the platform pages' hero panel
 * (../platform-page/template.tsx). The ring sits close around the
 * circle (a ~14px gap) rather than a wide halo, so it reads as a rim on
 * the mark itself, not a separate shape. Unpositioned — CardLogoBadge
 * below adds the absolute-overlay placement for the grid; the featured
 * hero renders this directly inline instead.
 */
function LogoGlassBadge({ logo }: { logo: NonNullable<ClientStorySummary["logo"]> }) {
  return (
    <span className="flex size-32 items-center justify-center rounded-full border border-plate/40 bg-plate/15 shadow-lg backdrop-blur-md">
      <span className="flex size-25 items-center justify-center rounded-full bg-plate p-5 shadow-md">
        <img
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          loading="lazy"
          className="size-full object-contain"
        />
      </span>
    </span>
  );
}

/**
 * LogoGlassBadge, centered over a card's photo. Renders nothing when a
 * story has no supplied mark yet, rather than a generic stand-in — a
 * missing city seal isn't the same kind of "no logo" as an integration
 * tile's.
 */
function CardLogoBadge({ logo }: { logo: NonNullable<ClientStorySummary["logo"]> }) {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <LogoGlassBadge logo={logo} />
    </span>
  );
}

function StoryCard({ story }: { story: ClientStorySummary }) {
  const isInternal = story.href.startsWith("/");
  return (
    <a
      href={story.href}
      {...(isInternal ? {} : { target: "_blank", rel: "noopener" })}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-default bg-surface transition-transform hover:-translate-y-1"
    >
      <span className="relative block aspect-[16/10] overflow-hidden border-b border-default bg-plate">
        <img
          src={story.photo.url}
          alt={story.photo.alt}
          width={story.photo.width}
          height={story.photo.height}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {story.logo ? <CardLogoBadge logo={story.logo} /> : null}
      </span>
      <span className="flex flex-1 flex-col p-6">
        <h3 className="font-sans text-xl font-semibold tracking-tight text-primary">
          {story.title}
        </h3>
        <span className="mt-2 flex-1 text-secondary">{story.oneLiner}</span>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent">
          Read the story{" "}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </a>
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
          {data.map((story) => (
            <StoryCard key={story.title} story={story} />
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
