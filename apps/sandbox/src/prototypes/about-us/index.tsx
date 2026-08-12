import { ArrowRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";
import { PHOTOS } from "../landing/photos";
import erica from "./team/erica.webp";
import todd from "./team/todd.webp";
import tom from "./team/tom.webp";
import kristine from "./team/kristine.webp";
import mark from "./team/mark.jpeg";
import kim from "./team/kim.webp";
import kendal from "./team/kendal.webp";
import heyden from "./team/heyden.webp";
import dana from "./team/dana.jpg";
import connor from "./team/connor.png";
import reid from "./team/reid.png";
import liv from "./team/liv.png";
import sarah from "./team/sarah.png";
import dave from "./team/dave.avif";
import behzad from "./team/behzad.webp";

// ============================================================================
// About Us — recreated from madisonai.com/about-us. Narrative sections are
// condensed in our own words; the leadership and county-partner rosters are
// factual (name, title, background, and photo), not creative copy — headshots
// are the real team/partner photos from the live site (used with approval).
// ============================================================================

interface Person {
  name: string;
  title: string;
  bio: string;
  photo: string;
}

const LEADERSHIP: Person[] = [
  {
    name: "Erica Olsen",
    title: "CEO, Co-Founder",
    bio: "2x founder and author of Strategic Planning for Dummies, with 20 years of organizational strategy experience.",
    photo: erica,
  },
  {
    name: "Todd Ballowe",
    title: "Head of Engineering & AI",
    bio: "15+ years building enterprise applications for clients including Make-A-Wish, Kia, and Chobani.",
    photo: todd,
  },
  {
    name: "Tom Spengler",
    title: "Board Member / Investor",
    bio: "25 years in GovTech; co-founder and former CEO of Granicus; current CEO of SOVRA.",
    photo: tom,
  },
  {
    name: "Kristine Richter",
    title: "Head of Client Success",
    bio: "Ex-Microsoft, with 50+ successful enterprise rollouts in local government.",
    photo: kristine,
  },
  {
    name: "Mark Wheeler",
    title: "Chief Public Data Officer",
    bio: "Former Philadelphia CIO and Director of Data and AI for Federal Centers of Excellence.",
    photo: mark,
  },
  {
    name: "Kim Perkins",
    title: "Principal Strategist",
    bio: "Ex-Google, with 15+ years in strategic planning and change management.",
    photo: kim,
  },
  {
    name: "Kendal Ferris",
    title: "Sales Manager",
    bio: "Background at GoDaddy and Citrix.",
    photo: kendal,
  },
  {
    name: "Heyden Enochson",
    title: "Head of GTM",
    bio: "11 years in SaaS marketing; founding team member.",
    photo: heyden,
  },
  {
    name: "Dana Searcy",
    title: "Principal Strategist",
    bio: "Former Washoe County Division Director of Housing & Homeless Services.",
    photo: dana,
  },
  {
    name: "Connor Ferris",
    title: "AI Solutions Advisor",
    bio: "Previously at AT&T, Citrix, and ShareFile.",
    photo: connor,
  },
  {
    name: "Reid Weber",
    title: "Senior Software Engineer",
    bio: "Solution Architect for the Nevada Secretary of State; co-founder of TrainerRoad.",
    photo: reid,
  },
  {
    name: "Liv Bailey",
    title: "Software Engineer",
    bio: "2025 Boston University Computer Science graduate.",
    photo: liv,
  },
  {
    name: "Sarah Orner",
    title: "Software Engineer",
    bio: "University of Nevada, Reno graduate specializing in data systems and AI.",
    photo: sarah,
  },
];

const COUNTY_PARTNERS: Person[] = [
  {
    name: "Dave Solaro",
    title: "Assistant County Manager, Washoe County",
    bio: "Originally proposed the Madison AI concept; 15 years in public works, engineering, and community services leadership.",
    photo: dave,
  },
  {
    name: "Behzad Zamanian",
    title: "CIO, Washoe County",
    bio: "25+ years leading IT strategy, infrastructure, and security in government; advises on secure AI deployment.",
    photo: behzad,
  },
];

function HeroSection() {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Eyebrow className="mb-6 text-brand-accent">About Us</Eyebrow>
          <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary lg:text-5xl">
            Shaping the Future of Our Communities, Together
          </h1>
          <p className="mb-8 max-w-lg text-pretty text-lg text-secondary">
            Our mission: give every elected official and local government knowledge worker 5 hours
            back every week.
          </p>
          <Button size="lg" asChild>
            <a href="/demo">
              Book a demo <ArrowRight className="size-4" />
            </a>
          </Button>
        </Reveal>
        {/* The negative bottom margin lets the photo bleed past the section's
            own border into OriginSection below — OriginSection is a later,
            opaque sibling, so it naturally paints over the overhang and the
            photo reads as tucked behind it, anchored to the page, rather
            than a tile floating inside the hero. This wrapper is deliberately
            *outside* Reveal: a `transition-all` ancestor gets promoted to its
            own compositing layer in some browsers, which can make an
            overflowing, rounded, `overflow-hidden` child paint above a later
            sibling instead of behind it — Reveal goes on the image only, so
            the negative-margin box itself stays plain and stacks in normal
            DOM order. */}
        <div className="relative -mb-16 aspect-[4/5] overflow-hidden rounded-3xl border-2 border-[hsl(var(--text-primary)/0.15)] shadow-2xl lg:-mb-40">
          <Reveal delay={100} className="size-full">
            <img
              src={PHOTOS.groupDiscussion.url}
              alt={PHOTOS.groupDiscussion.alt}
              loading="lazy"
              className="size-full object-cover"
            />
            {/* Fades the photo into Hero's own `bg-app` before it reaches the
                section boundary — same idiom as the client-story photo tiles
                below — so it dissolves into the page instead of ending in a
                hard edge, which is what actually reads as "not floating." */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-app" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function OriginSection() {
  return (
    <section className="border-b border-default bg-app px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow className="mb-6 text-secondary">How it started</Eyebrow>
          <h2 className="mb-6 text-balance text-3xl font-medium tracking-tight text-primary">
            The first AI platform co-founded by a local government.
          </h2>
          <div className="space-y-4">
            <p className="text-pretty leading-relaxed text-secondary">
              Madison AI didn't start with a product looking for a customer — it started with
              Washoe County, Nevada proposing the idea itself. That inverted the usual GovTech
              relationship: instead of buying software built elsewhere, Washoe County co-founded
              Madison as an equity partner, with a real seat at the table in how the product gets
              built.
            </p>
            <p className="text-pretty leading-relaxed text-secondary">
              That's the model going forward too — government-led innovation, not something handed
              down from outside the industry it's meant to serve.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LeadershipSection() {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="mb-12 max-w-2xl text-balance text-3xl font-medium tracking-tight text-primary">
            Meet the team shaping the future of government work.
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEADERSHIP.map((person, i) => (
            <Reveal key={person.name} delay={i * 30}>
              <div className="h-full rounded-2xl border border-default bg-panel p-5">
                <img
                  src={person.photo}
                  alt={person.name}
                  loading="lazy"
                  className="mb-4 size-16 rounded-full border border-default object-cover"
                />
                <div className="font-sans text-base font-semibold text-primary">
                  {person.name}
                </div>
                <div className="mt-0.5 text-sm font-medium text-brand-accent">{person.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{person.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountyPartnersSection() {
  return (
    <section className="border-b border-default bg-app px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow className="mb-6">Our county partners</Eyebrow>
          <h2 className="mb-10 text-balance text-3xl font-medium tracking-tight text-primary">
            The county partners behind the big idea.
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {COUNTY_PARTNERS.map((person, i) => (
            <Reveal key={person.name} delay={i * 60}>
              <div className="h-full rounded-2xl border border-default bg-surface p-6">
                <img
                  src={person.photo}
                  alt={person.name}
                  loading="lazy"
                  className="mb-4 size-16 rounded-full border border-default object-cover"
                />
                <div className="font-sans text-lg font-semibold text-primary">{person.name}</div>
                <div className="mt-0.5 text-sm font-medium text-brand-accent">{person.title}</div>
                <p className="mt-3 text-sm leading-relaxed text-secondary">{person.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="dark bg-app px-gutter py-30 text-center">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="mb-4 text-balance text-4xl font-medium tracking-tight text-primary">
            Book a demo today.
          </h2>
          <p className="mb-8 text-pretty text-lg text-secondary">
            Fill in the form and our team will get back to you within one business day.
          </p>
          <Button size="lg" asChild>
            <a href="/demo">
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
export default function AboutUsPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroSection />
        <OriginSection />
        <LeadershipSection />
        <CountyPartnersSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
