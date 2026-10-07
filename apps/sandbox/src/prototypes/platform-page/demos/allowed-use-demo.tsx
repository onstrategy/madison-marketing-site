import { useLayoutEffect, useRef } from "react";
import accela from "./allowed-use-logos/accela.png";
import esri from "./allowed-use-logos/esri.png";
import granicus from "./allowed-use-logos/granicus.png";
import laserfiche from "./allowed-use-logos/laserfiche.png";
import municode from "./allowed-use-logos/municode.jpg";
import sharepoint from "./allowed-use-logos/sharepoint.png";
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

// ============================================================================
// AllowedUseDemo — the animated product demo under the Community Development
// AI hero.
//
// A 76-second loop of one real planning workflow, beat for beat: a planner
// asks what a parcel allows, Madison searches six systems of record, the GIS
// map resolves the parcel layer by layer, and an executive summary, a cited
// allowed-uses table, and the permit history write themselves in. Citations
// are then opened one at a time and verified against their source.
//
// The timeline (`T`), copy, cursor track, and flow window are ported unchanged
// from the approved design — only the palette and typography are re-pointed
// at Madison's tokens. See ./demo-stage.tsx for why the geometry is in raw
// pixels.
// ============================================================================

const DUR = 76;

/** Keyframe times, in seconds. */
const T = {
  searchT: 5.6,
  cardAppear: 9.4,
  mapStart: 10.2,
  zoomStart: 16.4,
  zoomEnd: 18.4,
  labelAt: 18.9,
  collapseStart: 20.2,
  collapseEnd: 21.1,
  sumStart: 21.3,
  sumDur: 3.0,
  tableStart: 24.6,
  rowGap: 0.32,
  permitAt: 32.2,
  citeStart: 34.4,
  citeGap: 1.4,
  reExpandAt: 43.6,
  endAt: 74.0,
};

/** The still shown to reduced-motion visitors: the finished analysis. */
const STATIC_FRAME = 33.5;

const PROMPT = "Provide me all the allowed uses for 555 Chance Lane";

const SANS = "var(--font-sans)";
const SERIF = "var(--font-serif)";

/** The retired mono role — Inter, tightened and tracked out (design-system skill). */
const metaFont: Style = { fontFamily: SANS, letterSpacing: "0.04em" };

interface Chip {
  name: string;
  meta: string;
  /** The wordmark supplied with the approved animation, sized below. */
  logo: string;
  /** Logo box height / width÷height ratio, as authored against the 1920 stage. */
  logoH: number;
  ar: number;
}

const CHIPS: Chip[] = [
  { name: "Granicus", logo: granicus, meta: "6 agendas", logoH: 47, ar: 4.831 },
  { name: "Laserfiche", logo: laserfiche, meta: "3 staff reports", logoH: 62, ar: 3.285 },
  { name: "Esri", logo: esri, meta: "9 GIS layers", logoH: 48, ar: 2.635 },
  { name: "Accela", logo: accela, meta: "3 permits", logoH: 30, ar: 7.547 },
  { name: "SharePoint", logo: sharepoint, meta: "12 files", logoH: 88, ar: 1.779 },
  { name: "Municode", logo: municode, meta: "Ch. 110", logoH: 41, ar: 5.464 },
];

const LAYER_T = [10.6, 11.4, 12.4, 13.4, 14.2, 15.0];

interface Layer {
  name: string;
  swatch: Style;
}

const LAYERS: Layer[] = [
  { name: "Basemap", swatch: { background: "#EEF0EA", border: `1px solid ${token("--border-default")}` } },
  { name: "Parcels", swatch: { background: token("--bg-plate"), border: `1.5px solid ${token("--text-secondary")}` } },
  { name: "Zoning", swatch: { background: "linear-gradient(135deg,#CFE3B8 50%,#D9C2DE 50%)" } },
  { name: "FEMA flood zones", swatch: { background: "rgb(80 163 221 / 0.45)", border: "1.5px solid #3E8CC4" } },
  { name: "Wildfire hazard", swatch: { background: "rgb(214 108 40 / 0.2)", border: "1.5px dashed #D66C28" } },
  { name: "Planning areas", swatch: { background: "transparent", border: "2px dashed #C2412D" } },
];

const SUMMARY =
  "555 Chance Lane (APN 017-400-72) is a 5.86-acre parcel zoned Low Density Suburban (LDS), Master Plan Suburban Residential, in the South Valleys Planning Area. No airport, FEMA floodplain, or wildfire hazard overlay applies.";

type UseCode = "A" | "AR" | "P" | "S2" | "--";

interface UseRow {
  code: UseCode;
  use: string;
  note: string;
  cites: number[];
}

interface UseGroup {
  title: string;
  sub: string;
  rows: UseRow[];
}

const GROUPS: UseGroup[] = [
  {
    title: "Allowed by right",
    sub: "Building permit only",
    rows: [
      { code: "A", use: "Single family, detached", note: "Primary use; max 1 du/ac, min lot 35,000 sf", cites: [2] },
      { code: "A", use: "Single family, attached", note: "Allowed in LDS", cites: [2] },
      { code: "A", use: "Attached accessory dwelling", note: "Must meet Article 306 standards", cites: [2] },
      { code: "A", use: "Detached accessory structure", note: "12 ft or under may sit in rear/side yard, 5 ft from line", cites: [2] },
      { code: "A", use: "Group home", note: "Residential group home allowed", cites: [2] },
      { code: "A", use: "Family daycare", note: "Allowed by right", cites: [3] },
      { code: "A", use: "Community garden · passive recreation", note: "Allowed by right", cites: [3] },
    ],
  },
  {
    title: "Conditional uses",
    sub: "Review or permit required",
    rows: [
      { code: "AR", use: "Detached accessory dwelling", note: "Max 1,500 sf or 80% of main unit; one per parcel", cites: [2] },
      { code: "AR", use: "Minor accessory dwelling", note: "12 ft or under may sit 5 ft from side/rear lines", cites: [2] },
      { code: "P", use: "Duplex (middle housing)", note: "Administrative permit", cites: [2] },
      { code: "S2", use: "Place of worship", note: "Board of Adjustment SUP; WSUP25-0013 precedent", cites: [3, 4] },
      { code: "S2", use: "Large-family daycare", note: "Board of Adjustment SUP; see Article 810", cites: [3] },
      { code: "S2", use: "Private school facilities", note: "Board of Adjustment SUP", cites: [3] },
      { code: "S2", use: "Commercial stables", note: "Board of Adjustment SUP", cites: [3] },
      { code: "S2", use: "Wireless facility", note: "Only to fill a significant coverage gap", cites: [5] },
    ],
  },
  {
    title: "Prohibited uses",
    sub: "Not allowed in LDS",
    rows: [
      { code: "--", use: "Multi-family residential", note: "Not allowed per Table 110.302.05.1", cites: [2] },
      { code: "--", use: "Commercial & industrial uses", note: "Any not listed as permitted are prohibited", cites: [5] },
      { code: "--", use: "Commercial mining · aggregate pits", note: "Natural resource extraction prohibited", cites: [5] },
      { code: "--", use: "Salvage yards · auto wrecking", note: "Prohibited in LDS", cites: [5] },
    ],
  },
];

interface Cite {
  n: number;
  title: string;
  src: string;
  detail: string;
}

const CITES: Cite[] = [
  { n: 1, title: "ArcGIS Property Data — 555 Chance Ln", src: "Esri · zoning, overlay & hazard layers", detail: "Zone LDS, GP Suburban Residential, FEMA Zone X, wildfire risk Low." },
  { n: 2, title: "WCC Table 110.302.05.1 — Residential Uses", src: "Municode · Chapter 110", detail: "Residential use types by regulatory zone." },
  { n: 3, title: "WCC Table 110.302.05.2 — Civic Uses", src: "Municode · Chapter 110", detail: "Civic use types by regulatory zone." },
  { n: 4, title: "WSUP25-0013 Staff Report — Sanctuary Church", src: "Laserfiche · Board of Adjustment", detail: "Oct 2, 2025. Confirms religious assembly in LDS with an S2 special use permit." },
  { n: 5, title: "WCC §110.302 & §110.324 — Use Regulations", src: "Municode · Chapter 110", detail: "General LDS prohibitions; wireless facilities limited to significant coverage gaps." },
  { n: 6, title: "Permit WDADAR19-0005 — Detached ADU", src: "Accela · Planning records", detail: "Solaro Residence. Received 2019-07-12; status In Review." },
];

/** When each citation lands in the sources panel. */
const CITE_AT = [24.3, 24.9, 26.5, 28.4, 29.7, 32.6];

/** The order citations are opened in during the review beat. */
const CITE_ORDER = [1, 2, 3, 4, 5, 6];

/** Where the oversized cursor is at each beat, and whether it clicks there. */
const CURSOR: { at: number; sel: string | null; click?: boolean }[] = [
  { at: 3.9, sel: '[data-cur="send"]' },
  { at: 4.8, sel: '[data-cur="send"]', click: true },
  { at: 6.2, sel: '[data-cur="systems"]' },
  { at: 10.4, sel: '[data-cur="map"]' },
  ...CITE_ORDER.map((n, i) => ({ at: 34.4 + i * 1.4, sel: `[data-cur="cite${n}"]`, click: true })),
  { at: 42.8, sel: '[data-cur="expand"]' },
  { at: 43.6, sel: '[data-cur="expand"]', click: true },
  { at: 45.4, sel: null },
];

/** When the source-to-analysis connector wires are live. */
const FLOW = { start: 10.0, end: 29.5 };

/** Footprints on the GIS basemap: x, y, width, height, optional rotation about the center. */
const BUILDINGS: [number, number, number, number, number?][] = [
  [2, 58, 22, 26, -20],
  [98, 150, 20, 22, 15],
  [132, 150, 10, 12],
  [127, 124, 9, 9],
  [205, -4, 30, 14],
  [352, 92, 22, 30, 25],
  [398, 130, 12, 14],
  [468, 128, 22, 26, 30],
  [538, 132, 26, 22, 35],
  [543, 200, 15, 15],
  [563, 234, 15, 14],
  [596, 238, 14, 15],
  [590, 262, 10, 12],
  [572, 292, 10, 22],
  [536, 312, 16, 26, 30],
  [568, 318, 15, 15],
  [426, 82, 10, 10],
  [563, 384, 12, 14],
  [590, 388, 12, 12],
  [562, 428, 22, 24, 10],
  [608, 410, 12, 14],
  [2, 228, 16, 40],
  [6, 285, 12, 14],
  [312, 80, 14, 12],
];

const ROAD_MAIN = "M370 -8 L 466 30 C 560 70, 622 112, 646 170 C 664 212, 664 252, 662 300 L 654 490";
const ROAD_WEST = "M86 -6 L 52 136 L 40 188 L 38 490";

interface WireGeometry {
  p0: number[];
  c0: number[];
  c1: number[];
  p1: number[];
}

interface Wire {
  w: WireGeometry;
  path: SVGPathElement;
  len: number;
  dots: SVGCircleElement[];
  drawStart: number;
}

interface HeadItem {
  kind: "head";
  title: string;
  sub: string;
  count: string;
}

interface RowItem {
  kind: "row";
  row: UseRow;
}

type UseItem = HeadItem | RowItem;

const USE_ITEMS: UseItem[] = GROUPS.flatMap((g): UseItem[] => [
  { kind: "head", title: g.title, sub: g.sub, count: `${g.rows.length} uses` },
  ...g.rows.map((row): RowItem => ({ kind: "row", row })),
]);

/** Badge ink + tint per use code — success / info / warning / error semantics. */
const BADGE: Record<UseCode, { ink: string; tint: string }> = {
  A: { ink: token("--semantic-success"), tint: token("--semantic-success", 0.12) },
  AR: { ink: token("--brand-accent"), tint: token("--brand-accent", 0.12) },
  P: { ink: token("--brand-accent"), tint: token("--brand-accent", 0.12) },
  S2: { ink: token("--semantic-warning"), tint: token("--semantic-warning", 0.18) },
  "--": { ink: token("--semantic-error"), tint: token("--semantic-error", 0.09) },
};

const bezier = (w: WireGeometry, u: number) => {
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

export function AllowedUseDemo() {
  const { t, viewRef, reduced } = useDemoClock(DUR, { staticAt: STATIC_FRAME });
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const cursorPosRef = useRef<{ x: number; y: number } | null>(null);
  const wiresRef = useRef<Wire[] | null>(null);
  const wireKeyRef = useRef("");

  // ── derived state for this frame ──────────────────────────────────────────
  const hotN =
    t >= T.citeStart && t < T.reExpandAt
      ? CITE_ORDER[Math.min(CITE_ORDER.length - 1, Math.floor((t - T.citeStart) / T.citeGap))]
      : 0;

  const supBase: Style = {
    color: token("--brand-accent"),
    background: token("--brand-accent", 0.12),
    fontSize: 13,
    fontWeight: 700,
    padding: "1px 5px",
    borderRadius: 5,
    // The app's base layer zeroes `sup` line-height, which collapses the pill
    // to its padding and lets the number spill out of it.
    lineHeight: "normal",
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
  const renderSups = (cites: number[]) =>
    cites.map((n) => (
      <sup key={n} style={n === hotN ? supHot : supBase}>
        {n}
      </sup>
    ));

  const promptText = typed(PROMPT, 1.2, 2.4, t);
  const showPromptCaret = t >= 1.2 && t < 4.9;
  const sent = t >= 4.9;
  const sendScale = t >= 4.9 && t < 5.3 ? "scale(1.18)" : "scale(1)";

  const lastFound = T.searchT + 5 * 0.4 + 1.2;
  const chips = CHIPS.map((c, i) => {
    const appear = T.searchT + i * 0.4;
    const found = t >= appear + 1.2;
    const visible = t >= appear;
    return { ...c, visible, found, searching: visible && !found };
  });
  const statusShow = t >= T.searchT && t < lastFound;
  const searchDoneShow = t >= lastFound && t < T.cardAppear + 2;

  const tShow = ease(clamp((t - T.cardAppear) / 0.6, 0, 1));

  // ── map ──
  const fade = (at: number, dur: number) => ease(clamp((t - at) / dur, 0, 1));
  const mapOpacity = fade(T.mapStart, 0.5);
  const z = fade(T.zoomStart, T.zoomEnd - T.zoomStart);
  const mapScale = 1 + 0.3 * z;
  const blurP = clamp((t - LAYER_T[0]) / (LAYER_T[5] + 0.9 - LAYER_T[0]), 0, 1);
  const mapFilter = `blur(${((1 - blurP) * 7).toFixed(2)}px) saturate(${(0.35 + 0.65 * blurP).toFixed(3)})`;
  const collapse = fade(T.collapseStart, T.collapseEnd - T.collapseStart) * (1 - fade(T.reExpandAt + 0.2, 1.0));
  const mapH = Math.round(470 - 260 * collapse);
  const labelOpacity = fade(T.labelAt, 0.4) * (1 - collapse);

  const layers = LAYERS.map((l, i) => {
    const vis = t >= LAYER_T[i];
    return { ...l, op: vis ? 1 : 0.35, loading: vis && t < LAYER_T[i] + 0.6, on: t >= LAYER_T[i] + 0.6 };
  });
  const layerCount = `${layers.filter((l) => l.on).length} of 6`;

  // ── analysis ──
  const sumShow = t >= T.sumStart;
  const sp = clamp((t - T.sumStart) / T.sumDur, 0, 1);
  const sumText = SUMMARY.slice(0, Math.floor(sp * SUMMARY.length));
  const sumCaret = sumShow && sp < 1;
  const tableShow = t >= T.tableStart;
  const shownItems = tableShow ? Math.floor((t - T.tableStart) / T.rowGap) + 1 : 0;
  const useItems = USE_ITEMS.slice(0, shownItems);
  const permitShow = t >= T.permitAt;
  const permitCites = t >= T.permitAt + 0.4 ? [6] : [];

  let docPillText = "Resolving parcel…";
  let pillDone = false;
  if (t >= T.mapStart && t < T.sumStart) docPillText = "Loading GIS layers…";
  else if (t >= T.sumStart && t < T.permitAt + 0.6) docPillText = "Analyzing…";
  else if (t >= T.permitAt + 0.6) {
    docPillText = "Analysis ready";
    pillDone = true;
  }

  const citeRows = CITES.filter((_, i) => t >= CITE_AT[i]).map((c) => {
    const viewing = c.n === hotN;
    const ci = CITE_ORDER.indexOf(c.n);
    return { ...c, viewing, verified: ci >= 0 && t >= T.citeStart + ci * T.citeGap + 0.6 };
  });
  const citeCount = citeRows.length ? `${citeRows.length} of 6` : "—";

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

    // Scroll the analysis down to the permit history while the table writes in.
    const outer = root.querySelector<HTMLElement>("[data-doc-scroll]");
    const inner = root.querySelector<HTMLElement>("[data-doc-content]");
    if (outer && inner) {
      const max = Math.max(0, inner.offsetHeight - outer.clientHeight);
      const target = t >= T.tableStart && t < T.reExpandAt ? max : 0;
      scrollYRef.current =
        reduced || Math.abs(target - scrollYRef.current) < 0.6
          ? target
          : scrollYRef.current + (target - scrollYRef.current) * 0.12;
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

    // Connector wires: source chips streaming into the analysis card.
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

    const on = t >= FLOW.start - 0.2 && t < T.endAt && !reduced;
    svg.style.opacity = on ? "1" : "0";
    if (!on || !wiresRef.current) return;

    for (const wi of wiresRef.current) {
      const drawP = clamp((t - wi.drawStart) / 0.9, 0, 1);
      wi.path.style.strokeDashoffset = (wi.len * (1 - ease(drawP))).toFixed(1);
      wi.dots.forEach((dot, k) => {
        if (drawP < 0.55) {
          dot.setAttribute("opacity", "0");
          return;
        }
        const phase = ((((t - wi.drawStart) / 3.1 + k * 0.5) % 1) + 1) % 1;
        const pt = bezier(wi.w, phase);
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
  const sectionTitle: Style = {
    fontFamily: SERIF,
    fontWeight: 600,
    fontSize: 21,
    color: token("--text-primary"),
  };
  const panelRule = `1px solid ${token("--border-default")}`;

  return (
    <div ref={viewRef}>
      <DemoKeyframes />
      <DemoStage label="Madison AI looking up every allowed use for a parcel, mapping it in GIS, and citing the zoning code, staff reports, and permits behind each answer">
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
              <StepRule num="01" title="Ask about a parcel" />
              <div
                style={{
                  ...cardShell,
                  borderRadius: 16,
                  padding: "21px 23px 17px",
                  minHeight: 150,
                  display: "flex",
                  flexDirection: "column",
                  flexShrink: 0,
                  boxShadow: "var(--elevation-md)",
                }}
              >
                <div style={{ fontSize: 21, lineHeight: 1.5, color: token("--text-primary"), flex: 1 }}>
                  {promptText}
                  {showPromptCaret ? <Caret height={20} color={token("--brand-primary")} /> : null}
                </div>
                <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: 13,
                      fontWeight: 600,
                      color: token("--brand-accent"),
                      background: token("--brand-accent", 0.08),
                      border: `1px solid ${token("--brand-accent", 0.2)}`,
                      borderRadius: 999,
                      padding: "5px 12px",
                    }}
                  >
                    Planning &amp; Zoning
                  </span>
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

              <StepRule num="02" title="Search across your systems" style={{ margin: "22px 0 12px" }} />
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
                    <span>Searching 6 systems for 555 Chance Ln…</span>
                  </>
                ) : null}
                {searchDoneShow ? (
                  <>
                    <Dot color={token("--semantic-success")} />
                    <span style={{ color: token("--semantic-success") }}>APN 017-400-72 resolved · 6 systems</span>
                  </>
                ) : null}
              </div>

              <div data-cur="systems" style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {chips.map((c, i) => (
                  <div
                    key={c.name}
                    data-chip={i}
                    style={{
                      flex: 1,
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      gap: 15,
                      padding: "0 16px 0 18px",
                      minHeight: 76,
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
                    <span
                      role="img"
                      aria-label={c.name}
                      style={{
                        flex: "0 0 auto",
                        width: Math.round(c.logoH * c.ar),
                        height: c.logoH,
                        background: `url('${c.logo}') left center / contain no-repeat`,
                      }}
                    />
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

            {/* ── Right: map + analysis ── */}
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
              <StepRule num="03" title="Map the parcel and cite the allowed uses" style={{ flex: "0 0 auto" }} />
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
                  {/* Analysis */}
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <div
                      data-cur="doc"
                      style={{
                        flex: "0 0 auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 13,
                        padding: "16px 26px",
                        borderBottom: panelRule,
                      }}
                    >
                      <span style={{ ...sectionTitle, letterSpacing: "-0.01em" }}>Allowed Use: 555 Chance Lane</span>
                      <span style={{ ...metaFont, fontSize: 13, color: token("--text-muted") }}>APN 017-400-72</span>
                      <span
                        style={{
                          marginLeft: "auto",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 9,
                          fontWeight: 700,
                          fontSize: 12,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "7px 14px",
                          borderRadius: 999,
                          border: `1px solid ${pillDone ? token("--semantic-success", 0.3) : token("--brand-accent", 0.22)}`,
                          background: pillDone ? token("--semantic-success", 0.12) : token("--brand-accent", 0.1),
                          color: pillDone ? token("--semantic-success") : token("--brand-accent"),
                        }}
                      >
                        <Dot color={pillDone ? token("--semantic-success") : token("--brand-accent")} pulse={!pillDone} />
                        {docPillText}
                      </span>
                    </div>

                    <div data-doc-scroll style={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
                      <div data-doc-content style={{ padding: "20px 26px 24px" }}>
                        {/* GIS map */}
                        <div
                          data-cur="map"
                          style={{
                            position: "relative",
                            height: mapH,
                            borderRadius: 12,
                            overflow: "hidden",
                            border: panelRule,
                            background: "#EEF0EA",
                            opacity: mapOpacity,
                          }}
                        >
                          <ParcelMap scale={mapScale} filter={mapFilter} />
                          <div
                            style={{
                              position: "absolute",
                              left: "calc(50% + 40px)",
                              top: "calc(50% - 82px)",
                              opacity: labelOpacity,
                              background: token("--bg-surface"),
                              border: panelRule,
                              borderRadius: 10,
                              padding: "9px 13px",
                              boxShadow: "var(--elevation-lg)",
                            }}
                          >
                            <div style={{ ...metaFont, fontSize: 13, fontWeight: 700, color: token("--text-primary") }}>
                              555 CHANCE LN
                            </div>
                            <div style={{ fontSize: 12.5, color: token("--text-secondary"), marginTop: 3 }}>
                              LDS · Suburban Residential · 5.86 ac
                            </div>
                          </div>
                          <div
                            data-cur="expand"
                            style={{
                              position: "absolute",
                              right: 12,
                              top: 12,
                              display: "flex",
                              alignItems: "center",
                              gap: 7,
                              background: token("--bg-surface"),
                              border: panelRule,
                              borderRadius: 8,
                              padding: "6px 11px",
                              fontSize: 12.5,
                              fontWeight: 600,
                              color: token("--text-primary"),
                              opacity: collapse,
                            }}
                          >
                            <EyeIcon size={14} />
                            Expand GIS map
                          </div>
                        </div>

                        {/* summary */}
                        {sumShow ? (
                          <div style={{ marginTop: 20 }}>
                            <div style={{ ...sectionTitle, marginBottom: 8 }}>Executive summary</div>
                            <div style={{ fontSize: 17, lineHeight: 1.6, color: token("--text-secondary") }}>
                              {sumText}
                              {sp >= 1 ? renderSups([1]) : null}
                              {sumCaret ? <Caret height={17} color={token("--brand-accent")} /> : null}
                            </div>
                          </div>
                        ) : null}

                        {/* allowed uses table */}
                        {tableShow ? (
                          <div style={{ marginTop: 22 }}>
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                              <span style={sectionTitle}>Uses · LDS zone</span>
                              <span style={{ ...metaFont, fontSize: 11.5, color: token("--text-muted") }}>
                                A allowed · AR admin review · P admin permit · S2 special use permit
                              </span>
                            </div>
                            {useItems.map((u) =>
                              u.kind === "head" ? (
                                <div
                                  key={u.title}
                                  style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    gap: 10,
                                    paddingBottom: 6,
                                    marginTop: 14,
                                    borderBottom: `2px solid ${token("--text-primary")}`,
                                  }}
                                >
                                  <span style={{ ...sectionTitle, fontSize: 17.5 }}>{u.title}</span>
                                  <span style={{ fontSize: 13, color: token("--text-muted") }}>{u.sub}</span>
                                  <span style={{ marginLeft: "auto", ...metaFont, fontSize: 12, color: token("--text-muted") }}>
                                    {u.count}
                                  </span>
                                </div>
                              ) : (
                                <div
                                  key={u.row.use}
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "50px minmax(0,1fr) minmax(0,1.3fr)",
                                    alignItems: "center",
                                    gap: 14,
                                    padding: "8px 2px",
                                    borderBottom: panelRule,
                                  }}
                                >
                                  <span
                                    style={{
                                      justifySelf: "start",
                                      ...metaFont,
                                      fontSize: 12.5,
                                      fontWeight: 700,
                                      color: BADGE[u.row.code].ink,
                                      background: BADGE[u.row.code].tint,
                                      borderRadius: 6,
                                      padding: "3px 8px",
                                    }}
                                  >
                                    {u.row.code}
                                  </span>
                                  <span style={{ fontSize: 15.5, fontWeight: 600, color: token("--text-primary") }}>
                                    {u.row.use}
                                  </span>
                                  <span style={{ fontSize: 14, lineHeight: 1.4, color: token("--text-secondary") }}>
                                    {u.row.note}
                                    {renderSups(u.row.cites)}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        ) : null}

                        {/* permit history */}
                        {permitShow ? (
                          <div style={{ marginTop: 20 }}>
                            <div style={{ ...sectionTitle, marginBottom: 8 }}>Permit history</div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                background: token("--bg-panel"),
                                border: panelRule,
                                borderRadius: 10,
                                padding: "12px 16px",
                              }}
                            >
                              <span
                                style={{
                                  flex: "0 0 auto",
                                  whiteSpace: "nowrap",
                                  ...metaFont,
                                  fontSize: 14.5,
                                  fontWeight: 700,
                                  color: token("--text-primary"),
                                }}
                              >
                                WDADAR19-0005
                              </span>
                              <span style={{ flex: 1, minWidth: 0, fontSize: 15.5, color: token("--text-secondary") }}>
                                Detached ADU · admin review · 2019
                              </span>
                              <span
                                style={{
                                  flex: "0 0 auto",
                                  whiteSpace: "nowrap",
                                  ...metaFont,
                                  fontSize: 12.5,
                                  color: token("--text-muted"),
                                }}
                              >
                                In review
                                {renderSups(permitCites)}
                              </span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Right panel: layers + sources */}
                  <aside
                    style={{
                      width: 340,
                      flexShrink: 0,
                      borderLeft: panelRule,
                      background: token("--bg-panel"),
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ flex: "0 0 auto", padding: "18px 18px 14px", borderBottom: panelRule }}>
                      <PanelHeading label="GIS LAYERS" value={layerCount} style={{ marginBottom: 10 }} />
                      {layers.map((l) => (
                        <div
                          key={l.name}
                          style={{ display: "flex", alignItems: "center", gap: 11, padding: "6px 0", opacity: l.op }}
                        >
                          <span style={{ flex: "0 0 auto", width: 18, height: 14, borderRadius: 3, ...l.swatch }} />
                          <span style={{ flex: 1, fontSize: 14.5, fontWeight: 500, color: token("--text-primary") }}>
                            {l.name}
                          </span>
                          {l.loading ? (
                            <span style={{ ...metaFont, fontSize: 11.5, color: token("--text-muted") }}>loading…</span>
                          ) : null}
                          {l.on ? (
                            <span
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                background: token("--semantic-success"),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <CheckIcon size={10} />
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: "16px 18px" }}>
                      <PanelHeading label="SOURCES CITED" value={citeCount} style={{ margin: "2px 0 12px" }} />
                      {citeRows.map((r) => (
                        <div
                          key={r.n}
                          data-cur={`cite${r.n}`}
                          style={{
                            padding: "11px 12px",
                            borderRadius: 11,
                            marginBottom: 8,
                            transition: "all .3s",
                            background: r.viewing ? token("--brand-accent", 0.08) : token("--bg-surface"),
                            border: `1px solid ${r.viewing ? token("--brand-accent", 0.5) : token("--border-default")}`,
                          }}
                        >
                          <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
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
                              <div style={{ fontSize: 14, fontWeight: 600, color: token("--text-primary"), lineHeight: 1.3 }}>
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
                          {r.viewing ? (
                            <div
                              style={{
                                marginTop: 9,
                                paddingTop: 9,
                                borderTop: `1px dashed ${token("--border-active")}`,
                                fontSize: 12.5,
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
                    <div
                      style={{
                        flex: "0 0 auto",
                        padding: "10px 18px 12px",
                        borderTop: panelRule,
                        fontSize: 10,
                        color: token("--text-muted"),
                        textAlign: "center",
                      }}
                    >
                      Madison AI can make mistakes. Check important information.
                    </div>
                  </aside>
                </div>
              </div>
            </section>
          </div>

          {/* Connector wires (sources → analysis) */}
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
              <linearGradient id="maiAllowedWireGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={token("--text-muted")} stopOpacity="0.16" />
                <stop offset="55%" stopColor={token("--brand-accent")} stopOpacity="0.85" />
                <stop offset="100%" stopColor={token("--brand-primary")} stopOpacity="1" />
              </linearGradient>
            </defs>
            <g data-wire-group fill="none" stroke="url(#maiAllowedWireGrad)" strokeWidth="2.4" strokeLinecap="round" />
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

function PanelHeading({ label, value, style }: { label: string; value: string; style?: Style }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", ...style }}>
      <span style={{ ...metaFont, fontSize: 12.5, color: token("--text-muted") }}>{label}</span>
      <span style={{ ...metaFont, fontSize: 12.5, fontWeight: 700, color: token("--brand-accent") }}>{value}</span>
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

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={token("--brand-foreground")} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
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

function EyeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={token("--text-primary")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/**
 * The GIS basemap with the subject parcel outlined and pinned. Drawn in its
 * own literal map palette (land cover, water, road casings) rather than UI
 * tokens: it stands in for an Esri map render, the same reasoning that gives
 * client logos a true-white plate instead of the warm canvas.
 */
function ParcelMap({ scale, filter }: { scale: number; filter: string }) {
  return (
    <svg
      viewBox="0 0 680 482"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        transformOrigin: "50% 50%",
        transform: `scale(${scale.toFixed(4)})`,
        filter,
      }}
    >
      <rect x="0" y="0" width="680" height="482" fill="#D6DEE1" />
      <polygon points="398,0 680,0 680,248 671,248 662,192 628,138 568,84" fill="#D7DA9C" />
      <polygon points="668,380 680,380 680,482 664,482" fill="#C9E0AE" />
      <polygon points="160,0 344,0 344,160 252,160 252,138 186,138 175,60" fill="#C2E2AE" />
      <polygon points="346,160 520,158 520,360 432,360 432,240 346,240" fill="#C9E6B6" />
      <polygon points="40,137 250,139 251,374 38,372" fill="#BDE1A6" />
      <polygon points="40,140 186,140 40,300" fill="#D2EAC3" />
      <polygon points="0,300 40,300 38,372 0,372" fill="#C7E4B2" />
      <polygon points="0,374 456,374 456,482 0,482" fill="#C4E3B0" />
      <path d="M266 -4 C 268 40, 266 90, 285 112 C 300 126, 320 126, 336 124" fill="none" stroke="#EEF1F2" strokeWidth="5" strokeLinecap="round" opacity=".85" />
      <path d="M412 288 C 426 310, 430 335, 446 362" fill="none" stroke="#EEF1F2" strokeWidth="4" strokeLinecap="round" opacity=".8" />
      <path d="M546 400 C 552 420, 560 440, 582 452" fill="none" stroke="#EEF1F2" strokeWidth="4" strokeLinecap="round" opacity=".8" />
      <path d="M18 482 C 34 452, 62 430, 96 438 C 122 444, 150 432, 178 456" fill="none" stroke="#8DC3E6" strokeWidth="3" strokeLinecap="round" />
      {BUILDINGS.map(([x, y, w, h, rot]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={w}
          height={h}
          rx="1.5"
          fill="#BCC3CA"
          stroke="#A3ABB3"
          strokeWidth="1"
          transform={rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : undefined}
        />
      ))}
      <path d="M516 366 L 690 366" fill="none" stroke="#9CA3AA" strokeWidth="12" />
      <path d="M516 366 L 690 366" fill="none" stroke="#F5F6F6" strokeWidth="9" />
      <path d={ROAD_WEST} fill="none" stroke="#9CA3AA" strokeWidth="10" />
      <path d={ROAD_WEST} fill="none" stroke="#F5F6F6" strokeWidth="7" />
      <path d={ROAD_MAIN} fill="none" stroke="#2C2E30" strokeWidth="20" strokeLinejoin="round" />
      <path d={ROAD_MAIN} fill="none" stroke="#A9B0B6" strokeWidth="15" strokeLinejoin="round" />
      <path d={ROAD_MAIN} fill="none" stroke="#F7F7F7" strokeWidth="11" strokeLinejoin="round" />
      <g fill="none" stroke="#2C2E30" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
        <path d={ROAD_WEST} />
        <path d="M52 136 L 250 139" />
        <path d="M250 139 L 252 375" />
        <path d="M0 372 L 456 375" />
        <path d="M456 375 L 456 490" />
        <path d="M346 160 L 346 0" />
      </g>
      <polygon
        points="252,160 346,160 346,240 431,240 431,358 516,358 516,378 253,376"
        fill="rgb(60 140 170 / 0.2)"
        stroke="#203F5D"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <g fontFamily="Inter, sans-serif" fontSize="13" fill="#5B6168" stroke="#F4F6F7" strokeWidth="3" paintOrder="stroke" strokeLinejoin="round">
        <text transform="translate(78 82) rotate(-77)">Ox-Yoke Lane</text>
        <text transform="translate(520 270) rotate(-90)">Ox Yoke Lane</text>
        <text transform="translate(522 62) rotate(37)">Rhodes Road</text>
        <text x="612" y="370">Chance Lane</text>
      </g>
      <ellipse cx="358" cy="282" rx="18" ry="6" fill="rgb(0 0 0 / 0.22)" transform="rotate(-20 358 282)" />
      <defs>
        <linearGradient id="maiAllowedPinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4C9BE0" />
          <stop offset="1" stopColor="#1D6CB6" />
        </linearGradient>
      </defs>
      <path
        d="M342 285 C 330 262 318 248 318 226 A 24 24 0 0 1 366 226 C 366 248 354 262 342 285 Z"
        fill="url(#maiAllowedPinGrad)"
        stroke="#1A5E9E"
        strokeWidth="1.5"
      />
      <circle cx="342" cy="225" r="8.5" fill="#fff" />
    </svg>
  );
}
