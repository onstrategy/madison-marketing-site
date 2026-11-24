import { useLayoutEffect, useRef, useState } from "react";
import { Link2, Paperclip } from "lucide-react";
import {
  Abs,
  H,
  W,
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
  CITY,
  Headline,
  InfoCard,
  PEOPLE,
  Speaker,
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
  [-60, 300],
  [150, 360],
  [330, 470],
  [460, 540],
  [528, 560],
]);

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
  [1300, 950],
  [1120, 900],
  [1010, 790],
  [985, 750],
]);

const STATUS = ["Gathered", "Reviewed", "Released"];

/** When the released emails start flying into the conversation (seconds into the sign-off click). */
const ATTACH_AT = 3.5;
/** How long each email takes to morph into its attachment row. */
const MORPH = 1.1;

/**
 * The resident's morning, as one conversation in the city's portal. The
 * public-record answer comes first; on the next click the window glides left,
 * the conversation scrolls up, and the request for the emails continues in
 * the same thread, so the two read as one exchange rather than two screens.
 */
/**
 * Where each attachment slot sits inside the chat window, in stage pixels,
 * as if the conversation were not scrolled. Measured from the rendered page
 * (and divided by the stage's current scale), so it lands exactly whatever
 * the fonts, borders and paddings add up to.
 */
function slotsInWindow(chips: HTMLElement, content: HTMLElement) {
  const win = chips.closest("[data-window]");
  if (!(win instanceof HTMLElement)) return [];
  const winRect = win.getBoundingClientRect();
  const scale = winRect.width / win.offsetWidth || 1;
  const scrolled = Number(/translateY\((-?[\d.]+)px\)/.exec(content.style.transform)?.[1] ?? 0);
  return [...chips.children].map((el) => {
    const r = el.getBoundingClientRect();
    return {
      top: (r.top - winRect.top) / scale - scrolled,
      left: (r.left - winRect.left) / scale,
      width: r.width / scale,
      height: r.height / scale,
    };
  });
}

export function PortalChat({ c }: { c: Clock }) {
  // Timed to follow the old on-screen clock; the time now has its own click,
  // so the chat starts straight away.
  const m = c.at(S.morning);
  const a = m < 0 ? -1 : m + 2.8;
  const r = c.at(S.review);
  // The review's own builds start once the window has moved and scrolled.
  const ra = r < 0 ? -1 : r - 0.6;
  const b = c.at(S.signed);
  const move = ease(prog(0, 0.9, r));

  const morningRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({
    morning: 640,
    reviewTop: 680,
    total: 1460,
    // Where each attachment slot sits in the chat, measured from the window
    // body (the slots' nearest positioned ancestor), padding included.
    slots: [] as { top: number; left: number; width: number; height: number }[],
  });
  useLayoutEffect(() => {
    const measure = () => {
      const m = morningRef.current;
      const v = reviewRef.current;
      const all = contentRef.current;
      const chips = chipsRef.current;
      if (m && v && all && chips) {
        setSize({
          morning: m.offsetHeight,
          reviewTop: v.offsetTop,
          total: all.offsetHeight,
          slots: slotsInWindow(chips, all),
        });
      }
    };
    measure();
    void document.fonts.ready.then(measure);
  }, [c.step]);

  // Morning: the window fits its answer. Review: a taller window, scrolled.
  const WINDOW_TOP = 120;
  const HEADER = 88;
  const PAD = 30;
  const REVIEW_HEIGHT = 920;
  const height = lerp(size.morning + HEADER + 2 * PAD + 12, REVIEW_HEIGHT, move);
  const windowLeft = lerp(530, 120, move);
  // Scroll so the new request sits near the top, with the end of the earlier
  // answer still peeking in above it; then, like any chat, keep scrolling as
  // the reply and its attachments arrive so the newest message stays in view.
  const PEEK = 120;
  const firstScroll = Math.max(0, size.reviewTop - PEEK);
  const visible = REVIEW_HEIGHT - HEADER - 2 * PAD;
  // A little slack so nothing at the foot of the thread ever touches the edge.
  const SLACK = 24;
  const extra = Math.max(0, size.total + SLACK - firstScroll - visible);
  const follow = ease(prog(2.9, 0.8, b));
  const scroll = firstScroll * move + extra * follow;

  const head = glide(prog(5.0, 4.2, ra));
  const redacted = EMAIL_AT.map((f) => head >= f);
  const done = [ra >= 4.6, b >= 0.8, b >= 3.3];
  const stamp = ep(0.15, 0.32, b);

  return (
    <>
      <AppWindow
        title={PORTAL}
        style={{
          left: windowLeft,
          top: WINDOW_TOP,
          width: 860,
          height,
          ...rise(ep(3.1, 0.7, a)),
        }}
      >
        <div
          style={{
            height: "100%",
            overflow: "hidden",
            maskImage: scroll > 0 ? "linear-gradient(to bottom, transparent 0, black 110px)" : undefined,
            WebkitMaskImage: scroll > 0 ? "linear-gradient(to bottom, transparent 0, black 110px)" : undefined,
          }}
        >
          <div ref={contentRef} style={{ transform: `translateY(${-scroll}px)` }}>
            {/* The public record. */}
            <div ref={morningRef}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                <Speaker who="resident" size={28} style={rise(ep(3.5, 0.4, a), 8)} />
                <Bubble from="person" style={rise(ep(3.8, 0.35, a), 8)}>
                  <Typed text={PORTAL_QUESTION} start={3.9} dur={1.6} t={a} />
                </Bubble>
              </div>
              <div style={{ marginTop: 30, ...rise(ep(5.8, 0.4, a), 8) }}>
                <Speaker who="city" size={28} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
                {PUBLIC_LINKS.map((link, i) => (
                  <InfoCard
                    key={link}
                    kicker="Link"
                    icon={<Link2 size={24} />}
                    lit={a >= 6.5 + i * 0.45}
                    style={{
                      position: "relative",
                      minHeight: 140,
                      paddingBottom: 24,
                      ...rise(ep(6.3 + i * 0.45, 0.6, a)),
                    }}
                  >
                    {link}
                  </InfoCard>
                ))}
              </div>
              <div
                style={{
                  display: "inline-block",
                  marginTop: 26,
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
            </div>

            {/* The next request, in the same thread. */}
            <div ref={reviewRef} style={{ marginTop: 44 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                <Speaker who="resident" size={28} style={rise(ep(0.3, 0.4, ra), 8)} />
                <Bubble from="person" style={rise(ep(0.4, 0.35, ra), 8)}>
                  <Typed text="Can I see the emails with the contractor?" start={0.5} dur={1.3} t={ra} />
                </Bubble>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 12,
                  marginTop: 30,
                  ...rise(ep(2.0, 0.4, ra), 8),
                }}
              >
                <Speaker who="city" size={28} />
                <Bubble from="assistant" style={rise(ep(2.2, 0.5, ra), 8)}>
                  These need a review first. Request started.
                </Bubble>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 26, ...rise(ep(3.0, 0.5, ra), 12) }}>
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
              <Bubble from="assistant" style={{ marginTop: 22, ...rise(ep(3.1, 0.6, b), 12) }}>
                Your records are ready.
              </Bubble>
              {/* Empty slots that hold the attachments' place in the thread. The
                  attachments themselves are the email cards, which travel here
                  and stay; nothing is ever swapped in. */}
              <div ref={chipsRef} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                {EMAILS.map(({ subject }) => (
                  <div
                    key={subject}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "10px 18px",
                      borderRadius: 12,
                      border: `2px solid ${token("--border-active")}`,
                      background: token("--bg-surface"),
                      fontSize: 24,
                      visibility: "hidden",
                    }}
                  >
                    <Paperclip size={24} color={token("--text-secondary")} />
                    <span style={{ fontWeight: 600 }}>{subject}</span>
                    <span style={{ marginLeft: "auto", color: token(PEOPLE), fontWeight: 600 }}>
                      Redacted · signed off
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppWindow>

      <Wisp
        path={INTO_PORTAL}
        head={glide(prog(5.0, 1.3, a))}
        g={c.g}
        opacity={1 - prog(0, 0.4, r)}
      />

      {/* The emails: kept by the city, redactions marked, waiting for a person.
          Once released, each card morphs in place into its attachment row in
          the chat: it slides and reshapes to the row's exact size and spot
          while its contents cross-fade from email to attachment. */}
      {r >= 0
        ? EMAILS.map(({ subject, y, cuts }, i) => {
            const p = ep(3.4 + i * 0.2, 0.6, ra);
            const f = ease(prog(ATTACH_AT + i * 0.15, MORPH, b));
            // Its slot in the chat, tracked live with the window and its scroll,
            // so the card arrives exactly where the attachment belongs and
            // simply stays there.
            const slot = size.slots[i] ?? { top: 0, left: PAD, width: 860 - 2 * PAD, height: 52 };
            const toX = windowLeft + slot.left;
            const toY = WINDOW_TOP + slot.top - scroll;
            const toW = slot.width;
            return (
              <div
                key={subject}
                style={{
                  position: "absolute",
                  boxSizing: "border-box",
                  left: lerp(1040, toX, f) + (1 - p) * 80,
                  top: lerp(y, toY, f),
                  width: lerp(760, toW, f),
                  height: lerp(180, slot.height, f),
                  borderRadius: lerp(16, 12, f),
                  border: `2px solid ${token("--border-active")}`,
                  background: token("--bg-surface"),
                  boxShadow: `0 ${18 * Math.sin(Math.PI * f)}px ${40 * Math.sin(Math.PI * f)}px ${token("--text-primary", 0.12)}`,
                  overflow: "hidden",
                  opacity: p,
                }}
              >
                {/* As an email… */}
                <div style={{ padding: "18px 24px", opacity: 1 - prog(0, 0.35, f) }}>
                  <div style={{ marginBottom: 6, fontSize: 24, fontWeight: 600, letterSpacing: "0.04em", color: token("--text-muted") }}>
                    Email · kept by the city
                  </div>
                  <div style={{ fontSize: 30, lineHeight: 1.25, fontWeight: 500 }}>{subject}</div>
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
                </div>
                {/* …becoming its attachment row. */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "0 18px",
                    fontSize: 24,
                    whiteSpace: "nowrap",
                    opacity: prog(0.55, 0.45, f),
                  }}
                >
                  <Paperclip size={24} color={token("--text-secondary")} />
                  <span style={{ fontWeight: 600 }}>{subject}</span>
                  <span style={{ marginLeft: "auto", color: token(PEOPLE), fontWeight: 600 }}>
                    Redacted · signed off
                  </span>
                </div>
              </div>
            );
          })
        : null}

      {r >= 0 ? <Wisp path={THROUGH_EMAILS} head={head} g={c.g} orb={b < 1.2} /> : null}
      {b >= 1.2 ? (
        <Wisp
          path={TO_RESIDENT}
          head={glide(prog(1.2, 1.9, b))}
          g={c.g}
          opacity={1 - prog(ATTACH_AT, 0.5, b)}
        />
      ) : null}

      {/* Nothing is released without a person's stamp. */}
      {b >= 0.15 ? (
        <Abs
          x={1250}
          y={470}
          style={{
            opacity: stamp * (1 - prog(ATTACH_AT - 0.2, 0.4, b)),
            transform: `rotate(-8deg) scale(${lerp(1.7, 1, stamp)})`,
          }}
        >
          <Stamp size={84} style={{ background: token("--bg-surface", 0.92) }} />
        </Abs>
      ) : null}
    </>
  );
}

// ── 8 · One memory ──────────────────────────────────────────────────────────

const THREAD_Y = 420;
const THREAD = makePath([
  [-60, THREAD_Y],
  [480, THREAD_Y],
  [960, THREAD_Y],
  [1440, THREAD_Y],
  [1980, THREAD_Y],
]);

const SEATS: {
  x: number;
  who: "staff" | "council" | "resident";
  label: string;
  kicker: string;
  makes: string;
}[] = [
  { x: 480, who: "staff", label: "Staff", kicker: "Staff report", makes: "In the city’s template, every line cited" },
  { x: 960, who: "council", label: "Council", kicker: "Council brief", makes: "One page, no request to staff" },
  { x: 1440, who: "resident", label: "Resident", kicker: "Public answer", makes: "The record, on the city’s portal" },
];
const SEAT_AT = SEATS.map(({ x }) => fracAt(THREAD, [x, THREAD_Y]));

const PILLS = [1, 2, 3, 4, 5];

/** The one answer every seat gets, laid across all three columns. */
const ANSWER_TOP = 760;
const CARD_TOP = 520;
const CARD_H = 170;

export function OneMemory({ c }: { c: Clock }) {
  const a = c.at(S.seats);
  const b = c.at(S.unify);
  const head = glide(prog(0.5, 2.4, a));
  const join = ep(0.3, 0.6, b);
  const answer = ep(0.8, 0.6, b);

  return (
    <>
      {/* The title holds for the whole scene. */}
      <Abs x={0} y={130} w={W} style={{ textAlign: "center", ...rise(ep(2.8, 0.7, a)) }}>
        <Headline size={96}>Same source. Every seat.</Headline>
      </Abs>

      {/* One thread, running through every seat. */}
      <Wisp path={THREAD} head={head} g={c.g} line amp={10} />

      {SEATS.map(({ x, who, label, kicker, makes }, i) => {
        const reached = head >= SEAT_AT[i];
        return (
          <div key={label}>
            <Abs
              x={x - 220}
              y={THREAD_Y - 32}
              w={440}
              style={{ display: "flex", justifyContent: "center", opacity: ep(0.2 + i * 0.1, 0.6, a) }}
            >
              <Speaker who={who} size={40} />
            </Abs>
            <InfoCard
              kicker={kicker}
              style={{
                left: x - 220,
                top: CARD_TOP,
                width: 440,
                height: CARD_H,
                opacity: reached ? 1 : 0,
                transform: `translateY(${reached ? 0 : 20}px)`,
                transition: "opacity .6s, transform .6s",
              }}
            >
              {makes}
            </InfoCard>
            {/* Each seat's work drops into the same answer. */}
            <Abs
              x={x - 2}
              y={CARD_TOP + CARD_H}
              w={4}
              h={(ANSWER_TOP - CARD_TOP - CARD_H) * join}
              style={{
                borderRadius: 2,
                background: token("--brand-accent"),
                boxShadow: `0 0 14px ${token("--brand-accent", 0.5)}`,
              }}
            />
          </div>
        );
      })}

      {/* One answer, the same for every seat. */}
      <InfoCard
        lit
        kicker="One answer, every seat"
        style={{
          left: SEATS[0].x - 220,
          top: ANSWER_TOP,
          width: SEATS[2].x - SEATS[0].x + 440,
          padding: "22px 32px 26px",
          ...rise(answer, 18),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <span style={{ fontSize: 36 }}>Funded and awarded. No completion notice on file.</span>
          <span style={{ display: "flex", gap: 10 }}>
            {PILLS.map((n) => (
              <SourcePill key={n} n={n} size={44} dashed={n === 5} />
            ))}
          </span>
        </div>
      </InfoCard>
    </>
  );
}

/** The scene's conclusion, on its own: one line on a clear page. */
export function Transparent({ c }: { c: Clock }) {
  const a = c.at(S.transparent);
  return (
    <Abs x={0} y={0} w={W} h={H} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Headline size={120} style={{ textAlign: "center", ...rise(ep(0.3, 0.9, a), 24) }}>
        That’s a fully transparent government.
      </Headline>
    </Abs>
  );
}
