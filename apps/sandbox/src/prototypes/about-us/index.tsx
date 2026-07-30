import { ArrowRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";

// ============================================================================
// About Us — recreated from madisonai.com/about-us. Narrative sections are
// condensed in our own words; the leadership and county-partner rosters are
// factual (name, title, background), not creative copy.
// ============================================================================

interface Person {
  name: string;
  title: string;
  bio: string;
}

const LEADERSHIP: Person[] = [
  {
    name: "Erica Olsen",
    title: "CEO, Co-Founder",
    bio: "2x founder and author of Strategic Planning for Dummies, with 20 years of organizational strategy experience.",
  },
  {
    name: "Todd Ballowe",
    title: "Head of Engineering & AI",
    bio: "15+ years building enterprise applications for clients including Make-A-Wish, Kia, and Chobani.",
  },
  {
    name: "Tom Spengler",
    title: "Board Member / Investor",
    bio: "25 years in GovTech; co-founder and former CEO of Granicus; current CEO of SOVRA.",
  },
  {
    name: "Kristine Richter",
    title: "Head of Client Success",
    bio: "Ex-Microsoft, with 50+ successful enterprise rollouts in local government.",
  },
  {
    name: "Mark Wheeler",
    title: "Chief Public Data Officer",
    bio: "Former Philadelphia CIO and Director of Data and AI for Federal Centers of Excellence.",
  },
  {
    name: "Kim Perkins",
    title: "Principal Strategist",
    bio: "Ex-Google, with 15+ years in strategic planning and change management.",
  },
  {
    name: "Kendal Ferris",
    title: "Sales Manager",
    bio: "Background at GoDaddy and Citrix.",
  },
  {
    name: "Heyden Enochson",
    title: "Head of GTM",
    bio: "11 years in SaaS marketing; founding team member.",
  },
  {
    name: "Dana Searcy",
    title: "Principal Strategist",
    bio: "Former Washoe County Division Director of Housing & Homeless Services.",
  },
  {
    name: "Connor Ferris",
    title: "AI Solutions Advisor",
    bio: "Previously at AT&T, Citrix, and ShareFile.",
  },
  {
    name: "Reid Weber",
    title: "Senior Software Engineer",
    bio: "Solution Architect for the Nevada Secretary of State; co-founder of TrainerRoad.",
  },
  {
    name: "Liv Bailey",
    title: "Software Engineer",
    bio: "2025 Boston University Computer Science graduate.",
  },
  {
    name: "Sarah Orner",
    title: "Software Engineer",
    bio: "University of Nevada, Reno graduate specializing in data systems and AI.",
  },
];

const COUNTY_PARTNERS: Person[] = [
  {
    name: "Dave Solaro",
    title: "Assistant County Manager, Washoe County",
    bio: "Originally proposed the Madison AI concept; 15 years in public works, engineering, and community services leadership.",
  },
  {
    name: "Behzad Zamanian",
    title: "CIO, Washoe County",
    bio: "25+ years leading IT strategy, infrastructure, and security in government; advises on secure AI deployment.",
  },
];

function HeroSection() {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-brand-accent">About Us</Eyebrow>
          <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            Shaping the Future of Our Communities, Together
          </h1>
          <p className="mb-8 text-pretty text-lg text-secondary">
            Our mission: give every elected official and local government knowledge worker 5 hours
            back every week.
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

function OriginSection() {
  return (
    <section className="border-b border-default bg-app px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow className="mb-6">How it started</Eyebrow>
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
              <div className="h-full rounded-2xl border border-default bg-app p-5">
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
