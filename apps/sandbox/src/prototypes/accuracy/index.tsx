import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  FileCheck,
  FileSearch,
  Landmark,
  ListChecks,
  Minus,
  Target,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@madison/ui/button";
import { Logo } from "@madison/ui/logo";
import { cn } from "@madison/ui/utils";
import { Nav, Footer, ClientLogos } from "../landing/sections";
import {
  Reveal,
  Eyebrow,
  SectionHeading,
  DotGrid,
  useReducedMotion,
} from "../landing/parts";

// ============================================================================
// Accuracy — the page behind the nav's "Accuracy" link. Built from the
// accuracy deck: slide 1 is the benchmark (the question, the four scores, and
// the five-dimension rubric they're scored against); slide 2 is why the gap
// exists (a pile of files in a chat window vs. Madison's two layers).
//
// The narrative runs claim → test → result → rubric → mechanism → CTA, so the
// scores land before the methodology that justifies them, and the architecture
// explains the gap the scores just showed.
// ============================================================================

/** The benchmark question every assistant on this page was given. */
const QUESTION =
  "Across all the council meetings in these minutes, how many total residential housing units were approved through public hearing votes?";

interface Score {
  name: string;
  score: number;
  /** Madison's own row — filled in brand, everyone else stays neutral. */
  us?: boolean;
}

// Ascending, so the row order itself carries the finding.
const SCORES: Score[] = [
  { name: "Copilot", score: 8 },
  { name: "ChatGPT", score: 54 },
  { name: "Claude", score: 80 },
  { name: "Madison AI", score: 97, us: true },
];

// The hero's headline comparison is DERIVED from the table above rather than
// typed out again, so the two can never disagree if a score is ever revised.
const US = SCORES.find((s) => s.us)!;
const RIVALS = SCORES.filter((s) => !s.us);
const RIVAL_AVERAGE = Math.round(
  RIVALS.reduce((sum, s) => sum + s.score, 0) / RIVALS.length,
);

interface Dimension {
  icon: LucideIcon;
  name: string;
  test: string;
  weight: number;
}

const DIMENSIONS: Dimension[] = [
  { icon: Target, name: "Correctness", test: "Is the answer correct?", weight: 30 },
  { icon: ListChecks, name: "Completeness", test: "All key facts included?", weight: 30 },
  { icon: FileCheck, name: "Faithfulness", test: "Backed by docs?", weight: 20 },
  { icon: FileSearch, name: "Retrieval", test: "Found the right docs", weight: 10 },
  { icon: Landmark, name: "Authority", test: "Used official records?", weight: 10 },
];

/** What actually happens when you paste the whole packet into a chat window. */
const LLM_LIMITS = [
  {
    title: "Still time-intensive.",
    body: "Staff re-upload, re-prompt, and re-verify every single time.",
  },
  {
    title: "Inconsistent.",
    body: "Same question, different answer. Capped at ~20 files at a time.",
  },
  {
    title: "Not trustworthy.",
    body: "No grounding, no citations. Nothing you can take to the dais or present to a citizen.",
  },
];

const LAYERS = [
  {
    label: "Layer 1 — Madison Memory",
    lede: "Your single source of truth.",
    steps: ["Connect", "Convert", "Organize", "Ground"],
    sources: "PDFs · Tabular · GIS · Permit data · ERP · Decades of files/decisions",
  },
  {
    label: "Layer 2 — Madison Intelligence",
    lede: "Agents that complete the whole task.",
    steps: ["Analyze", "Synthesize", "Output", "Cite Work"],
  },
];

/**
 * Counts up to `value` once, easing out. Reduced-motion visitors get the final
 * number immediately — the number is the content, the count is the flourish.
 */
function CountUp({ value, run }: { value: number; run: boolean }) {
  const reduced = useReducedMotion();
  // Starts at the REAL number, not zero. This renders into the prerendered
  // HTML, so what a crawler (or anyone whose frames never run — rAF is
  // suspended in a background tab) reads is "97%", not "0%". The effect below
  // rewinds to zero and counts up only once we know we can actually animate.
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    if (!run) return;
    setShown(0);
    const duration = 1600;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // Cubic ease-out: fast off the line, settling onto the final number.
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, run, value]);

  return <>{shown}</>;
}

/**
 * The hero's proof: Madison's score against the average of the three
 * assistants it was benchmarked next to. Both bars grow from zero on mount —
 * the rivals' bar first, Madison's a beat later, so the gap opens in front of
 * you rather than arriving pre-drawn.
 *
 * Bars scale on the X axis rather than animating `width`: a transform runs on
 * the compositor instead of triggering layout on every frame. `origin-left`
 * makes them grow from the left edge. No `useInView` here — this block sits in
 * the hero, so mount and "visible" are the same moment.
 */
function ScoreComparison() {
  const bar = (score: number, delayMs: number, brand: boolean) => (
    <div className={cn("w-full overflow-hidden rounded-full bg-app", brand ? "h-4" : "h-2.5")}>
      <div
        className={cn(
          "animate-bar-grow h-full origin-left rounded-full",
          brand ? "bg-brand" : "bg-border-active",
        )}
        style={
          {
            "--bar-scale": score / 100,
            transform: `scaleX(${score / 100})`,
            animationDelay: `${delayMs}ms`,
          } as CSSProperties
        }
      />
    </div>
  );

  return (
    <div className="mx-auto mt-14 max-w-2xl text-left">
      {/* The deep bottom padding is the point: it gives the card real body
          below the last bar, which the section underneath then covers, so the
          card reads as continuing down behind it rather than being cropped
          right under its content. The overhang on the wrapper below is tuned
          to land inside this padding — never above the last bar, never past
          the rounded bottom corners. */}
      <div className="rounded-2xl border border-default bg-surface p-8 pb-32 lg:pb-40">
        <Eyebrow className="mb-6 text-primary">Quality Score</Eyebrow>
        {/* Madison */}
        <div className="mb-2 flex items-end justify-between gap-4">
          <Logo className="[&_svg]:h-5 [&_svg]:w-auto" />
          <span className="font-sans text-5xl font-bold leading-none tracking-tight text-brand-accent">
            <CountUp value={US.score} run />%
          </span>
        </div>
        {bar(US.score, 350, true)}

        {/* The field it was measured against */}
        <div className="mb-2 mt-8 flex items-end justify-between gap-4">
          <span className="text-sm text-secondary">
            Other assistants · average of {RIVALS.length}
          </span>
          <span className="font-sans text-2xl font-bold leading-none tracking-tight text-secondary">
            <CountUp value={RIVAL_AVERAGE} run />%
          </span>
        </div>
        {bar(RIVAL_AVERAGE, 0, false)}
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="dark relative border-b border-default bg-app px-gutter pb-0 pt-28 lg:px-0 lg:pt-40">
      <DotGrid className="opacity-60" />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-brand-accent">Accuracy</Eyebrow>
          <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            The proof is in the accuracy score.
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-secondary">
            Anyone can claim their AI is accurate. We publish the rubric, ask a real
            multi-document council question, and score every answer the same way — including
            our own.
          </p>
        </Reveal>
      </div>
      {/* The negative bottom margin pulls the hero's own bottom edge up past
          the score box, so the box runs on underneath BenchmarkSection below —
          a later, opaque sibling, which paints over the overhang. The hero
          carries no bottom padding of its own (`pb-0`), so this number IS the
          overhang, with nothing cancelling it: 72px of the card's 128px bottom
          padding is hidden on mobile, 96px of 160px from `lg` up. Either way
          the cut lands mid-padding — a slice of empty card still shows below
          the last bar, and the rounded bottom corners stay out of sight, which
          is what sells "continues behind" rather than "cropped".
          Deliberately NOT wrapped in Reveal: a `transition-all` ancestor
          gets promoted to its own compositing layer, which can make the
          overhang paint above the next section instead of behind it (same
          trap documented on the About Us hero photo). The box brings its own
          entrance — the bars grow and the numbers count up — so it doesn't
          need Reveal's fade anyway. */}
      <div className="relative mx-auto -mb-18 max-w-3xl lg:-mb-24">
        <ScoreComparison />
      </div>
    </section>
  );
}

/** Slide 1's right column: the question, the ground truth, and the four scores. */
function BenchmarkSection() {
  return (
    // `relative` is load-bearing, not decorative: the hero above is positioned
    // (it needs to be, for its DotGrid), and a positioned element paints after
    // a static one no matter the DOM order — so as a static section this was
    // being painted OVER by the hero's overhanging score card instead of
    // covering it. Positioning this section puts both in the same paint bucket,
    // where the later sibling wins and the card tucks behind as intended.
    <section className="relative bg-app px-gutter py-30 lg:px-0">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="The test"
            title="One question. Twelve months of packets."
            blurb="A question no single document answers — it has to be assembled from a year of minutes, then counted correctly."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[3fr_2fr] lg:gap-10">
          <Reveal>
            <div className="h-full rounded-2xl border border-default bg-surface p-8">
              <Eyebrow className="mb-4 text-brand-accent">Question</Eyebrow>
              <p className="text-pretty font-serif text-2xl font-medium tracking-tight text-primary">
                {QUESTION}
              </p>
              <dl className="mt-8 grid gap-6 border-t border-default pt-6">
                <div>
                  <dt className="mb-1.5 font-sans text-sm uppercase tracking-widest text-muted">
                    Context
                  </dt>
                  <dd className="font-semibold text-primary">12 months of packets/minutes</dd>
                </div>
                <div>
                  <dt className="mb-1.5 font-sans text-sm uppercase tracking-widest text-muted">
                    Correct answer
                  </dt>
                  <dd className="font-semibold text-primary">928 units across 7 hearings</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full rounded-2xl border border-default bg-surface p-8">
              <Eyebrow className="mb-6 text-brand-accent">Quality Score</Eyebrow>
              <ul className="space-y-5">
                {SCORES.map((row) => (
                  <li key={row.name}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      {/* Our own row is the brand lockup rather than a text label —
                          Logo carries an sr-only "Madison Ai", so the row keeps its
                          accessible name. Competitors stay as plain text: the kit
                          doesn't ship marks it has no rights to. */}
                      {row.us ? (
                        <Logo className="[&_svg]:h-5 [&_svg]:w-auto" />
                      ) : (
                        <span className="text-sm text-secondary">{row.name}</span>
                      )}
                      <span
                        className={cn(
                          "font-sans font-bold tracking-tight",
                          row.us ? "text-2xl text-brand-accent" : "text-lg text-secondary",
                        )}
                      >
                        {row.score}%
                      </span>
                    </div>
                    {/* Track + fill. The width is the datum, so it rides an inline
                        style rather than a class — there is no utility for "97%". */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-panel">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          row.us ? "bg-brand" : "bg-border-active",
                        )}
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-default pt-4 text-sm text-muted">
                Scores on this question, graded against the five dimensions below.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Slide 1's left column: the rubric the scores above are produced by. */
function RubricSection() {
  return (
    <section className="border-t border-default bg-surface px-gutter py-30 lg:px-0">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="The rubric"
            title="The 5 dimensions of a Quality Score."
            blurb="Every answer is graded on the same five dimensions, weighted to what a government actually needs to defend a decision."
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <Reveal>
            <ul>
              {DIMENSIONS.map((dimension, i) => (
                <li
                  key={dimension.name}
                  className={cn(
                    "flex items-center gap-5 border-default py-5",
                    i === 0 ? "border-t" : "",
                    "border-b",
                  )}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-brand-accent">
                    <dimension.icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-primary">{dimension.name}</div>
                    <div className="text-sm text-secondary">{dimension.test}</div>
                  </div>
                  <span className="font-sans text-2xl font-bold tracking-tight text-primary">
                    {dimension.weight}%
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100}>
            {/* Forced `dark` scope: every token inside resolves to the Dark Navy
                foundation, so the box reads as one solid dark-blue panel against
                the warm section — on-token, and it holds up in both themes. */}
            <div className="dark rounded-2xl border border-default bg-app p-8">
              <h3 className="mb-6 text-2xl font-semibold text-primary">How the score works</h3>
              <dl className="space-y-6">
                <div>
                  <dt className="mb-1 font-semibold text-primary">Quality Score</dt>
                  <dd className="text-pretty text-secondary">
                    A weighted sum of all five dimensions.
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 font-semibold text-primary">Our target</dt>
                  <dd className="text-pretty text-secondary">90%+ on every question.</dd>
                </div>
                {/* Red carries the "fail" signal as the icon and tint (graphical
                    elements, which need 3:1) while the label itself stays
                    text-primary. Inside this forced-dark scope, `text-error` as
                    ink measures only 4.02:1 on the navy — under the 4.5:1 AA
                    floor for body-size text. */}
                <div className="rounded-xl border-2 border-error bg-error/10 p-5">
                  <dt className="mb-1 flex items-center gap-2 font-semibold text-primary">
                    <TriangleAlert aria-hidden className="size-4 shrink-0 text-error" />
                    Automatic fail
                  </dt>
                  <dd className="text-pretty text-secondary">
                    Any factual error caps the score at 70% — no matter how well the answer
                    scores everywhere else.
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Slide 2: why a pile of files in a chat window can't close the gap. */
function ArchitectureSection() {
  return (
    <section className="border-t border-default bg-app px-gutter py-30 lg:px-0">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Why the gap"
            title="No magic wand. Just hard work."
            blurb="The same question, run two ways — and the difference is architecture, not prompting."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-default bg-surface p-8">
              <h3 className="mb-1 text-2xl font-semibold text-primary">
                Drop 24 files into an LLM
              </h3>
              <p className="mb-8 text-sm text-muted">The workaround most teams try first.</p>
              <ul className="space-y-6">
                {LLM_LIMITS.map((limit) => (
                  <li key={limit.title} className="flex items-start gap-3.5">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-error-subtle text-error">
                      <Minus className="size-3.5" />
                    </span>
                    <p className="text-pretty text-secondary">
                      <span className="font-semibold text-primary">{limit.title}</span>{" "}
                      {limit.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            {/* The winning side of the comparison, so it carries the one brand
                accent in this section: blue edge, a soft brand ring reading as
                a glow, and two decorative rings radiating outward from the
                card's own edge. The rings are `position: absolute` with no
                z-index, which paints them above the card's own (static,
                non-positioned) background — so the actual content is wrapped
                in its own `relative` div rather than reaching for a raw
                z-index: an absolute/relative element with z-index:auto paints
                in DOM order among its stacking-context siblings, and the
                content div comes after the rings in the tree. Same idiom as
                the intel diagram's "secured" state, taken one step further. */}
            <div className="relative flex h-full flex-col rounded-2xl border border-brand bg-surface p-8 shadow-lg">
              {/* No border or background of its own — the animation's blurred
                  box-shadow is the only thing that paints, and a non-inset
                  shadow only draws outside the box, so it sits behind the
                  card rather than over its face. */}
              <span
                aria-hidden
                className="animate-radiate pointer-events-none absolute inset-0 rounded-2xl"
              />
              {/* The card's translucent outline, on its own element rather than
                  a static `ring-*` on the card itself — the animation drives
                  box-shadow directly (see index.css), which a static `ring-*`
                  utility's own box-shadow would fight with. */}
              <span
                aria-hidden
                className="animate-outline-breathe pointer-events-none absolute -inset-px rounded-2xl"
              />
              <div className="relative flex h-full flex-col">
                <h3 className="mb-1 text-2xl font-semibold text-primary">
                  Madison Memory + Intelligence
                </h3>
                <p className="mb-8 text-sm text-muted">Two layers, built for the whole task.</p>
                <div className="space-y-8">
                  {LAYERS.map((layer) => (
                    <div key={layer.label}>
                      <div className="mb-4">
                        <span className="font-semibold text-primary">{layer.label}</span>{" "}
                        <span className="text-secondary">{layer.lede}</span>
                      </div>
                      {/* Wraps on narrow screens — the arrows sit between chips, so a
                          wrapped row still reads as one left-to-right sequence. */}
                      <ol className="flex flex-wrap items-center gap-y-2">
                        {layer.steps.map((step, i) => (
                          <li key={step} className="flex items-center">
                            <span className="rounded-full border border-default bg-app px-3 py-1.5 text-sm font-medium text-primary">
                              {step}
                            </span>
                            {i < layer.steps.length - 1 ? (
                              <ArrowRight
                                aria-hidden
                                className="mx-1.5 size-4 shrink-0 text-brand-accent"
                              />
                            ) : null}
                          </li>
                        ))}
                      </ol>
                      {layer.sources ? (
                        <p className="mt-4 text-sm text-secondary">{layer.sources}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="border-t border-default bg-gradient-to-b from-brand-subtle to-app px-gutter py-38 text-center">
      <Reveal>
        <h2 className="mb-4.5 text-balance text-3xl font-medium tracking-tight text-primary md:text-4xl">
          Run the same question against your own record.
        </h2>
        <p className="mx-auto mb-8.5 max-w-lg text-lg leading-relaxed text-secondary">
          We&rsquo;ll load Madison with a sample of your files and score the answers in front
          of you.
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Button size="lg" asChild>
            <a href="/demo/">
              Book a demo <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="bg-surface" asChild>
            <a href="/security/">See how we handle your data</a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function AccuracyPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroSection />
        <BenchmarkSection />
        <RubricSection />
        <ArchitectureSection />
        <ClientLogos />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
