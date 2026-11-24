import { Link2 } from "lucide-react";
import {
  Abs,
  SERIF,
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
  Seat,
  SourcePill,
  Stamp,
  TextBars,
} from "./parts";
import { S } from "./steps";
import { Wisp, fracAt, glide, makePath } from "./wisp";

// ============================================================================
// The morning scenes, on paper: scenes 6 to 8 of the storyboard. The same
// resident gets the public record herself, the emails come back with a
// person's sign-off, and every seat is answered from the same source.
// ============================================================================

const PORTAL = `${CITY} · Public records`;

// ── 6 · The next morning ────────────────────────────────────────────────────

const PORTAL_QUESTION = "What happened with the Elm Street drainage project?";

const PUBLIC_LINKS = [
  "Minutes · March 2019",
  "Staff report · September 2019",
  "Capital budget · Elm Street drainage",
  "Contract award · 2021",
];

const INTO_PORTAL = makePath([
  [-60, 200],
  [180, 232],
  [400, 320],
  [540, 420],
  [636, 500],
]);

export function Morning({ c }: { c: Clock }) {
  const a = c.at(S.morning);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: SERIF,
          fontSize: 300,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
          fontVariantNumeric: "lining-nums",
          opacity: prog(0.8, 0.6, a) * (1 - prog(2.5, 0.6, a)),
        }}
      >
        8:15 a.m.
      </div>

      <Abs x={120} y={84} style={rise(ep(3.1, 0.6, a))}>
        <Kicker>The next morning</Kicker>
      </Abs>
      <Seat x={300} y={560} r={64} label="Resident" opacity={ep(3.1, 0.6, a)} />

      <AppWindow
        title={PORTAL}
        style={{ left: 640, top: 200, width: 1160, height: 680, ...rise(ep(3.3, 0.7, a)) }}
      >
        {a >= 3.9 ? <Bubble from="person">{typed(PORTAL_QUESTION, 3.9, 1.6, a)}</Bubble> : null}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginTop: 40,
          }}
        >
          {PUBLIC_LINKS.map((link, i) => (
            <InfoCard
              key={link}
              kicker="Link"
              icon={<Link2 size={24} />}
              lit={a >= 6.5 + i * 0.45}
              style={{ position: "relative", height: 156, ...rise(ep(6.3 + i * 0.45, 0.6, a)) }}
            >
              {link}
            </InfoCard>
          ))}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 34,
            padding: "10px 24px",
            borderRadius: 999,
            border: `2px solid ${token("--brand-accent")}`,
            background: token("--brand-accent", 0.12),
            color: token("--brand-accent"),
            fontSize: 28,
            fontWeight: 600,
            ...rise(ep(8.4, 0.6, a), 14),
          }}
        >
          Public record, available now.
        </div>
      </AppWindow>

      <Wisp path={INTO_PORTAL} head={glide(prog(5.0, 1.3, a))} g={c.g} />
    </>
  );
}

// ── 7 · The review ──────────────────────────────────────────────────────────

const EMAILS = [
  { subject: "Re: Elm Street drainage schedule", y: 190, cuts: [[0.2, 0.2], [0.34, 0.24]] },
  { subject: "Re: Change order 3", y: 400, cuts: [[0.5, 0.24], [0.16, 0.2]] },
  { subject: "Re: Site access, Elm Street", y: 610, cuts: [[0.12, 0.26], [0.4, 0.2]] },
];

const THROUGH_EMAILS = makePath([
  [980, 110],
  [1080, 230],
  [1400, 322],
  [1700, 340],
  [1832, 430],
  [1700, 520],
  [1300, 534],
  [1042, 548],
  [992, 640],
  [1100, 730],
  [1400, 746],
  [1700, 752],
  [1822, 832],
  [1680, 902],
  [1480, 892],
]);
const EMAIL_AT = [
  fracAt(THROUGH_EMAILS, [1500, 328]),
  fracAt(THROUGH_EMAILS, [1300, 534]),
  fracAt(THROUGH_EMAILS, [1500, 748]),
];

const TO_RESIDENT = makePath([
  [1480, 892],
  [1300, 962],
  [900, 990],
  [520, 964],
  [340, 912],
  [276, 892],
]);

const STATUS = ["Gathered", "Reviewed", "Released"];

export function Review({ c }: { c: Clock }) {
  const a = c.at(S.review);
  const b = c.at(S.signed);
  const head = glide(prog(5.0, 4.2, a));
  const redacted = EMAIL_AT.map((f) => head >= f);
  const done = [a >= 4.6, b >= 0.8, b >= 3.3];
  const stamp = ep(0.15, 0.32, b);

  return (
    <>
      <Abs x={120} y={84} style={rise(ep(0.2, 0.6, a))}>
        <Kicker>The review</Kicker>
      </Abs>

      <AppWindow
        title={PORTAL}
        style={{ left: 120, top: 160, width: 800, height: 560, ...rise(ep(0.2, 0.6, a)) }}
      >
        {a >= 0.5 ? (
          <Bubble from="person">
            {typed("Can I see the emails with the contractor?", 0.5, 1.3, a)}
          </Bubble>
        ) : null}
        {a >= 2.2 ? (
          <Bubble from="assistant" style={{ marginTop: 20, ...rise(ep(2.2, 0.5, a), 12) }}>
            These need a review first. Request started.
          </Bubble>
        ) : null}
        <div style={{ display: "flex", gap: 14, marginTop: 26, ...rise(ep(3.0, 0.5, a), 12) }}>
          {STATUS.map((label, i) => (
            <span
              key={label}
              style={{
                padding: "8px 22px",
                borderRadius: 999,
                fontSize: 26,
                fontWeight: 600,
                transition: "background .5s, color .5s, border-color .5s",
                border: `2px solid ${done[i] ? token("--brand-primary") : token("--border-active")}`,
                background: done[i] ? token("--brand-primary") : "transparent",
                color: done[i] ? token("--brand-foreground") : token("--text-muted"),
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </AppWindow>

      {/* The emails: kept by the city, redactions marked, waiting for a person. */}
      {EMAILS.map(({ subject, y, cuts }, i) => {
        const p = ep(3.4 + i * 0.2, 0.6, a);
        return (
          <InfoCard
            key={subject}
            kicker="Email · kept by the city"
            style={{
              left: 1040,
              top: y,
              width: 760,
              height: 180,
              opacity: p,
              transform: `translateX(${(1 - p) * 80}px)`,
            }}
          >
            {subject}
            <div style={{ position: "relative", marginTop: 14 }}>
              <TextBars rows={[0.84, 0.62]} gap={18} height={14} />
              {cuts.map(([left, width], row) => (
                <div
                  key={left}
                  style={{
                    position: "absolute",
                    left: `${left * 100}%`,
                    top: row * 32 - 3,
                    width: `${width * 100}%`,
                    height: 20,
                    borderRadius: 3,
                    background: token("--text-primary"),
                    transformOrigin: "left center",
                    transform: `scaleX(${redacted[i] ? 1 : 0})`,
                    transition: `transform .5s ease ${row * 0.18}s`,
                  }}
                />
              ))}
            </div>
          </InfoCard>
        );
      })}

      <Seat x={200} y={890} r={56} label="Resident" opacity={ep(0.3, 0.6, a)} />

      <Wisp path={THROUGH_EMAILS} head={head} g={c.g} orb={b < 1.2} trail={0.3} />
      {b >= 1.2 ? (
        <Wisp path={TO_RESIDENT} head={glide(prog(1.2, 1.9, b))} g={c.g} />
      ) : null}

      {/* Nothing is released without a person's stamp. */}
      {b >= 0.15 ? (
        <Abs
          x={1250}
          y={470}
          style={{
            opacity: stamp,
            transform: `rotate(-8deg) scale(${lerp(1.7, 1, stamp)})`,
          }}
        >
          <Stamp size={84} style={{ background: token("--bg-surface", 0.92) }} />
        </Abs>
      ) : null}

      <InfoCard
        lit
        style={{
          left: 290,
          top: 846,
          width: 470,
          padding: "22px 28px",
          ...rise(ep(3.1, 0.6, b)),
        }}
      >
        <span style={{ fontSize: 34 }}>Your records are ready.</span>
      </InfoCard>
    </>
  );
}

// ── 8 · One memory ──────────────────────────────────────────────────────────

const THREAD_Y = 548;
const THREAD = makePath([
  [-60, THREAD_Y],
  [480, THREAD_Y],
  [960, THREAD_Y],
  [1440, THREAD_Y],
  [1980, THREAD_Y],
]);

const SEATS = [
  { x: 480, label: "Staff", kicker: "Staff report", makes: "In the city’s template, every line cited" },
  { x: 960, label: "Council", kicker: "Council brief", makes: "One page, no request to staff" },
  { x: 1440, label: "Resident", kicker: "Public answer", makes: "The record, on the city’s portal" },
];
const SEAT_AT = SEATS.map(({ x }) => fracAt(THREAD, [x, THREAD_Y]));

const PILLS = [1, 2, 3, 4, 5];

export function OneMemory({ c }: { c: Clock }) {
  const a = c.at(S.seats);
  const b = c.at(S.transparent);
  const head = glide(prog(0.5, 2.4, a));
  const first = 1 - prog(0.2, 0.4, b);
  const second = ep(0.7, 0.6, b);

  return (
    <>
      <Abs x={120} y={84} style={rise(ep(0.2, 0.6, a))}>
        <Kicker>One memory</Kicker>
      </Abs>
      <Abs x={120} y={132} style={{ ...rise(ep(3.0, 0.7, a)), opacity: ep(3.0, 0.7, a) * (1 - prog(1.0, 0.4, b)) }}>
        <Headline size={84}>Same source. Every seat.</Headline>
      </Abs>
      <Abs x={120} y={132} style={rise(ep(1.6, 0.7, b))}>
        <Headline size={84}>That’s a fully transparent government.</Headline>
      </Abs>

      {/* The directive itself, still open until the drainage is fixed. */}
      <Abs
        x={120}
        y={268}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 24px",
          borderRadius: 999,
          border: `2px solid ${token("--border-active")}`,
          background: token("--bg-surface"),
          fontSize: 28,
          ...rise(ep(3.8, 0.6, a), 14),
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            boxSizing: "border-box",
            borderRadius: "50%",
            border: `3px solid ${token("--brand-accent")}`,
          }}
        />
        Elm Street drainage · directed March 2019 ·{" "}
        <strong style={{ fontWeight: 700 }}>Open</strong>
      </Abs>

      {/* One thread, running through every seat. */}
      <Wisp path={THREAD} head={head} g={c.g} line amp={10} />

      {SEATS.map(({ x, label, kicker, makes }, i) => {
        const reached = head >= SEAT_AT[i];
        return (
          <div key={label}>
            <Seat x={x} y={THREAD_Y} r={64} label={label} opacity={ep(0.2 + i * 0.1, 0.6, a)} />
            <InfoCard
              lit={b >= 0.7}
              style={{
                left: x - 220,
                top: 712,
                width: 440,
                height: 206,
                opacity: reached ? 1 : 0,
                transform: `translateY(${reached ? 0 : 20}px)`,
                transition: "opacity .6s, transform .6s, border-color .5s, box-shadow .5s",
              }}
            >
              <div style={{ position: "absolute", left: 24, right: 24, top: 18, opacity: first }}>
                <div style={{ marginBottom: 6, fontSize: 24, fontWeight: 600, letterSpacing: "0.04em", color: token("--text-muted") }}>
                  {kicker}
                </div>
                {makes}
              </div>
              <div style={{ opacity: second }}>
                <div style={{ marginBottom: 6, fontSize: 24, fontWeight: 600, letterSpacing: "0.04em", color: token("--brand-accent") }}>
                  Answer
                </div>
                Funded and awarded. No completion notice on file.
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {PILLS.map((n) => (
                    <SourcePill key={n} n={n} size={34} dashed={n === 5} />
                  ))}
                </div>
              </div>
            </InfoCard>
          </div>
        );
      })}
    </>
  );
}
