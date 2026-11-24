import type { ReactNode } from "react";
import { Plug, ScanLine, Tag } from "lucide-react";
import { NavFooterLogo } from "../landing/nav-footer-logo";
import {
  Abs,
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
  typed,
  type Clock,
} from "./engine";
import {
  AppWindow,
  Bubble,
  CITY,
  Headline,
  InfoCard,
  Kicker,
  LockBadge,
  PEOPLE,
  Seat,
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

// ── Holding slide ───────────────────────────────────────────────────────────

const HOLD_LINE = makePath([
  [-60, 790],
  [480, 790],
  [960, 790],
  [1440, 790],
  [1980, 790],
]);

export function Hold({ c }: { c: Clock }) {
  return (
    <>
      <Abs x={160} y={130}>
        <NavFooterLogo svgClassName="h-16 w-auto" />
      </Abs>
      <Abs x={160} y={400} w={1600}>
        <Kicker>9:47 p.m. at the dais</Kicker>
        <Headline size={150} style={{ marginTop: 28 }}>
          The life of a decision.
        </Headline>
      </Abs>
      <Wisp path={HOLD_LINE} head={1} g={c.g} line amp={13} />
      <Abs
        x={160}
        y={990}
        style={{
          fontSize: 24,
          color: token("--text-muted"),
          opacity: 0.8 * (1 - prog(9, 1.5, c.g)),
        }}
      >
        Press F for full screen. Click, or press the right arrow, to begin.
      </Abs>
    </>
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
      <Abs x={120} y={92} style={rise(ep(0.3, 0.6, a))}>
        <Kicker>The life of a decision</Kicker>
      </Abs>
      <Abs x={120} y={142} w={1700} style={rise(ep(0.45, 0.7, a))}>
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
        y={286}
        style={{ fontSize: 42, color: token("--text-secondary"), ...rise(ep(2.6, 0.6, a)) }}
      >
        An assistant on every desk.
      </Abs>
    </>
  );
}

// ── The clock that sits in the corner through scenes 2 to 5 ─────────────────

export function NightClock({ c }: { c: Clock }) {
  const a = c.at(S.nine47);
  const move = ease(prog(1.9, 1.0, a));
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${lerp(0, 700, move)}px), calc(-50% + ${lerp(0, -452, move)}px)) scale(${lerp(1, 0.2, move)})`,
        fontFamily: SERIF,
        fontSize: 300,
        fontWeight: 500,
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
        fontVariantNumeric: "lining-nums",
        opacity: prog(0.3, 0.7, a),
      }}
    >
      9:47 p.m.
    </div>
  );
}

// ── 2 · 9:47 p.m. ───────────────────────────────────────────────────────────

const PROMISE_LINES = ["Two years ago you promised", "to fix the flooding", "on Elm Street."];

/** Each word of `lines` with its place in the whole quote, for a word-by-word build. */
const PROMISE_WORDS = PROMISE_LINES.map((line, li) => {
  const before = PROMISE_LINES.slice(0, li).reduce((n, l) => n + l.split(" ").length, 0);
  return { line, words: line.split(" ").map((word, wi) => ({ word, i: before + wi })) };
});

const RISE_PATH = makePath([
  [930, 535],
  [1040, 580],
  [1180, 545],
  [1300, 462],
  [1440, 474],
  [1540, 400],
]);

export function Nine47({ c }: { c: Clock }) {
  const a = c.at(S.nine47);
  const b = c.at(S.isThatTrue);
  return (
    <>
      <Seat x={190} y={318} r={44} label="Resident" side="none" opacity={ep(2.9, 0.5, a)} />
      <Abs
        x={280}
        y={200}
        style={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: token(PEOPLE),
          opacity: ep(2.9, 0.5, a),
        }}
      >
        Resident
      </Abs>
      <Abs x={280} y={246} w={1500}>
        <Headline size={92} style={{ lineHeight: 1.18 }}>
          {PROMISE_WORDS.map(({ line, words }) => (
            <div key={line}>
              {words.map(({ word, i }) => (
                <span key={`${i}-${word}`} style={{ opacity: prog(3.1 + i * 0.16, 0.5, a) }}>
                  {word}{" "}
                </span>
              ))}
            </div>
          ))}
        </Headline>
      </Abs>
      <Wisp path={RISE_PATH} head={glide(prog(5.3, 2.4, a))} g={c.g} />

      <Seat x={700} y={818} r={44} label="Council" side="none" opacity={ep(0.2, 0.5, b)} />
      <Abs
        x={790}
        y={706}
        style={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: token(PEOPLE),
          opacity: ep(0.2, 0.5, b),
        }}
      >
        Council
      </Abs>
      <Abs x={786} y={738} style={rise(ep(0.5, 0.7, b))}>
        <Headline size={150}>Is that true?</Headline>
      </Abs>
    </>
  );
}

// ── 3 · The smart stranger ──────────────────────────────────────────────────

const GENERIC_ANSWER = "Drainage repairs are usually scheduled in a capital improvement plan.";

const SLIDE_OFF = makePath([
  [1440, 474],
  [1540, 400],
  [1505, 290],
  [1425, 222],
  [1372, 300],
  [1378, 480],
  [1420, 640],
  [1500, 770],
  [1560, 850],
]);

const BREAK_UP = makePath([
  [1500, 770],
  [1560, 850],
  [1650, 838],
  [1700, 750],
  [1664, 642],
]);

/** Where the wisp breaks up against a label. */
const PUFF_AT: Pt = [1664, 636];
const PUFFS = [
  { angle: 200, dist: 70, r: 7 },
  { angle: 165, dist: 96, r: 5 },
  { angle: 128, dist: 80, r: 8 },
  { angle: 92, dist: 110, r: 5 },
  { angle: 58, dist: 84, r: 7 },
  { angle: 22, dist: 100, r: 5 },
  { angle: -14, dist: 72, r: 6 },
];

const LABEL_SUB = { marginTop: 4, fontSize: 24, fontWeight: 400, color: token("--text-muted") };

/** A dashed lead from the assistant to a system, with the connector's plug on it. */
function Connector({ x, y, p }: { x: number; y: number; p: number }) {
  return (
    <Abs x={x} y={y - 16} w={70} h={32} style={{ opacity: p }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 15,
          borderTop: `3px dashed ${token("--border-active")}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 19,
          top: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: token("--bg-app"),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Plug size={22} color={token("--text-muted")} />
      </div>
    </Abs>
  );
}

const DISAGREE = ["Funded in 2020.", "Funded in 2021.", "No record found."];

export function Stranger({ c }: { c: Clock }) {
  const a = c.at(S.stranger);
  const b = c.at(S.connectors);
  const d = c.at(S.getBack);
  const dim = 1 - 0.72 * prog(0, 0.6, d);
  const card = (i: number) => ep(0.3 + i * 0.22, 0.55, b);
  const labelIcon = <Tag size={22} />;
  const puff = prog(2.9, 1.3, b);

  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: dim }}>
        <AppWindow
          title="Assistant"
          tag="Visitor"
          style={{ left: 560, top: 190, width: 800, height: 480, ...rise(ep(0.3, 0.6, a)) }}
        >
          {a >= 0.7 ? <Bubble from="person">{typed(QUESTION, 0.7, 1.3, a)}</Bubble> : null}
          {a >= 2.5 ? (
            <Bubble from="assistant" style={{ marginTop: 20 }}>
              {typed(GENERIC_ANSWER, 2.6, 1.4, a)}
            </Bubble>
          ) : null}
          <div
            style={{
              display: "inline-block",
              marginTop: 18,
              padding: "4px 16px",
              borderRadius: 999,
              border: `2px solid ${token("--border-active")}`,
              fontSize: 24,
              color: token("--text-muted"),
              opacity: ep(4.4, 0.5, a),
            }}
          >
            No sources
          </div>
        </AppWindow>

        {/* The fixes on offer: connectors that bring back a label, not the page. */}
        <Connector x={490} y={285} p={card(0)} />
        <Connector x={490} y={465} p={card(1)} />
        <Connector x={490} y={645} p={card(2)} />
        <Connector x={1360} y={375} p={card(3)} />
        <Connector x={1360} y={555} p={card(4)} />

        <InfoCard kicker="Label" icon={labelIcon} style={{ left: 70, top: 210, width: 420, height: 150, ...rise(card(0)) }}>
          2019-03-12 minutes.pdf
          <div style={LABEL_SUB}>Mar 12, 2019 · Council / 2019</div>
        </InfoCard>
        <InfoCard kicker="Label" icon={labelIcon} style={{ left: 70, top: 390, width: 420, height: 150, ...rise(card(1)) }}>
          Permits export
          <div style={LABEL_SUB}>2021</div>
        </InfoCard>
        <InfoCard
          kicker="Scanned file"
          icon={<ScanLine size={22} />}
          style={{ left: 70, top: 570, width: 420, height: 150, ...rise(card(2)) }}
        >
          <TextBars rows={[0.92, 0.7, 0.82]} gap={14} blur={4} style={{ marginTop: 12 }} />
        </InfoCard>
        <InfoCard kicker="Label" icon={labelIcon} style={{ left: 1430, top: 300, width: 420, height: 150, ...rise(card(3)) }}>
          Staff report
          <div style={LABEL_SUB}>Sept 2019</div>
        </InfoCard>
        <InfoCard
          kicker="Walled off"
          icon={<LockBadge size={22} />}
          style={{ left: 1430, top: 480, width: 420, height: 150, ...rise(card(4)) }}
        >
          Budget
          <div style={LABEL_SUB}>No access</div>
        </InfoCard>

        {/* Ask three times, get three answers. */}
        {DISAGREE.map((answer, i) => (
          <Abs
            key={answer}
            x={495 + i * 320}
            y={724}
            w={290}
            style={{
              boxSizing: "border-box",
              padding: "16px 0",
              textAlign: "center",
              borderRadius: 18,
              background: token("--bg-hover"),
              fontSize: 30,
              ...rise(ep(3.6 + i * 0.7, 0.5, b)),
            }}
          >
            {answer}
          </Abs>
        ))}
      </div>

      {/* The wisp drifts to the assistant and slides off it … */}
      <Wisp
        path={SLIDE_OFF}
        head={lerp(0.16, 1, glide(prog(3.2, 2.8, a)))}
        g={c.g}
        opacity={(1 - 0.45 * prog(5.2, 0.8, a)) * (1 - prog(0, 0.4, b))}
      />
      {/* … then breaks up against a label it cannot open. */}
      {b >= 0 ? (
        <Wisp
          path={BREAK_UP}
          head={lerp(0.35, 1, glide(prog(1.5, 1.4, b)))}
          g={c.g}
          opacity={0.6 * (1 - prog(2.9, 0.7, b))}
        />
      ) : null}
      {puff > 0 && puff < 1 ? (
        <Lines>
          {PUFFS.map(({ angle, dist, r }) => {
            const rad = (angle * Math.PI) / 180;
            const out = ease(puff) * dist;
            return (
              <circle
                key={angle}
                cx={PUFF_AT[0] + Math.cos(rad) * out}
                cy={PUFF_AT[1] + Math.sin(rad) * out}
                r={r * (1 - 0.4 * puff)}
                fill={token("--brand-accent")}
                opacity={0.7 * (1 - puff)}
              />
            );
          })}
        </Lines>
      ) : null}

      <Abs x={0} y={838} w={W} style={{ textAlign: "center", ...rise(ep(0.3, 0.7, d)) }}>
        <Headline size={120}>“We’ll get back to you.”</Headline>
      </Abs>
    </>
  );
}

// ── 4 · The memory wakes ────────────────────────────────────────────────────

/** Stage y of the three passages the wisp lifts out of the minutes. */
const PASSAGE_Y = [377, 569, 761];

const INTO_MINUTES = makePath([
  [-60, 100],
  [150, 180],
  [520, 270],
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

const THROUGH_SOURCES = makePath([
  [690, 860],
  [760, 950],
  [930, 1036],
  [1180, 1042],
  [1320, 992],
  [1362, 880],
  [1362, 665],
  [1362, 475],
  [1362, 285],
  [1380, 172],
  [1460, 122],
]);
/** Sources top to bottom; the wisp reaches the bottom one first. */
const SOURCE_AT = [285, 475, 665, 855].map((y) => fracAt(THROUGH_SOURCES, [1362, y]));

const TO_ASSISTANT = makePath([
  [180, 236],
  [380, 150],
  [700, 112],
  [1100, 104],
  [1340, 120],
  [1440, 160],
  [1464, 204],
]);

const MINUTES_ROWS = Array.from({ length: 21 }, (_, i) => 0.62 + ((i * 37) % 34) / 100);
/** Rows of the minutes page that are the passages (see PASSAGE_Y). */
const PASSAGE_ROWS = [3, 9, 15];

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

  const headA = glide(prog(0.9, 4.4, a));
  const passage = PASSAGE_AT.map((f) => headA >= f);
  const headB = glide(prog(0.7, 3.8, b));
  const source = SOURCE_AT.map((f) => b >= 0 && headB >= f);
  const fly = (i: number) => {
    const p = ep(0.1 + i * 0.12, 0.6, b);
    return { opacity: p, transform: `translateX(${(1 - p) * 90}px)` };
  };
  const lineAt = (i: number) => 2.2 + i * 1.5;

  return (
    <>
      <Abs x={120} y={84} style={rise(ep(0.2, 0.6, a))}>
        <Kicker>Follow the decision</Kicker>
      </Abs>

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

          {/* The passages that matter lift out, each tied back to its line. */}
          <Lines>
            {PASSAGE_Y.map((y, i) => (
              <Trace key={y} d={`M 688 ${y} L 820 ${y}`} p={passage[i] ? ep(0, 0.5, a - 0.9 - PASSAGE_AT[i] * 4.4) : 0} />
            ))}
          </Lines>
          <InfoCard kicker="Item" lit={passage[0]} style={{ left: 820, top: 322, width: 480, height: 110, opacity: passage[0] ? 1 : 0, transition: "opacity .5s, border-color .5s, box-shadow .5s" }}>
            7B · Elm Street drainage
          </InfoCard>
          <InfoCard kicker="Motion" lit={passage[1]} style={{ left: 820, top: 494, width: 480, height: 150, opacity: passage[1] ? 1 : 0, transition: "opacity .5s, border-color .5s, box-shadow .5s" }}>
            Direct staff to design and fund the repair
          </InfoCard>
          <InfoCard kicker="Vote" lit={passage[2]} style={{ left: 820, top: 706, width: 480, height: 110, opacity: passage[2] ? 1 : 0, transition: "opacity .5s, border-color .5s, box-shadow .5s" }}>
            Passed 5 to 0
          </InfoCard>
          <InfoCard kicker="Source" style={{ left: 820, top: 850, width: 480, height: 150, opacity: headA >= 0.97 ? 1 : 0, transition: "opacity .6s" }}>
            Minutes, March 12, 2019, page 14
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

          <Wisp path={INTO_MINUTES} head={headA} g={c.g} orb={b < 0} trail={0.35} />
          {b >= 0 ? <Wisp path={THROUGH_SOURCES} head={lerp(0.05, 1, headB)} g={c.g} /> : null}
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
              const y1 = 402 + i * 84;
              return (
                <Trace
                  key={line}
                  d={`M 580 ${y0} C 670 ${y0}, 660 ${y1}, 748 ${y1}`}
                  p={ep(lineAt(i), 0.7, d)}
                />
              );
            })}
          </Lines>
          <AppWindow
            title="Assistant"
            tag={d >= 1.5 ? CITY : "Visitor"}
            tagLit={d >= 1.5}
            style={{ left: 720, top: 170, width: 1080, height: 790, ...rise(ep(0.4, 0.6, d)) }}
          >
            <Bubble from="person">{QUESTION}</Bubble>
            <div style={{ marginTop: 34 }}>
              {ANSWER.map(({ line }, i) => (
                <div
                  key={line}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    height: 84,
                    fontSize: 36,
                    ...rise(ep(lineAt(i), 0.6, d), 16),
                  }}
                >
                  <SourcePill n={i + 1} dashed={i === 4} />
                  {line}
                </div>
              ))}
            </div>
          </AppWindow>
          <Wisp path={TO_ASSISTANT} head={glide(prog(0.4, 1.2, d))} g={c.g} ribbon={300} />
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

const TIMELINE = makePath([[40, LINE_Y], ...STOPS.map(({ x }): Pt => [x, LINE_Y])]);
const STOP_AT = STOPS.map(({ x }) => fracAt(TIMELINE, [x, LINE_Y]));

const BACK_TO_PROMISE = makePath([
  [1700, LINE_Y],
  [1842, 672],
  [1850, 556],
  [1720, 472],
  [1450, 456],
  [1180, 452],
  [1076, 420],
  [1052, 376],
]);

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
  const beatAt = [ep(2.4, 0.7, a), ep(1.9, 0.7, b), ep(1.3, 0.7, d), ep(2.5, 0.7, e)];
  const cellPulse = d >= 0 ? 0.55 + 0.45 * Math.sin(c.g * 3) : 0;

  return (
    <>
      <Abs x={120} y={84} style={rise(ep(0.2, 0.6, a))}>
        <Kicker>The life of a decision</Kicker>
      </Abs>

      {BEATS.map((beat, i) => (
        <Abs key={beat} x={120} y={140 + i * 126} style={rise(beatAt[i], 30)}>
          <Headline size={108}>{beat}</Headline>
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
              style={{ left: x - 165, top: 778, width: 330, height: 206, ...rise(p) }}
            >
              {what}
              {i === 4 ? (
                <div
                  style={{
                    marginTop: 10,
                    width: 150,
                    height: 40,
                    boxSizing: "border-box",
                    borderRadius: 8,
                    border: `3px dashed ${d >= 0 ? token("--brand-accent", cellPulse) : token("--border-active")}`,
                  }}
                />
              ) : null}
            </InfoCard>
          </div>
        );
      })}
      <Abs
        x={1200}
        y={1000}
        w={665}
        style={{
          textAlign: "right",
          fontSize: 28,
          fontWeight: 600,
          color: token("--brand-accent"),
          ...rise(ep(3.6, 0.6, e), 12),
        }}
      >
        What the record doesn’t show.
      </Abs>

      {/* Every promise: back to the words the resident just said. */}
      <Seat x={1050} y={318} r={38} label="Resident" side="none" opacity={ep(2.0, 0.6, e)} />
      <Abs
        x={1112}
        y={250}
        style={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: token(PEOPLE),
          opacity: ep(2.0, 0.6, e),
        }}
      >
        Resident
      </Abs>
      <Abs x={1112} y={288} w={700} style={rise(ep(2.1, 0.7, e))}>
        <Headline size={44} style={{ lineHeight: 1.25 }}>
          “You promised to fix the flooding on Elm Street.”
        </Headline>
      </Abs>

      <Wisp path={TIMELINE} head={head} g={c.g} orb={e < 0} trail={0.5} amp={7} />
      {e >= 0 ? (
        <Wisp path={BACK_TO_PROMISE} head={glide(prog(0.3, 2.4, e))} g={c.g} />
      ) : null}
    </>
  );
}
