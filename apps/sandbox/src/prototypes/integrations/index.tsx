import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@madison/ui/tabs";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow, LogoMark } from "../landing/parts";

// ============================================================================
// Integrations — every system Madison connects to, filterable by platform
// module. Same hero + overlapping-tabs shape as ../resources/index.tsx, but
// the tabs drive one filtered logo grid via lifted state instead of swapping
// separate TabsContent panels — there's one inventory of tools, not one list
// per tab, so Tabs.Root here only powers the switcher, not a panel per value.
// ============================================================================

type Category = "citywide" | "community-development" | "procurement-contracts" | "public-records";

const CATEGORIES: { value: "all" | Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "citywide", label: "Citywide" },
  { value: "community-development", label: "Community Development" },
  { value: "procurement-contracts", label: "Procurement & Contracts" },
  { value: "public-records", label: "Public Records" },
];

interface Tool {
  name: string;
  categories: Category[];
}

// The real systems each platform module talks to — pulled from the
// "connectors" data already on ../citywide-ai, ../community-development-ai,
// ../procurement-contracts-ai, and ../public-records-requests-ai. A tool
// that shows up on more than one of those pages carries every category it
// appeared under, so it surfaces under each of those filters here too.
const TOOLS: Tool[] = [
  {
    name: "Outlook",
    categories: ["citywide", "community-development", "procurement-contracts", "public-records"],
  },
  {
    name: "Exchange",
    categories: ["citywide", "community-development", "procurement-contracts", "public-records"],
  },
  {
    name: "Teams",
    categories: ["citywide", "community-development", "procurement-contracts", "public-records"],
  },
  {
    name: "SharePoint",
    categories: ["citywide", "community-development", "procurement-contracts", "public-records"],
  },
  {
    name: "Laserfiche",
    categories: ["citywide", "community-development", "procurement-contracts", "public-records"],
  },
  {
    name: "Granicus",
    categories: ["citywide", "community-development", "procurement-contracts", "public-records"],
  },
  {
    name: "Municode",
    categories: ["citywide", "community-development", "procurement-contracts", "public-records"],
  },
  {
    name: "OnBase",
    categories: ["citywide", "community-development", "procurement-contracts", "public-records"],
  },
  { name: "Workday", categories: ["citywide", "procurement-contracts"] },
  { name: "Tyler Technologies", categories: ["citywide"] },
  { name: "CivicPlus", categories: ["citywide", "community-development", "public-records"] },
  { name: "ClearGov", categories: ["citywide", "community-development"] },
  { name: "YouTube", categories: ["citywide", "community-development"] },
  { name: "eScribe", categories: ["citywide", "community-development"] },
  { name: "Esri / ArcGIS", categories: ["community-development"] },
  { name: "Accela", categories: ["community-development"] },
  { name: "Bonfire", categories: ["procurement-contracts"] },
  { name: "OpenGov Procurement", categories: ["procurement-contracts"] },
  { name: "DocuSign", categories: ["procurement-contracts"] },
  { name: "NextRequest", categories: ["public-records"] },
  { name: "GovQA", categories: ["public-records"] },
];

function HeroSection() {
  return (
    // `relative` gives the floating tab switcher below a positioning
    // context — same straddle-the-boundary technique as
    // ../resources/index.tsx's HeroSection.
    <section className="dark relative border-b border-default bg-app px-gutter pb-20 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-brand-accent">Integrations</Eyebrow>
          <h1 className="text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            Every system your government already runs.
          </h1>
        </Reveal>
      </div>
      {/* Tab switcher — pinned to the hero's bottom edge, shifted down by
          half its own height so it straddles the hero/grid boundary and
          reads as one element overlapping both. `light` is forced so it
          stays a legible light pill regardless of which section's theme
          it's currently floating over. */}
      <div className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center px-gutter lg:px-0">
        <Reveal delay={100}>
          <TabsList className="light h-auto flex-wrap justify-center gap-1 rounded-full border border-default bg-hover p-1.5 shadow-xl">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} className="rounded-full px-5 py-2">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Reveal>
      </div>
    </section>
  );
}

function ToolGridSection({ filter }: { filter: string }) {
  const filtered = TOOLS.filter(
    (tool) => filter === "all" || tool.categories.includes(filter as Category),
  );
  return (
    // pt-24/pb-16, same tightened rhythm as ../resources/index.tsx's
    // TabsSection: half the switcher's height already lands in this
    // section's top padding via the translate above.
    <section className="bg-app px-gutter pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
        {/* Keyed by filter so the whole grid remounts on every tab change —
            each tile then plays its own staggered entrance (tw-animate-css's
            animate-in, the same enter primitive every Radix popover/dialog
            in the kit already uses) instead of the grid just snapping to
            the new set. Gap is a single value (not gap-x/gap-y) so row and
            column spacing stay identical. */}
        <div
          key={filter}
          className="grid grid-cols-2 items-stretch justify-items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {filtered.map((tool, i) => (
            <div
              key={tool.name}
              style={{ animationDelay: `${i * 30}ms`, animationFillMode: "backwards" }}
              className="animate-in fade-in-0 zoom-in-95 duration-300"
            >
              {/* px-8 overrides just LogoMark's horizontal padding (base is
                  p-3 = 12px all round) — 32px, well past the requested
                  left-right breathing room, while vertical padding stays
                  the shared default. */}
              <LogoMark name={tool.name} className="aspect-video h-auto w-full px-8" />
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-muted">
          Don&rsquo;t see your system? We ship new connectors every month — ask us about yours.
        </p>
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
export default function IntegrationsPrototype() {
  const [filter, setFilter] = useState<string>("all");
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        {/* Tabs.Root only wraps the switcher here — there's no TabsContent.
            One grid, filtered in place by lifted state, rather than a
            separate panel per tab. */}
        <Tabs value={filter} onValueChange={setFilter}>
          <HeroSection />
        </Tabs>
        <ToolGridSection filter={filter} />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
