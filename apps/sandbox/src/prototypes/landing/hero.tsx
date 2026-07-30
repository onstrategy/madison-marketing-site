import { ArrowRight } from "lucide-react";
import { Button } from "@madison/ui/button";
import { LogoMark } from "@madison/ui/logo";
import { PromptDemo, type PromptDemoItem } from "@madison/ui/prompt-demo";
import { Reveal } from "./parts";
import heroIllustration from "./hero-illustration.jpg";

// ============================================================================
// Madison landing — hero. Matches the "2a Platform — home" wireframe: a
// full-bleed warm illustration, a serif headline, dual CTAs, and a live
// audience-switching prompt demo (the @madison/ui PromptDemo primitive). On-token
// throughout — the wireframe's blue accent is rendered as Madison's Terracotta,
// and the warm image is faded into the `bg-app` canvas with token-based gradients.
// ============================================================================

// The prompt demo cycles through Madison's three audiences — the same framing the
// wireframe uses (staff · electeds · citizens/FOIA). Content is illustrative.
const AUDIENCES: PromptDemoItem[] = [
  {
    id: "staff",
    label: "For staff",
    prompt: "Draft a staff report on the STR permit cap.",
    reply:
      "Pulling your report template, five prior reports, and Ordinance 24-07 — a first draft is ready to edit.",
  },
  {
    id: "electeds",
    label: "For Elected",
    prompt: "Brief me on tonight's agenda.",
    reply:
      "Summarizing all twelve items, the packet, and prior votes — your briefing is ready before the meeting.",
  },
  {
    id: "foia",
    label: "For FOIA Requests",
    prompt: "Process this public records request.",
    reply:
      "Scoping the request, flagging exemptions, and drafting the response letter — ready for your review.",
  },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[70vh] items-center overflow-hidden border-b border-default bg-app"
    >
      {/* Full-bleed warm illustration (dimmed in dark mode so it reads as texture) */}
      <img
        src={heroIllustration}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-95 [object-position:82%_0%] dark:opacity-40"
      />
      {/* Warm left→right fade so the copy stays legible over the art */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-app from-20% via-app/70 via-55% to-app/30 to-90% lg:to-transparent"
      />
      {/* Heavier flat veil on small screens, where copy sits over the full image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-app/40 lg:hidden"
      />
      {/* Top fade so the transparent nav reads at the very top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-app to-transparent"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-gutter pb-22 pt-38 lg:grid-cols-2 lg:gap-8 lg:px-0 lg:pb-38 lg:pt-54">
        {/* Left — the message */}
        <div>
          <Reveal>
            <a
              href="/director-of-ai-assistant"
              className="inline-flex items-center gap-2.5 rounded-full border border-default bg-surface px-3.5 py-1.5 text-sm text-secondary shadow-xs transition-colors hover:border-active"
            >
              <span className="size-1.5 rounded-full bg-info" />
              AI in Action webinar · June 6
              <span className="font-medium text-brand-accent">Register →</span>
            </a>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-7 max-w-xl text-balance font-serif text-4xl font-medium tracking-tight text-primary md:text-5xl">
              Dedicated AI for{" "}
              <span className="text-brand-accent">local government.</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-md text-pretty text-lg text-secondary">
              One platform for everyone who runs your community — staff, elected
              officials, and citizens — built from your own record.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button size="lg">
                Book a demo <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" className="bg-surface/70">
                Why we&rsquo;re 95% accurate <ArrowRight className="size-4" />
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Right — the product, as illustration */}
        <Reveal delay={150} className="w-full max-w-lg lg:justify-self-end">
          <PromptDemo
            items={AUDIENCES}
            className="shadow-2xl"
            avatar={
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand">
                <LogoMark width={20} height={12} className="text-brand-fg" />
              </span>
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
