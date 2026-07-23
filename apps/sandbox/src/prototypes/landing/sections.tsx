import { useEffect, useState, type ReactNode } from "react";
import {
  Wind,
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  MessageSquare,
  ShieldCheck,
  GitPullRequest,
  PenTool,
  Megaphone,
  Code2,
  Check,
  Mail,
} from "lucide-react";
import { cn } from "@madison/ui/utils";
import { Button } from "@madison/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@madison/ui/card";
import { Badge } from "@madison/ui/badge";
import { Input } from "@madison/ui/input";
import { TestimonialCard } from "@madison/ui/testimonial-card";
import { Separator } from "@madison/ui/separator";
import { Switch } from "@madison/ui/switch";
import { ThemeToggle } from "@madison/ui/theme";
import {
  Reveal,
  Eyebrow,
  SectionHeading,
  DotGrid,
  BrowserFrame,
  CheckChip,
} from "./parts";

// ============================================================================
// Madison landing — sections. Neutral-first, product-as-illustration,
// every accent a token. Reads as a crafted dev/design tool, not SaaS slop.
// ============================================================================

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#system", label: "The system" },
  { href: "#pricing", label: "Pricing" },
];

function Wordmark() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-md bg-brand">
        <Wind className="size-4 text-brand-fg" />
      </span>
      <span className="text-sm font-semibold tracking-tight text-primary">
        Madison
      </span>
    </a>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-sticky transition-colors",
        scrolled
          ? "border-b border-default bg-app/80 backdrop-blur"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-gutter py-4">
        <Wordmark />
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-secondary transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button size="sm">Book a demo</Button>
        </div>
      </nav>
    </header>
  );
}

const HERO_PLANS = [
  { name: "Starter", price: "$0", featured: false },
  { name: "Team", price: "$29", featured: true },
  { name: "Scale", price: "$99", featured: false },
];

function HeroDevice() {
  return (
    <BrowserFrame title="madison — sandbox">
      <div className="space-y-4 p-card">
        {/* The plain-language request */}
        <div className="flex items-center gap-3 rounded-lg border border-default bg-app px-3 py-2.5">
          <span className="font-mono text-sm text-brand">❯</span>
          <span className="font-mono text-sm text-secondary">
            build me a pricing page
          </span>
          <span className="ml-auto inline-block h-4 w-px animate-pulse bg-brand" />
        </div>

        <div className="flex items-center justify-between">
          <Eyebrow>On-token result</Eyebrow>
          <span className="font-mono text-xs text-muted">pricing.tsx</span>
        </div>

        {/* The result, rendered on-token */}
        <div className="grid grid-cols-3 gap-2">
          {HERO_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-lg border p-3",
                plan.featured
                  ? "border-brand bg-brand-subtle"
                  : "border-default bg-app",
              )}
            >
              <div className="text-xs text-secondary">{plan.name}</div>
              <div className="mt-1 text-lg font-semibold text-primary">
                {plan.price}
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-hover" />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <CheckChip>on-token</CheckChip>
          <CheckChip>bun run check</CheckChip>
          <Badge variant="secondary">draft PR #128</Badge>
        </div>
      </div>
    </BrowserFrame>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-default">
      <DotGrid className="opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-gutter py-section lg:grid-cols-2 lg:py-28">
        <div>
          <Reveal>
            <Eyebrow>
              <Sparkles className="size-3.5" /> Design systems · as code
            </Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
              Your design system, in code. Shipped by your whole team.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 max-w-xl text-pretty text-lg text-secondary">
              Madison makes code the single source of truth — so design and
              implementation never drift apart. Designers, PMs, and marketing
              don't write code; they describe what they want, and Claude Code
              ships it as real, on-system components in the real repo —
              governance-as-code keeping every change safe.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg">Book a demo</Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works">
                  See how it works <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 font-mono text-xs text-muted">
              No Figma handoff · No raw hex · Real PRs your engineers merge
            </p>
          </Reveal>
        </div>
        <Reveal delay={120} className="lg:pl-6">
          <HeroDevice />
        </Reveal>
      </div>
    </section>
  );
}

const STACK = [
  "React",
  "Tailwind CSS",
  "Storybook",
  "Claude Code",
  "W3C Design Tokens",
];

export function LogoStrip() {
  return (
    <div className="border-b border-default bg-panel">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-gutter py-6">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          Built on
        </span>
        {STACK.map((item) => (
          <span key={item} className="text-sm font-medium text-secondary">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function DiagramNode({
  children,
  featured,
}: {
  children: ReactNode;
  featured?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-md border px-3 py-1.5 text-sm font-medium",
        featured
          ? "border-brand bg-brand-subtle text-primary"
          : "border-default bg-app text-secondary",
      )}
    >
      {children}
    </span>
  );
}

export function Problem() {
  return (
    <section className="border-b border-default">
      <div className="mx-auto max-w-6xl px-gutter py-section">
        <Reveal>
          <SectionHeading
            eyebrow="The problem"
            title="Your design system lives in two places. They drift."
            blurb="Most teams maintain a system in Figma and rebuild it in code — two sources of truth that fall out of sync the moment someone ships."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-xl border border-default bg-surface p-card">
              <Eyebrow className="text-error">Today</Eyebrow>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <DiagramNode>Figma</DiagramNode>
                <ArrowLeftRight className="size-5 shrink-0 text-muted" />
                <DiagramNode>Code</DiagramNode>
              </div>
              <p className="mt-4 text-sm text-secondary">
                Two sources of truth. Every change is made — and reviewed —
                twice. Drift is inevitable.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="h-full rounded-xl border border-default bg-surface p-card">
              <Eyebrow className="text-success">With Madison</Eyebrow>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <DiagramNode featured>Code</DiagramNode>
                <ArrowRight className="size-5 shrink-0 text-muted" />
                <DiagramNode>Tokens</DiagramNode>
                <ArrowRight className="size-5 shrink-0 text-muted" />
                <DiagramNode>Figma</DiagramNode>
              </div>
              <p className="mt-4 text-sm text-secondary">
                Code is the source. Tokens generate the rest, and Figma reads
                from it — not the other way around.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-8 flex items-start gap-5 rounded-xl border border-default bg-panel p-card">
            <span className="text-4xl font-semibold tracking-tight text-primary">
              14%
            </span>
            <p className="text-pretty text-secondary">
              of Shopify's admin UI had drifted off its own Polaris design system
              within a year. The real failure mode isn't tooling — it's
              governance.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const STEPS = [
  {
    n: "01",
    icon: MessageSquare,
    title: "Ask in plain language",
    body: "“Build a pricing page.” Contributors speak in outcomes — no tools, commands, file paths, or slugs to learn.",
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "The agent stays on-system",
    body: "Claude Code loads the design-system skill, pulls real components from Storybook, and emits on-token code. Reach for a raw hex and the skill-gate blocks it.",
  },
  {
    n: "03",
    icon: GitPullRequest,
    title: "Governance gates the merge",
    body: "bun run check runs typecheck, tests, and the on-token lint. What lands is a real pull request your engineers review and merge.",
  },
];

function GateTerminal() {
  return (
    <BrowserFrame title="claude code — governance">
      <div className="space-y-2 bg-app p-card font-mono text-sm leading-relaxed">
        <div className="text-muted">
          <span className="text-brand">❯</span> add a “Choose plan” button
        </div>
        <div className="text-secondary">
          Editing <span className="text-primary">pricing.tsx</span> …
        </div>
        <div className="text-error">
          ✗ SKILL GATE BLOCKED — load the design-system skill
        </div>
        <div className="text-secondary">
          ↳ skill loaded · using <span className="text-primary">bg-brand</span>,
          not <span className="text-muted line-through">#7c3aed</span>
        </div>
        <div className="pt-1 text-secondary">
          <span className="text-brand">❯</span> bun run check
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <CheckChip>typecheck</CheckChip>
          <CheckChip>test</CheckChip>
          <CheckChip>lint</CheckChip>
        </div>
        <div className="pt-1 text-success">✓ on-system · opened PR #128</div>
      </div>
    </BrowserFrame>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-b border-default"
    >
      <div className="mx-auto max-w-6xl px-gutter py-section">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="From a plain-language request to a clean, on-system PR."
            blurb="The same loop every time — and the guardrails are code, not a checklist someone has to remember."
          />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 80}>
                <div className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-default bg-surface">
                    <step.icon className="size-5 text-brand" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted">
                        {step.n}
                      </span>
                      <h3 className="text-lg font-semibold text-primary">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-pretty text-secondary">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <GateTerminal />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const NEUTRAL_SWATCHES: { cls: string; label: string }[] = [
  { cls: "bg-app", label: "app" },
  { cls: "bg-panel", label: "panel" },
  { cls: "bg-surface", label: "surface" },
  { cls: "bg-hover", label: "hover" },
];

const ACCENT_SWATCHES = ["bg-brand", "bg-success", "bg-warning", "bg-error"];

function TokenBoard() {
  return (
    <div className="rounded-xl border border-default bg-surface p-card shadow-md">
      <Eyebrow>tokens.tsx</Eyebrow>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {NEUTRAL_SWATCHES.map((sw) => (
          <div key={sw.label} className="space-y-1.5">
            <div
              className={cn(
                "h-12 rounded-md border border-default",
                sw.cls,
              )}
            />
            <div className="font-mono text-2xs text-muted">{sw.label}</div>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="flex items-center gap-3">
        <span className="font-mono text-2xs uppercase tracking-widest text-muted">
          signal
        </span>
        <div className="flex gap-2">
          {ACCENT_SWATCHES.map((cls) => (
            <div key={cls} className={cn("size-8 rounded-md", cls)} />
          ))}
        </div>
      </div>
    </div>
  );
}

const TRUST_ROWS: { change: string; outcome: string; tone: string }[] = [
  { change: "Sandbox copy & content", outcome: "Auto-merge", tone: "success" },
  { change: "Any token or ui/ change", outcome: "Draft PR", tone: "warning" },
  { change: "Token deprecations, the gates", outcome: "Suggest only", tone: "info" },
];

const TONE_CHIP: Record<string, string> = {
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  info: "bg-info-subtle text-info",
};

function TrustMatrix() {
  return (
    <div className="overflow-hidden rounded-xl border border-default bg-surface shadow-md">
      <div className="flex items-center justify-between gap-4 bg-panel px-4 py-2.5">
        <span className="font-mono text-2xs uppercase tracking-widest text-muted">
          Change
        </span>
        <span className="font-mono text-2xs uppercase tracking-widest text-muted">
          Outcome
        </span>
      </div>
      {TRUST_ROWS.map((row) => (
        <div
          key={row.change}
          className="flex items-center justify-between gap-4 border-t border-default px-4 py-3"
        >
          <span className="text-sm text-secondary">{row.change}</span>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
              TONE_CHIP[row.tone],
            )}
          >
            {row.outcome}
          </span>
        </div>
      ))}
    </div>
  );
}

const SYSTEM_POINTS = [
  "Neutral-first — color is a signal, not decoration",
  "Semantic triads for status, never a raw red or green",
  "Dark mode is automatic — the same token, both themes",
];

export function SystemSection() {
  return (
    <section id="system" className="scroll-mt-24 border-b border-default">
      <div className="mx-auto max-w-6xl space-y-16 px-gutter py-section">
        <Reveal>
          <SectionHeading
            eyebrow="The system"
            title="Tokens are the contract. Everything derives from them."
            blurb="One dictionary of design decisions — color, spacing, type, elevation, motion — generates CSS variables and Tailwind utilities for every surface, light and dark."
          />
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <h3 className="text-xl font-semibold text-primary">
                A single source of truth
              </h3>
              <p className="mt-3 text-pretty text-secondary">
                Edit one file; regenerate the theme. No ad-hoc hex, no numbered
                scales — a curated vocabulary that's impossible to drift from.
              </p>
              <ul className="mt-5 space-y-2.5">
                {SYSTEM_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 text-sm text-secondary"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <TokenBoard />
          </Reveal>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="lg:order-2">
            <div>
              <h3 className="text-xl font-semibold text-primary">
                Guardrails decide what's safe
              </h3>
              <p className="mt-3 text-pretty text-secondary">
                A trust matrix routes every change to the right outcome — so
                non-technical contributors move fast without touching anything
                they shouldn't. Skill-gates and{" "}
                <span className="font-mono text-sm text-primary">
                  bun run check
                </span>{" "}
                enforce it in CI.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80} className="lg:order-1">
            <TrustMatrix />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const AUDIENCES = [
  {
    icon: PenTool,
    title: "Designers",
    body: "Ship the component, not a redline. Your tokens are the source — Figma reads from code, not the other way around.",
  },
  {
    icon: Megaphone,
    title: "PMs & Marketing",
    body: "Spin up a landing page, change copy, adjust a price — in plain language, safely, without filing a ticket.",
  },
  {
    icon: Code2,
    title: "Engineers",
    body: "Stop being the pixel-pushing bottleneck. Review real PRs that already pass bun run check on the way in.",
  },
];

export function Audiences() {
  return (
    <section className="border-b border-default">
      <div className="mx-auto max-w-6xl px-gutter py-section">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Who it's for"
            title="Built for the whole product team."
            className="mx-auto"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {AUDIENCES.map((audience, i) => (
            <Reveal key={audience.title} delay={i * 80}>
              <Card className="h-full">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg border border-default bg-app">
                    <audience.icon className="size-5 text-brand" />
                  </div>
                  <CardTitle className="text-lg">{audience.title}</CardTitle>
                  <CardDescription className="text-pretty">
                    {audience.body}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATUS_CHIPS: { label: string; cls: string }[] = [
  { label: "Passing", cls: "bg-success-subtle text-success" },
  { label: "In review", cls: "bg-warning-subtle text-warning" },
  { label: "Failed", cls: "bg-error-subtle text-error" },
  { label: "Info", cls: "bg-info-subtle text-info" },
];

export function Showcase() {
  return (
    <section className="border-b border-default">
      <div className="mx-auto max-w-6xl px-gutter py-section">
        <Reveal>
          <SectionHeading
            eyebrow="Proof"
            title="This page is built from the system it sells."
            blurb="Every button, badge, and input here is a real @madison/ui primitive. Toggle the theme in the nav — the whole page recolors from the same tokens."
          />
        </Reveal>
        <Reveal>
          <div className="mt-12 rounded-xl border border-default bg-surface p-card shadow-md">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <Eyebrow>Buttons</Eyebrow>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Delete</Button>
                </div>
              </div>
              <div>
                <Eyebrow>Status</Eyebrow>
                <div className="mt-4 flex flex-wrap gap-2">
                  {STATUS_CHIPS.map((chip) => (
                    <span
                      key={chip.label}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        chip.cls,
                      )}
                    >
                      {chip.label}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <Eyebrow>Input</Eyebrow>
                <div className="mt-4 max-w-sm">
                  <Input placeholder="you@company.com" />
                </div>
              </div>
              <div>
                <Eyebrow>Neutral-first</Eyebrow>
                <p className="mt-4 text-pretty text-sm text-secondary">
                  ~90% of the surface is neutral. Brand and semantic color appear
                  only where they carry meaning — a CTA, a status, a warning.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "Our marketing team ships landing pages without waiting on engineering — and every one is on-brand, because it has to be.",
    name: "Maya Chen",
    roleLabel: "Head of Design, Lumen",
  },
  {
    quote:
      "We deleted our second source of truth. Figma reads from the code now, and drift just stopped being something we fight.",
    name: "Daniel Okoro",
    roleLabel: "Staff Engineer, Patchwork",
  },
  {
    quote:
      "I described a pricing page in plain English and reviewed a real pull request an hour later. No redlines, no handoff.",
    name: "Priya Nair",
    roleLabel: "Product Manager, Northstar",
  },
  {
    quote:
      "Onboarding a new brand used to take a quarter. We cloned the kit, swapped the tokens, and shipped a fully themed system in a week.",
    name: "Sofia Almeida",
    roleLabel: "Design Systems Lead, Cardinal",
  },
  {
    quote:
      "Our PMs open pull requests now and engineering just reviews them. The 'can you change this color' tickets vanished, and nothing lands off-brand.",
    name: "Marcus Webb",
    roleLabel: "VP Engineering, Tideline",
  },
];

export function Testimonials() {
  return (
    <section className="border-b border-default">
      <div className="mx-auto max-w-6xl px-gutter py-section">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="What teams say"
            title="Teams ship faster — and stay on-brand."
            className="mx-auto"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={i * 80}>
              <TestimonialCard
                quote={testimonial.quote}
                name={testimonial.name}
                roleLabel={testimonial.roleLabel}
                verified
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const TIERS = [
  {
    name: "Setup & Migration",
    cadence: "Fixed fee",
    blurb: "We make code the source of truth and wire up governance.",
    points: ["Token migration from Figma", "Storybook + MCP", "CI gates installed"],
    cta: "Scope a setup",
    featured: false,
  },
  {
    name: "Enablement Workshop",
    cadence: "Per cohort",
    blurb: "Your team ships their first real components, hands-on.",
    points: ["Half-day, ~70% build", "The leave-behind kit", "Recorded walkthrough"],
    cta: "Plan a workshop",
    featured: true,
  },
  {
    name: "Governance Retainer",
    cadence: "Monthly",
    blurb: "We keep the system healthy as you scale.",
    points: ["Quarterly drift audits", "Token lifecycle", "Office hours"],
    cta: "Talk retainer",
    featured: false,
  },
];

const NOTIFICATION_CHANNELS = [
  {
    id: "email",
    icon: Mail,
    title: "Email notifications",
    description: "Account activity, receipts, and security alerts.",
    defaultOn: true,
  },
  {
    id: "sms",
    icon: MessageSquare,
    title: "SMS notifications",
    description: "Time-sensitive alerts sent straight to your phone.",
    defaultOn: false,
  },
  {
    id: "product",
    icon: Megaphone,
    title: "Product updates",
    description: "New features, improvements, and the occasional tip.",
    defaultOn: true,
  },
];

export function Notifications() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      NOTIFICATION_CHANNELS.map((channel) => [channel.id, channel.defaultOn]),
    ),
  );

  return (
    <section className="border-b border-default">
      <div className="mx-auto max-w-2xl px-gutter py-section">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Stay in the loop"
            title="Choose how you hear from us."
            blurb="A live component built with the kit — neutral-first, on-token, and accessible. Flip any channel to see it work."
            className="mx-auto"
          />
        </Reveal>
        <Reveal delay={80}>
          <Card className="mt-12">
            <CardContent className="py-2">
              {NOTIFICATION_CHANNELS.map((channel, i) => {
                const Icon = channel.icon;
                const labelId = `landing-${channel.id}-label`;
                return (
                  <div key={channel.id}>
                    {i > 0 ? <Separator /> : null}
                    <div className="flex items-center justify-between gap-4 py-4">
                      <div className="flex items-start gap-3">
                        <Icon
                          className="mt-0.5 size-5 shrink-0 text-secondary"
                          aria-hidden
                        />
                        <div className="space-y-1">
                          <p
                            id={labelId}
                            className="text-sm font-medium text-primary"
                          >
                            {channel.title}
                          </p>
                          <p className="text-sm text-secondary">
                            {channel.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={enabled[channel.id] ?? false}
                        onCheckedChange={(next) =>
                          setEnabled((prev) => ({ ...prev, [channel.id]: next }))
                        }
                        aria-labelledby={labelId}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 border-b border-default">
      <div className="mx-auto max-w-6xl px-gutter py-section">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Engagement"
            title="Three phases. Start small, scale to a retainer."
            blurb="A productized path from first migration to ongoing governance — the recurring engine that keeps drift from creeping back."
            className="mx-auto"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 80}>
              <Card
                className={cn(
                  "relative h-full",
                  tier.featured && "border-brand shadow-lg",
                )}
              >
                {tier.featured ? (
                  <Badge className="absolute right-4 top-4">Most popular</Badge>
                ) : null}
                <CardHeader>
                  <span className="font-mono text-xs uppercase tracking-widest text-muted">
                    {tier.cadence}
                  </span>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription className="text-pretty">
                    {tier.blurb}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <ul className="space-y-2.5">
                    {tier.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2.5 text-sm text-secondary"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-success" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={tier.featured ? "default" : "outline"}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-b border-default bg-panel">
      <DotGrid className="opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-3xl px-gutter py-section text-center lg:py-28">
        <Reveal>
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
            Make code your single source of truth.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-secondary">
            Give your whole team a safe, governed way to ship real UI — and never
            maintain the same design system in two places again.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg">Book a demo</Button>
            <Button size="lg" variant="outline">
              Read the docs
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const FOOTER_COLUMNS = [
  { title: "Product", links: ["How it works", "The system", "Pricing", "Components"] },
  { title: "Resources", links: ["Docs", "Storybook", "Governance", "Changelog"] },
  { title: "Company", links: ["About", "Contact", "Careers"] },
];

export function Footer() {
  return (
    <footer className="bg-app">
      <div className="mx-auto max-w-6xl px-gutter py-12">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <Wordmark />
            <p className="mt-3 text-sm text-secondary">
              The code-first design system kit. Governance-as-code for teams
              that ship.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h4 className="font-mono text-xs uppercase tracking-widest text-muted">
                  {column.title}
                </h4>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#top"
                        className="text-sm text-secondary transition-colors hover:text-primary"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono text-xs text-muted">
            © 2026 Madison. A neutral demo brand.
          </p>
          <a
            href="/"
            className="text-xs text-muted transition-colors hover:text-secondary"
          >
            ← Back to all prototypes
          </a>
        </div>
      </div>
    </footer>
  );
}
