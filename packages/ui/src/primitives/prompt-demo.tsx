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

interface PromptDemoProps extends Omit<React.ComponentProps<"div">, "children"> {
  items: PromptDemoItem[];
  /** Optional node shown beside the reply — e.g. a brand avatar. */
  avatar?: React.ReactNode;
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

  React.useEffect(() => {
    if (!blink) {
      setOn(true);
      return;
    }
    const id = setInterval(() => setOn((v) => !v), CARET_BLINK_MS);
    return () => clearInterval(id);
  }, [blink]);

  return (
    <span
      aria-hidden
      className={cn(
        "ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-brand align-middle transition-opacity",
        on ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

function PromptDemo({ items, avatar, className, ...props }: PromptDemoProps) {
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = React.useState(items[0]?.id);
  const active = items.find((item) => item.id === activeId) ?? items[0];
  const prompt = active?.prompt ?? "";

  const [typed, setTyped] = React.useState("");
  const [answered, setAnswered] = React.useState(false);

  // Type the active prompt out, then reveal the answer. Re-runs on every tab
  // switch; reduced-motion users get the finished state immediately.
  React.useEffect(() => {
    if (!prompt) return;
    if (reduced) {
      setTyped(prompt);
      setAnswered(true);
      return;
    }
    setTyped("");
    setAnswered(false);
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
        "rounded-2xl border border-[hsl(var(--bg-surface)/0.55)] bg-surface/30 shadow-xl backdrop-blur-xl backdrop-saturate-150",
        className,
      )}
      {...props}
    >
      {/* Persona tabs — the active one carries the brand accent */}
      <div className="flex gap-1.5 p-2.5">
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
                on
                  ? "border-brand bg-brand text-brand-fg"
                  : "border-[hsl(var(--bg-surface)/0.6)] bg-surface/40 text-secondary hover:bg-surface/70",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="px-4 pb-5 pt-1">
        {/* The plain-language request, typed out live */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[hsl(var(--bg-surface)/0.6)] bg-surface/50 px-4 py-4">
          <p className="min-w-0 text-base font-medium text-primary">
            {typed}
            <Caret blink={!reduced} />
          </p>
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-fg"
          >
            <ArrowUp className="size-4" />
          </span>
        </div>

        {/* The answer — fades in once the prompt finishes typing */}
        <div
          className={cn(
            "mt-4 flex items-start gap-3 transition-all duration-[var(--duration-slow)] ease-[var(--ease-standard)] motion-reduce:transition-none",
            answered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          {avatar ? <div className="shrink-0">{avatar}</div> : null}
          <p className="text-sm leading-relaxed text-secondary">
            {active.reply}
          </p>
        </div>
      </div>
    </div>
  );
}

export { PromptDemo };
