import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useReducedMotion } from "../../landing/parts";

// ============================================================================
// Shared scaffolding for the two animated product demos that sit under a
// platform page's hero (see ./staff-report-demo.tsx and
// ./solicitation-demo.tsx).
//
// Both were authored as a fixed 1920x1080 stage — every offset, wire endpoint,
// and font size inside them is expressed in that coordinate space, the same
// way an SVG's contents are expressed in its viewBox. Rather than rewrite that
// geometry responsively (which would break the hand-tuned layout), `DemoStage`
// renders the stage at its true 1920x1080 size and scales the whole thing down
// to whatever width the page gives it. That keeps the px values inside the
// demos meaningful and self-consistent, and is why those files use inline
// styles with literal pixels instead of Tailwind spacing utilities.
//
// Colors are the exception: they resolve from the design system's runtime CSS
// variables (`hsl(var(--text-primary))`, …) rather than the source's hardcoded
// hex, so the demos follow Madison's palette — and its light/dark theming —
// like every other surface on the site.
// ============================================================================

/** Every demo is authored against this stage size. */
export const STAGE_W = 1920;
export const STAGE_H = 1080;

/**
 * Scales a 1920x1080 stage to fit its container's width, preserving the 16:9
 * box so the page reserves the right height before the demo paints. The
 * wrapper clips, so a demo that overdraws its stage can't spill onto the page.
 */
export function DemoStage({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  /** Describes the demo for assistive tech — the animation itself is decorative. */
  label: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / STAGE_W);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      className={className}
      style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden" }}
    >
      {/* Hidden until measured — painting at scale 0 would flash a full-size
          stage on the first frame, before the ResizeObserver reports. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: STAGE_W,
          height: STAGE_H,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          visibility: scale ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface DemoClockOptions {
  /**
   * The frame reduced-motion visitors see instead of the animation — pick a
   * moment that reads as the finished result, not a mid-build state.
   */
  staticAt: number;
}

/**
 * Drives a looping demo timeline. Autoplays, loops at `duration`, and pauses
 * whenever the demo is scrolled out of view so an off-screen animation isn't
 * burning frames. Reduced-motion visitors get `staticAt` and no rAF loop at
 * all.
 *
 * Returns the current time in seconds plus the ref to put on the element whose
 * visibility gates playback.
 */
export function useDemoClock(duration: number, { staticAt }: DemoClockOptions) {
  const reduced = useReducedMotion();
  const [t, setT] = useState(reduced ? staticAt : 0);
  const viewRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(true);

  useEffect(() => {
    if (reduced) {
      setT(staticAt);
      return;
    }
    const el = viewRef.current;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      // Clamp dt so a backgrounded tab doesn't resume by jumping the timeline.
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (inViewRef.current) setT((prev) => (prev + dt) % duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let observer: IntersectionObserver | undefined;
    if (el) {
      observer = new IntersectionObserver(
        ([entry]) => {
          inViewRef.current = entry.isIntersecting;
          // Reset the delta baseline so time paused off-screen isn't credited
          // to the first frame back.
          last = performance.now();
        },
        { threshold: 0 },
      );
      observer.observe(el);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [duration, reduced, staticAt]);

  return { t, viewRef, reduced };
}

// ── Small helpers shared by both demos ──────────────────────────────────────

export const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

/** easeInOutCubic — the source's easing, matched exactly. */
export const ease = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/** Reveals `full` one character at a time across `dur`, starting at `start`. */
export const typed = (full: string, start: number, dur: number, t: number) => {
  if (t < start) return "";
  const p = clamp((t - start) / dur, 0, 1);
  return full.slice(0, Math.floor(p * full.length));
};

export const prog = (start: number, dur: number, t: number) =>
  clamp((t - start) / dur, 0, 1);

/** Token-backed color, so the demos theme with the rest of the site. */
export const token = (name: string, alpha?: number) =>
  alpha === undefined ? `hsl(var(${name}))` : `hsl(var(${name}) / ${alpha})`;

/** A blinking text caret, used wherever a demo is "typing". */
export function Caret({ height, color = token("--brand-accent") }: { height: number; color?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height,
        background: color,
        verticalAlign: -2,
        marginLeft: 2,
        animation: "mai-blink 1.1s steps(2) infinite",
      }}
    />
  );
}

/**
 * The keyframes both demos rely on. Scoped to the demos rather than added to
 * the app stylesheet, since nothing else uses them.
 */
export const DEMO_KEYFRAMES = `
@keyframes mai-blink { 50% { opacity: 0; } }
@keyframes mai-pulse {
  0%, 100% { box-shadow: 0 0 0 4px hsl(var(--brand-accent) / 0.16); }
  50% { box-shadow: 0 0 0 6px hsl(var(--brand-accent) / 0.04); }
}
@keyframes mai-scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-demo-stage] * { animation: none !important; }
}
`;

export function DemoKeyframes() {
  return <style>{DEMO_KEYFRAMES}</style>;
}

export type Style = CSSProperties;
