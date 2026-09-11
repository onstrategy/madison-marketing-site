import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@madison/ui/tabs";
import { Nav, Footer } from "../landing/sections";
import { Reveal, Eyebrow } from "../landing/parts";
import {
  INTEGRATION_CATEGORIES,
  logosForCategory,
  type IntegrationCategory,
} from "./logos";

// ============================================================================
// Integrations — every system Madison connects to, filterable by platform
// module. Same hero + overlapping-tabs shape as ../resources/index.tsx, but
// the tabs drive one filtered logo grid via lifted state instead of swapping
// separate TabsContent panels — there's one inventory of tools, not one list
// per tab, so Tabs.Root here only powers the switcher, not a panel per value.
// ============================================================================

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
          it's currently floating over.

          Five categories, two of them long ("Community Development",
          "Procurement & Contracts"), don't fit one row under ~500px. This
          used to wrap, which broke two ways at once on a phone: a
          `rounded-full` pill wrapped to 3 rows renders as a tall oval, not a
          rounded rectangle (the radius is 50% of the SHORTER side, and
          wrapping makes that side the height); and the section's fixed pb-20
          had no way to reserve enough clearance for a pill that could be one
          row or three depending on viewport, so the tall (wrapped) version
          climbed up into the headline above it. Scrolling horizontally
          instead of wrapping keeps the pill exactly one row tall always, so
          neither problem has a viewport where it can occur — no breakpoint
          to pick, and pb-20 needed no change. `max-w-full` is load-bearing:
          without it a flex child's default `min-width: auto` lets it grow
          past its container instead of respecting it, and overflow-x-auto
          never engages. */}
      <div className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center px-gutter lg:px-0">
        {/* `min-w-0` overrides the flex item's default `min-width: auto`,
            which otherwise refuses to shrink this wrapper below its child's
            own content width (728px, wider than the 375px phone it needs to
            fit in) no matter what max-width the child sets — TabsList's own
            max-w-full has nothing to measure against until its actual
            containing block (this div) is allowed to be narrower than its
            content. */}
        <Reveal delay={100} className="min-w-0">
          <TabsList className="light h-auto max-w-full flex-nowrap gap-1 overflow-x-auto rounded-full border border-default bg-hover p-1.5 shadow-xl">
            {INTEGRATION_CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="shrink-0 rounded-full px-5 py-2"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Reveal>
      </div>
    </section>
  );
}

function ToolGridSection({ filter }: { filter: IntegrationCategory }) {
  const filtered = logosForCategory(filter);
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
          {filtered.map((logo, i) => (
            <div
              key={logo.name}
              style={{ animationDelay: `${i * 30}ms`, animationFillMode: "backwards" }}
              className="animate-in fade-in-0 zoom-in-95 duration-300"
            >
              {/* Each source SVG is a pre-composed 192×108 card — full-bleed
                  white background baked in, mark inset with its own margin.
                  The border/rounding live on THIS wrapper rather than the
                  img itself, with real padding between them: without it the
                  border sits flush against the SVG's own edge, so every logo
                  reads at whatever size its own internal margin happens to
                  leave, not a size this page controls. */}
              <div className="aspect-video w-full rounded-lg border border-default bg-plate p-5">
                <img
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  loading="lazy"
                  className="size-full object-contain"
                />
              </div>
            </div>
          ))}
          {filter === "citywide-procurement" ? (
            <div
              key="other-erps"
              style={{
                animationDelay: `${filtered.length * 30}ms`,
                animationFillMode: "backwards",
              }}
              className="animate-in fade-in-0 zoom-in-95 duration-300"
            >
              {/* Same tile footprint as a logo card, but text instead of a
                  mark — closes out the row for tools we don't have a plate
                  for yet. `light` forces the text token to resolve against
                  the white bg-plate regardless of the page's own theme,
                  same reason ../platform-page/template.tsx's connector tiles
                  force it. */}
              <div className="light flex aspect-video w-full items-center justify-center rounded-lg border border-default bg-plate p-5 text-center">
                <span className="text-sm font-medium text-secondary">+ Other ERPs</span>
              </div>
            </div>
          ) : null}
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
  const [filter, setFilter] = useState<IntegrationCategory>(INTEGRATION_CATEGORIES[0].value);
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        {/* Tabs.Root only wraps the switcher here — there's no TabsContent.
            One grid, filtered in place by lifted state, rather than a
            separate panel per tab. */}
        {/* Radix's onValueChange is typed as (value: string) => void — it
            doesn't know the tab values are drawn from IntegrationCategory —
            so setFilter can't be passed directly. Every value that reaches
            it is one of TabsTrigger's own values below, all IntegrationCategory,
            so the cast is safe. */}
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as IntegrationCategory)}
        >
          <HeroSection />
        </Tabs>
        <ToolGridSection filter={filter} />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
