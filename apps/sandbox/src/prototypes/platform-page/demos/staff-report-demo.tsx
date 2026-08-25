import { useLayoutEffect, useRef } from "react";
import { logoForSource } from "../../landing/source-logos";
import {
  Caret,
  DemoKeyframes,
  DemoStage,
  STAGE_W,
  clamp,
  ease,
  prog,
  token,
  typed,
  useDemoClock,
  type Style,
} from "./demo-stage";

// ============================================================================
// StaffReportDemo — the animated product demo under the Citywide AI and
// Community Development AI heroes.
//
// A 50-second loop of one real workflow, beat for beat: a staff member types a
// prompt, Madison searches six systems of record, the sources wire into a
// draft, the report writes itself section by section with live citations, the
// user opens two citations and asks for a revision, then exports to Word.
//
// The timeline (`T`), copy, drafting schedule, cursor track, and flow window
// below are ported unchanged from the approved design so the flow and script
// stay identical — only the palette and typography are re-pointed at Madison's
// tokens. See ./demo-stage.tsx for why the geometry is in raw pixels.
// ============================================================================

const DUR = 50;

/** Keyframe times, in seconds. */
const T = {
  searchT: 6.6,
  cardAppear: 10.6,
  draftStart: 13.0,
  draftDoneAt: 26.6,
  reviewStart: 27.0,
  cite1At: 27.5,
  cite2At: 30.5,
  reviseStart: 33.4,
  reviseDone: 35.8,
  reviseRespAt: 36.1,
  bulletsStart: 36.6,
  exportTabAt: 40.0,
  exportClickAt: 40.9,
  toastAt: 41.1,
  endAt: 43.8,
};

/** The still shown to reduced-motion visitors: finished draft, all citations in. */
const STATIC_FRAME = 27.0;

const PROMPT =
  "Draft a new staff report to approve the opioid settlement between Cedar Hollow and Purdue Pharmaceuticals for $10,000,000. Direct staff to appropriate the funds — at the direction of the City Manager and Finance Director — to create a special fund.";

interface Chip {
  name: string;
  meta: string;
  /** Fallback glyph for sources with no licensed wordmark (site convention). */
  mono?: string;
}

const CHIPS: Chip[] = [
  { name: "Laserfiche", meta: "1,204 records" },
  { name: "Granicus", meta: "14 agendas" },
  { name: "SharePoint", meta: "318 files" },
  { name: "Municode", meta: "§ 2.40" },
  { name: "State law", meta: "3 statutes", mono: "§" },
  { name: "YouTube", meta: "2 meetings" },
];

const FACTS = [
  { k: "Settlement", v: "$10,000,000" },
  { k: "Counterparty", v: "Purdue Pharma" },
  { k: "Destination", v: "Special fund" },
  { k: "Authority", v: "Charter § 2.40" },
];

interface Section {
  key: string;
  num: string;
  heading: string;
  body: string;
  cites: number[];
  bullets?: { text: string; cites: number[] }[];
}

const SECTIONS: Section[] = [
  {
    key: "rec",
    num: "01",
    heading: "Recommendation",
    body: "Staff recommends that the City Council approve the settlement agreement between the City of Cedar Hollow and Purdue Pharmaceuticals in the amount of $10,000,000, and direct staff to appropriate the funds — at the direction of the City Manager and the Finance Director — into a newly established Opioid Abatement Special Fund.",
    cites: [1],
  },
  {
    key: "bg",
    num: "02",
    heading: "Background",
    body: "The City of Cedar Hollow was a participating litigant in the national prescription-opioid settlement. The negotiated allocation to Cedar Hollow totals $10,000,000, payable over the multi-year settlement schedule. Settlement terms restrict use of these funds to approved opioid-abatement purposes consistent with the master settlement framework.",
    cites: [2, 3],
    bullets: [
      { text: "Cedar Hollow joined the national prescription-opioid settlement.", cites: [2] },
      { text: "The negotiated allocation totals $10,000,000.", cites: [2] },
      { text: "Funds are paid over a multi-year settlement schedule.", cites: [] },
      { text: "Use is restricted to approved opioid-abatement purposes.", cites: [3] },
    ],
  },
  {
    key: "fisc",
    num: "03",
    heading: "Fiscal Impact",
    body: "Receipt of the $10,000,000 settlement is non-recurring revenue and will not be deposited into the General Fund. To preserve restricted-use compliance and audit traceability, staff recommends a dedicated special fund. No new General Fund appropriation is required.",
    cites: [4],
  },
  {
    key: "fund",
    num: "04",
    heading: "Special Fund & Appropriation",
    body: "The Opioid Abatement Special Fund will be established under City Charter § 2.40. Appropriations from the fund shall be made jointly at the direction of the City Manager and the Finance Director, consistent with Council-adopted abatement priorities.",
    cites: [5],
  },
];

const CITES = [
  {
    n: 1,
    sec: "rec",
    title: "Settlement Agreement — Cedar Hollow v. Purdue",
    src: "Laserfiche · Permanent records",
    detail:
      "Executed February 2026. Allocates $10,000,000 to the City of Cedar Hollow under the national prescription-opioid resolution.",
  },
  {
    n: 2,
    sec: "bg",
    title: "National Opioid Settlement — Allocation Schedule",
    src: "SharePoint · Internal files",
    detail: "Exhibit C, p. 42 — multi-year disbursement schedule by participating subdivision.",
  },
  {
    n: 3,
    sec: "bg",
    title: "Master Settlement Framework — Approved Uses",
    src: "State Law · Statutes",
    detail: "§ V — enumerated permissible opioid-abatement expenditures.",
  },
  {
    n: 4,
    sec: "fisc",
    title: "FY26 Finance Policy — Special Revenue Funds",
    src: "Municode · § 2.40",
    detail: "Segregation and audit requirements for restricted revenue.",
  },
  {
    n: 5,
    sec: "fund",
    title: "City Charter § 2.40 — Special Fund Authority",
    src: "Municode",
    detail: "Authorizes Council to establish dedicated special funds.",
  },
];

/** Per-section drafting schedule: [headingStart, bodyStart, bodyDuration]. */
const SCHED: Record<string, [number, number, number]> = {
  rec: [14.0, 14.4, 2.4],
  bg: [17.2, 17.6, 3.0],
  fisc: [21.0, 21.4, 2.4],
  fund: [24.2, 24.6, 2.0],
};

/** When each section's body finishes — gates its citation appearing. */
const SECDONE: Record<string, number> = { rec: 16.8, bg: 20.6, fisc: 23.8, fund: 26.6 };

/** Where the oversized cursor is at each beat, and whether it clicks there. */
const CURSOR: { at: number; sel: string | null; click?: boolean }[] = [
  { at: 4.7, sel: '[data-cur="send"]' },
  { at: 5.85, sel: '[data-cur="send"]', click: true },
  { at: 7.0, sel: '[data-cur="systems"]' },
  { at: 11.0, sel: '[data-cur="doc"]' },
  { at: 27.5, sel: '[data-cur="cite1"]', click: true },
  { at: 30.5, sel: '[data-cur="cite2"]', click: true },
  { at: 33.5, sel: '[data-cur="revise"]', click: true },
  { at: 35.8, sel: '[data-cur="revisesend"]', click: true },
  { at: 40.9, sel: '[data-cur="export"]', click: true },
  { at: 43.5, sel: null },
];

/** When the source-to-draft connector wires are live. */
const FLOW = { start: 11.3, end: 26.6 };

/**
 * Microsoft Word's own chrome color. Deliberately not a Madison token: this is
 * a third-party product surface inside the demo, the same reasoning that gives
 * client logos a true-white `bg-plate` to sit on rather than the warm canvas.
 */
const WORD_BLUE = "#2b5797";

const SANS = "var(--font-sans)";
const SERIF = "var(--font-serif)";

/** The retired mono role — Inter, tightened and tracked out (design-system skill). */
const metaFont: Style = { fontFamily: SANS, letterSpacing: "0.04em" };

export function StaffReportDemo() {
  const { t, viewRef, reduced } = useDemoClock(DUR, { staticAt: STATIC_FRAME });
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const cursorPosRef = useRef<{ x: number; y: number } | null>(null);
  const wiresRef = useRef<
    | {
        w: { p0: number[]; c0: number[]; c1: number[]; p1: number[] };
        path: SVGPathElement;
        len: number;
        dots: SVGCircleElement[];
        drawStart: number;
      }[]
    | null
  >(null);
  const wireKeyRef = useRef("");

  // ── derived state for this frame ──────────────────────────────────────────
  const supBase: Style = {
    color: token("--brand-accent"),
    background: token("--brand-accent", 0.12),
    fontSize: 15,
    fontWeight: 700,
    padding: "2px 6px",
    borderRadius: 5,
    verticalAlign: "super",
    marginLeft: 3,
    ...metaFont,
  };
  const supHot: Style = {
    ...supBase,
    color: token("--brand-foreground"),
    background: token("--brand-accent"),
    boxShadow: `0 0 0 3px ${token("--brand-accent", 0.18)}`,
  };

  const promptText = typed(PROMPT, 1.2, 4.6, t);
  const showPromptCaret = t >= 1.2 && t < 6.0;
  const sent = t >= 6.0;
  const sendScale = t >= 6.0 && t < 6.4 ? "scale(1.18)" : "scale(1)";

  const lastFound = T.searchT + 5 * 0.4 + 1.2;
  const chips = CHIPS.map((c, i) => {
    const appear = T.searchT + i * 0.4;
    const foundAt = appear + 1.2;
    const visible = t >= appear;
    const found = t >= foundAt;
    const searching = visible && !found;
    return { ...c, visible, found, searching, logo: logoForSource(c.name) };
  });
  const statusShow = t >= T.searchT && t < lastFound;
  const searchDoneShow = t >= lastFound && t < T.cardAppear + 1.6;

  const tShow = ease(clamp((t - T.cardAppear) / 0.6, 0, 1));

  const coverShow = t >= T.draftStart;
  const titleText = typed(
    "Approval of the Purdue Opioid Settlement & Establishment of an Opioid Abatement Special Fund",
    T.draftStart,
    1.3,
    t,
  );
  const factsShow = t >= T.draftStart + 1.4;
  const bgRevised = t >= T.bulletsStart;

  const hot = (n: number) =>
    (n === 1 && t >= T.cite1At && t < T.cite2At) ||
    (n === 2 && t >= T.cite2At && t < T.reviseStart);

  const sections = SECTIONS.map((s) => {
    const sc = SCHED[s.key];
    const headingShow = t >= sc[0];
    const bp = prog(sc[1], sc[2], t);
    const bodyDone = bp >= 1;
    const body = s.body.slice(0, Math.floor(bp * s.body.length));
    const isBg = s.key === "bg";
    const showBullets = isBg && bgRevised;
    const showPara = headingShow && !showBullets;
    const caret = showPara && !bodyDone;
    const cites = bodyDone ? s.cites : [];
    let bullets: { text: string; cites: number[] }[] = [];
    if (showBullets && s.bullets) {
      const n = Math.ceil(clamp((t - T.bulletsStart) / 2.6, 0, 1) * s.bullets.length);
      bullets = s.bullets.slice(0, n);
    }
    return { ...s, show: headingShow, showPara, caret, body, cites, showBullets, bullets, revised: isBg && bgRevised };
  });

  let docPillText = "Template ready";
  let pillDone = false;
  let pillActive = false;
  if (t >= FLOW.start && t < T.draftStart) {
    docPillText = "Connecting sources…";
    pillActive = true;
  } else if (t >= T.draftStart && t < T.draftDoneAt) {
    docPillText = "Drafting…";
    pillActive = true;
  } else if (t >= T.draftDoneAt && t < T.exportClickAt) {
    docPillText = "Draft ready";
    pillDone = true;
  } else if (t >= T.exportClickAt) {
    docPillText = "Exported to Word";
    pillDone = true;
  }

  const inRevise = t >= T.reviseStart;
  const reviseQuery = "make it shorter and in four bullet points";
  const askText = inRevise
    ? t < T.reviseDone
      ? typed(reviseQuery, T.reviseStart, 2.2, t)
      : reviseQuery
    : "Tell Madison what to revise…";
  const askCaret = t >= T.reviseStart && t < T.reviseDone;
  const askActive = t >= T.reviseStart && t < T.reviseRespAt;
  const askSend = t >= T.reviseDone - 0.2 && t < T.reviseDone + 0.2 ? "scale(.9)" : "scale(1)";
  const askRespShow = t >= T.reviseRespAt;

  const citeRows = CITES.filter((c) => t >= SECDONE[c.sec]).map((c) => ({
    ...c,
    expanded: (c.n === 1 && t >= T.cite1At) || (c.n === 2 && t >= T.cite2At),
    viewing:
      (c.n === 1 && t >= T.cite1At && t < T.cite2At) ||
      (c.n === 2 && t >= T.cite2At && t < T.reviseStart),
    verified: (c.n === 1 && t >= T.cite1At + 0.6) || (c.n === 2 && t >= T.cite2At + 0.6),
    cur: c.n === 1 ? "cite1" : c.n === 2 ? "cite2" : "none",
  }));
  const citeCount = citeRows.length ? `${citeRows.length} of 5` : "—";

  const exportHot = t >= T.exportClickAt;
  const exportDone = t >= T.toastAt + 0.4;

  const toastP = clamp((t - T.toastAt) / 0.4, 0, 1);
  const toastOut = clamp((t - (T.endAt - 0.4)) / 0.4, 0, 1);
  const toastOpacity = t < T.toastAt || t >= T.endAt ? 0 : ease(toastP) * (1 - toastOut);
  const toastY = (1 - ease(toastP)) * 18;

  const wordP = ease(clamp((t - T.endAt) / 0.9, 0, 1));

  // ── imperative layer: doc scroll, cursor, connector wires ────────────────
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

    // Scroll the draft to follow generation, then the section under review.
    const outer = root.querySelector<HTMLElement>("[data-doc-scroll]");
    const inner = root.querySelector<HTMLElement>("[data-doc-content]");
    if (outer && inner) {
      const max = Math.max(0, inner.offsetHeight - outer.clientHeight + 24);
      const secOff = (k: string) => {
        const s = inner.querySelector<HTMLElement>(`[data-sec="${k}"]`);
        if (!s) return scrollYRef.current;
        return Math.max(0, Math.min(max, s.offsetTop - 28));
      };
      let target = 0;
      if (t < T.draftStart) target = 0;
      else if (t < T.reviewStart) target = max;
      else if (t < T.cite2At) target = 0;
      else if (t < T.exportTabAt) target = secOff("bg");
      else target = 0;
      scrollYRef.current =
        Math.abs(target - scrollYRef.current) < 0.6
          ? target
          : scrollYRef.current + (target - scrollYRef.current) * 0.18;
      inner.style.transform = `translateY(${-scrollYRef.current.toFixed(1)}px)`;
    }

    // Oversized cursor: ease toward the active target, pulse a ring on click.
    const cur = root.querySelector<HTMLElement>("[data-cursor]");
    if (cur) {
      let kf: (typeof CURSOR)[number] | null = null;
      for (const k of CURSOR) if (t >= k.at) kf = k;
      const el = kf && kf.sel ? root.querySelector(kf.sel) : null;
      if (t >= T.endAt || !el || reduced) {
        cur.style.opacity = "0";
      } else {
        const p = toLocal(el);
        if (!cursorPosRef.current) cursorPosRef.current = { x: p.x, y: p.y };
        cursorPosRef.current.x += (p.x - cursorPosRef.current.x) * 0.115;
        cursorPosRef.current.y += (p.y - cursorPosRef.current.y) * 0.115;
        cur.style.opacity = "1";
        cur.style.transform = `translate(${(cursorPosRef.current.x - 10).toFixed(1)}px,${(cursorPosRef.current.y - 7).toFixed(1)}px)`;
        const ring = cur.querySelector<HTMLElement>("[data-cursor-ring]");
        if (ring) {
          let cp = -1;
          for (const k of CURSOR) if (k.click && t >= k.at && t - k.at < 0.5) cp = (t - k.at) / 0.5;
          if (cp >= 0) {
            ring.style.opacity = (1 - cp).toFixed(2);
            ring.style.transform = `translate(-50%,-50%) scale(${(0.4 + cp * 1.2).toFixed(2)})`;
          } else {
            ring.style.opacity = "0";
          }
        }
      }
    }

    // Connector wires: source chips streaming into the draft card.
    const svg = root.querySelector<SVGSVGElement>("[data-wires]");
    const group = root.querySelector<SVGGElement>("[data-wire-group]");
    const pulses = root.querySelector<SVGGElement>("[data-pulse-group]");
    const card = root.querySelector("[data-draft-card]");
    if (!svg || !group || !pulses || !card) return;

    const pr = stageRect(card);
    const key = `${fit.toFixed(4)}:${pr.x.toFixed(1)}:${pr.h.toFixed(1)}`;
    if (!wiresRef.current || wireKeyRef.current !== key) {
      const chipRects: ReturnType<typeof stageRect>[] = [];
      for (let i = 0; i < CHIPS.length; i++) {
        const c = root.querySelector(`[data-chip="${i}"]`);
        if (c) chipRects.push(stageRect(c));
      }
      if (chipRects.length < CHIPS.length) return;
      const n = chipRects.length;
      const top = pr.y + pr.h * 0.13;
      const span = pr.h * 0.62;
      group.innerHTML = "";
      pulses.innerHTML = "";
      const SVGNS = "http://www.w3.org/2000/svg";
      wiresRef.current = chipRects.map((cr, i) => {
        const x1 = cr.x + cr.w - 6;
        const y1 = cr.y + cr.h / 2;
        const x2 = pr.x + 2;
        const y2 = top + (n > 1 ? (span * i) / (n - 1) : 0);
        const dx = Math.max(70, (x2 - x1) * 0.5);
        const path = document.createElementNS(SVGNS, "path");
        path.setAttribute("d", `M${x1},${y1} C ${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`);
        group.appendChild(path);
        const len = path.getTotalLength();
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
        const dots: SVGCircleElement[] = [];
        for (let k = 0; k < 2; k++) {
          const c = document.createElementNS(SVGNS, "circle");
          c.setAttribute("r", "3.6");
          c.setAttribute("opacity", "0");
          pulses.appendChild(c);
          dots.push(c);
        }
        return {
          w: { p0: [x1, y1], c0: [x1 + dx, y1], c1: [x2 - dx, y2], p1: [x2, y2] },
          path,
          len,
          dots,
          drawStart: FLOW.start + i * 0.12,
        };
      });
      wireKeyRef.current = key;
    }

    const on = t >= FLOW.start - 0.2 && t < T.endAt;
    svg.style.opacity = on ? "1" : "0";
    if (!on || !wiresRef.current) return;

    const bez = (w: { p0: number[]; c0: number[]; c1: number[]; p1: number[] }, u: number) => {
      const mt = 1 - u;
      const a = mt * mt * mt;
      const b = 3 * mt * mt * u;
      const c = 3 * mt * u * u;
      const d = u * u * u;
      return [
        a * w.p0[0] + b * w.c0[0] + c * w.c1[0] + d * w.p1[0],
        a * w.p0[1] + b * w.c0[1] + c * w.c1[1] + d * w.p1[1],
      ];
    };

    for (const wi of wiresRef.current) {
      const drawP = clamp((t - wi.drawStart) / 0.9, 0, 1);
      wi.path.style.strokeDashoffset = (wi.len * (1 - ease(drawP))).toFixed(1);
      wi.dots.forEach((dot, k) => {
        if (drawP < 0.55) {
          dot.setAttribute("opacity", "0");
          return;
        }
        const phase = (((t - wi.drawStart) / 3.1 + k * 0.5) % 1 + 1) % 1;
        const pt = bez(wi.w, phase);
        const op = phase < 0.12 ? phase / 0.12 : phase > 0.88 ? (1 - phase) / 0.12 : 1;
        dot.setAttribute("cx", pt[0].toFixed(1));
        dot.setAttribute("cy", pt[1].toFixed(1));
        dot.setAttribute("opacity", (op * 0.95).toFixed(2));
      });
    }
  }, [t, reduced]);

  const cardShell: Style = {
    background: token("--bg-surface"),
    border: `1px solid ${token("--border-default")}`,
  };

  return (
    <div ref={viewRef}>
      <DemoKeyframes />
      <DemoStage label="Madison AI drafting a cited staff report from a city's own records, then exporting it to Word">
        <div
          ref={rootRef}
          data-demo-stage
          style={{
            width: STAGE_W,
            height: 1080,
            overflow: "hidden",
            background: token("--bg-app"),
            position: "relative",
            fontFamily: SANS,
          }}
        >
          <div style={{ position: "absolute", left: 80, right: 80, top: 72, bottom: 54, display: "flex" }}>
            {/* ── Left third: prompt + source search ── */}
            <section style={{ width: 540, flexShrink: 0, display: "flex", flexDirection: "column" }}>
              <StepRule num="01" title="Draft a New Staff Report" />
              <div
                style={{
                  ...cardShell,
                  borderRadius: 16,
                  padding: "21px 23px 17px",
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  flexShrink: 0,
                  boxShadow: "var(--elevation-md)",
                }}
              >
                <div style={{ fontSize: 18, lineHeight: 1.5, color: token("--text-primary"), flex: 1 }}>
                  {promptText}
                  {showPromptCaret ? <Caret height={18} color={token("--brand-primary")} /> : null}
                </div>
                <div style={{ marginTop: 17, display: "flex", justifyContent: "flex-end" }}>
                  <span
                    data-cur="send"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: token("--brand-accent"),
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: sendScale,
                    }}
                  >
                    {sent ? <CheckIcon size={16} /> : <ArrowUpIcon size={16} />}
                  </span>
                </div>
              </div>

              <StepRule num="02" title="Search across your systems" style={{ margin: "18px 0 12px" }} />
              <div
                style={{
                  ...metaFont,
                  fontSize: 14,
                  color: token("--text-muted"),
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  minHeight: 17,
                }}
              >
                {statusShow ? (
                  <>
                    <Dot color={token("--brand-accent")} pulse />
                    <span>Searching 1,840 sources across 6 systems…</span>
                  </>
                ) : null}
                {searchDoneShow ? (
                  <>
                    <Dot color={token("--semantic-success")} />
                    <span style={{ color: token("--semantic-success") }}>1,840 sources indexed · 6 systems</span>
                  </>
                ) : null}
              </div>

              <div data-cur="systems" style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {chips.map((c, i) => (
                  <div
                    key={c.name}
                    data-chip={i}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      gap: 15,
                      padding: "0 16px 0 18px",
                      minHeight: 90,
                      background: token("--bg-surface"),
                      borderRadius: 12,
                      opacity: c.visible ? 1 : 0,
                      transition: "border-color .3s, box-shadow .3s",
                      border: `1px solid ${
                        c.found
                          ? token("--semantic-success", 0.45)
                          : c.searching
                            ? token("--brand-accent")
                            : token("--border-default")
                      }`,
                      boxShadow: c.searching
                        ? `0 0 0 1px ${token("--brand-accent", 0.2)}, var(--elevation-md)`
                        : "var(--elevation-xs)",
                    }}
                  >
                    {c.searching ? (
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          background: `linear-gradient(100deg, transparent 20%, ${token("--brand-primary", 0.22)} 50%, transparent 80%)`,
                          animation: "mai-scan .85s ease-in-out infinite",
                        }}
                      />
                    ) : null}
                    {c.logo ? (
                      <span
                        role="img"
                        aria-label={c.name}
                        style={{
                          flex: "0 0 auto",
                          width: 190,
                          height: 62,
                          background: `url('${c.logo}') left center / contain no-repeat`,
                        }}
                      />
                    ) : (
                      <>
                        <span
                          style={{
                            flex: "0 0 auto",
                            width: 42,
                            height: 42,
                            borderRadius: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 15,
                            color: token("--brand-foreground"),
                            transition: "all .3s",
                            background: c.searching ? token("--brand-accent") : token("--text-secondary"),
                          }}
                        >
                          {c.mono}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: 27, color: token("--text-primary"), whiteSpace: "nowrap" }}>
                          {c.name}
                        </span>
                      </>
                    )}
                    <span
                      style={{
                        marginLeft: "auto",
                        ...metaFont,
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: c.found ? token("--text-secondary") : token("--text-muted"),
                      }}
                    >
                      {c.found ? c.meta : c.searching ? "searching…" : ""}
                    </span>
                    {c.found ? (
                      <span
                        style={{
                          width: 23,
                          height: 23,
                          borderRadius: "50%",
                          background: token("--semantic-success"),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: 2,
                          flexShrink: 0,
                        }}
                      >
                        <CheckIcon size={12} />
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            {/* ── Right: the draft, building in ── */}
            <section
              style={{
                flex: "0 0 1056px",
                minWidth: 0,
                minHeight: 0,
                marginLeft: "auto",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  opacity: tShow,
                  transform: `translateY(${((1 - tShow) * 16).toFixed(1)}px)`,
                }}
              >
                <div
                  data-draft-card
                  style={{
                    ...cardShell,
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    borderRadius: 14,
                    boxShadow: "var(--elevation-2xl)",
                    overflow: "hidden",
                  }}
                >
                  {/* Document */}
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <div
                      data-cur="doc"
                      style={{
                        flex: "0 0 auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 13,
                        padding: "16px 28px",
                        borderBottom: `1px solid ${token("--border-default")}`,
                      }}
                    >
                      <span
                        style={{
                          width: 31,
                          height: 31,
                          borderRadius: 7,
                          background: token("--brand-accent", 0.1),
                          border: `1px solid ${token("--brand-accent", 0.2)}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: token("--brand-accent"),
                        }}
                      >
                        <FileIcon size={16} />
                      </span>
                      <span style={{ ...metaFont, fontWeight: 600, fontSize: 15.5, color: token("--text-secondary") }}>
                        SR-2026-118.docx
                      </span>
                      <span
                        style={{
                          marginLeft: "auto",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 9,
                          fontWeight: 700,
                          fontSize: 12.5,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "7px 15px",
                          borderRadius: 999,
                          border: `1px solid ${pillDone ? token("--semantic-success", 0.3) : token("--brand-accent", 0.22)}`,
                          background: pillDone ? token("--semantic-success", 0.12) : token("--brand-accent", 0.1),
                          color: pillDone ? token("--semantic-success") : token("--brand-shade"),
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: pillDone ? token("--semantic-success") : token("--brand-accent"),
                            animation: pillActive ? "mai-pulse 1.4s ease-in-out infinite" : undefined,
                          }}
                        />
                        {docPillText}
                      </span>
                    </div>

                    <div data-doc-scroll style={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
                      <div data-doc-content style={{ position: "relative", padding: "42px 56px 40px" }}>
                        {coverShow ? (
                          <div
                            style={{
                              borderBottom: `1px solid ${token("--border-default")}`,
                              paddingBottom: 26,
                              marginBottom: 30,
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 14,
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color: token("--brand-accent"),
                                marginBottom: 13,
                              }}
                            >
                              Staff report · City of Cedar Hollow
                            </div>
                            <div
                              style={{
                                fontFamily: SERIF,
                                fontWeight: 600,
                                fontSize: 36,
                                lineHeight: 1.14,
                                letterSpacing: "-0.015em",
                                color: token("--text-primary"),
                                marginBottom: 13,
                              }}
                            >
                              {titleText}
                            </div>
                            <div style={{ ...metaFont, fontSize: 14.5, color: token("--text-muted") }}>
                              File SR-2026-118 · Finance / City Manager · Drafted by Madison AI
                            </div>
                            {factsShow ? (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(4,1fr)",
                                  gap: 20,
                                  marginTop: 26,
                                }}
                              >
                                {FACTS.map((f) => (
                                  <div key={f.k} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                    <span
                                      style={{
                                        fontWeight: 600,
                                        fontSize: 11.5,
                                        letterSpacing: "0.13em",
                                        textTransform: "uppercase",
                                        color: token("--text-muted"),
                                      }}
                                    >
                                      {f.k}
                                    </span>
                                    <span
                                      style={{
                                        fontFamily: SERIF,
                                        fontWeight: 500,
                                        fontSize: 21,
                                        color: token("--text-primary"),
                                        letterSpacing: "-0.01em",
                                      }}
                                    >
                                      {f.v}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        {sections.map((s) =>
                          s.show ? (
                            <div key={s.key} data-sec={s.key} style={{ marginBottom: 30 }}>
                              <div style={{ display: "flex", alignItems: "baseline", gap: 13, marginBottom: 13 }}>
                                <span style={{ ...metaFont, fontWeight: 700, fontSize: 17, color: token("--brand-accent") }}>
                                  {s.num}
                                </span>
                                <span
                                  style={{
                                    fontFamily: SERIF,
                                    fontWeight: 600,
                                    fontSize: 25,
                                    color: token("--text-primary"),
                                    letterSpacing: "-0.01em",
                                    lineHeight: 1.15,
                                  }}
                                >
                                  {s.heading}
                                </span>
                                {s.revised ? (
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      fontSize: 11,
                                      letterSpacing: "0.1em",
                                      textTransform: "uppercase",
                                      color: token("--semantic-success"),
                                      background: token("--semantic-success", 0.12),
                                      border: `1px solid ${token("--semantic-success", 0.3)}`,
                                      borderRadius: 999,
                                      padding: "3px 10px",
                                    }}
                                  >
                                    Revised
                                  </span>
                                ) : null}
                              </div>
                              {s.showPara ? (
                                <div style={{ fontSize: 19, lineHeight: 1.62, color: token("--text-secondary") }}>
                                  {s.body}
                                  {s.cites.map((n) => (
                                    <sup key={n} style={hot(n) ? supHot : supBase}>
                                      {n}
                                    </sup>
                                  ))}
                                  {s.caret ? <Caret height={19} /> : null}
                                </div>
                              ) : null}
                              {s.showBullets ? (
                                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                  {s.bullets.map((b) => (
                                    <li key={b.text} style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 12 }}>
                                      <span
                                        style={{
                                          flex: "0 0 auto",
                                          width: 7,
                                          height: 7,
                                          borderRadius: 2,
                                          background: token("--brand-accent"),
                                          marginTop: 11,
                                        }}
                                      />
                                      <span style={{ display: "block", flex: "1 1 auto", minWidth: 0, fontSize: 19, lineHeight: 1.55, color: token("--text-secondary") }}>
                                        {b.text}
                                        {b.cites.map((n) => (
                                          <sup key={n} style={supBase}>
                                            {n}
                                          </sup>
                                        ))}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                          ) : null,
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Side panel: revise + citations + export */}
                  <aside
                    style={{
                      width: 372,
                      flexShrink: 0,
                      borderLeft: `1px solid ${token("--border-default")}`,
                      background: token("--bg-panel"),
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ flex: "0 0 auto", padding: "22px 20px 20px", borderBottom: `1px solid ${token("--border-default")}` }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 11,
                          fontFamily: SERIF,
                          fontWeight: 600,
                          fontSize: 23,
                          color: token("--text-primary"),
                          marginBottom: 16,
                        }}
                      >
                        <SparkIcon />
                        Revise with AI
                      </div>
                      <div
                        data-cur="revise"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 13,
                          padding: "13px 13px 13px 18px",
                          background: token("--bg-surface"),
                          borderRadius: 14,
                          transition: "all .3s",
                          border: `1px solid ${askActive ? token("--brand-accent") : token("--border-default")}`,
                          boxShadow: askActive ? `0 0 0 3px ${token("--brand-accent", 0.12)}` : undefined,
                        }}
                      >
                        <span
                          style={{
                            flex: 1,
                            fontSize: 19,
                            lineHeight: 1.35,
                            color: inRevise ? token("--text-primary") : token("--text-muted"),
                          }}
                        >
                          {askText}
                          {askCaret ? <Caret height={19} /> : null}
                        </span>
                        <span
                          data-cur="revisesend"
                          style={{
                            flex: "0 0 auto",
                            width: 42,
                            height: 42,
                            borderRadius: 11,
                            background: token("--brand-accent"),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: askSend,
                          }}
                        >
                          <ArrowUpIcon size={19} />
                        </span>
                      </div>
                      {askRespShow ? (
                        <div
                          style={{
                            marginTop: 14,
                            padding: "16px 17px",
                            background: token("--brand-accent", 0.08),
                            border: `1px solid ${token("--brand-accent", 0.18)}`,
                            borderRadius: 12,
                            fontSize: 16.5,
                            lineHeight: 1.5,
                            color: token("--brand-shade"),
                          }}
                        >
                          Done — rewrote Background as four concise bullet points, keeping citations [2] and [3].
                        </div>
                      ) : null}
                    </div>

                    <div style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "2px 0 12px" }}>
                        <span style={{ ...metaFont, fontSize: 12.5, color: token("--text-muted") }}>SOURCES CITED</span>
                        <span style={{ ...metaFont, fontSize: 12.5, fontWeight: 700, color: token("--brand-accent") }}>{citeCount}</span>
                      </div>
                      {citeRows.map((r) => (
                        <div
                          key={r.n}
                          data-cur={r.cur}
                          style={{
                            padding: "12px 13px",
                            borderRadius: 11,
                            marginBottom: 9,
                            transition: "all .3s",
                            background: r.viewing ? token("--brand-accent", 0.08) : token("--bg-surface"),
                            border: `1px solid ${r.viewing ? token("--brand-primary") : token("--border-default")}`,
                          }}
                        >
                          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <span
                              style={{
                                flex: "0 0 auto",
                                width: 23,
                                height: 23,
                                borderRadius: 6,
                                background: token("--brand-accent"),
                                color: token("--brand-foreground"),
                                ...metaFont,
                                fontSize: 12,
                                fontWeight: 700,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {r.n}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 14.5, fontWeight: 600, color: token("--text-primary"), lineHeight: 1.3 }}>
                                {r.title}
                              </div>
                              <div style={{ ...metaFont, fontSize: 11, color: token("--text-muted"), marginTop: 3 }}>{r.src}</div>
                            </div>
                            {r.verified ? (
                              <span
                                style={{
                                  width: 19,
                                  height: 19,
                                  borderRadius: "50%",
                                  background: token("--semantic-success"),
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <CheckIcon size={10} />
                              </span>
                            ) : null}
                          </div>
                          {r.expanded ? (
                            <div
                              style={{
                                marginTop: 10,
                                paddingTop: 10,
                                borderTop: `1px dashed ${token("--border-active")}`,
                                fontSize: 13,
                                lineHeight: 1.5,
                                color: token("--text-secondary"),
                              }}
                            >
                              {r.detail}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <div style={{ flex: "0 0 auto", padding: "14px 18px", borderTop: `1px solid ${token("--border-default")}` }}>
                      <div
                        data-cur="export"
                        style={{
                          padding: "13px 14px",
                          borderRadius: 11,
                          display: "flex",
                          gap: 11,
                          alignItems: "center",
                          fontSize: 14.5,
                          fontWeight: 600,
                          color: token("--text-primary"),
                          transition: "all .3s",
                          background: exportHot ? token("--brand-accent", 0.08) : token("--bg-surface"),
                          border: `1px solid ${exportHot ? token("--brand-primary") : token("--border-default")}`,
                        }}
                      >
                        <WordIcon size={18} />
                        <span style={{ flex: 1 }}>Export to Microsoft Word</span>
                        {exportDone ? <CheckIcon size={16} color={token("--semantic-success")} /> : null}
                      </div>
                      <div style={{ marginTop: 9, fontSize: 10, color: token("--text-muted"), textAlign: "center", lineHeight: 1.4 }}>
                        Madison AI can make mistakes. Check important information.
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </section>
          </div>

          {/* Connector wires (sources → draft) */}
          <svg
            data-wires
            viewBox="0 0 1920 1080"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 38,
              opacity: 0,
              transition: "opacity .5s ease",
            }}
          >
            <defs>
              <linearGradient id="maiWireGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={token("--text-muted")} stopOpacity="0.16" />
                <stop offset="55%" stopColor={token("--brand-accent")} stopOpacity="0.85" />
                <stop offset="100%" stopColor={token("--brand-primary")} stopOpacity="1" />
              </linearGradient>
            </defs>
            <g data-wire-group fill="none" stroke="url(#maiWireGrad)" strokeWidth="2.4" strokeLinecap="round" />
            <g data-pulse-group fill={token("--brand-accent")} />
          </svg>

          {/* Oversized cursor */}
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
              transform: "translate(-200px,-200px)",
            }}
          >
            <div
              data-cursor-ring
              style={{
                position: "absolute",
                left: 10,
                top: 7,
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: `3px solid ${token("--brand-accent")}`,
                opacity: 0,
                transform: "translate(-50%,-50%) scale(.4)",
              }}
            />
            <svg width="52" height="52" viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 5px 9px rgb(0 0 0 / 0.4))" }}>
              <path
                d="M5.5 2.5 L5.5 20 L10 16 L12.9 22.5 L15.6 21.2 L12.7 15 L18.5 15 Z"
                fill={token("--bg-plate")}
                stroke={token("--text-primary")}
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Export toast */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 50,
              transform: `translateX(-50%) translateY(${toastY.toFixed(1)}px)`,
              opacity: toastOpacity,
              display: "flex",
              alignItems: "center",
              gap: 15,
              background: token("--bg-surface"),
              border: `1px solid ${token("--border-default")}`,
              borderRadius: 14,
              padding: "15px 22px 15px 16px",
              boxShadow: "var(--elevation-2xl)",
            }}
          >
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                background: WORD_BLUE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WordIcon size={24} color={token("--bg-plate")} />
            </span>
            <span>
              <span style={{ display: "block", ...metaFont, fontWeight: 600, fontSize: 15, color: token("--text-primary") }}>
                SR-2026-118_Opioid-Settlement.docx
              </span>
              <span style={{ display: "block", fontSize: 13, color: token("--text-muted"), marginTop: 2 }}>
                Exported to Microsoft Word · ready to download
              </span>
            </span>
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: token("--semantic-success"),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 6,
              }}
            >
              <CheckIcon size={14} />
            </span>
          </div>

          {/* Word finale — the report lifts out of the UI into a real document */}
          <WordFinale opacity={wordP} scale={0.72 + 0.28 * wordP} />
        </div>
      </DemoStage>
    </div>
  );
}

// ── small pieces ────────────────────────────────────────────────────────────

function StepRule({ num, title, style }: { num: string; title: string; style?: Style }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        paddingBottom: 11,
        borderBottom: `2px solid ${token("--text-primary")}`,
        marginBottom: 18,
        ...style,
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 34, lineHeight: 0.9, letterSpacing: "-0.02em", color: token("--text-primary") }}>
        {num}
      </span>
      <span
        style={{
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 34,
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
          color: token("--text-primary"),
        }}
      >
        {title}
      </span>
    </div>
  );
}

function Dot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: color,
        animation: pulse ? "mai-pulse 1.4s ease-in-out infinite" : undefined,
      }}
    />
  );
}

function CheckIcon({ size = 16, color }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color ?? token("--brand-foreground")} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowUpIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={token("--brand-foreground")} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function FileIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function WordIcon({ size = 18, color }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color ?? WORD_BLUE} strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="m8 13 1.5 4 1.5-3 1.5 3L15 13" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill={token("--brand-accent")} stroke="none">
      <path d="M12 2 9.2 9.2 2 12l7.2 2.8L12 22l2.8-7.2L22 12l-7.2-2.8Z" />
    </svg>
  );
}

/**
 * The finished report as it lands in Word. Kept visually literal — Word's own
 * chrome and a serif page — because the point of the beat is "this leaves
 * Madison as a real document you already know how to edit."
 */
function WordFinale({ opacity, scale }: { opacity: number; scale: number }) {
  const label: Style = { fontWeight: 700, fontSize: 13.5, letterSpacing: "0.04em", marginBottom: 6 };
  const para: Style = { margin: "0 0 15px", fontSize: 13.5, lineHeight: 1.55, textAlign: "justify" };
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 70,
        display: "flex",
        flexDirection: "column",
        background: token("--bg-hover"),
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        pointerEvents: "none",
      }}
    >
      <div style={{ flex: "0 0 auto", height: 50, background: WORD_BLUE, display: "flex", alignItems: "center", gap: 12, padding: "0 22px", color: token("--bg-plate") }}>
        <WordIcon size={22} color={token("--bg-plate")} />
        <span style={{ fontWeight: 600, fontSize: 15 }}>SR-2026-118_Opioid-Settlement.docx — Word</span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 22, opacity: 0.9, fontSize: 15, letterSpacing: "0.06em" }}>– □ ✕</span>
      </div>
      <div
        style={{
          flex: "0 0 auto",
          height: 36,
          background: token("--bg-panel"),
          borderBottom: `1px solid ${token("--border-default")}`,
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "0 24px",
          fontSize: 12.5,
          color: token("--text-secondary"),
        }}
      >
        <span>File</span>
        <span style={{ color: WORD_BLUE, fontWeight: 600, borderBottom: `2px solid ${WORD_BLUE}`, height: 36, display: "flex", alignItems: "center" }}>Home</span>
        <span>Insert</span>
        <span>Layout</span>
        <span>References</span>
        <span>Review</span>
        <span>View</span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 7, color: token("--semantic-success"), fontWeight: 600 }}>
          <CheckIcon size={14} color={token("--semantic-success")} />
          Saved to OneDrive
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "26px 0" }}>
        <div
          style={{
            width: 816,
            flex: "0 0 auto",
            background: token("--bg-plate"),
            boxShadow: "var(--elevation-xl)",
            padding: "64px 84px",
            fontFamily: SERIF,
            color: token("--text-primary"),
            transform: "scale(.9)",
            transformOrigin: "top center",
          }}
        >
          <div style={{ textAlign: "center", borderBottom: `2.5px solid ${token("--text-primary")}`, paddingBottom: 13 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                border: `2px solid ${token("--text-primary")}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 9px",
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              CH
            </div>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 23, letterSpacing: "0.07em" }}>CITY OF CEDAR HOLLOW</div>
            <div style={{ fontSize: 12.5, letterSpacing: "0.16em", textTransform: "uppercase", color: token("--text-secondary"), marginTop: 4 }}>
              Office of the City Manager · Finance Department
            </div>
          </div>
          <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 16, letterSpacing: "0.32em", margin: "17px 0 18px" }}>
            STAFF REPORT
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "78px 1fr",
              rowGap: 5,
              columnGap: 14,
              fontSize: 13.5,
              lineHeight: 1.5,
              borderBottom: `1px solid ${token("--border-active")}`,
              paddingBottom: 15,
              marginBottom: 18,
            }}
          >
            <span style={{ fontWeight: 700 }}>TO:</span>
            <span>Honorable Mayor and Members of the City Council</span>
            <span style={{ fontWeight: 700 }}>FROM:</span>
            <span>Dana Morales, Budget Analyst — Finance Department</span>
            <span style={{ fontWeight: 700 }}>DATE:</span>
            <span>June 27, 2026</span>
            <span style={{ fontWeight: 700 }}>RE:</span>
            <span>Approval of the Purdue Pharmaceuticals opioid settlement and establishment of an Opioid Abatement Special Fund</span>
            <span style={{ fontWeight: 700 }}>FILE NO.:</span>
            <span>SR-2026-118</span>
          </div>
          <div style={label}>1.&nbsp;&nbsp;RECOMMENDATION</div>
          <p style={para}>
            That the City Council approve the settlement agreement between the City of Cedar Hollow and Purdue Pharmaceuticals in
            the amount of $10,000,000, and direct staff — at the direction of the City Manager and the Finance Director — to
            appropriate the funds into a newly established Opioid Abatement Special Fund.
          </p>
          <div style={label}>2.&nbsp;&nbsp;BACKGROUND</div>
          <ul style={{ margin: "0 0 15px", paddingLeft: 24, fontSize: 13.5, lineHeight: 1.55 }}>
            <li style={{ marginBottom: 3 }}>The City of Cedar Hollow was a participating litigant in the national prescription-opioid settlement.</li>
            <li style={{ marginBottom: 3 }}>The negotiated allocation to Cedar Hollow totals $10,000,000.</li>
            <li style={{ marginBottom: 3 }}>Funds are disbursed over a multi-year settlement schedule.</li>
            <li>Use of the funds is restricted to approved opioid-abatement purposes.</li>
          </ul>
          <div style={label}>3.&nbsp;&nbsp;FISCAL IMPACT</div>
          <p style={para}>
            Receipt of the $10,000,000 settlement is non-recurring revenue and will not be deposited into the General Fund.
            Establishing a dedicated special fund preserves restricted-use compliance and audit traceability. No new General Fund
            appropriation is required.
          </p>
          <div style={label}>4.&nbsp;&nbsp;SPECIAL FUND &amp; APPROPRIATION</div>
          <p style={{ ...para, margin: "0 0 22px" }}>
            The Opioid Abatement Special Fund shall be established under City Charter § 2.40. Appropriations from the fund shall be
            made jointly at the direction of the City Manager and the Finance Director, consistent with Council-adopted abatement
            priorities.
          </p>
          <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>Respectfully submitted,</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 22, color: token("--brand-shade"), margin: "6px 0 1px" }}>Dana Morales</div>
          <div style={{ fontSize: 13, color: token("--text-secondary") }}>Dana Morales, Budget Analyst — Finance Department</div>
          <div style={{ display: "flex", gap: 48, marginTop: 30 }}>
            <div style={{ flex: 1, borderTop: `1px solid ${token("--text-primary")}`, paddingTop: 5, fontSize: 12.5 }}>City Manager</div>
            <div style={{ flex: 1, borderTop: `1px solid ${token("--text-primary")}`, paddingTop: 5, fontSize: 12.5 }}>Finance Director</div>
          </div>
        </div>
      </div>
      <div
        style={{
          flex: "0 0 auto",
          height: 26,
          background: WORD_BLUE,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "0 22px",
          color: token("--bg-plate"),
          fontSize: 11.5,
        }}
      >
        <span>Page 1 of 1</span>
        <span>438 words</span>
        <span>English (United States)</span>
        <span style={{ marginLeft: "auto" }}>100%</span>
      </div>
    </div>
  );
}
