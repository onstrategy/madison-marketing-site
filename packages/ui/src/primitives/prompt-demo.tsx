import * as React from "react";
import { ArrowUp } from "lucide-react";

import { cn } from "../ui/utils";

// PromptDemo — a frosted-glass "assistant" demo card. Each persona tab, when
// selected, types its prompt out character-by-character (with a blinking caret),
// then reveals the answer. Fully self-contained: the typing, the caret blink, and
// reduced-motion handling live here, so it works anywhere with no extra CSS.
//
//   <PromptDemo items={ITEMS} avatar={<Brand />} />
//
// `items` is the data (persona label + prompt + reply); `avatar` is an optional
// node shown beside the answer.

const TYPING_MS = 26; // per typed character
const LEAD_IN_MS = 280; // pause before typing starts
const ANSWER_DELAY_MS = 240; // pause after typing, before the answer reveals
const CARET_BLINK_MS = 530;

export interface PromptDemoItem {
  id: string;
  /** Tab label. */
  label: string;
  /** The text that types itself out in the prompt row. */
  prompt: string;
  /** The answer revealed once typing finishes. */
  reply: string;
}

interface PromptDemoProps extends Omit<React.ComponentProps<"div">, "children" | "title"> {
  items: PromptDemoItem[];
  /** Optional node shown beside the reply — e.g. a brand avatar. */
  avatar?: React.ReactNode;
  /** Optional proof-point banner rendered above the persona tabs, inside the card. */
  title?: React.ReactNode;
}

/** Synchronously-initialized reduced-motion preference (kept local so the primitive is self-contained). */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** A blinking text caret. Isolated so its interval doesn't re-render the whole card. */
function Caret({ blink }: { blink: boolean }) {
  const [on, setOn] = React.useState(true);

  // The blink interval is the only external system here. When `blink` is false
  // the caret is forced solid during render (below), so there's no state to sync.
  React.useEffect(() => {
    if (!blink) return;
    const id = setInterval(() => setOn((v) => !v), CARET_BLINK_MS);
    return () => clearInterval(id);
  }, [blink]);

  return (
    <span
      aria-hidden
      className={cn(
        "ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-brand align-middle transition-opacity",
        on || !blink ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

function PromptDemo({ items, avatar, title, className, ...props }: PromptDemoProps) {
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = React.useState(items[0]?.id);
  const active = items.find((item) => item.id === activeId) ?? items[0];
  const prompt = active?.prompt ?? "";
  // The tallest of every item's prompt, not just the active one — reserves
  // room for whichever tab (and however many wrapped lines its full text
  // needs) could ever be shown, so switching tabs never resizes the box either.
  const longestPrompt = React.useMemo(
    () => items.reduce((longest, item) => (item.prompt.length > longest.length ? item.prompt : longest), ""),
    [items],
  );

  const [typed, setTyped] = React.useState(reduced ? prompt : "");
  const [answered, setAnswered] = React.useState(reduced);

  // Reset the animation when the active prompt (or motion preference) changes.
  // Adjusted during render via a prev-value comparison — not synced through an
  // effect, which would flash the previous prompt's text for one frame.
  const animKey = `${prompt}|${reduced}`;
  const [prevAnimKey, setPrevAnimKey] = React.useState(animKey);
  if (prevAnimKey !== animKey) {
    setPrevAnimKey(animKey);
    setTyped(reduced ? prompt : "");
    setAnswered(reduced);
  }

  // Drive the typing timers, then reveal the answer. Reduced-motion users get the
  // finished state from the reset above, so this effect no-ops for them.
  React.useEffect(() => {
    if (reduced || !prompt) return;
    let i = 0;
    let typeTimer: ReturnType<typeof setTimeout> | undefined;
    let answerTimer: ReturnType<typeof setTimeout> | undefined;
    const step = () => {
      i += 1;
      setTyped(prompt.slice(0, i));
      if (i < prompt.length) {
        typeTimer = setTimeout(step, TYPING_MS);
      } else {
        answerTimer = setTimeout(() => setAnswered(true), ANSWER_DELAY_MS);
      }
    };
    typeTimer = setTimeout(step, LEAD_IN_MS);
    return () => {
      clearTimeout(typeTimer);
      clearTimeout(answerTimer);
    };
  }, [prompt, reduced]);

  if (!active) return null;

  return (
    <div
      className={cn(
        // --brand-shade: a dark SHADE of Neon Blue — a fixed hex in both
        // themes, reads distinctly blue (bluer than --brand-shade-deep,
        // which trends toward near-black navy). Higher opacity (75%) so the
        // card reads darker/more solid, while staying just short of opaque.
        "rounded-2xl border border-[hsl(var(--brand-shade)/0.7)] bg-brand-shade/75 shadow-xl backdrop-blur-xl backdrop-saturate-150",
        className,
      )}
      {...props}
    >
      {title ? (
        <p className="border-b border-[hsl(var(--brand-shade)/0.55)] px-4 pb-4 pt-5 text-center font-serif text-xl font-medium tracking-tight text-brand-fg">
          {title}
        </p>
      ) : null}
      {/* Persona tabs — the active one carries the brand accent. Stacked
          below sm: 3 equal-width flex-1 tabs on a phone squeeze a
          multi-word label ("For Public Records Requests") into a sliver
          each tab can't fit on one line, wrapping unevenly against its
          single-line siblings. Full-width stacked rows give every label the
          same room regardless of length. */}
      <div className="flex flex-col gap-1.5 px-4 py-2.5 sm:flex-row">
        {items.map((item) => {
          const on = item.id === active.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              aria-pressed={on}
              className={cn(
                "flex-1 rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors",
                // Selected tab: a transparent light-blue glass — brand-subtle
                // is Madison's pale-cyan token; `light` punches back out of
                // the card's dark scope so it resolves to its light-theme
                // value (dark mode's brand-subtle is a dark navy, the
                // opposite of what we want here). Low opacity keeps it
                // genuinely see-through rather than a solid pale chip.
                // text-brand-fg (white, fixed in both themes) for the label.
                // Inactive tabs: outline only, no fill — the outline is the
                // label's own color (text-secondary) at 50% opacity, so the
                // border always matches the text instead of an unrelated
                // neutral token.
                on
                  ? "light border-[hsl(var(--brand-subtle)/0.7)] bg-brand-subtle/40 text-brand-fg shadow-sm backdrop-blur-md"
                  : "border-[hsl(var(--text-secondary)/0.3)] bg-transparent text-secondary hover:bg-surface/20",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="px-4 pb-5 pt-1">
        {/* The plain-language request, typed out live. `light` punches this
            one box back out of the card's Dark Navy scope — it reads as a
            genuinely light input against the dark glass, rather than just a
            lighter shade of the same dark tone. */}
        <div className="light flex items-center justify-between gap-3 rounded-2xl border border-[hsl(var(--bg-surface)/0.6)] bg-surface px-4 py-4">
          {/* Grid-stacked ghost: the invisible copy of the longest prompt
              claims the row's final width/height (including however many
              lines it wraps to) on first render, and the two layers share
              that one reserved box — so the visible layer can grow from 0
              characters to a full sentence without ever resizing the card,
              the hero above it, or anything the hero pushes down. */}
          <div className="grid min-w-0">
            <p aria-hidden="true" className="invisible col-start-1 row-start-1 text-base font-medium">
              {longestPrompt}
            </p>
            <p className="col-start-1 row-start-1 text-base font-medium text-primary">
              {typed}
              <Caret blink={!reduced} />
            </p>
          </div>
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-fg"
          >
            <ArrowUp className="size-4" />
          </span>
        </div>

        {/* The answer — fades in once the prompt finishes typing. text-primary
            (not text-secondary) so it reads as white against the card's dark
            scope — the reply is the payoff, not a muted caption. */}
        <div
          className={cn(
            "mt-4 flex items-start gap-3 transition-all duration-[var(--duration-slow)] ease-[var(--ease-standard)] motion-reduce:transition-none",
            answered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          {avatar ? <div className="shrink-0">{avatar}</div> : null}
          <p className="text-sm leading-relaxed text-primary">
            {active.reply}
          </p>
        </div>
      </div>
    </div>
  );
}

export { PromptDemo };
