import type { ReactNode } from "react";
import { NavFooterLogo } from "../landing/nav-footer-logo";
import {
  Abs,
  DONE,
  H,
  SERIF,
  W,
  ease,
  easeOut,
  ep,
  lerp,
  prog,
  rise,
  token,
  type Clock,
} from "./engine";
import { CITY, Headline, LockBadge, SourcePill, TextBars } from "./parts";
import { MiniWindow } from "./scenes-night";
import { S } from "./steps";
import { Wisp, glide, makePath, type Pt } from "./wisp";

// ============================================================================
// The closing scenes, back on navy: scenes 9 to 12 of the storyboard. The bar
// the answer has to clear, the peers already doing it, how little it takes,
// and the four beats one last time.
// ============================================================================

// ── 9 · The bar ─────────────────────────────────────────────────────────────

/** Each word is tied to something the audience just watched the memory do. */
const BAR: { word: string; x: number; proof: ReactNode }[] = [
  {
    word: "Accurate",
    x: 285,
    proof: (
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 210, height: 24, borderRadius: 12, background: token("--brand-accent") }} />
        <SourcePill n={1} size={64} />
      </div>
    ),
  },
  {
    word: "Complete",
    x: 735,
    proof: (
      <div
        style={{
          width: 240,
          height: 78,
          boxSizing: "border-box",
          borderRadius: 10,
          border: `3px dashed ${token("--brand-accent")}`,
        }}
      />
    ),
  },
  {
    word: "Secure",
    x: 1185,
    proof: <LockBadge size={84} lit />,
  },
  {
    word: "Owned",
    x: 1635,
    proof: (
      <div
        style={{
          padding: "10px 22px",
          borderRadius: 999,
          border: `2px solid ${token("--brand-accent")}`,
          background: token("--brand-accent", 0.14),
          color: token("--brand-accent"),
          fontSize: 32,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {CITY}
      </div>
    ),
  },
];

export function Bar({ c }: { c: Clock }) {
  const a = c.at(S.bar);
  return (
    <>
      {/* The standard itself, then the four things it means. */}
      <Abs x={0} y={150} w={W} style={{ textAlign: "center", ...rise(ep(0.4, 0.7, a)) }}>
        <Headline size={120}>DAIS ready.</Headline>
      </Abs>
      {BAR.map(({ word, x, proof }, i) => {
        const p = ep(1.0 + i * 0.9, 0.7, a);
        return (
          <Abs
            key={word}
            x={x - 225}
            y={400}
            w={450}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", ...rise(p, 30) }}
          >
            <div style={{ height: 110, display: "flex", alignItems: "center" }}>{proof}</div>
            <Headline size={76} style={{ marginTop: 30 }}>
              {word}
            </Headline>
          </Abs>
        );
      })}
      <Abs
        x={0}
        y={800}
        w={W}
        style={{
          textAlign: "center",
          fontFamily: SERIF,
          fontSize: 50,
          color: token("--text-secondary"),
          ...rise(ep(5.2, 0.8, a)),
        }}
      >
        That’s what responsible AI looks like.
      </Abs>
    </>
  );
}

// ── 10 · You're not first ───────────────────────────────────────────────────

const PEER_COUNT = 80;
const WASHOE = { col: 4, row: 9 };

/** Stable pseudo-random value in 0..1 for a grid cell. */
const scatter = (col: number, row: number) => {
  const v = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * The field of governments. Cells behind the headline, and behind Washoe
 * County's label, are left out; the rest are ranked by a stable scatter and
 * all of them light up in that order.
 */
const FIELD = (() => {
  const cells: { x: number; y: number; rank: number; washoe: boolean }[] = [];
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 23; col++) {
      const washoe = col === WASHOE.col && row === WASHOE.row;
      // Leave a clear row under the text; the dots that sat there move into a
      // column just to the right of it instead.
      const underHeadline = col <= 9 && row <= 6;
      const underLabel = row === WASHOE.row && col > WASHOE.col && col <= WASHOE.col + 4;
      if (underHeadline || underLabel) continue;
      cells.push({
        x: 80 + col * 80,
        y: 100 + row * 80,
        rank: washoe ? -1 : scatter(col, row),
        washoe,
      });
    }
  }
  return cells
    .sort((p, q) => p.rank - q.rank)
    .map((cell, order) => ({ ...cell, order }));
})();

export function Peers({ c }: { c: Clock }) {
  const a = c.at(S.peers);
  const count = Math.floor(lerp(0, PEER_COUNT, ease(prog(0.8, 4.2, a))));
  return (
    <>
      {FIELD.map(({ x, y, order, washoe }) => {
        // Every dot lights, in a scattered order, finishing as the count lands.
        const on = ep(0.8 + (order / FIELD.length) * 3.7, 0.5, a);
        const twinkle = 1 + 0.08 * Math.sin(c.g * 1.6 + order);
        const size = washoe ? 34 : 22;
        return (
          <div
            key={`${x}-${y}`}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              boxSizing: "border-box",
              borderRadius: "50%",
              border: `2px solid ${on > 0 ? token("--brand-accent") : token("--border-active")}`,
              background: token("--brand-accent", on),
              boxShadow: on > 0 ? `0 0 ${22 * on}px ${token("--brand-accent", 0.55 * on)}` : "none",
              transform: `scale(${on > 0 ? lerp(0.6, twinkle, on) : 0.62})`,
              opacity: ep(0.2, 0.8, a),
            }}
          />
        );
      })}

      <Abs x={112} y={58} style={{ opacity: ep(0.5, 0.6, a) }}>
        <Headline
          size={300}
          style={{
            fontVariantNumeric: count >= PEER_COUNT ? "lining-nums" : "lining-nums tabular-nums",
            lineHeight: 1,
          }}
        >
          {count >= PEER_COUNT ? "80+" : count}
        </Headline>
      </Abs>
      <Abs x={120} y={362} style={rise(ep(0.7, 0.7, a))}>
        <Headline size={100}>governments</Headline>
      </Abs>
      <Abs
        x={122}
        y={490}
        style={{ fontSize: 40, color: token("--text-secondary"), ...rise(ep(5.0, 0.7, a)) }}
      >
        have turned on their memory.
      </Abs>

      {/* The first of them. */}
      <Abs
        x={80 + WASHOE.col * 80 + 34}
        y={100 + WASHOE.row * 80 - 46}
        style={{
          padding: "10px 22px",
          borderRadius: 14,
          background: token("--bg-surface"),
          border: `2px solid ${token("--brand-accent")}`,
          ...rise(ep(1.4, 0.6, a), 12),
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "0.04em", color: token("--brand-accent") }}>
          Co-founder
        </div>
        <div style={{ fontSize: 32, fontWeight: 600, whiteSpace: "nowrap" }}>Washoe County</div>
      </Abs>
    </>
  );
}

// ── Hours saved ─────────────────────────────────────────────────────────────

/**
 * Total staff hours saved across every Madison deployment.
 * PLACEHOLDER until marketing confirms the real, sourced figure: while it is
 * null the slide shows a visible "[hours]" marker so it can't ship by mistake.
 */
const HOURS_SAVED: number | null = null;

export function Hours({ c }: { c: Clock }) {
  const a = c.at(S.hours);
  const shown =
    HOURS_SAVED === null
      ? "[hours]"
      : `${Math.round(lerp(0, HOURS_SAVED, ease(prog(0.4, 2.2, a)))).toLocaleString("en-US")}+`;
  return (
    <Abs
      x={0}
      y={0}
      w={W}
      h={H}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
    >
      <div style={{ opacity: ep(0.2, 0.6, a) }}>
        <Headline
          size={260}
          style={{ lineHeight: 1, fontVariantNumeric: "lining-nums tabular-nums", textAlign: "center" }}
        >
          {shown}
        </Headline>
      </div>
      <div style={{ marginTop: 36, ...rise(ep(0.9, 0.7, a), 18) }}>
        <Headline size={64} style={{ color: token("--text-secondary") }}>
          hours saved across our deployments.
        </Headline>
      </div>
    </Abs>
  );
}

// ── 11 · It isn't hard ──────────────────────────────────────────────────────

const SYSTEMS = [
  { label: "Agendas and minutes", locked: false },
  { label: "Staff reports", locked: false },
  { label: "Budget", locked: true },
  { label: "Contracts", locked: false },
  { label: "Permits", locked: false },
  { label: "Email", locked: true },
];
const MEMORY_Y = 600;
const MEMORY_LINE = makePath([
  [120, MEMORY_Y],
  [680, MEMORY_Y],
  [1240, MEMORY_Y],
  [1800, MEMORY_Y],
]);

const EASY_LINES = [
  { text: "Start with what you already publish.", at: 1.8 },
  { text: "Nothing migrates. Nothing gets replaced.", at: 3.8 },
  { text: "No two-year data project.", at: 5.8 },
];

/** New documents keep arriving, and the memory reads each as it lands. */
const ARRIVALS = [0, 3, 1, 4];

export function Easy({ c }: { c: Clock }) {
  const a = c.at(S.easy);
  // After the build, the arrivals keep looping on the ambient clock.
  const living = a >= DONE ? c.g : a - EASY_LINES[2].at;

  return (
    <>

      {/* What all of this is: one memory, reading every system read-only. */}
      <Abs x={120} y={52} style={rise(ep(0.2, 0.7, a))}>
        <Headline size={96}>Madison Memory</Headline>
      </Abs>
      <Abs
        x={122}
        y={170}
        style={{ fontSize: 34, fontWeight: 500, color: token("--text-secondary"), ...rise(ep(0.5, 0.7, a), 12) }}
      >
        Connected read-only
      </Abs>

      {SYSTEMS.map(({ label, locked }, i) => {
        const x = 120 + i * 286;
        const lit = a >= (i < 2 ? EASY_LINES[0].at : EASY_LINES[1].at) + 0.2;
        const drop = ep((i < 2 ? EASY_LINES[0].at : EASY_LINES[1].at) + 0.2 + i * 0.08, 0.6, a);
        return (
          <div key={label}>
            <Abs
              x={x}
              y={250}
              w={250}
              h={220}
              style={{
                boxSizing: "border-box",
                padding: "18px 20px",
                borderRadius: 16,
                background: token("--bg-surface"),
                border: `2px solid ${lit ? token("--brand-accent") : token("--border-active")}`,
                boxShadow: lit ? `0 0 40px ${token("--brand-accent", 0.22)}` : "none",
                transition: "border-color .5s, box-shadow .5s",
                ...rise(ep(0.3 + i * 0.1, 0.6, a)),
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  minHeight: 62,
                  fontSize: 24,
                  fontWeight: 600,
                  lineHeight: 1.25,
                  color: lit ? token("--brand-accent") : token("--text-muted"),
                  transition: "color .5s",
                }}
              >
                {label}
                {locked ? <LockBadge size={26} lit={lit} /> : null}
              </div>
              <TextBars rows={[0.9, 0.66, 0.78, 0.5]} gap={16} style={{ marginTop: 16 }} />
            </Abs>
            {/* Read-only: a dashed lead down to the memory. Nothing moves. */}
            <Abs
              x={x + 124}
              y={470}
              w={0}
              h={(MEMORY_Y - 470) * drop}
              style={{ borderLeft: `3px dashed ${token("--brand-accent", 0.7)}` }}
            />
          </div>
        );
      })}

      <Wisp path={MEMORY_LINE} head={glide(prog(1.0, 1.6, a))} g={c.g} line amp={8} />

      {EASY_LINES.map(({ text, at }, i) => (
        <Abs key={text} x={120} y={690 + i * 104} style={rise(ep(at, 0.7, a))}>
          <Headline size={64}>{text}</Headline>
        </Abs>
      ))}

      {living >= 0
        ? ARRIVALS.map((system, n) => {
            const local = (living % 4) - n * 0.9;
            const fall = prog(0, 0.7, local);
            const read = prog(0.7, 0.5, local);
            const x = 120 + system * 286 + 124;
            return (
              <div key={system}>
                {fall > 0 && fall < 1 ? (
                  <Abs
                    x={x - 18}
                    y={lerp(196, 232, easeOut(fall))}
                    w={36}
                    h={46}
                    style={{
                      boxSizing: "border-box",
                      borderRadius: 6,
                      border: `2px solid ${token("--brand-accent")}`,
                      background: token("--bg-surface"),
                      opacity: Math.min(1, fall * 3) * (1 - prog(0.75, 0.25, fall)),
                    }}
                  />
                ) : null}
                {read > 0 && read < 1 ? (
                  <Abs
                    x={x - 9}
                    y={lerp(470, MEMORY_Y, read) - 8}
                    w={18}
                    h={18}
                    style={{
                      borderRadius: "50%",
                      background: token("--brand-tint-pale"),
                      boxShadow: `0 0 18px ${token("--brand-accent")}`,
                    }}
                  />
                ) : null}
              </div>
            );
          })
        : null}
    </>
  );
}

// ── 12 · Close ──────────────────────────────────────────────────────────────

const BEATS = ["Every decision.", "Every dollar.", "Every permit.", "Every promise."];

const SETTLED = makePath([
  [-60, 668],
  [480, 668],
  [960, 668],
  [1440, 668],
  [1980, 668],
]);

const CLOSE_COLS = [0, 1, 2, 3];
const CLOSE_ROWS = [0, 1, 2];

export function Close({ c }: { c: Clock }) {
  const a = c.at(S.beats);
  const b = c.at(S.memory);
  const d = c.at(S.people);

  return (
    <>
      {/* Every desk again, each answer now carrying its source. */}
      {CLOSE_ROWS.map((row) =>
        CLOSE_COLS.map((col) => (
          <MiniWindow
            key={`${row}-${col}`}
            x={1090 + col * 186}
            y={104 + row * 146}
            w={160}
            h={116}
            p={0.8 * ep(0.4 + col * 0.08 + row * 0.14, 0.6, a)}
            g={c.g}
            seed={(col * 0.29 + row * 0.53) % 1}
            memory
          />
        )),
      )}

      {BEATS.map((beat, i) => (
        <Abs key={beat} x={160} y={92 + i * 122} style={rise(ep(0.6 + i * 0.5, 0.7, a), 30)}>
          <Headline size={104}>{beat}</Headline>
        </Abs>
      ))}

      <Wisp path={SETTLED} head={glide(prog(1.8, 2.2, a))} g={c.g} line amp={11} />

      <Abs
        x={160}
        y={712}
        style={{
          fontFamily: SERIF,
          fontSize: 52,
          color: token("--brand-accent"),
          ...rise(ep(0.3, 0.7, b)),
        }}
      >
        That’s your government’s memory. Turn it on. Keep it current.
      </Abs>

      <Abs x={160} y={812} style={rise(ep(0.3, 0.8, d))}>
        <Headline size={72}>When it needs to be right, we’re your people.</Headline>
      </Abs>
    </>
  );
}

// ── Sign-off ────────────────────────────────────────────────────────────────

/**
 * The wisp's last flourish: it drifts in from the left, makes one full lap
 * around the logo and tagline (wide enough never to cross them), then carries
 * on over the top and slips away off the right edge.
 */
const ORBIT = (() => {
  const cx = W / 2;
  const cy = H / 2;
  const rx = 660;
  const ry = 240;
  const pts: Pt[] = [
    [-90, 800],
    [140, 720],
  ];
  // From the left, clockwise over the top: one lap and a quarter.
  for (let k = 0; k <= 15; k++) {
    const th = Math.PI + (k / 12) * 2 * Math.PI;
    pts.push([cx + rx * Math.cos(th), cy + ry * Math.sin(th)]);
  }
  pts.push([1420, 270], [1760, 230], [2040, 210]);
  return makePath(pts);
})();

/** The last thing on screen: the Madison AI logo and tagline, alone and centered. */
export function SignOff({ c }: { c: Clock }) {
  const a = c.at(S.signOff);
  return (
    <>
    <Abs
      x={0}
      y={0}
      w={W}
      h={H}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
      }}
    >
      <div style={rise(ep(0.5, 0.9, a), 20)}>
        <NavFooterLogo svgClassName="h-32 w-auto" />
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 60,
          color: token("--text-secondary"),
          ...rise(ep(1.2, 0.9, a), 20),
        }}
      >
        Your government’s AI. You own it.
      </div>
    </Abs>
    {/* One lap of emphasis around the name, then gone. */}
    {a >= 1.6 ? <Wisp path={ORBIT} head={glide(prog(1.8, 3.6, a))} g={c.g} amp={6} /> : null}
    </>
  );
}
