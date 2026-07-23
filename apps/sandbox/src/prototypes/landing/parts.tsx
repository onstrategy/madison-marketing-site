import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
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
 * Fade + rise a block into view on scroll (IntersectionObserver). Purposeful, not
 * decorative: a small 12px offset, once. Reduced-motion users get it shown instantly.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
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
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted",
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
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary md:text-4xl">
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
          <span className="ml-3 truncate font-mono text-xs text-muted">
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
