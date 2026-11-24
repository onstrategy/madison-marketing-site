import { useEffect } from "react";
import { cn } from "@madison/ui/utils";
import { Layer, Stage, prog, useDeck, type Clock } from "./engine";
import { Bar, Close, Easy, Peers, SignOff } from "./scenes-close";
import { Morning, OneMemory, Review } from "./scenes-day";
import {
  Given,
  Hold,
  MemoryWakes,
  Nine47,
  NightClock,
  SlowMotion,
  Stranger,
} from "./scenes-night";
import { S, TOTAL } from "./steps";

// ============================================================================
// The life of a decision — the visual for the GovAI Coalition lightning talk.
//
// A speaker-driven deck, not a video: every click plays one beat and then
// holds, so the screen follows the talk instead of racing it. It runs full
// screen in any browser and is advanced with a clicker, the keyboard, or a
// tap. The scenes follow the storyboard one for one; see ./steps.ts for the
// click list and ./engine.tsx for how the clock works.
// ============================================================================

/**
 * A scene's opacity. It fades in over the first moments of its first step and
 * fades out as the next scene's first step begins, so scenes cross-dissolve
 * rather than cut. Stepping back lands on a finished scene with no dissolve.
 */
const fade = (c: Clock, first: number, last: number) => {
  if (c.step < first || c.step > last + 1) return 0;
  if (c.step === last + 1) return 1 - prog(0, 0.45, c.t);
  return prog(0, 0.6, c.at(first));
};

/** Clicker, keyboard and tap control. */
function useControls({
  next,
  back,
  go,
}: {
  next: () => void;
  back: () => void;
  go: (n: number, done: boolean) => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      switch (event.key) {
        // Clickers send Page Down / Page Up or the arrow keys.
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
        case "Enter":
          event.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "Backspace":
          event.preventDefault();
          back();
          break;
        case "Home":
          event.preventDefault();
          go(0, true);
          break;
        case "End":
          event.preventDefault();
          go(TOTAL - 1, true);
          break;
        case "f":
        case "F":
          if (document.fullscreenElement) void document.exitFullscreen();
          else void document.documentElement.requestFullscreen();
          break;
        default:
      }
    };
    // A click or tap advances; the left edge of the screen steps back.
    const onPointer = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (event.clientX < window.innerWidth * 0.12) back();
      else next();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerup", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerup", onPointer);
    };
  }, [next, back, go]);
}

export default function LifeOfADecisionPrototype() {
  const { clock: c, next, back, go } = useDeck(TOTAL);
  useControls({ next, back, go });

  // Navy for the night at the dais, paper for the next morning.
  const morning = c.step >= S.morning && c.step <= S.transparent;

  return (
    <div
      className={cn(
        "fixed inset-0 cursor-none select-none overflow-hidden bg-app",
        morning ? "light" : "dark",
      )}
      style={{ transition: "background-color 1.1s ease" }}
    >
      <h1 className="sr-only">The life of a decision</h1>
      <Stage>
        <Layer theme="dark" opacity={fade(c, S.hold, S.hold)}>
          <Hold c={c} />
        </Layer>
        <Layer theme="dark" opacity={fade(c, S.given, S.given)}>
          <Given c={c} />
        </Layer>
        <Layer theme="dark" opacity={fade(c, S.nine47, S.promise)}>
          <NightClock c={c} />
        </Layer>
        <Layer theme="dark" opacity={fade(c, S.nine47, S.isThatTrue)}>
          <Nine47 c={c} />
        </Layer>
        <Layer theme="dark" opacity={fade(c, S.stranger, S.getBack)}>
          <Stranger c={c} />
        </Layer>
        <Layer theme="dark" opacity={fade(c, S.minutes, S.answer)}>
          <MemoryWakes c={c} />
        </Layer>
        <Layer theme="dark" opacity={fade(c, S.decision, S.promise)}>
          <SlowMotion c={c} />
        </Layer>
        <Layer theme="light" opacity={fade(c, S.morning, S.morning)}>
          <Morning c={c} />
        </Layer>
        <Layer theme="light" opacity={fade(c, S.review, S.signed)}>
          <Review c={c} />
        </Layer>
        <Layer theme="light" opacity={fade(c, S.seats, S.transparent)}>
          <OneMemory c={c} />
        </Layer>
        <Layer theme="dark" opacity={fade(c, S.bar, S.bar)}>
          <Bar c={c} />
        </Layer>
        <Layer theme="dark" opacity={fade(c, S.peers, S.peers)}>
          <Peers c={c} />
        </Layer>
        <Layer theme="dark" opacity={fade(c, S.easy, S.easy)}>
          <Easy c={c} />
        </Layer>
        <Layer theme="dark" opacity={fade(c, S.beats, S.people)}>
          <Close c={c} />
        </Layer>
        <Layer theme="dark" opacity={fade(c, S.signOff, S.signOff)}>
          <SignOff c={c} />
        </Layer>
      </Stage>
    </div>
  );
}
