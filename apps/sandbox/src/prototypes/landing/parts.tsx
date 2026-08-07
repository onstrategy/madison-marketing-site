import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { Check, Landmark } from "lucide-react";
import { cn } from "@madison/ui/utils";

// ============================================================================
// Shared building blocks for the Madison landing prototype.
// Everything here is on-token — neutral-first, color as signal, no raw hex.
// ============================================================================

/** True when the user prefers reduced motion. Initialized synchronously to avoid a reveal flash. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger in ms — lets a row of items rise in sequence. */
  delay?: number;
}

/**
 * True when this document arrived as prerendered HTML rather than being booted
 * client-side: any server render, plus the published site, whose prerender step
 * stamps `data-prerendered` on <html> (apps/site/scripts/prerender.ts).
 *
 * Reveal starting hidden is right for the client-rendered sandbox and wrong for a
 * prerendered page — the HTML that crawlers read and the browser paints first
 * would be a wall of `opacity-0` blocks, which is most of the point of
 * prerendering thrown away. Read once at module scope so hydration can't disagree
 * with what the server emitted.
 */
const START_SHOWN =
  typeof document === "undefined" ||
  document.documentElement.hasAttribute("data-prerendered");
const SEO_AUDIT = import.meta.env.VITE_SEO_AUDIT === "true";

/**
 * Fade + rise a block into view on scroll (IntersectionObserver). Purposeful, not
 * decorative: a small 12px offset, once. Reduced-motion users get it shown instantly.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(START_SHOWN);

  useEffect(() => {
    // Lighthouse/axe must inspect below-fold content too. Hiding it after
    // hydration would cause color-contrast checks to skip most of the page.
    if (reduced || SEO_AUDIT) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    // Prerendered: this block is already painted and hydrated as visible. Leave
    // whatever is on screen alone, and re-arm the reveal only for what's still
    // below the fold — where hiding it again can't be seen, so the scroll
    // animation survives without a flash.
    if (START_SHOWN) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      setShown(false);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown && delay ? `${delay}ms` : undefined }}
      className={cn(
        "transition-all duration-[var(--duration-slow)] ease-[var(--ease-standard)] motion-reduce:transition-none",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A monospace, uppercase overline — the "developer tool" credibility cue. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  blurb?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  blurb,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
      <h2 className="text-balance text-3xl font-medium tracking-tight text-primary md:text-4xl">
        {title}
      </h2>
      {blurb ? (
        <p className="mt-4 text-pretty text-lg text-secondary">{blurb}</p>
      ) : null}
    </div>
  );
}

/** A faded dot-grid texture — the one ambient background motif (reused from the style guide). */
export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border-default)_1px,transparent_1px)] [background-size:20px_20px]",
        className,
      )}
    />
  );
}

/** A macOS-style window chrome — its traffic-light dots are semantic tokens, not raw color. */
export function BrowserFrame({
  title,
  children,
  className,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-default bg-surface shadow-xl",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-default bg-panel px-4 py-3">
        <span className="size-3 rounded-full bg-error" />
        <span className="size-3 rounded-full bg-warning" />
        <span className="size-3 rounded-full bg-success" />
        {title ? (
          <span className="ml-3 truncate font-sans text-sm text-muted">
            {title}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** A small "✓ passed" pill in the success triad. */
export function CheckChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-subtle px-2.5 py-1 text-xs font-medium text-success">
      <Check className="size-3.5" />
      {children}
    </span>
  );
}

interface MarqueeProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** Time for one full loop — lower is faster. Constant speed (linear, no easing). */
  durationSeconds?: number;
  className?: string;
}

/**
 * Infinite, constant-speed horizontal scroller. The track renders `items`
 * twice back-to-back (second copy `aria-hidden`) with the loop-connecting
 * gap baked into each copy's own width via `pr-8` — so translateX(-50%)
 * always lands on a pixel-identical copy, with no visible seam or snap.
 */
export function Marquee<T>({
  items,
  renderItem,
  durationSeconds = 32,
  className,
}: MarqueeProps<T>) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{ "--marquee-duration": `${durationSeconds}s` } as CSSProperties}
      >
        {[items, items].map((track, copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-8 pr-8"
          >
            {track.map((item, i) => (
              <div key={i} className="shrink-0">
                {renderItem(item, i)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * A stand-in "logo" chip — an icon + name lockup. We don't hold rights to
 * real client wordmarks, so every client is represented the same on-token
 * way rather than a fabricated logo image.
 */
export function LogoMark({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2 rounded-lg border border-default bg-surface px-4 py-2.5">
      <Landmark className="size-4 text-muted" aria-hidden />
      <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-secondary">
        {name}
      </span>
    </span>
  );
}
