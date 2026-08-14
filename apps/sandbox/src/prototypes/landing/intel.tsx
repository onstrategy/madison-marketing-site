import { useEffect, useRef, useState } from "react";
import { ArrowUp, Check, FileText, Lock, ArrowUpRight } from "lucide-react";
import { cn } from "@madison/ui/utils";
import { LogoMark } from "@madison/ui/logo";
import { useReducedMotion } from "./parts";
import { logoForSource } from "./source-logos";

// ============================================================================
// Intelligence Layer widget — the React port of the design file's
// `data-intel-light` diagram. A looping state machine: the query types itself
// → systems light up as they're searched → a grounded, cited answer appears
// → the source tabs cycle → a "secured" ring + lock badge closes the loop.
// Reduced-motion users get the completed state, statically, no loop.
// On-token throughout; the design's blue accents are `brand` tokens.
// ============================================================================

const QUERY = "What did the council decide on short-term rental caps?";

const SYSTEMS = [
  "Laserfiche",
  "Granicus",
  "SharePoint",
  "Municode",
  "YouTube",
  "OnBase",
  "CivicPlus",
  "ClearGov",
  "Outlook",
  "eScribe",
  "Workday",
  "State law",
];

interface SourceRef {
  tab: string;
  label: string;
  meta: string;
  quote: string;
}

const SOURCES: SourceRef[] = [
  {
    tab: "Minutes",
    label: "Board minutes",
    meta: "Apr 15, 2025 · Item 7",
    quote: "“Motion to adopt Ordinance 24-07 carried 5–2.”",
  },
  {
    tab: "Staff report",
    label: "Staff report SR-118",
    meta: "Planning Department",
    quote: "“Staff recommends approval of the proposed permit cap.”",
  },
  {
    tab: "Ordinance",
    label: "Ordinance 24-07 · §4(b)",
    meta: "Transition provisions",
    quote: "“Existing permits shall conform within 18 months of adoption.”",
  },
];

const STATS = [
  { value: "16,408", label: "files indexed across your systems", countUp: true },
  { value: "100%", label: "of answers cited to ground-truth documents" },
  { value: "92%+", label: "accuracy on grounded answers" },
  { value: "0", label: "data ever leaves your environment" },
];

// Loop phases, in order. Timings (ms from loop start) tuned to read calmly.
type Phase = "typing" | "searching" | "answer" | "sources" | "secured";

const TYPE_MS = 34;
const TYPED_AT = 400 + QUERY.length * TYPE_MS; // typing done
const SEARCH_AT = TYPED_AT + 300; // status + tiles wake
const TILE_STEP = 110; // per-tile check-in
const ANSWER_AT = SEARCH_AT + 400 + SYSTEMS.length * TILE_STEP;
const SOURCES_AT = ANSWER_AT + 1400;
const SOURCE_CYCLE = 2200; // per source tab
const SECURED_AT = SOURCES_AT + SOURCES.length * SOURCE_CYCLE;
const RESTART_AT = SECURED_AT + 3400;

function Citation({
  n,
  active,
  visible,
  onSelect,
}: {
  n: number;
  active: boolean;
  visible: boolean;
  onSelect: (n: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(n)}
      aria-label={`Show source ${n}`}
      className={cn(
        "ml-0.5 inline-flex -translate-y-1 items-center rounded-md border px-1 py-0.5 align-middle font-sans text-sm font-bold leading-none transition-all",
        active
          ? "border-brand bg-brand text-brand-fg"
          : "border-brand/30 bg-brand-subtle text-brand-accent",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {n}
    </button>
  );
}

export function IntelDiagram() {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(reduced ? QUERY : "");
  const [phase, setPhase] = useState<Phase>(reduced ? "secured" : "typing");
  const [checkedCount, setCheckedCount] = useState(reduced ? SYSTEMS.length : 0);
  const [activeSource, setActiveSource] = useState<number | null>(reduced ? 1 : null);
  const userPinned = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reduced) return;
    const at = (ms: number, fn: () => void) =>
      timers.current.push(window.setTimeout(fn, ms));

    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      userPinned.current = false;
      setTyped("");
      setPhase("typing");
      setCheckedCount(0);
      setActiveSource(null);

      for (let i = 1; i <= QUERY.length; i++) {
        at(400 + i * TYPE_MS, () => setTyped(QUERY.slice(0, i)));
      }
      at(SEARCH_AT, () => setPhase("searching"));
      for (let i = 1; i <= SYSTEMS.length; i++) {
        at(SEARCH_AT + 400 + i * TILE_STEP, () => setCheckedCount(i));
      }
      at(ANSWER_AT, () => setPhase("answer"));
      SOURCES.forEach((_, idx) => {
        at(SOURCES_AT + idx * SOURCE_CYCLE, () => {
          setPhase("sources");
          if (!userPinned.current) setActiveSource(idx + 1);
        });
      });
      at(SECURED_AT, () => setPhase("secured"));
      at(RESTART_AT, run);
    };
    run();
    return () => {
      cancelled = true;
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, [reduced]);

  const selectSource = (n: number) => {
    userPinned.current = true;
    setActiveSource(n);
  };

  const answered = phase === "answer" || phase === "sources" || phase === "secured";
  const sourcesShown = phase === "sources" || phase === "secured";
  const searching = phase === "searching";
  const secured = phase === "secured";
  const source = activeSource ? SOURCES[activeSource - 1] : null;

  return (
    <div>
      <div
        className={cn(
          "relative rounded-2xl border bg-surface p-5 shadow-xl transition-all [transition-duration:var(--duration-slow)]",
          secured
            ? "border-brand ring-[length:var(--ring-width)] ring-brand/25"
            : "border-default",
        )}
      >
        {/* Lock badge — drops in once the loop reaches the "secured" beat */}
        <span
          aria-hidden
          className={cn(
            "absolute -right-4 -top-4 z-dropdown flex size-9 items-center justify-center rounded-full bg-brand text-brand-fg shadow-lg transition-all [transition-duration:var(--duration-slow)]",
            secured ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <Lock className="size-4" />
        </span>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left — query + systems */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-default bg-app p-4">
              <div className="min-h-14 text-base text-primary">
                {typed}
                <span
                  aria-hidden
                  className={cn(
                    "ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-brand",
                    phase === "typing" ? "animate-pulse" : "opacity-0",
                  )}
                />
              </div>
              <div className="mt-3 flex justify-end">
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand text-brand-fg">
                  <ArrowUp className="size-4" />
                </span>
              </div>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-muted transition-opacity",
                searching || answered ? "opacity-100" : "opacity-0",
              )}
            >
              <span className="size-1.5 animate-pulse rounded-full bg-brand" />
              Searching your enterprise data
            </div>
            <div className="flex flex-wrap content-start gap-2.5">
              {SYSTEMS.map((name, i) => {
                const checked = i < checkedCount;
                const logoSrc = logoForSource(name);
                return (
                  <span
                    key={name}
                    title={name}
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-all",
                      checked
                        ? "border-brand/30 bg-surface text-primary opacity-100"
                        : "border-default bg-panel text-secondary",
                      searching || answered ? "opacity-100" : "opacity-40",
                    )}
                  >
                    {/* Real vendor logos where we have one (see ./source-logos.ts),
                        on their own white plate — these marks carry their own ink
                        and would be tinted by the warm canvas or lost against a
                        dark chip. Sources with no logo keep their plain name. */}
                    {logoSrc ? (
                      <span className="light flex h-7 items-center rounded-sm bg-plate px-1.5">
                        <img
                          src={logoSrc}
                          alt={name}
                          loading="lazy"
                          className="h-4.5 w-auto max-w-24 object-contain"
                        />
                      </span>
                    ) : (
                      name
                    )}
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded-full bg-success-subtle text-success transition-opacity",
                        checked ? "opacity-100" : "opacity-0",
                      )}
                    >
                      <Check className="size-2.5" />
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Right — grounded answer */}
          <div
            className={cn(
              "flex flex-col rounded-xl border border-default bg-surface p-4 shadow-md transition-all [transition-duration:var(--duration-slow)]",
              answered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            <div className="mb-2.5 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-brand">
                <LogoMark width={15} height={9} className="text-brand-fg" />
              </span>
              <span className="text-xs font-semibold text-primary">
                Grounded answer
              </span>
              <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-success">
                <Check className="size-3" /> cited
              </span>
            </div>
            <p className="text-sm leading-relaxed text-secondary">
              On April 15, 2025 the Board of County Commissioners adopted
              Ordinance 24-07, capping short-term rental permits at 7 per 2
              acres in residential zones.
              <Citation n={1} active={activeSource === 1} visible={answered} onSelect={selectSource} />{" "}
              The motion passed 5–2 after planning staff recommended approval,
              <Citation n={2} active={activeSource === 2} visible={answered} onSelect={selectSource} />{" "}
              and directs code enforcement to phase existing permit holders
              into compliance over 18 months.
              <Citation n={3} active={activeSource === 3} visible={answered} onSelect={selectSource} />
            </p>
            <div
              className={cn(
                "mt-4 border-t border-default pt-3 transition-opacity",
                sourcesShown ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="mb-2.5 flex items-center gap-2">
                <span className="font-sans text-sm uppercase tracking-widest text-muted">
                  Sources
                </span>
                <div className="flex gap-1.5">
                  {SOURCES.map((s, idx) => (
                    <button
                      key={s.tab}
                      type="button"
                      onClick={() => selectSource(idx + 1)}
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors",
                        activeSource === idx + 1
                          ? "border-brand bg-brand text-brand-fg"
                          : "border-default bg-panel text-secondary hover:bg-hover",
                      )}
                    >
                      {s.tab}
                    </button>
                  ))}
                </div>
              </div>
              {/* Fixed-height well. This block mounts only once a source is
                  picked, and the three sources' quotes differ in length — both
                  of which resized the card mid-loop and made the whole section
                  jump. Reserving the tallest state's height up front keeps the
                  layout still while the animation cycles. */}
              <div className="min-h-28">
                {source ? (
                  <div className="flex gap-3 rounded-lg border border-brand/30 bg-brand-subtle p-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-surface text-brand-accent">
                      <FileText className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-primary">
                          {source.label}
                        </span>
                        <span className="text-sm text-muted">{source.meta}</span>
                      </div>
                      <p className="mt-1 text-xs italic leading-relaxed text-secondary">
                        {source.quote}
                      </p>
                      <span className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-brand-accent">
                        Open source document <ArrowUpRight className="size-3" />
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Below-diagram stats */}
      <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <div className="text-3xl font-bold tracking-tight text-primary">
              {stat.countUp ? <CountUp target={16408} /> : stat.value}
            </div>
            <p className="mt-2 text-sm leading-snug text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Eased count-up (once, on mount). Reduced-motion users see the final number. */
function CountUp({ target }: { target: number }) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    const dur = 3200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, target]);

  return <span>{value.toLocaleString("en-US")}</span>;
}
