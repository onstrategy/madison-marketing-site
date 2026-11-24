import type { ReactNode } from "react";
import { ScanLine, Tag } from "lucide-react";
import {
  Abs,
  DONE,
  H,
  SERIF,
  W,
  clamp,
  ease,
  ep,
  lerp,
  prog,
  rise,
  token,
  Typed,
  type Clock,
} from "./engine";
import {
  AppWindow,
  Bubble,
  Headline,
  InfoCard,
  LockBadge,
  Speaker,
  SourcePill,
  TextBars,
} from "./parts";
import { S } from "./steps";
import { Wisp, fracAt, glide, makePath, type Pt } from "./wisp";

// ============================================================================
// The night scenes: the holding slide, then scenes 1 to 5 of the storyboard.
// 9:47 p.m. at the dais — the question, the smart stranger, the memory waking
// and the life of the decision in slow motion.
// ============================================================================

const QUESTION = "Did we fix the Elm Street drainage?";

/** A full-stage SVG for thin connecting lines. */
function Lines({ children }: { children: ReactNode }) {
  return (
    <svg
      width={W}
      height={H}
      fill="none"
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
    >
      {children}
    </svg>
  );
}

/** A thin blue line that draws itself from its source to what it supports. */
function Trace({ d, p, opacity = 0.75 }: { d: string; p: number; opacity?: number }) {
  if (p <= 0) return null;
  return (
    <path
      d={d}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
      stroke={token("--brand-accent")}
      strokeWidth={2.5}
      strokeLinecap="round"
      opacity={opacity}
    />
  );
}

// ── 1 · Yes, and ────────────────────────────────────────────────────────────

/** One assistant window, small: the "assistant on every desk". */
export function MiniWindow({
  x,
  y,
  w = 216,
  h = 150,
  p,
  g,
  seed,
  memory = false,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  /** Arrival progress, 0..1. */
  p: number;
  g: number;
  seed: number;
  /** With the city's memory behind it: its reply carries a source. */
  memory?: boolean;
}) {
  const cycle = (g * 0.2 + seed) % 1;
  const one = clamp(cycle * 3, 0, 1);
  const two = clamp(cycle * 3 - 1, 0, 1);
  const blink = Math.floor(g * 1.8 + seed * 7) % 2 === 0;
  const bar = { height: 10, borderRadius: 5, background: token("--text-muted", 0.5) };
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: 14,
        border: `2px solid ${token("--border-active")}`,
        background: token("--bg-panel"),
        padding: "12px 14px",
        ...rise(p, 14),
      }}
    >
      <div style={{ display: "flex", gap: 6, alignItems: "center", height: 12 }}>
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: token("--border-active"),
            }}
          />
        ))}
        {memory ? (
          <span
            style={{
              marginLeft: "auto",
              width: w * 0.32,
              height: 10,
              borderRadius: 5,
              background: token("--brand-accent"),
            }}
          />
        ) : null}
      </div>
      <div style={{ ...bar, marginTop: h * 0.15, width: `${one * 78}%` }} />
      <div style={{ ...bar, marginTop: 12, width: `${two * 52}%` }} />
      {memory ? (
        <div
          style={{
            marginTop: 12,
            width: 18,
            height: 18,
            borderRadius: "50%",
            boxSizing: "border-box",
            border: `2px solid ${token("--brand-accent")}`,
            background: token("--brand-accent", 0.2),
          }}
        />
      ) : (
        <div
          style={{
            marginTop: 12,
            width: 3,
            height: 18,
            background: token("--brand-accent"),
            opacity: blink ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}

const DESK_COLS = [0, 1, 2, 3, 4, 5, 6];
const DESK_ROWS = [0, 1, 2];

export function Given({ c }: { c: Clock }) {
  const a = c.at(S.given);
  return (
    <>
      <Abs x={120} y={110} w={1700} style={rise(ep(0.45, 0.7, a))}>
        <Headline size={96}>AI assisting our work is a given.</Headline>
      </Abs>
      {DESK_ROWS.map((row) =>
        DESK_COLS.map((col) => (
          <MiniWindow
            key={`${row}-${col}`}
            x={108 + col * 248}
            y={430 + row * 195}
            p={ep(1.0 + col * 0.07 + row * 0.16, 0.5, a)}
            g={c.g}
            seed={(col * 0.37 + row * 0.61) % 1}
          />
        )),
      )}
      <Abs
        x={120}
        y={254}
        style={{ fontSize: 42, color: token("--text-secondary"), ...rise(ep(2.6, 0.6, a)) }}
      >
        The future: an assistant on every desk.
      </Abs>
    </>
  );
}

// ── The time cards ──────────────────────────────────────────────────────────

/**
 * The time of day, alone in the middle of the screen. It sets the scene for
 * one click and is gone on the next; it never follows the story around.
 */
export function TimeCard({ c, step, time }: { c: Clock; step: number; time: string }) {
  const a = c.at(step);
  return (
    <Abs x={0} y={0} w={W} h={H} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Headline
        size={300}
        style={{
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
          fontVariantNumeric: "lining-nums",
          ...rise(ep(0.2, 0.9, a), 24),
        }}
      >
        {time}
      </Headline>
    </Abs>
  );
}

// ── 2 · 9:47 p.m. ───────────────────────────────────────────────────────────

const PROMISE_LINES = [
  "Two years ago you promised to fix",
  "the flooding on Elm Street.",
  "Nothing has happened.",
];

/** Each word with its place in the whole quote, for a word-by-word build. */
const PROMISE_WORDS = PROMISE_LINES.map((line, li) => {
  const before = PROMISE_LINES.slice(0, li).reduce((n, l) => n + l.split(" ").length, 0);
  return { line, li, words: line.split(" ").map((word, wi) => ({ word, i: before + wi })) };
});

/** The council's "typing…" bubble: three dots rising and falling in turn. */
function Thinking({ g, opacity }: { g: number; opacity: number }) {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 16,
        padding: "30px 38px",
        borderRadius: 40,
        background: token("--bg-hover"),
        opacity,
      }}
    >
      {[0, 1, 2].map((i) => {
        const wave = Math.max(0, Math.sin(g * 5 - i * 0.9));
        return (
          <span
            key={i}
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: token("--text-primary"),
              opacity: 0.35 + 0.65 * wave,
              transform: `translateY(${-10 * wave}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * The exchange at the dais, laid out like a chat: the resident's words on the
 * left, the council on the right. On the first visit the council is still
 * thinking; when we come back after the assistant and the bots have failed,
 * the thinking turns into the only reply it has.
 */
function DaisChat({
  resident,
  council,
  reply,
  g,
}: {
  resident: number;
  council: number;
  reply: number;
  g: number;
}) {
  // The last sentence lands a beat after the promise.
  const wordAt = (i: number, li: number) => 3.1 + i * 0.16 + (li === 2 ? 0.5 : 0);
  // On the reply click the dots hold for a moment, then become the answer.
  const answered = ep(1.0, 0.6, reply);
  return (
    <>
      <Abs x={120} y={150} style={rise(ep(2.9, 0.5, resident), 14)}>
        <Speaker who="resident" size={48} />
      </Abs>
      <Abs x={120} y={236} w={1560}>
        <Headline size={76} style={{ lineHeight: 1.16 }}>
          {PROMISE_WORDS.map(({ line, li, words }) => (
            <div key={line}>
              {words.map(({ word, i }) => (
                <span key={`${i}-${word}`} style={{ opacity: prog(wordAt(i, li), 0.5, resident) }}>
                  {word}{" "}
                </span>
              ))}
            </div>
          ))}
        </Headline>
      </Abs>

      <Abs
        x={0}
        y={600}
        w={1800}
        style={{ display: "flex", justifyContent: "flex-end", ...rise(ep(0.2, 0.5, council), 14) }}
      >
        <Speaker who="council" size={48} />
      </Abs>
      <Abs
        x={0}
        y={690}
        w={1800}
        style={{ display: "flex", justifyContent: "flex-end", ...rise(ep(0.5, 0.5, council), 10) }}
      >
        <Thinking g={g} opacity={1 - answered} />
      </Abs>
      {reply >= 0 ? (
        <Abs x={0} y={680} w={1806} style={{ textAlign: "right", ...rise(answered, 16) }}>
          <Headline size={110}>“We’ll get back to you.”</Headline>
        </Abs>
      ) : null}
    </>
  );
}

export function Nine47({ c }: { c: Clock }) {
  // The resident's words were timed to follow the old on-screen clock; the
  // time now has its own click, so they start straight away.
  const r = c.at(S.nine47);
  return (
    <DaisChat resident={r < 0 ? -1 : r + 2.6} council={c.at(S.isThatTrue)} reply={-1} g={c.g} />
  );
}

/**
 * Back at the dais after the assistant and the bots have failed: the same
 * exchange, and the council's thinking turns into "We'll get back to you."
 */
export function GetBack({ c }: { c: Clock }) {
  return <DaisChat resident={DONE} council={DONE} reply={c.at(S.getBack)} g={c.g} />;
}

// ── 3 · The smart stranger ──────────────────────────────────────────────────

const GENERIC_ANSWER = "Drainage repairs are usually scheduled in a capital improvement plan.";

/**
 * The systems the bots reach on the second click, laid out on their own, and
 * what each one actually hands back: a file name, a scan nobody can read, or
 * nothing at all.
 */
const SOURCES: {
  system: string;
  gets: ReactNode;
  note: string;
  kind: "label" | "scan" | "locked";
}[] = [
  { system: "Minutes", gets: <>2019-03-12<br />minutes.pdf</>, note: "File name only", kind: "label" },
  { system: "Staff reports", gets: <>Staff report<br />Sept 2019</>, note: "File name only", kind: "label" },
  { system: "Permits", gets: <>Permits export<br />2021</>, note: "File name only", kind: "label" },
  { system: "Contracts", gets: null, note: "Scanned. Can’t be read", kind: "scan" },
  { system: "Budget", gets: "No access", note: "Walled off", kind: "locked" },
];
const SOURCE_W = 330;
const SOURCE_GAP = 30;
const SOURCE_TOP = 150;
const SOURCE_H = 200;
const sourceX = (i: number) => 75 + i * (SOURCE_W + SOURCE_GAP);

/** Three askings of the same question, three different replies. */
const DISAGREE = [
  { ask: "First ask", answer: "Funded in 2020.", from: [0, 1] },
  { ask: "Second ask", answer: "Funded in 2021.", from: [2, 3] },
  { ask: "Third ask", answer: "No record found.", from: [4] },
];
const ANSWER_W = 460;
const ANSWER_TOP = 560;
const answerX = (i: number) => 200 + i * (ANSWER_W + 70);

export function Stranger({ c }: { c: Clock }) {
  const a = c.at(S.stranger);
  const b = c.at(S.connectors);
  const d = c.at(S.getBack);
  const dim = 1 - 0.72 * prog(0, 0.6, d);
  // The first half clears completely before the sources come in.
  const first = 1 - prog(0, 0.5, b);
  const source = (i: number) => ep(0.6 + i * 0.15, 0.55, b);
  const lineAt = (i: number) => 1.7 + i * 0.6;
  const answer = (i: number) => ep(lineAt(i) + 0.6, 0.5, b);

  return (
    <>
      {/* First click: the council asks, the assistant answers with confidence
          and nothing behind it. Same chat layout as the slide before. */}
      {first > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: first }}>
          <AppWindow
            style={{ left: 460, top: 110, width: 1000, height: 560, ...rise(ep(0.2, 0.6, a)) }}
          >
            {/* The council asks… */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
              <Speaker who="council" size={28} style={rise(ep(0.5, 0.4, a), 8)} />
              {a >= 0.6 ? (
                <Bubble from="person" style={rise(ep(0.6, 0.35, a), 8)}>
                  <Typed text={QUESTION} start={0.7} dur={1.3} t={a} />
                </Bubble>
              ) : null}
            </div>
            {/* …and the assistant answers. */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 12,
                marginTop: 34,
              }}
            >
              <Speaker who="assistant" size={28} style={rise(ep(2.3, 0.4, a), 8)} />
              {a >= 2.5 ? (
                <Bubble from="assistant" style={rise(ep(2.5, 0.35, a), 8)}>
                  <Typed text={GENERIC_ANSWER} start={2.6} dur={1.6} t={a} />
                </Bubble>
              ) : null}
            </div>
          </AppWindow>

          <Abs x={0} y={712} w={W} style={{ textAlign: "center" }}>
            <div style={rise(ep(4.4, 0.8, a), 24)}>
              <Headline size={84} style={{ lineHeight: 1.12 }}>
                A smart stranger
                <br />
                with no memory of Elm Street.
              </Headline>
            </div>
            <div
              style={{
                marginTop: 26,
                fontFamily: SERIF,
                fontSize: 52,
                color: token("--text-secondary"),
                ...rise(ep(5.4, 0.8, a), 16),
              }}
            >
              Total confidence. No sources.
            </div>
          </Abs>
        </div>
      ) : null}

      {/* Second click: the systems as the bots see them, feeding three replies. */}
      {b >= 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: dim }}>
          {SOURCES.map(({ system, gets, note, kind }, i) => (
            <InfoCard
              key={system}
              kicker={system}
              icon={
                kind === "locked" ? (
                  <LockBadge size={24} />
                ) : kind === "scan" ? (
                  <ScanLine size={24} />
                ) : (
                  <Tag size={22} />
                )
              }
              style={{
                left: sourceX(i),
                top: SOURCE_TOP,
                width: SOURCE_W,
                height: SOURCE_H,
                ...rise(source(i)),
              }}
            >
              {kind === "scan" ? (
                <TextBars rows={[0.92, 0.7]} gap={16} height={12} blur={4} style={{ margin: "14px 0 24px" }} />
              ) : (
                gets
              )}
              <div style={{ marginTop: 6, fontSize: 24, fontWeight: 400, color: token("--text-muted") }}>
                {note}
              </div>
            </InfoCard>
          ))}

          <Lines>
            {DISAGREE.map(({ answer: reply, from }, i) =>
              from.map((s) => {
                const x0 = sourceX(s) + SOURCE_W / 2;
                const y0 = SOURCE_TOP + SOURCE_H;
                const x1 = answerX(i) + ANSWER_W / 2;
                const y1 = ANSWER_TOP;
                const p = ep(lineAt(i), 0.7, b);
                if (p <= 0) return null;
                return (
                  <path
                    key={`${reply}-${s}`}
                    d={`M ${x0} ${y0} C ${x0} ${y0 + 110}, ${x1} ${y1 - 110}, ${x1} ${y1}`}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - p}
                    stroke={token("--border-active")}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                );
              }),
            )}
          </Lines>

          {/* Ask three times, get three answers: replies to the same question. */}
          {DISAGREE.map(({ ask, answer: reply }, i) => (
            <Abs
              key={ask}
              x={answerX(i)}
              y={ANSWER_TOP}
              w={ANSWER_W}
              style={{
                boxSizing: "border-box",
                padding: "18px 28px 22px",
                borderRadius: 20,
                background: token("--bg-hover"),
                ...rise(answer(i)),
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 600, color: token("--text-muted") }}>
                {ask}
              </div>
              <div style={{ marginTop: 4, fontSize: 42, fontWeight: 500 }}>{reply}</div>
            </Abs>
          ))}
        </div>
      ) : null}

      <Abs
        x={0}
        y={800}
        w={W}
        style={{ textAlign: "center", opacity: 1 - prog(0, 0.4, d) }}
      >
        <div style={rise(ep(4.3, 0.8, b), 24)}>
          <Headline size={96}>Ask three times. Get three answers.</Headline>
        </div>
      </Abs>

    </>
  );
}

// ── The switch ──────────────────────────────────────────────────────────────

/**
 * A beat of its own between the two halves of the story: the screen clears,
 * a single switch appears, and it flips on. Same question, same assistant;
 * the only thing that changes is the city's memory behind it.
 */
/** Where the switch's knob rests once it is on; the wisp starts from here. */
export const KNOB_ON: Pt = [1030, 400];

export function MemoryOn({ c }: { c: Clock }) {
  const a = c.at(S.memoryOn);
  // The next click: the switch melts away and its knob becomes the wisp.
  const m = c.at(S.minutes);
  const melt = ease(prog(0, 0.7, m));
  const on = ease(prog(1.6, 0.6, a));
  const glow = on * (0.85 + 0.15 * Math.sin(c.g * 2.2)) * (1 - melt);
  const TRACK_W = 300;
  const TRACK_H = 160;
  const KNOB = 124;
  const BORDER = 4;
  const inset = (TRACK_H - KNOB) / 2 - BORDER;
  const trackX = W / 2 - TRACK_W / 2;
  const trackY = 400 - TRACK_H / 2;
  const arrive = rise(ep(0.2, 0.7, a), 20);
  // The knob's centre, sliding from off to on.
  const knobX = trackX + BORDER + inset + KNOB / 2 + on * (TRACK_W - KNOB - 2 * inset - 2 * BORDER);
  const knobY = KNOB_ON[1];
  const size = lerp(KNOB, 36, melt);

  return (
    <>
      {/* A soft blue bloom behind the switch once it is on. */}
      <div
        style={{
          position: "absolute",
          left: W / 2 - 520,
          top: 400 - 520,
          width: 1040,
          height: 1040,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${token("--brand-accent", 0.22)} 0%, ${token("--brand-accent", 0)} 62%)`,
          opacity: glow,
        }}
      />

      <Abs x={0} y={0} w={W} h={0} style={arrive}>
        <Abs
          x={trackX}
          y={trackY}
          w={TRACK_W}
          h={TRACK_H}
          style={{
            boxSizing: "border-box",
            borderRadius: TRACK_H / 2,
            border: `${BORDER}px solid ${on > 0.5 ? token("--brand-accent") : token("--border-active")}`,
            background: on > 0 ? token("--brand-primary", on) : token("--bg-hover"),
            boxShadow: `0 0 ${80 * glow}px ${token("--brand-accent", 0.5 * glow)}`,
            transition: "border-color .3s",
            opacity: 1 - prog(0, 0.45, m),
            transform: `scale(${1 - 0.15 * melt})`,
          }}
        />
        {/* The knob: white when on, then it shrinks to the wisp's own blue orb. */}
        <div
          style={{
            position: "absolute",
            left: knobX - size / 2,
            top: knobY - size / 2,
            width: size,
            height: size,
            borderRadius: "50%",
            background:
              melt > 0.35
                ? token("--brand-accent")
                : on > 0.5
                  ? token("--brand-foreground")
                  : token("--text-muted"),
            boxShadow:
              melt > 0
                ? `0 0 ${40 * melt}px ${token("--brand-accent", 0.7)}`
                : "var(--elevation-lg)",
            transition: "background .3s",
            opacity: 1 - prog(0.7, 0.15, m),
          }}
        />
      </Abs>

      {/* One line only, arriving as the switch flips on. */}
      <Abs
        x={0}
        y={560}
        w={W}
        style={{
          textAlign: "center",
          ...rise(ep(1.6, 0.7, a), 16),
          opacity: ep(1.6, 0.7, a) * (1 - prog(0, 0.35, m)),
        }}
      >
        <Headline size={96}>Turn on the city’s memory.</Headline>
      </Abs>
    </>
  );
}

// ── 4 · The memory wakes ────────────────────────────────────────────────────

/** Stage y of the three passages the wisp lifts out of the minutes. */
const PASSAGE_Y = [377, 569, 761];

/** What the wisp lifts out of the minutes, one row per passage, into one list. */
const EXTRACTED = [
  { label: "Item", value: "7B · Elm Street drainage" },
  { label: "Motion", value: "Direct staff to design and fund the repair" },
  { label: "Vote", value: "Passed 5 to 0" },
];
const EXTRACT_TOP = 250;
const EXTRACT_H = 480;
/** Row offsets inside the list card. */
const EXTRACT_ROW_Y = [28, 140, 290];

const INTO_MINUTES = makePath([
  KNOB_ON,
  [960, 330],
  [820, 282],
  [650, 362],
  [430, 470],
  [190, 558],
  [330, 680],
  [560, 752],
  [690, 860],
  [760, 950],
]);
const PASSAGE_AT = [
  fracAt(INTO_MINUTES, [650, 370]),
  fracAt(INTO_MINUTES, [190, 562]),
  fracAt(INTO_MINUTES, [560, 755]),
];

/**
 * From the foot of the minutes, the wisp weaves through the body of every
 * other source, bottom to top: across one card, round the end, back across
 * the next, so each one visibly gets read rather than passed by.
 */
const THROUGH_SOURCES = makePath([
  [690, 860],
  [760, 950],
  [930, 1030],
  [1180, 1020],
  [1330, 900],
  [1420, 866],
  [1600, 855],
  [1780, 846],
  [1868, 760],
  [1780, 676],
  [1600, 665],
  [1420, 656],
  [1334, 570],
  [1420, 486],
  [1600, 475],
  [1780, 466],
  [1868, 380],
  [1780, 296],
  [1600, 285],
  [1420, 276],
  [1350, 200],
]);
/** Where the wisp enters each source, top to bottom; it reaches the bottom one first. */
const SOURCE_AT = (
  [
    [1780, 296],
    [1420, 486],
    [1780, 676],
    [1420, 866],
  ] as Pt[]
).map((pt) => fracAt(THROUGH_SOURCES, pt));

const MINUTES_ROWS = Array.from({ length: 21 }, (_, i) => 0.62 + ((i * 37) % 34) / 100);
/** Rows of the minutes page that are the passages (see PASSAGE_Y). */
const PASSAGE_ROWS = [3, 9, 15];

/** Where the cited lines sit inside the answer window (centre of line one), and their spacing. */
const ANSWER_LINE_Y = 548;
const ANSWER_LINE_H = 76;

const ANSWER = [
  { line: "March 2019: council directs the fix. Passed 5 to 0.", source: "Minutes · March 12, 2019" },
  { line: "September 2019: design report returned.", source: "Staff report · Sept 2019" },
  { line: "Funded in the capital budget.", source: "Capital budget" },
  { line: "2021: construction contract awarded.", source: "Contract award · 2021" },
  { line: "No completion notice on file.", source: "Permits · 21-0442" },
];

export function MemoryWakes({ c }: { c: Clock }) {
  const a = c.at(S.minutes);
  const b = c.at(S.sources);
  const d = c.at(S.answer);
  const docs = 1 - prog(0, 0.5, d);

  const headA = glide(prog(0.7, 4.6, a));
  const passage = PASSAGE_AT.map((f) => headA >= f);
  const headB = lerp(0.04, 1, glide(prog(0.7, 5.2, b)));
  const source = SOURCE_AT.map((f) => b >= 0 && headB >= f);
  const fly = (i: number) => {
    const p = ep(0.1 + i * 0.12, 0.6, b);
    return { opacity: p, transform: `translateX(${(1 - p) * 90}px)` };
  };
  const lineAt = (i: number) => 2.2 + i * 1.5;

  return (
    <>

      {docs > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: docs }}>
          {/* The minutes, open as a full page. */}
          <Abs
            x={120}
            y={160}
            w={600}
            h={850}
            style={{
              boxSizing: "border-box",
              borderRadius: 14,
              background: token("--bg-panel"),
              border: `2px solid ${token("--border-active")}`,
              boxShadow: "var(--elevation-2xl)",
              ...rise(ep(0.3, 0.7, a)),
            }}
          >
            <Abs x={34} y={30} style={{ fontSize: 24, color: token("--text-muted") }}>
              Council minutes · March 12, 2019
            </Abs>
            {MINUTES_ROWS.map((width, i) => {
              const hit = PASSAGE_ROWS.indexOf(i);
              const lit = hit >= 0 && passage[hit];
              return (
                <Abs
                  key={`${i}-${width}`}
                  x={34}
                  y={110 + i * 32 + (hit >= 0 ? -6 : 0)}
                  w={hit >= 0 ? 532 : 532 * width}
                  h={hit >= 0 ? 22 : 10}
                  style={{
                    borderRadius: 11,
                    transition: "background .5s, box-shadow .5s",
                    background: lit ? token("--brand-accent") : token("--text-muted", 0.4),
                    boxShadow: lit ? `0 0 30px ${token("--brand-accent", 0.6)}` : "none",
                  }}
                />
              );
            })}
          </Abs>

          {/* One list, filled line by line from the same page, then its source. */}
          <Lines>
            {PASSAGE_Y.map((y, i) => {
              const ry = EXTRACT_TOP + EXTRACT_ROW_Y[i] + 30;
              return (
                <Trace
                  key={y}
                  d={`M 688 ${y} C 760 ${y}, 760 ${ry}, 820 ${ry}`}
                  p={passage[i] ? ep(0, 0.5, a - 0.7 - PASSAGE_AT[i] * 4.6) : 0}
                />
              );
            })}
          </Lines>
          <InfoCard
            lit={passage[0]}
            style={{
              left: 820,
              top: EXTRACT_TOP,
              width: 480,
              height: EXTRACT_H,
              padding: 0,
              opacity: ep(0.4, 0.6, a),
            }}
          >
            {EXTRACTED.map(({ label, value }, i) => (
              <div
                key={label}
                style={{
                  position: "absolute",
                  left: 28,
                  right: 28,
                  top: EXTRACT_ROW_Y[i],
                  opacity: passage[i] ? 1 : 0,
                  transform: `translateX(${passage[i] ? 0 : -16}px)`,
                  transition: "opacity .5s, transform .5s",
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 600, color: token("--brand-accent") }}>{label}</div>
                <div style={{ marginTop: 4 }}>{value}</div>
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                left: 28,
                right: 28,
                bottom: 24,
                paddingTop: 18,
                borderTop: `2px solid ${token("--border-default")}`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 26,
                fontWeight: 500,
                color: token("--text-secondary"),
                opacity: headA >= 0.97 ? 1 : 0,
                transition: "opacity .6s",
              }}
            >
              <SourcePill n={1} size={38} />
              Minutes, March 12, 2019, page 14
            </div>
          </InfoCard>

          {/* The other systems the decision passed through. */}
          <InfoCard kicker="Agendas" lit={source[0]} style={{ left: 1380, top: 210, width: 440, height: 150, ...fly(0) }}>
            Staff report · September 2019
          </InfoCard>
          <InfoCard
            kicker={source[1] ? "Budget · read-only" : "Budget · walled off"}
            icon={<LockBadge size={22} lit={source[1]} />}
            lit={source[1]}
            style={{ left: 1380, top: 400, width: 440, height: 150, ...fly(1) }}
          >
            Elm Street drainage · funded
          </InfoCard>
          <InfoCard
            kicker={source[2] ? "Contracts · now searchable" : "Contracts · scanned"}
            icon={<ScanLine size={22} />}
            lit={source[2]}
            style={{ left: 1380, top: 590, width: 440, height: 150, ...fly(2) }}
          >
            <span style={{ filter: source[2] ? "blur(0px)" : "blur(7px)", transition: "filter .9s" }}>
              Construction award · 2021
            </span>
          </InfoCard>
          <InfoCard kicker="Permits" lit={source[3]} style={{ left: 1380, top: 780, width: 440, height: 150, ...fly(3) }}>
            Permit 21-0442 · Open · Final inspection: none
          </InfoCard>

          <Wisp path={INTO_MINUTES} head={headA} g={c.g} orb={b < 0} />
          {b >= 0 ? <Wisp path={THROUGH_SOURCES} head={headB} g={c.g} /> : null}
        </div>
      ) : null}

      {/* The answer: same assistant, every line tied to where it came from. */}
      {d >= 0 ? (
        <>
          {ANSWER.map(({ source: label }, i) => (
            <Abs
              key={label}
              x={120}
              y={250 + i * 138}
              w={460}
              h={112}
              style={{
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "0 22px",
                borderRadius: 16,
                background: token("--bg-surface"),
                border: `2px solid ${d >= lineAt(i) ? token("--brand-accent") : token("--border-active")}`,
                transition: "border-color .5s",
                fontSize: 28,
                fontWeight: 500,
                lineHeight: 1.2,
                ...rise(ep(0.5 + i * 0.1, 0.5, d)),
              }}
            >
              <SourcePill n={i + 1} dashed={i === 4} />
              {label}
            </Abs>
          ))}
          <Lines>
            {ANSWER.map(({ line }, i) => {
              const y0 = 306 + i * 138;
              const y1 = ANSWER_LINE_Y + i * ANSWER_LINE_H;
              return (
                <Trace
                  key={line}
                  d={`M 580 ${y0} C 670 ${y0}, 660 ${y1}, 748 ${y1}`}
                  p={ep(lineAt(i), 0.7, d)}
                />
              );
            })}
          </Lines>
          {/* The same window and the same question as the smart stranger.
              This time the city's own assistant answers, and shows its work. */}
          <AppWindow
            style={{ left: 720, top: 170, width: 1080, height: 790, ...rise(ep(0.4, 0.6, d)) }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
              <Speaker who="council" size={28} />
              <Bubble from="person">{QUESTION}</Bubble>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, marginTop: 34 }}>
              <Speaker who="city" size={28} style={rise(ep(1.4, 0.4, d), 8)} />
              <div>
              {ANSWER.map(({ line }, i) => (
                <div
                  key={line}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    height: ANSWER_LINE_H,
                    fontSize: 32,
                    ...rise(ep(lineAt(i), 0.6, d), 16),
                  }}
                >
                  <SourcePill n={i + 1} dashed={i === 4} />
                  {line}
                </div>
              ))}
              </div>
            </div>
          </AppWindow>
        </>
      ) : null}
    </>
  );
}

// ── 5 · Slow motion: the life of the decision ───────────────────────────────

const BEATS = ["Every decision.", "Every dollar.", "Every permit.", "Every promise."];

const STOPS = [
  { x: 260, when: "March 2019", what: "Motion and vote, passed 5 to 0" },
  { x: 620, when: "September 2019", what: "Design report" },
  { x: 980, when: "Capital budget", what: "Funded" },
  { x: 1340, when: "2021", what: "Contract awarded" },
  { x: 1700, when: "Permit 21-0442", what: "Open · final inspection" },
];
const LINE_Y = 736;
/** The frame drawn around all five stops on "Every promise." */
const FRAME = { x: 64, y: 694, w: 1830, h: 320 };
/** Where the resident's question returns, above the frame it connects to. */
const QUOTE_Y = 520;

const TIMELINE = makePath([[40, LINE_Y], ...STOPS.map(({ x }): Pt => [x, LINE_Y])]);
const STOP_AT = STOPS.map(({ x }) => fracAt(TIMELINE, [x, LINE_Y]));


export function SlowMotion({ c }: { c: Clock }) {
  const a = c.at(S.decision);
  const b = c.at(S.dollar);
  const d = c.at(S.permit);
  const e = c.at(S.promise);

  // The wisp's place on the timeline: one stretch of travel per click.
  const head =
    d >= 0
      ? lerp(STOP_AT[3], STOP_AT[4], glide(prog(0.2, 1.5, d)))
      : b >= 0
        ? lerp(STOP_AT[0], STOP_AT[3], glide(prog(0.2, 3.0, b)))
        : lerp(0, STOP_AT[0], glide(prog(1.2, 1.5, a)));
  const visited = STOP_AT.map((f) => head >= f - 0.002);
  // Which stops the beat on screen is talking about.
  const focus = e >= 0 ? [0, 1, 2, 3, 4] : d >= 0 ? [4] : b >= 0 ? [2, 3] : [0];
  const beatAt = [ep(2.4, 0.7, a), ep(1.9, 0.7, b), ep(1.3, 0.7, d), ep(0.2, 0.7, e)];
  const cellPulse = d >= 0 ? 0.55 + 0.45 * Math.sin(c.g * 3) : 0;

  return (
    <>

      {/* The four beats, two to a line, each arriving with its click. */}
      {[0, 1].map((row) => (
        <Abs key={row} x={120} y={100 + row * 128}>
          <Headline size={108}>
            {[0, 1].map((col) => {
              const i = row * 2 + col;
              return (
                <span
                  key={BEATS[i]}
                  style={{ display: "inline-block", marginRight: col === 0 ? 34 : 0, ...rise(beatAt[i], 30) }}
                >
                  {BEATS[i]}
                </span>
              );
            })}
          </Headline>
        </Abs>
      ))}

      {/* The timeline: the five stops of the decision, left to right. */}
      <Abs
        x={140}
        y={LINE_Y - 1}
        w={1640}
        h={3}
        style={{ background: token("--border-active"), opacity: ep(0.3, 0.8, a) }}
      />
      {STOPS.map(({ x, when, what }, i) => {
        const lit = visited[i] && focus.includes(i);
        const p = ep(0.4 + i * 0.14, 0.6, a);
        return (
          <div key={when}>
            <Abs
              x={x - 13}
              y={LINE_Y - 13}
              w={26}
              h={26}
              style={{
                boxSizing: "border-box",
                borderRadius: "50%",
                border: `3px solid ${visited[i] ? token("--brand-accent") : token("--border-active")}`,
                background: visited[i] ? token("--brand-accent") : token("--bg-app"),
                transition: "background .4s, border-color .4s",
                opacity: p,
              }}
            />
            <InfoCard
              kicker={when}
              lit={lit}
              style={{ left: x - 165, top: 778, width: 330, height: 214, ...rise(p) }}
            >
              {what}
              {i === 4 ? (
                <div
                  style={{
                    marginTop: 10,
                    height: 48,
                    boxSizing: "border-box",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `3px dashed ${d >= 0 ? token("--brand-accent", cellPulse) : token("--border-active")}`,
                    background: token("--brand-accent", 0.12 * ep(0.9, 0.6, d)),
                    color: token("--brand-accent"),
                    fontSize: 24,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ opacity: ep(1.0, 0.6, d) }}>No completion notice</span>
                </div>
              ) : null}
            </InfoCard>
          </div>
        );
      })}

      {/* Every promise: the five stops framed as one record, answering the
          question the resident asked at 9:47. */}
      {e >= 0 ? (
        <>
          <Lines>
            <rect
              x={FRAME.x}
              y={FRAME.y}
              width={FRAME.w}
              height={FRAME.h}
              rx={28}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - ep(0.6, 1.0, e)}
              stroke={token("--brand-accent")}
              strokeWidth={4}
              style={{ filter: `drop-shadow(0 0 12px ${token("--brand-accent", 0.5)})` }}
            />
            <Trace d={`M ${W / 2} ${FRAME.y} L ${W / 2} ${QUOTE_Y + 96}`} p={ep(1.6, 0.5, e)} opacity={1} />
          </Lines>
          <Abs
            x={0}
            y={QUOTE_Y - 64}
            w={W}
            style={{ display: "flex", justifyContent: "center", ...rise(ep(2.0, 0.5, e), 12) }}
          >
            <Speaker who="resident" size={34} />
          </Abs>
          <Abs x={0} y={QUOTE_Y} w={W} style={{ textAlign: "center", ...rise(ep(2.1, 0.7, e), 14) }}>
            <Headline size={52}>“Two years ago you promised to fix the flooding on Elm Street.”</Headline>
          </Abs>
        </>
      ) : null}

      <Wisp path={TIMELINE} head={head} g={c.g} orb={e < 0} amp={7} />

    </>
  );
}
