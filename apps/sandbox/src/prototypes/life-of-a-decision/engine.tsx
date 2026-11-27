import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useReducedMotion } from "../landing/parts";

// ============================================================================
// The deck engine for "The life of a decision".
//
// Like the platform-page demos (../platform-page/demos/demo-stage.tsx), every
// scene is authored against a fixed 1920x1080 stage and scaled to fit, so the
// pixel values inside the scenes are stage coordinates, not page layout. The
// difference is the clock: those demos loop on their own, this one is driven
// by the speaker. Each click starts one step; the step plays its build and
// then HOLDS until the next click, so nothing on screen can race the talk.
// ============================================================================

/** Every scene is authored against this stage size. */
export const W = 1920;
export const H = 1080;

export type Style = CSSProperties;

export const SANS = "var(--font-sans)";
export const SERIF = "var(--font-serif)";

/** Local time reported for a step that has already finished playing. */
export const DONE = 999;

export const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** easeInOutCubic — used for travel. */
export const ease = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/** easeOutCubic — used for things arriving. */
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/** Linear progress 0..1 of a build that starts at `start` and lasts `dur`. */
export const prog = (start: number, dur: number, t: number) =>
  clamp((t - start) / dur, 0, 1);

/** The same progress, eased out. */
export const ep = (start: number, dur: number, t: number) => easeOut(prog(start, dur, t));

/**
 * Types `text` in across `dur`, starting at `start`. The whole line is laid
 * out from the first frame and only revealed in place, so words never jump
 * to the next line and the bubble never grows as it types. The letters at
 * the edge fade in over a short run instead of popping, which keeps the
 * motion soft.
 */
export function Typed({
  text,
  start,
  dur,
  t,
}: {
  text: string;
  start: number;
  dur: number;
  t: number;
}) {
  const FADE = 6;
  const at = prog(start, dur, t) * (text.length + FADE);
  const settled = Math.max(0, Math.floor(at - FADE));
  const edge = text.slice(settled, Math.min(text.length, Math.ceil(at)));
  return (
    <>
      {text.slice(0, settled)}
      {[...edge].map((ch, i) => (
        <span
          // Position within the fading run is the identity here.
          key={`${settled + i}`}
          style={{ opacity: clamp(at - FADE - (settled + i) + FADE, 0, FADE) / FADE }}
        >
          {ch}
        </span>
      ))}
      <span style={{ opacity: 0 }}>{text.slice(settled + edge.length)}</span>
    </>
  );
}

/** Token-backed color, so the deck follows the design system's palette. */
export const token = (name: string, alpha?: number) =>
  alpha === undefined ? `hsl(var(${name}))` : `hsl(var(${name}) / ${alpha})`;

/** Fade-and-rise for anything that arrives on stage. */
export const rise = (p: number, dy = 26): Style => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dy}px)`,
});

export interface Clock {
  /** The step the speaker is on. */
  step: number;
  /** Seconds since that step began (DONE once reached by stepping back). */
  t: number;
  /** Seconds since the page loaded — ambient motion only. */
  g: number;
  /** Local time for step `n`: -1 before it, DONE after it, `t` during it. */
  at: (n: number) => number;
}

/**
 * The speaker-driven clock. `next` starts the following step from zero;
 * `back` returns to the previous step in its finished state, so stepping back
 * shows the slide as it was left rather than replaying its build.
 */
/** Stable "skip nothing" list, so `go` keeps its identity between renders. */
const NO_SKIP: readonly number[] = [];

export function useDeck(total: number, skip: readonly number[] = NO_SKIP) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [now, setNow] = useState({ t: 0, g: 0 });
  const stepRef = useRef(0);
  const startRef = useRef(0);
  const doneRef = useRef(false);

  const go = useCallback(
    (n: number, done: boolean) => {
      let target = clamp(n, 0, total - 1);
      // A step that isn't part of this version is never landed on: move past
      // it in the direction of travel.
      const dir = n < stepRef.current ? -1 : 1;
      while (skip.includes(target) && target > 0 && target < total - 1) target += dir;
      if (target === stepRef.current && !done) return;
      stepRef.current = target;
      startRef.current = performance.now();
      doneRef.current = done;
      setStep(target);
      setNow((prev) => ({ t: done ? DONE : 0, g: prev.g }));
      // A refresh mid-talk comes back to the same step.
      window.history.replaceState(null, "", `#${target}`);
    },
    [total, skip],
  );

  const next = useCallback(() => go(stepRef.current + 1, false), [go]);
  const back = useCallback(() => go(stepRef.current - 1, true), [go]);

  useEffect(() => {
    const fromHash = Number.parseInt(window.location.hash.slice(1), 10);
    if (Number.isFinite(fromHash) && fromHash > 0) go(fromHash, true);
  }, [go]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const tick = (ts: number) => {
      setNow({
        t: doneRef.current ? DONE : Math.max(0, (ts - startRef.current) / 1000),
        g: ts / 1000,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Reduced-motion viewers get each step's finished state, with no builds.
  const t = reduced ? DONE : now.t;
  const g = reduced ? 0 : now.g;
  const clock: Clock = {
    step,
    t,
    g,
    at: (n) => (step > n ? DONE : step === n ? t : -1),
  };

  return { clock, next, back, go };
}

/**
 * Fits the 1920x1080 stage inside the window, whatever its shape, and centers
 * it. Hidden until measured so the first frame never paints an unscaled stage.
 */
export function Stage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const measure = () =>
      setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: W,
        height: H,
        marginLeft: -W / 2,
        marginTop: -H / 2,
        transform: `scale(${scale})`,
        visibility: scale ? "visible" : "hidden",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

/** A full-stage layer carrying its own light or dark theme scope. */
export function Layer({
  theme,
  opacity,
  children,
}: {
  theme: "dark" | "light";
  opacity: number;
  children: ReactNode;
}) {
  if (opacity <= 0) return null;
  return (
    <div
      className={theme}
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        color: token("--text-primary"),
        fontFamily: SANS,
      }}
    >
      {children}
    </div>
  );
}

/** Absolutely placed box, in stage coordinates. */
export function Abs({
  x,
  y,
  w,
  h,
  style,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  style?: Style;
  children?: ReactNode;
}) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  );
}
