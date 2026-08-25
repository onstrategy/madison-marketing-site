import { useLayoutEffect, useRef } from "react";
import {
  Caret,
  DemoKeyframes,
  DemoStage,
  STAGE_W,
  clamp,
  ease,
  token,
  typed,
  useDemoClock,
  type Style,
} from "./demo-stage";
import { DEMO_EMAILS, DEMO_PAGES, type Run } from "./pra-content";

// ============================================================================
// PraDemo — the animated product demo under the AI for Public Records Requests
// hero.
//
// One fulfillment run, beat for beat: a records request is typed, six systems
// are searched, the responsive material wires into review buckets, then each
// item is opened, scanned, and either redacted-and-released or withheld —
// finishing with the packaged Records.zip.
//
// The source drove this with an async `runIntro()` plus a `setInterval` cycle.
// As with the solicitation demo, the identical durations are accumulated into
// an absolute timeline so the whole thing can loop cleanly, pause off-screen,
// and hold a still for reduced-motion. See ./demo-stage.tsx for why the
// geometry is in raw pixels.
// ============================================================================

const SANS = "var(--font-sans)";
const SERIF = "var(--font-serif)";
const metaFont: Style = { fontFamily: SANS, letterSpacing: "0.04em" };

const PROMPT =
  "Provide all emails between the City Manager and Commissioner Smith regarding pickleball court funding, plus related contracts, purchase orders, and budget memos.";

const CHIPS = [
  { name: "Outlook", meta: "8,412 msgs" },
  { name: "SharePoint", meta: "2,190 docs" },
  { name: "Laserfiche", meta: "1,204 records" },
  { name: "Barracuda", meta: "archive" },
  { name: "Granicus", meta: "14 agendas" },
  { name: "Other systems", meta: "connect", other: true },
];

/** The four review buckets, in the order they stagger in. */
const BUCKETS = [
  { id: "responsive", label: "AI Reviewed & Ready", count: "14 items", tone: "--semantic-success" },
  { id: "privileged", label: "Privileged", count: "3 items", tone: "--semantic-warning" },
  { id: "private", label: "Needs Human Review", count: "2 items", tone: "--semantic-error" },
  { id: "outscope", label: "Out of scope", count: "126 items", tone: "--text-muted" },
] as const;

/** The one item the reviewer withholds rather than releases (source: `idx === 1`). */
const DENY_INDEX = 1;

/** A source-to-review connector: the drawn path plus the pulses riding it. */
interface PraWire {
  w: { p0: number[]; c0: number[]; c1: number[]; p1: number[] };
  path: SVGPathElement;
  len: number;
  dots: SVGCircleElement[];
  drawStart: number;
}

// ── timeline, accumulated from the source's exact waits ─────────────────────

function buildSchedule() {
  let c = 0;
  const s = (ms: number) => (c += ms);
  const now = () => c / 1000;

  // Phase A — hero zoom, then the request is typed
  s(1650);
  const promptStart = now();
  const promptDur = (PROMPT.length * 36) / 1000;
  s(PROMPT.length * 36);
  s(1200);

  // Phase B — the column settles back, eyebrow and footer fade in
  const settleAt = now();
  s(1650);

  // Phase C — source chips appear one at a time
  const chipsBlockAt = now();
  const chipAt: number[] = [];
  for (let i = 0; i < CHIPS.length; i++) {
    s(220);
    chipAt.push(now());
  }
  s(550);

  // Phase D — the review column, its tally, then the empty buckets
  const midAt = now();
  s(320);
  const midLabelAt = now();
  s(320);
  const tallyAt = now();
  s(450);
  const bucketAt: number[] = [];
  for (let i = 0; i < BUCKETS.length; i++) {
    bucketAt.push(now());
    s(240);
  }
  s(420);

  // Phase E — wires draw, then the emails drop into their buckets
  const wiresAt = now();
  const wireCount = 5;
  s(wireCount * 130 + 700);
  const emailAt: number[] = [];
  for (let i = 0; i < DEMO_EMAILS.length; i++) {
    emailAt.push(now());
    s(160);
  }
  s(380);

  // Phase F — the document column
  const rightAt = now();
  s(380);
  const docAt = now();
  s(420);
  const sortWireAt = now();
  s(1100);

  // Phase G — review cycle, one pass per item on the source's 8.2s interval
  const cycleStart = now();
  const items = DEMO_EMAILS.map((_, i) => {
    const base = cycleStart + i * 8.2;
    return {
      cursorToEmail: base,
      emailClick: base + 0.95,
      pageOpen: base + 1.13,
      actionRow: base + 2.23,
      cursorToButton: base + 2.23,
      buttonClick: base + 3.23,
      outcome: base + 3.49,
      done: base + 5.69,
    };
  });
  c = (cycleStart + DEMO_EMAILS.length * 8.2) * 1000;
  s(7400);

  const finaleAt = now();
  s(1200); // cards lift
  const folderAt = now();
  s(3600); // folder holds
  const fadeAt = now();
  s(900);
  const total = now();

  return {
    promptStart,
    promptDur,
    settleAt,
    chipsBlockAt,
    chipAt,
    midAt,
    midLabelAt,
    tallyAt,
    bucketAt,
    wiresAt,
    emailAt,
    rightAt,
    docAt,
    sortWireAt,
    cycleStart,
    items,
    finaleAt,
    folderAt,
    fadeAt,
    total,
  };
}

const S = buildSchedule();
const DUR = S.total;
/** Reduced-motion still: every item reviewed, the package ready. */
const STATIC_FRAME = S.finaleAt - 1;

export function PraDemo() {
  const { t, viewRef, reduced } = useDemoClock(DUR, { staticAt: STATIC_FRAME });
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorPosRef = useRef<{ x: number; y: number } | null>(null);
  const wiresRef = useRef<PraWire[] | null>(null);
  const sortWireRef = useRef<{ path: SVGPathElement; len: number } | null>(null);
  const wireKeyRef = useRef("");

  // ── frame state ───────────────────────────────────────────────────────────
  const inHero = t < S.settleAt;
  const promptText = typed(PROMPT, S.promptStart, S.promptDur, t);
  const promptCaret = t >= S.promptStart && t < S.settleAt;
  const settled = t >= S.settleAt;

  const chipsShown = t >= S.chipsBlockAt;
  const midShown = t >= S.midAt;
  const midLabel = t >= S.midLabelAt;
  const tallyShown = t >= S.tallyAt;
  const rightShown = t >= S.rightAt;
  const docShown = t >= S.docAt;
  const wiresOn = t >= S.wiresAt;

  /** Per-item review state for this frame. */
  const items = S.items.map((it, i) => {
    const deny = i === DENY_INDEX;
    return {
      i,
      deny,
      visible: t >= S.emailAt[i],
      active: t >= it.emailClick && t < it.done,
      clicking: t >= it.emailClick && t < it.emailClick + 0.55,
      pageOpen: t >= it.pageOpen && t < it.done,
      scanning: t >= it.pageOpen && t < it.outcome,
      showActions: t >= it.actionRow && t < it.done,
      buttonPressed: t >= it.buttonClick && t < it.buttonClick + 0.26,
      resolved: t >= it.outcome,
      done: t >= it.done,
    };
  });

  const activeItem = items.find((it) => it.pageOpen);
  const reviewed = items.filter((it) => it.done).length;
  const released = items.filter((it) => it.done && !it.deny).length;
  const withheld = items.filter((it) => it.done && it.deny).length;

  const inFinale = t >= S.finaleAt;
  const finaleP = ease(clamp((t - S.finaleAt) / 1.2, 0, 1));
  const folderP = ease(clamp((t - S.folderAt) / 0.6, 0, 1));
  const loopFade = t >= S.fadeAt ? 1 - clamp((t - S.fadeAt) / 0.9, 0, 1) : 1;

  // ── imperative layer: cursor + connector wires ────────────────────────────
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const rootRect = root.getBoundingClientRect();
    const fit = rootRect.width / STAGE_W;
    if (!fit) return;

    const toLocal = (el: Element) => {
      const r = el.getBoundingClientRect();
      return {
        x: (r.left + r.width / 2 - rootRect.left) / fit,
        y: (r.top + r.height / 2 - rootRect.top) / fit,
      };
    };
    const stageRect = (el: Element) => {
      const r = el.getBoundingClientRect();
      return {
        x: (r.left - rootRect.left) / fit,
        y: (r.top - rootRect.top) / fit,
        w: r.width / fit,
        h: r.height / fit,
      };
    };

    // Cursor: travels to the row, then to whichever button it will press.
    const cur = root.querySelector<HTMLElement>("[data-cursor]");
    if (cur) {
      const it = items.find((x) => t >= S.items[x.i].cursorToEmail && !x.done);
      let target: Element | null = null;
      if (it && !inFinale) {
        target =
          t >= S.items[it.i].cursorToButton
            ? root.querySelector(`[data-action="${it.deny ? "deny" : "redact"}"]`)
            : root.querySelector(`[data-email="${it.i}"]`);
      }
      if (!target || reduced || inFinale) {
        cur.style.opacity = "0";
      } else {
        const p = toLocal(target);
        if (!cursorPosRef.current) cursorPosRef.current = { x: p.x, y: p.y };
        cursorPosRef.current.x += (p.x - cursorPosRef.current.x) * 0.12;
        cursorPosRef.current.y += (p.y - cursorPosRef.current.y) * 0.12;
        cur.style.opacity = "1";
        cur.style.transform = `translate(${cursorPosRef.current.x.toFixed(1)}px,${cursorPosRef.current.y.toFixed(1)}px)`;
      }
    }

    // Wires: every step-02 source fans into the left edge of the step-03
    // review frame — the same idiom as the other two Platform demos, where the
    // sources feed one destination panel rather than individual rows. The
    // "Other systems" chip is deliberately left unwired: it stands for
    // integrations not connected in this scenario, so a live data line from it
    // would be claiming a flow that isn't there.
    const group = root.querySelector<SVGGElement>("[data-wire-group]");
    const pulses = root.querySelector<SVGGElement>("[data-pulse-group]");
    const sortPath = root.querySelector<SVGPathElement>("[data-sort-wire]");
    if (!group || !pulses || !sortPath) return;
    const sortArea = root.querySelector("[data-sort-area]");
    const docEl = root.querySelector("[data-doc]");
    if (!sortArea || !docEl) return;

    const pr = stageRect(sortArea);
    const key = `${fit.toFixed(4)}:${pr.x.toFixed(1)}:${pr.h.toFixed(1)}`;
    // Measure only once the wires are due. Until then the left column is still
    // held in (or easing out of) its opening zoom, so the chips report
    // transformed positions — and since the geometry is cached, building from
    // them would pin every wire to a start point that no longer exists.
    if (wiresOn && (!wiresRef.current || wireKeyRef.current !== key)) {
      const SVGNS = "http://www.w3.org/2000/svg";
      group.innerHTML = "";
      pulses.innerHTML = "";
      // Fan the arrival points down the frame's left edge, same proportions
      // the staff-report demo uses on its draft card.
      const wired = CHIPS.map((c, i) => ({ c, i })).filter(({ c }) => !c.other);
      const n = wired.length;
      const top = pr.y + pr.h * 0.13;
      const span = pr.h * 0.62;
      const built: PraWire[] = [];
      wired.forEach(({ i }, k) => {
        const chip = root.querySelector(`[data-chip="${i}"]`);
        if (!chip) return;
        const cr = stageRect(chip);
        const x1 = cr.x + cr.w - 6;
        const y1 = cr.y + cr.h / 2;
        const x2 = pr.x + 2;
        const y2 = top + (n > 1 ? (span * k) / (n - 1) : 0);
        const dx = Math.max(70, (x2 - x1) * 0.5);
        const path = document.createElementNS(SVGNS, "path");
        path.setAttribute("d", `M${x1},${y1} C ${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`);
        group.appendChild(path);
        const len = path.getTotalLength();
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
        const dots: SVGCircleElement[] = [];
        for (let d = 0; d < 2; d++) {
          const dot = document.createElementNS(SVGNS, "circle");
          dot.setAttribute("r", "3.4");
          dot.setAttribute("opacity", "0");
          pulses.appendChild(dot);
          dots.push(dot);
        }
        built.push({
          w: { p0: [x1, y1], c0: [x1 + dx, y1], c1: [x2 - dx, y2], p1: [x2, y2] },
          path,
          len,
          dots,
          drawStart: S.wiresAt + k * 0.13,
        });
      });
      wiresRef.current = built;

      const dr = stageRect(docEl);
      const sx1 = pr.x + pr.w;
      const sy1 = pr.y + pr.h / 2;
      const sx2 = dr.x;
      const sy2 = dr.y + dr.h / 2;
      const sdx = (sx2 - sx1) * 0.55;
      sortPath.setAttribute("d", `M${sx1},${sy1} C ${sx1 + sdx},${sy1} ${sx2 - sdx},${sy2} ${sx2},${sy2}`);
      const slen = sortPath.getTotalLength();
      sortPath.style.strokeDasharray = String(slen);
      sortWireRef.current = { path: sortPath, len: slen };
      wireKeyRef.current = key;
    }

    if (!wiresRef.current) return;

    const bez = (w: PraWire["w"], u: number) => {
      const mt = 1 - u;
      const a = mt * mt * mt;
      const b = 3 * mt * mt * u;
      const cc = 3 * mt * u * u;
      const d = u * u * u;
      return [
        a * w.p0[0] + b * w.c0[0] + cc * w.c1[0] + d * w.p1[0],
        a * w.p0[1] + b * w.c0[1] + cc * w.c1[1] + d * w.p1[1],
      ];
    };

    for (const wi of wiresRef.current) {
      const drawP = wiresOn ? clamp((t - wi.drawStart) / 0.8, 0, 1) : 0;
      wi.path.style.strokeDashoffset = (wi.len * (1 - ease(drawP))).toFixed(1);
      wi.dots.forEach((dot, k) => {
        // Pulses only once the wire itself is mostly drawn, and only while the
        // pipeline is actually pulling records — not over the finale.
        if (drawP < 0.55 || inFinale) {
          dot.setAttribute("opacity", "0");
          return;
        }
        const phase = ((((t - wi.drawStart) / 3.1 + k * 0.5) % 1) + 1) % 1;
        const pt = bez(wi.w, phase);
        const op = phase < 0.12 ? phase / 0.12 : phase > 0.88 ? (1 - phase) / 0.12 : 1;
        dot.setAttribute("cx", pt[0].toFixed(1));
        dot.setAttribute("cy", pt[1].toFixed(1));
        dot.setAttribute("opacity", (op * 0.95).toFixed(2));
      });
    }

    if (sortWireRef.current) {
      const p = clamp((t - S.sortWireAt) / 0.8, 0, 1);
      sortWireRef.current.path.style.strokeDashoffset = (
        sortWireRef.current.len * (1 - ease(p))
      ).toFixed(1);
    }
  }, [t, reduced, wiresOn, inFinale, items]);

  const card: Style = {
    background: token("--bg-surface"),
    border: `1px solid ${token("--border-default")}`,
  };

  return (
    <div ref={viewRef}>
      <DemoKeyframes />
      <DemoStage label="Madison AI fulfilling a public records request: scoping, searching every system, triaging by exemption, then redacting and packaging the release">
        <div
          ref={rootRef}
          data-demo-stage
          style={{
            width: STAGE_W,
            height: 1080,
            position: "relative",
            overflow: "hidden",
            background: token("--bg-app"),
            fontFamily: SANS,
            color: token("--text-primary"),
            opacity: loopFade,
          }}
        >
          {/* ── Col 1: request + sources ── */}
          <div
            style={{
              position: "absolute",
              left: 72,
              top: 84,
              width: 430,
              height: 912,
              display: "flex",
              flexDirection: "column",
              transformOrigin: "0 0",
              transition: reduced ? undefined : "transform 1.5s cubic-bezier(0.65,0,0.35,1)",
              transform: inHero ? "translate(470px, 120px) scale(1.72)" : "none",
            }}
          >
            <StepLabel num="01" name="Request" />
            <div style={{ ...card, borderRadius: 16, padding: "18px 22px 16px", boxShadow: "var(--elevation-md)" }}>
              <Fade shown={settled}>
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: 13,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: token("--text-muted"),
                    marginBottom: 11,
                  }}
                >
                  Records Request · Live
                </div>
              </Fade>
              <div style={{ fontSize: 20, lineHeight: 1.45, letterSpacing: "-0.005em", minHeight: "1.45em" }}>
                {promptText}
                {promptCaret ? <Caret height={15} color={token("--brand-primary")} /> : null}
              </div>
              <Fade shown={settled}>
                <div
                  style={{
                    marginTop: 15,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 15,
                    color: token("--text-muted"),
                  }}
                >
                  <span>Jan 1, 2024 – present · 6 mailboxes</span>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: token("--brand-accent"),
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowRight size={15} />
                  </span>
                </div>
              </Fade>
            </div>

            <div style={{ marginTop: 32, opacity: chipsShown ? 1 : 0, transition: "opacity .8s ease" }}>
              <StepLabel num="02" name="Search" />
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {CHIPS.map((c, i) => (
                  <div
                    key={c.name}
                    data-chip={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "0 15px",
                      minHeight: 58,
                      background: c.other ? "transparent" : token("--bg-surface"),
                      borderRadius: 11,
                      border: `1px solid ${c.other ? token("--border-active") : token("--border-default")}`,
                      borderStyle: c.other ? "dashed" : "solid",
                      opacity: t >= S.chipAt[i] ? 1 : 0,
                      transition: "opacity .5s ease",
                      boxShadow: c.other ? undefined : "var(--elevation-xs)",
                    }}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        flex: "0 0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        background: c.other ? token("--bg-hover") : token("--brand-accent", 0.1),
                        color: c.other ? token("--text-muted") : token("--brand-accent"),
                      }}
                    >
                      {c.other ? "+" : c.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span style={{ fontSize: 17, fontWeight: 500 }}>{c.name}</span>
                    <span style={{ marginLeft: "auto", ...metaFont, fontSize: 13, color: token("--text-muted") }}>
                      {c.meta}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Col 2: AI review buckets ── */}
          <div
            style={{
              position: "absolute",
              left: 560,
              top: 84,
              width: 560,
              height: 912,
              display: "flex",
              flexDirection: "column",
              opacity: midShown ? 1 : 0,
              transition: "opacity .8s ease",
            }}
          >
            <Fade shown={midLabel}>
              <StepLabel num="03" name="AI Review" />
            </Fade>
            <Fade shown={tallyShown}>
              <div style={{ ...card, borderRadius: 13, display: "flex", padding: "14px 6px", marginBottom: 16 }}>
                <Tally value="19" label="Flagged" />
                <Tally value={String(released)} label="Ready for release" tone="--semantic-success" />
                <Tally value={String(withheld)} label="Withheld" tone="--semantic-error" />
              </div>
            </Fade>

            <div data-sort-area style={{ display: "flex", flexDirection: "column", gap: 11, flex: 1, minHeight: 0 }}>
              {BUCKETS.map((b, bi) => {
                const rows = DEMO_EMAILS.map((e, i) => ({ e, i })).filter(({ e }) => e.bucket === b.id);
                const bucketActive = rows.some(({ i }) => items[i].active);
                return (
                  <div
                    key={b.id}
                    style={{
                      ...card,
                      borderRadius: 12,
                      padding: "12px 13px",
                      opacity: t >= S.bucketAt[bi] ? 1 : 0,
                      transform: t >= S.bucketAt[bi] ? "none" : "translateY(8px)",
                      transition: "opacity .45s ease, transform .45s ease, border-color .3s",
                      borderColor: bucketActive ? token("--brand-accent") : token("--border-default"),
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: rows.length ? 10 : 0 }}>
                      <span style={{ width: 9, height: 9, borderRadius: 3, background: token(b.tone) }} />
                      <span style={{ fontSize: 15.5, fontWeight: 600 }}>{b.label}</span>
                      <span style={{ marginLeft: "auto", ...metaFont, fontSize: 13, color: token("--text-muted") }}>
                        {b.count}
                      </span>
                    </div>
                    {rows.map(({ e, i }) => {
                      const st = items[i];
                      return (
                        <div
                          key={e.subject}
                          data-email={i}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                            padding: "9px 10px",
                            borderRadius: 9,
                            marginBottom: 6,
                            opacity: st.visible ? 1 : 0,
                            transition: "opacity .4s ease, background .3s, border-color .3s",
                            background: st.active ? token("--brand-accent", 0.08) : token("--bg-app"),
                            border: `1px solid ${st.active ? token("--brand-primary") : token("--border-default")}`,
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                              <span style={{ ...metaFont, fontSize: 12.5, color: token("--text-muted") }}>
                                <Runs runs={e.from} redact={false} />
                              </span>
                              <span style={{ ...metaFont, fontSize: 12.5, color: token("--text-muted") }}>{e.date}</span>
                            </div>
                            <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 2 }}>{e.subject}</div>
                            <div
                              style={{
                                fontSize: 12.5,
                                lineHeight: 1.45,
                                color: token("--text-muted"),
                                marginTop: 3,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              <Runs runs={e.snippet} redact={false} />
                            </div>
                          </div>
                          <span
                            style={{
                              width: 21,
                              height: 21,
                              borderRadius: "50%",
                              flex: "0 0 auto",
                              marginTop: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "background .3s",
                              background: st.done
                                ? st.deny
                                  ? token("--semantic-error")
                                  : token("--semantic-success")
                                : token("--bg-hover"),
                            }}
                          >
                            {st.done ? st.deny ? <Cross /> : <Check size={11} /> : null}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Col 3: the document under redaction ── */}
          <div
            style={{
              position: "absolute",
              left: 1176,
              top: 84,
              width: 672,
              height: 912,
              display: "flex",
              flexDirection: "column",
              opacity: rightShown ? 1 : 0,
              transition: "opacity .8s ease",
            }}
          >
            <StepLabel num="04" name="AI Redaction" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ ...metaFont, fontSize: 13, color: token("--text-muted"), textTransform: "uppercase", letterSpacing: "0.14em" }}>
                Production package
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  ...card,
                  borderRadius: 999,
                  padding: "8px 16px 8px 12px",
                  fontSize: 14.5,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: reviewed === DEMO_EMAILS.length ? token("--semantic-success") : token("--brand-accent"),
                    animation: reviewed === DEMO_EMAILS.length ? undefined : "mai-pulse 1.4s ease-in-out infinite",
                  }}
                />
                {reviewed} / {DEMO_EMAILS.length} reviewed
              </span>
            </div>

            <div
              data-doc
              style={{
                ...card,
                flex: 1,
                minHeight: 0,
                borderRadius: 15,
                position: "relative",
                overflow: "hidden",
                boxShadow: "var(--elevation-xl)",
                opacity: docShown ? 1 : 0,
                transition: "opacity .6s ease",
              }}
            >
              {DEMO_PAGES.map((p, i) => {
                const st = items[i];
                if (!st.pageOpen) return null;
                const redacted = st.resolved;
                return (
                  <div key={p.title} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "18px 26px 14px", borderBottom: `1px solid ${token("--border-default")}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ ...metaFont, fontSize: 12.5, color: token("--text-muted") }}>{p.eyebrow}</div>
                          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 22, marginTop: 4, letterSpacing: "-0.01em" }}>
                            {p.title}
                          </div>
                        </div>
                        <span
                          style={{
                            flex: "0 0 auto",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 7,
                            fontSize: 12.5,
                            fontWeight: 600,
                            padding: "5px 11px",
                            borderRadius: 999,
                            background:
                              p.tag.kind === "private"
                                ? token("--semantic-error", 0.12)
                                : token("--semantic-success", 0.12),
                            color: p.tag.kind === "private" ? token("--semantic-error") : token("--semantic-success"),
                          }}
                        >
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: 2,
                              background:
                                p.tag.kind === "private" ? token("--semantic-error") : token("--semantic-success"),
                            }}
                          />
                          {p.tag.label}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "76px 1fr",
                          rowGap: 4,
                          columnGap: 12,
                          marginTop: 13,
                          fontSize: 13,
                        }}
                      >
                        {p.meta.map(([k, v]) => (
                          <span key={k} style={{ display: "contents" }}>
                            <b style={{ ...metaFont, fontSize: 11.5, color: token("--text-muted"), letterSpacing: "0.1em" }}>{k}</b>
                            <span style={{ color: token("--text-secondary") }}>
                              <Runs runs={v} redact={redacted} />
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: "18px 26px", position: "relative" }}>
                      {p.paragraphs.map((para, pi) => (
                        <p key={pi} style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.62, color: token("--text-secondary") }}>
                          <Runs runs={para} redact={redacted} />
                        </p>
                      ))}
                      {st.scanning ? (
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            background: `linear-gradient(100deg, transparent 20%, ${token("--brand-primary", 0.16)} 50%, transparent 80%)`,
                            animation: "mai-scan 1.2s ease-in-out infinite",
                          }}
                        />
                      ) : null}
                      {st.resolved && st.deny ? (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: token("--bg-surface", 0.86),
                          }}
                        >
                          <span
                            style={{
                              fontFamily: SERIF,
                              fontWeight: 600,
                              fontSize: 30,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: token("--semantic-error"),
                              border: `3px solid ${token("--semantic-error")}`,
                              borderRadius: 10,
                              padding: "12px 26px",
                              transform: "rotate(-6deg)",
                            }}
                          >
                            Withheld
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div
                      style={{
                        flex: "0 0 auto",
                        display: "flex",
                        gap: 11,
                        padding: "14px 20px 18px",
                        borderTop: `1px solid ${token("--border-default")}`,
                        opacity: st.showActions ? 1 : 0,
                        transition: "opacity .35s ease",
                      }}
                    >
                      <ActionButton
                        kind="deny"
                        label="Do Not Release"
                        emphasized={st.deny}
                        pressed={st.deny && st.buttonPressed}
                      />
                      <ActionButton
                        kind="redact"
                        label="Redact & Release"
                        emphasized={!st.deny}
                        pressed={!st.deny && st.buttonPressed}
                      />
                    </div>
                  </div>
                );
              })}
              {!activeItem ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: token("--text-muted"),
                    fontSize: 15,
                  }}
                >
                  {reviewed === DEMO_EMAILS.length ? "All items reviewed" : "Awaiting review"}
                </div>
              ) : null}
            </div>
          </div>

          {/* Connector wires */}
          <svg
            viewBox="0 0 1920 1080"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 20,
              opacity: wiresOn && !inFinale ? 1 : 0,
              transition: "opacity .6s ease",
            }}
          >
            <defs>
              <linearGradient id="praWire" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={token("--text-muted")} stopOpacity="0.3" />
                <stop offset="50%" stopColor={token("--brand-accent")} stopOpacity="1" />
                <stop offset="100%" stopColor={token("--text-muted")} stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <g data-wire-group fill="none" stroke="url(#praWire)" strokeWidth="2.4" strokeLinecap="round" />
            <g data-pulse-group fill={token("--brand-accent")} />
            <path data-sort-wire fill="none" stroke="url(#praWire)" strokeWidth="2.6" strokeLinecap="round" d="M0,0" />
          </svg>

          {/* Cursor */}
          <div
            data-cursor
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 60,
              pointerEvents: "none",
              opacity: 0,
              transition: "opacity .25s ease",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 32" style={{ filter: "drop-shadow(0 4px 8px rgb(0 0 0 / 0.35))" }}>
              <path
                d="M2 2 L2 26 L9 20 L13 30 L17 28.5 L13 18.5 L22 18.5 Z"
                fill={token("--text-primary")}
                stroke={token("--bg-plate")}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Finale — the released set packaged for delivery */}
          {inFinale ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 70,
                background: token("--bg-app"),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 34,
                opacity: finaleP,
              }}
            >
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 46, letterSpacing: "-0.02em" }}>Records.zip</div>
              <div
                style={{
                  width: 250,
                  height: 186,
                  borderRadius: 18,
                  background: token("--brand-accent"),
                  boxShadow: "var(--elevation-2xl)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${(0.86 + 0.14 * folderP).toFixed(3)})`,
                  transition: "transform .3s ease",
                }}
              >
                <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 30, color: token("--brand-foreground") }}>
                  {released} files
                </span>
              </div>
              <div style={{ display: "flex", gap: 44, fontSize: 19, color: token("--text-secondary") }}>
                <span>
                  <b style={{ color: token("--text-primary") }}>{released}</b> released
                </span>
                <span>
                  <b style={{ color: token("--text-primary") }}>{withheld}</b> withheld
                </span>
                <span>
                  <b style={{ color: token("--text-primary") }}>126</b> out of scope
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </DemoStage>
    </div>
  );
}

// ── pieces ──────────────────────────────────────────────────────────────────

/**
 * Renders a run list. Once `redact` is on, every `r` span becomes a black bar —
 * the text is replaced, not merely covered, so nothing sensitive is left in the
 * DOM for a reader to pull back out.
 */
function Runs({ runs, redact }: { runs: Run[]; redact: boolean }) {
  return (
    <>
      {runs.map(([kind, text], i) =>
        kind === "r" ? (
          redact ? (
            <span
              key={i}
              aria-label="redacted"
              style={{
                display: "inline-block",
                background: token("--text-primary"),
                color: "transparent",
                borderRadius: 3,
                verticalAlign: "baseline",
                userSelect: "none",
              }}
            >
              {" ".repeat(Math.max(3, Math.round(text.length * 0.9)))}
            </span>
          ) : (
            <span key={i} style={{ color: token("--semantic-error"), fontWeight: 500 }}>
              {text}
            </span>
          )
        ) : (
          <span key={i}>{text}</span>
        ),
      )}
    </>
  );
}

function Fade({ shown, children }: { shown: boolean; children: React.ReactNode }) {
  return <div style={{ opacity: shown ? 1 : 0, transition: "opacity .7s ease" }}>{children}</div>;
}

function StepLabel({ num, name }: { num: string; name: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        paddingBottom: 11,
        borderBottom: `2px solid ${token("--text-primary")}`,
        marginBottom: 16,
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 32, lineHeight: 0.9, letterSpacing: "-0.02em" }}>{num}</span>
      <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 32, lineHeight: 0.9, letterSpacing: "-0.02em" }}>
        {name}
      </span>
    </div>
  );
}

function Tally({ value, label, tone }: { value: string; label: string; tone?: string }) {
  return (
    <div style={{ flex: 1, textAlign: "center", padding: "0 8px" }}>
      <div
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 30,
          lineHeight: 1.1,
          color: tone ? token(tone) : token("--text-primary"),
        }}
      >
        {value}
      </div>
      <div style={{ ...metaFont, fontSize: 12, color: token("--text-muted"), marginTop: 3 }}>{label}</div>
    </div>
  );
}

function ActionButton({
  kind,
  label,
  emphasized,
  pressed,
}: {
  kind: "deny" | "redact";
  label: string;
  emphasized: boolean;
  pressed: boolean;
}) {
  const isDeny = kind === "deny";
  return (
    <span
      data-action={kind}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        padding: "13px 16px",
        borderRadius: 11,
        fontSize: 15.5,
        fontWeight: 600,
        transition: "all .2s ease",
        transform: pressed ? "scale(.96)" : "scale(1)",
        background: emphasized
          ? isDeny
            ? token("--semantic-error")
            : token("--brand-accent")
          : token("--bg-app"),
        color: emphasized ? token("--brand-foreground") : token("--text-muted"),
        border: `1px solid ${emphasized ? "transparent" : token("--border-default")}`,
      }}
    >
      {label}
    </span>
  );
}

function Check({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={token("--brand-foreground")} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Cross() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={token("--brand-foreground")} strokeWidth="3.2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ArrowRight({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={token("--brand-foreground")} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
