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

// ============================================================================
// SolicitationDemo — the animated product demo under the Contracts &
// Procurement AI hero.
//
// One workflow, beat for beat: a buyer describes the solicitation they need,
// Madison searches six procurement sources, wires them into an assistant that
// asks three clarifying questions, then writes a six-section RFP live and runs
// a compliance pass over it.
//
// The source authored this as an async `run()` of sequential `await wait(ms)`
// calls. Reproducing that literally would give us a one-shot animation with no
// way to loop cleanly, pause off-screen, or hold a still for reduced-motion —
// so the identical wait values are instead accumulated into an absolute
// timeline (`S` below) and replayed off a clock. Every duration is the
// source's; only the driver changed.
// ============================================================================

const SANS = "var(--font-sans)";
const SERIF = "var(--font-serif)";
const metaFont: Style = { fontFamily: SANS, letterSpacing: "0.04em" };

const PROMPT =
  "Build an RFP for citywide tree-trimming and urban forestry services — three-year term with two one-year renewals. Prevailing wage applies.";

const CHIPS = [
  { name: "Prior solicitations", find: "312 docs", browsing: "prior solicitations" },
  { name: "Procurement manual", find: "rev 2026", browsing: "the procurement manual" },
  { name: "Municipal code", find: "§ 3.24", browsing: "municipal code" },
  { name: "Budget & CIP", find: "FY26", browsing: "budget & CIP records" },
  { name: "Section templates", find: "18 forms", browsing: "section templates" },
  { name: "Past contracts", find: "204 records", browsing: "past contracts" },
];

const ROUNDS = [
  {
    q: "A couple of quick questions to tailor this RFP. Roughly how much do you expect this to cost?",
    a: "About $1.4M over the three-year term.",
  },
  {
    q: "Is this being funded with general fund or grant funds?",
    a: "General fund — under budget authority BA-2026-07, CIP line 41-220.",
  },
  {
    q: "Do you have specific insurance requirements to meet, or just use our standards?",
    a: "Use our standards — $2M CGL per occurrence and a 100% performance bond.",
  },
];

const CLOSER = "Got it — that’s everything I need. Drafting your solicitation now.";

/** A source-to-assistant connector: the drawn path plus the pulses riding it. */
interface SolWire {
  w: { p0: number[]; c0: number[]; c1: number[]; p1: number[] };
  path: SVGPathElement;
  len: number;
  dots: SVGCircleElement[];
}

interface RfpLine {
  text: string;
  /** Bullet-style lines animate faster, matching the source's 380ms vs 520ms. */
  li?: boolean;
}

const RFP_SECTIONS: { n: string; title: string; lines: RfpLine[] }[] = [
  {
    n: "1.",
    title: "Purpose & Background",
    lines: [
      {
        text: 'The City of Cedar Hollow (the "City") is soliciting proposals from qualified firms to provide comprehensive urban forestry and tree-maintenance services across its public rights-of-way, parks, and facilities.',
      },
      {
        text: "The City maintains an inventory of approximately 9,400 trees. This solicitation establishes a multi-year program covering routine maintenance, hazard mitigation, and emergency response.",
      },
    ],
  },
  {
    n: "2.",
    title: "Scope of Work",
    lines: [
      { text: "The selected contractor shall provide routine and emergency services, including:" },
      { text: "Structural and clearance pruning on a three-year cycle across all inventoried trees", li: true },
      { text: "Tree and stump removal, planting, and establishment watering of replacement stock", li: true },
      { text: "24/7 emergency storm response, on-site citywide within two hours", li: true },
      { text: "All work shall conform to ANSI A300 standards and Z133 safety requirements." },
    ],
  },
  {
    n: "3.",
    title: "Minimum Qualifications",
    lines: [
      { text: "Proposers must demonstrate, at minimum:" },
      { text: "At least one ISA-Certified Arborist assigned to each crew", li: true },
      { text: "A minimum of five (5) years of municipal urban-forestry experience", li: true },
      { text: "A valid contractor's license and current general liability coverage", li: true },
    ],
  },
  {
    n: "4.",
    title: "Evaluation Criteria",
    lines: [
      {
        text: "Proposals will be scored on a 100-point scale: Qualifications & Experience (30), Technical Approach & Service Plan (25), Cost Proposal (25), Local & DBE Participation (10), and References (10).",
      },
      { text: "Award will be made to the proposer offering the best overall value to the City, subject to Council confirmation." },
    ],
  },
  {
    n: "5.",
    title: "Insurance, Bonding & Prevailing Wage",
    lines: [
      {
        text: "The contractor shall maintain commercial general liability of $2,000,000 per occurrence, automobile liability, and statutory workers' compensation coverage.",
      },
      {
        text: "Prevailing wage applies to all work under this contract per Municipal Code § 3.24. A performance bond equal to 100% of the annual contract value is required prior to notice to proceed.",
      },
    ],
  },
  {
    n: "6.",
    title: "Submission & Schedule",
    lines: [
      {
        text: "One electronic proposal shall be submitted through the City bid portal no later than 2:00 PM on the posted closing date. Late submissions will not be accepted.",
      },
      {
        text: "Estimated contract value is $1.4 million over a three-year term with two optional one-year renewals, following the standard 60-day procurement cycle.",
      },
    ],
  },
];

const TSECS = [
  "Purpose & Background",
  "Scope of Work",
  "Minimum Qualifications",
  "Evaluation Criteria",
  "Insurance, Bonding & Wage",
  "Submission & Schedule",
];

const COMPLIANCE = [
  { name: "Prevailing wage clause", ref: "Municipal Code § 3.24", status: "Verified" },
  { name: "Insurance & bonding minimums", ref: "Manual § 7.2 · CGL $2M / 100% bond", status: "Verified" },
  { name: "Local & DBE participation", ref: "Manual § 4.5 · 10-point preference", status: "Verified" },
  { name: "Conflict-of-interest certification", ref: "Manual § 9.1 · Form COI-2", status: "Verified" },
  { name: "Budget authority confirmed", ref: "BA-2026-07 · CIP line 41-220", status: "Verified" },
  { name: "Public Records Act notice", ref: "Manual § 11.0 · was missing — inserted", status: "Added" },
];

// ── timeline, accumulated from the source's exact waits ─────────────────────

interface ChatEvent {
  at: number;
  kind: "typing" | "ai" | "user";
  text?: string;
  intro?: boolean;
  /** For a typing indicator: when it's replaced by the message. */
  until?: number;
}

function buildSchedule() {
  let c = 0;
  const s = (ms: number) => (c += ms) / 1000;
  const now = () => c / 1000;

  // 01 Intent
  s(1600);
  const promptStart = now();
  const promptDur = (PROMPT.length * 28) / 1000;
  s(PROMPT.length * 28);
  const promptDone = now();
  s(1000);
  const heroOut = now(); // left column settles back from its hero zoom
  s(900);

  // 02 Search
  const searchBlockAt = now();
  const chipAppear: number[] = [];
  for (let i = 0; i < CHIPS.length; i++) {
    chipAppear.push(now());
    s(120);
  }
  s(450);
  const chipSearch: number[] = [];
  const chipFound: number[] = [];
  for (let i = 0; i < CHIPS.length; i++) {
    chipSearch.push(now());
    s(780);
    chipFound.push(now());
    s(220);
  }
  const searchDoneAt = now();
  s(700);

  // 03 Clarify
  const chatPanelAt = now();
  s(450);
  const wiresAt = now();
  s(CHIPS.length * 120 + 1000);
  const cursorOnAt = now();

  const chat: ChatEvent[] = [];
  const composer: { at: number; text: string; dur: number; sendAt: number; clearAt: number }[] = [];
  for (const round of ROUNDS) {
    const typingAt = now();
    s(950);
    chat.push({ at: typingAt, kind: "typing", until: now() });
    chat.push({ at: now(), kind: "ai", text: round.q });
    s(900);
    const compStart = now();
    const compDur = (round.a.length * 26) / 1000;
    s(round.a.length * 26);
    s(360);
    s(620); // cursor travels to send
    const sendAt = now();
    s(200);
    const clearAt = now();
    composer.push({ at: compStart, text: round.a, dur: compDur, sendAt, clearAt });
    chat.push({ at: clearAt, kind: "user", text: round.a });
    s(850);
  }
  const cursorOffAt = now();
  const closerTypingAt = now();
  s(900);
  chat.push({ at: closerTypingAt, kind: "typing", until: now() });
  chat.push({ at: now(), kind: "ai", text: CLOSER, intro: true });
  s(1700);
  const wiresOffAt = now();

  // 04 Create
  const stage4At = now();
  s(600);
  const coverAt = now();
  s(900);

  const secAt: number[] = [];
  const secDoneAt: number[] = [];
  const lineAt: number[][] = [];
  for (let i = 0; i < RFP_SECTIONS.length; i++) {
    secAt.push(now());
    s(440);
    const lines: number[] = [];
    for (const ln of RFP_SECTIONS[i].lines) {
      lines.push(now());
      s(ln.li ? 380 : 520);
    }
    lineAt.push(lines);
    s(260);
    secDoneAt.push(now());
    s(220);
  }
  s(600);

  // Compliance
  const compPanelAt = now();
  s(700);
  const compItemAt: number[] = [];
  const compCheckAt: number[] = [];
  for (let i = 0; i < COMPLIANCE.length; i++) {
    compItemAt.push(now());
    s(320);
    compCheckAt.push(now());
    s(540);
  }
  s(500);

  const readyAt = now();
  s(4600);
  const fadeOutAt = now();
  s(850);
  const total = now();

  return {
    promptStart,
    promptDur,
    promptDone,
    heroOut,
    searchBlockAt,
    chipAppear,
    chipSearch,
    chipFound,
    searchDoneAt,
    chatPanelAt,
    wiresAt,
    cursorOnAt,
    chat,
    composer,
    cursorOffAt,
    wiresOffAt,
    stage4At,
    coverAt,
    secAt,
    secDoneAt,
    lineAt,
    compPanelAt,
    compItemAt,
    compCheckAt,
    readyAt,
    fadeOutAt,
    total,
  };
}

const S = buildSchedule();
const DUR = S.total;
/** Reduced-motion still: the finished RFP with compliance cleared. */
const STATIC_FRAME = S.readyAt + 1;

export function SolicitationDemo() {
  const { t, viewRef, reduced } = useDemoClock(DUR, { staticAt: STATIC_FRAME });
  const rootRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const docScrollRef = useRef<HTMLDivElement>(null);
  const wiresRef = useRef<SolWire[] | null>(null);
  const wireKeyRef = useRef("");

  // ── frame state ───────────────────────────────────────────────────────────
  const inHero = t < S.heroOut;
  const promptText = typed(PROMPT, S.promptStart, S.promptDur, t);
  const promptCaret = t >= S.promptStart && t < S.promptDone + 1;
  const eyebrowShown = t >= S.heroOut;

  const searchShown = t >= S.searchBlockAt;
  const chips = CHIPS.map((c, i) => {
    const visible = t >= S.chipAppear[i];
    const found = t >= S.chipFound[i];
    const searching = t >= S.chipSearch[i] && !found;
    return { ...c, visible, found, searching };
  });
  const browsingIdx = chips.findIndex((c) => c.searching);
  const searchDone = t >= S.searchDoneAt;

  const chatShown = t >= S.chatPanelAt && t < S.stage4At;
  const wiresOn = t >= S.wiresAt && t < S.wiresOffAt;
  const cursorOn = t >= S.cursorOnAt && t < S.cursorOffAt;

  const messages = S.chat.filter((m) => {
    if (m.kind === "typing") return t >= m.at && t < (m.until ?? m.at);
    return t >= m.at;
  });

  const activeComposer = S.composer.find((c) => t >= c.at && t < c.clearAt);
  const composerText = activeComposer ? typed(activeComposer.text, activeComposer.at, activeComposer.dur, t) : "";
  const composerPressed = activeComposer ? t >= activeComposer.sendAt && t < activeComposer.clearAt : false;

  const stage4Shown = t >= S.stage4At;
  const coverShown = t >= S.coverAt;
  const sections = RFP_SECTIONS.map((sec, i) => ({
    ...sec,
    shown: t >= S.secAt[i],
    lines: sec.lines.map((ln, j) => ({ ...ln, shown: t >= S.lineAt[i][j] })),
  }));
  const activeSec = S.secAt.findIndex((at, i) => t >= at && t < S.secDoneAt[i]);
  const doneSecs = S.secDoneAt.filter((at) => t >= at).length;

  const compShown = t >= S.compPanelAt;
  const compItems = COMPLIANCE.map((c, i) => ({
    ...c,
    shown: t >= S.compItemAt[i],
    checked: t >= S.compCheckAt[i],
  }));
  const ready = t >= S.readyAt;
  const statusText = ready
    ? "Solicitation ready"
    : compShown
      ? "Reviewing compliance…"
      : activeSec >= 0
        ? `Drafting ${activeSec + 1} of 6 sections`
        : "Drafting solicitation…";

  // The whole stage fades out before looping, so the restart isn't a hard cut.
  const loopFade = t >= S.fadeOutAt ? 1 - clamp((t - S.fadeOutAt) / 0.85, 0, 1) : 1;

  // ── imperative layer: chat autoscroll, typewriter follow, wires ───────────
  useLayoutEffect(() => {
    const chat = chatScrollRef.current;
    if (chat) chat.scrollTop = chat.scrollHeight;

    // Keep the line being written in the lower-middle of the page, as the
    // source's typewriter-follow scroll did.
    const doc = docScrollRef.current;
    if (doc) {
      if (ready) {
        doc.scrollTop += (0 - doc.scrollTop) * 0.12;
      } else {
        const active = doc.querySelector<HTMLElement>("[data-line-active]");
        if (active) {
          const target = active.offsetTop + active.offsetHeight - doc.clientHeight * 0.62;
          if (target > doc.scrollTop) doc.scrollTop += (target - doc.scrollTop) * 0.18;
        }
      }
    }

    const root = rootRef.current;
    if (!root) return;
    const rootRect = root.getBoundingClientRect();
    const fit = rootRect.width / STAGE_W;
    if (!fit) return;
    const stageRect = (el: Element) => {
      const r = el.getBoundingClientRect();
      return {
        x: (r.left - rootRect.left) / fit,
        y: (r.top - rootRect.top) / fit,
        w: r.width / fit,
        h: r.height / fit,
      };
    };

    const group = root.querySelector<SVGGElement>("[data-wire-group]");
    const pulses = root.querySelector<SVGGElement>("[data-pulse-group]");
    const panel = root.querySelector("[data-chat-panel]");
    if (!group || !pulses || !panel) return;
    const pr = stageRect(panel);
    const key = `${fit.toFixed(4)}:${pr.x.toFixed(1)}`;
    // Measure only once the wires are due — see the same guard in ./pra-demo.tsx.
    // Before that the left column is still in its opening zoom, so the chips
    // would be measured (and cached) at transformed positions.
    if (wiresOn && (!wiresRef.current || wireKeyRef.current !== key)) {
      const chipRects: ReturnType<typeof stageRect>[] = [];
      for (let i = 0; i < CHIPS.length; i++) {
        const c = root.querySelector(`[data-chip="${i}"]`);
        if (c) chipRects.push(stageRect(c));
      }
      if (chipRects.length < CHIPS.length) return;
      group.innerHTML = "";
      pulses.innerHTML = "";
      const SVGNS = "http://www.w3.org/2000/svg";
      const n = chipRects.length;
      const top = pr.y + pr.h * 0.16;
      const span = pr.h * 0.64;
      wiresRef.current = chipRects.map((cr, i) => {
        const x1 = cr.x + cr.w - 6;
        const y1 = cr.y + cr.h / 2;
        const x2 = pr.x;
        const y2 = top + (n > 1 ? (span * i) / (n - 1) : 0);
        const dx = Math.max(54, (x2 - x1) * 0.55);
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
        return {
          w: { p0: [x1, y1], c0: [x1 + dx, y1], c1: [x2 - dx, y2], p1: [x2, y2] },
          path,
          len,
          dots,
        };
      });
      wireKeyRef.current = key;
    }

    if (!wiresRef.current) return;

    const bez = (w: SolWire["w"], u: number) => {
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

    for (let i = 0; i < wiresRef.current.length; i++) {
      const wi = wiresRef.current[i];
      const drawStart = S.wiresAt + i * 0.12;
      const drawP = wiresOn ? clamp((t - drawStart) / 0.9, 0, 1) : 0;
      wi.path.style.strokeDashoffset = (wi.len * (1 - ease(drawP))).toFixed(1);
      // Pulses ride the wire once it's mostly drawn — the same "data is
      // flowing" cue the other two Platform demos use.
      wi.dots.forEach((dot, k) => {
        if (drawP < 0.55 || !wiresOn) {
          dot.setAttribute("opacity", "0");
          return;
        }
        const phase = ((((t - drawStart) / 3.1 + k * 0.5) % 1) + 1) % 1;
        const pt = bez(wi.w, phase);
        const op = phase < 0.12 ? phase / 0.12 : phase > 0.88 ? (1 - phase) / 0.12 : 1;
        dot.setAttribute("cx", pt[0].toFixed(1));
        dot.setAttribute("cy", pt[1].toFixed(1));
        dot.setAttribute("opacity", (op * 0.95).toFixed(2));
      });
    }
  }, [t, ready, wiresOn]);

  const card: Style = {
    background: token("--bg-surface"),
    border: `1px solid ${token("--border-default")}`,
  };

  return (
    <div ref={viewRef}>
      <DemoKeyframes />
      <DemoStage label="Madison AI clarifying scope and then writing a compliant RFP from a city's procurement record">
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
          {/* ── 01/02: intent + search ── */}
          <div
            style={{
              position: "absolute",
              left: 96,
              top: 100,
              width: 460,
              height: 900,
              display: "flex",
              flexDirection: "column",
              transformOrigin: "0 0",
              transition: reduced ? undefined : "transform 1.4s cubic-bezier(0.65,0,0.35,1)",
              transform: inHero ? "translate(440px, 80px) scale(1.78)" : "none",
            }}
          >
            <StepLabel num="01" name="Create New Request" small />
            <div style={{ ...card, width: "100%", borderRadius: 16, padding: "18px 22px 16px", boxShadow: "var(--elevation-md)" }}>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: 14,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: token("--text-muted"),
                  marginBottom: 12,
                  opacity: eyebrowShown ? 1 : 0,
                  transition: "opacity .75s ease",
                }}
              >
                New solicitation · Live
              </div>
              <div style={{ fontSize: 22, lineHeight: 1.45, color: token("--text-primary"), letterSpacing: "-0.005em", minHeight: "1.45em" }}>
                {promptText}
                {promptCaret ? <Caret height={16} color={token("--brand-primary")} /> : null}
              </div>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 16,
                  color: token("--text-muted"),
                  opacity: eyebrowShown ? 1 : 0,
                  transition: "opacity .75s ease",
                }}
              >
                <span>Professional services · 3-yr term · prevailing wage</span>
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
                  <ArrowUp size={15} />
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: 34,
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
                opacity: searchShown ? 1 : 0,
                transition: "opacity .9s ease",
              }}
            >
              <StepLabel num="02" name="Search your record" small />
              <div style={{ ...metaFont, fontSize: 14, color: token("--text-muted"), margin: "14px 0", display: "flex", alignItems: "center", gap: 9, minHeight: 17 }}>
                {searchDone ? (
                  <>
                    <Dot color={token("--semantic-success")} />
                    <span style={{ color: token("--semantic-success") }}>Searched 6 sources · 4,900+ records reviewed</span>
                  </>
                ) : browsingIdx >= 0 ? (
                  <>
                    <Dot color={token("--brand-accent")} pulse />
                    <span>Browsing {CHIPS[browsingIdx].browsing}…</span>
                  </>
                ) : null}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {chips.map((c, i) => (
                  <div
                    key={c.name}
                    data-chip={i}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      gap: 13,
                      padding: "0 16px",
                      minHeight: 62,
                      background: token("--bg-surface"),
                      borderRadius: 12,
                      opacity: c.visible ? 1 : 0,
                      transition: "opacity .4s ease, border-color .3s",
                      border: `1px solid ${
                        c.found ? token("--semantic-success", 0.45) : c.searching ? token("--brand-accent") : token("--border-default")
                      }`,
                      boxShadow: "var(--elevation-xs)",
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
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        flex: "0 0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: c.found ? token("--semantic-success", 0.12) : token("--brand-accent", 0.1),
                        color: c.found ? token("--semantic-success") : token("--brand-accent"),
                      }}
                    >
                      <FileGlyph />
                    </span>
                    <span style={{ fontSize: 19, fontWeight: 500, color: token("--text-primary") }}>{c.name}</span>
                    <span style={{ marginLeft: "auto", ...metaFont, fontSize: 14, color: c.found ? token("--text-secondary") : token("--text-muted") }}>
                      {c.found ? c.find : c.searching ? "searching…" : ""}
                    </span>
                    {c.found ? (
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: token("--semantic-success"),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Check size={11} />
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connector wires: sources → assistant */}
          <svg
            viewBox="0 0 1920 1080"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 16,
              opacity: wiresOn ? 1 : 0,
              transition: "opacity .6s ease",
            }}
          >
            <defs>
              <linearGradient id="solWireGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={token("--text-muted")} stopOpacity="0.16" />
                <stop offset="55%" stopColor={token("--brand-accent")} stopOpacity="0.85" />
                <stop offset="100%" stopColor={token("--brand-primary")} stopOpacity="1" />
              </linearGradient>
            </defs>
            <g data-wire-group fill="none" stroke="url(#solWireGrad)" strokeWidth="2.4" strokeLinecap="round" />
            <g data-pulse-group fill={token("--brand-accent")} />
          </svg>

          {/* ── 03: clarifying chat ── */}
          <div
            data-chat-panel
            style={{
              ...card,
              position: "absolute",
              left: 724,
              top: 100,
              width: 1100,
              height: 900,
              borderRadius: 18,
              boxShadow: "var(--elevation-2xl)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              opacity: chatShown ? 1 : 0,
              transition: "opacity .9s ease",
              zIndex: 17,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 30px", borderBottom: `1px solid ${token("--border-default")}`, flex: "0 0 auto" }}>
              <MTile size={44} radius={11} font={24} />
              <div>
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 22, color: token("--text-primary"), lineHeight: 1.1 }}>Clarifying scope</div>
                <div style={{ fontSize: 13, color: token("--text-muted"), marginTop: 3, letterSpacing: "0.02em" }}>
                  Urban Forestry &amp; Tree Maintenance · RFP-2026-014
                </div>
              </div>
              <div style={{ marginLeft: "auto", ...metaFont, fontSize: 14, color: token("--text-muted") }}>
                <span style={{ fontWeight: 700, color: token("--brand-accent") }}>03</span> · Clarify
              </div>
            </div>

            <div ref={chatScrollRef} style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: "26px 30px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {messages.map((m, i) =>
                  m.kind === "user" ? (
                    <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div
                        style={{
                          maxWidth: "76%",
                          background: token("--brand-accent"),
                          color: token("--brand-foreground"),
                          borderRadius: "16px 16px 5px 16px",
                          padding: "15px 20px",
                          fontSize: 20,
                          lineHeight: 1.45,
                        }}
                      >
                        {m.text}
                      </div>
                    </div>
                  ) : (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <MTile size={38} radius={10} font={20} />
                      <div
                        style={{
                          maxWidth: "76%",
                          background: m.intro ? token("--brand-accent", 0.08) : token("--bg-panel"),
                          border: `1px solid ${m.intro ? token("--brand-accent", 0.18) : token("--border-default")}`,
                          borderRadius: "16px 16px 16px 5px",
                          padding: "15px 20px",
                          fontSize: 20,
                          lineHeight: 1.45,
                          color: m.intro ? token("--brand-shade") : token("--text-primary"),
                        }}
                      >
                        {m.kind === "typing" ? <TypingDots /> : m.text}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div style={{ flex: "0 0 auto", padding: "20px 30px 26px", borderTop: `1px solid ${token("--border-default")}` }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 14px 14px 20px",
                  background: token("--bg-surface"),
                  borderRadius: 14,
                  border: `1px solid ${activeComposer ? token("--brand-accent") : token("--border-default")}`,
                  boxShadow: activeComposer ? `0 0 0 3px ${token("--brand-accent", 0.12)}` : undefined,
                  transition: "all .3s",
                }}
              >
                <span style={{ flex: 1, fontSize: 20, color: token("--text-primary"), minHeight: "1.4em" }}>
                  {composerText}
                  {activeComposer ? <Caret height={20} /> : null}
                </span>
                <span
                  data-composer-send
                  style={{
                    flex: "0 0 auto",
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: composerPressed ? token("--brand-primary-hover") : token("--brand-accent"),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: composerPressed ? "scale(.9)" : "scale(1)",
                    transition: "transform .15s ease, background .15s ease",
                  }}
                >
                  <ArrowUp size={20} />
                </span>
              </div>
            </div>
          </div>

          {/* Cursor, parked on the composer's send button during the Q&A */}
          <Cursor on={cursorOn && !reduced} pressed={composerPressed} />

          {/* ── 04: writing the RFP ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: token("--bg-app"),
              zIndex: 18,
              display: "flex",
              flexDirection: "column",
              padding: "52px 96px 44px",
              opacity: stage4Shown ? 1 : 0,
              pointerEvents: stage4Shown ? "auto" : "none",
              transition: "opacity .7s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
              <StepLabel num="04" name="Build the Solicitation" bare />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  ...card,
                  borderRadius: 999,
                  padding: "10px 22px 10px 15px",
                  fontSize: 17,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                <Dot color={ready ? token("--semantic-success") : token("--brand-accent")} pulse={!ready} />
                {statusText}
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 30 }}>
              {/* the document */}
              <div style={{ ...card, flex: 1, minWidth: 0, borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "var(--elevation-xl)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "16px 26px", borderBottom: `1px solid ${token("--border-default")}`, flex: "0 0 auto" }}>
                  <span style={{ color: token("--brand-accent"), display: "flex" }}>
                    <FileGlyph />
                  </span>
                  <span style={{ ...metaFont, fontWeight: 600, fontSize: 16, color: token("--text-secondary") }}>RFP-2026-014</span>
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
                      border: `1px solid ${ready ? token("--semantic-success", 0.3) : token("--brand-accent", 0.22)}`,
                      background: ready ? token("--semantic-success", 0.12) : token("--brand-accent", 0.1),
                      color: ready ? token("--semantic-success") : token("--brand-shade"),
                    }}
                  >
                    <Dot color={ready ? token("--semantic-success") : token("--brand-accent")} pulse={!ready} />
                    {ready ? "Complete" : "Drafting"}
                  </span>
                </div>
                <div ref={docScrollRef} style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                  <div style={{ padding: "40px 54px 60px" }}>
                    {coverShown ? (
                      <div style={{ borderBottom: `1px solid ${token("--border-default")}`, paddingBottom: 24, marginBottom: 28 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: token("--brand-accent"), marginBottom: 12 }}>
                          Request for Proposals
                        </div>
                        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 34, lineHeight: 1.15, letterSpacing: "-0.015em", marginBottom: 12 }}>
                          Urban Forestry &amp; Tree Maintenance Services
                        </div>
                        <div style={{ ...metaFont, fontSize: 14, color: token("--text-muted") }}>
                          RFP-2026-014 · City of Cedar Hollow · Department of Public Works
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginTop: 24 }}>
                          {[
                            ["Issued", "Jun 26, 2026"],
                            ["Proposals due", "Aug 14, 2026"],
                            ["Est. value", "$1.4M"],
                            ["Term", "3 yr + 2×1"],
                          ].map(([k, v]) => (
                            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <span style={{ fontWeight: 600, fontSize: 11, letterSpacing: "0.13em", textTransform: "uppercase", color: token("--text-muted") }}>{k}</span>
                              <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 19 }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {sections.map((sec, i) =>
                      sec.shown ? (
                        <div key={sec.title} style={{ marginBottom: 26 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                            <span style={{ ...metaFont, fontWeight: 700, fontSize: 17, color: token("--brand-accent") }}>{sec.n}</span>
                            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 24, letterSpacing: "-0.01em" }}>{sec.title}</span>
                          </div>
                          {sec.lines.map((ln, j) => {
                            const isLast = sec.lines.filter((l) => l.shown).length - 1 === j;
                            return ln.shown ? (
                              <p
                                key={ln.text}
                                {...(isLast && activeSec === i ? { "data-line-active": true } : {})}
                                style={{
                                  margin: "0 0 11px",
                                  fontSize: 17.5,
                                  lineHeight: 1.6,
                                  color: token("--text-secondary"),
                                  paddingLeft: ln.li ? 22 : 0,
                                  position: "relative",
                                }}
                              >
                                {ln.li ? (
                                  <span
                                    style={{
                                      position: "absolute",
                                      left: 0,
                                      top: 11,
                                      width: 6,
                                      height: 6,
                                      borderRadius: 2,
                                      background: token("--brand-accent"),
                                    }}
                                  />
                                ) : null}
                                {ln.text}
                              </p>
                            ) : null;
                          })}
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              </div>

              {/* rail: section checklist + compliance */}
              <div style={{ width: 430, flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 20, minHeight: 0 }}>
                <div style={{ ...card, borderRadius: 16, padding: "22px 24px", flex: "0 0 auto" }}>
                  <div style={{ ...metaFont, fontSize: 12.5, color: token("--text-muted"), marginBottom: 14 }}>
                    SECTIONS · {doneSecs} OF 6
                  </div>
                  {TSECS.map((name, i) => {
                    const active = activeSec === i;
                    const done = t >= S.secDoneAt[i];
                    return (
                      <div
                        key={name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "9px 11px",
                          borderRadius: 9,
                          marginBottom: 5,
                          transition: "all .3s",
                          background: active ? token("--brand-accent", 0.08) : "transparent",
                          border: `1px solid ${active ? token("--brand-accent", 0.25) : "transparent"}`,
                        }}
                      >
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            flex: "0 0 auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ...metaFont,
                            fontSize: 12,
                            fontWeight: 700,
                            background: done ? token("--semantic-success") : active ? token("--brand-accent") : token("--bg-hover"),
                            color: done || active ? token("--brand-foreground") : token("--text-muted"),
                          }}
                        >
                          {done ? <Check size={11} /> : i + 1}
                        </span>
                        <span style={{ fontSize: 16, color: done || active ? token("--text-primary") : token("--text-muted") }}>{name}</span>
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    ...card,
                    borderRadius: 16,
                    padding: "22px 24px",
                    flex: 1,
                    minHeight: 0,
                    opacity: compShown ? 1 : 0,
                    transition: "opacity .6s ease",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ ...metaFont, fontSize: 12.5, color: token("--text-muted"), marginBottom: 14 }}>COMPLIANCE REVIEW</div>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    {compItems.map((c) => (
                      <div
                        key={c.name}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 11,
                          padding: "8px 0",
                          opacity: c.shown ? 1 : 0,
                          transition: "opacity .35s ease",
                        }}
                      >
                        <span
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            flex: "0 0 auto",
                            marginTop: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: c.checked
                              ? c.status === "Added"
                                ? token("--brand-accent")
                                : token("--semantic-success")
                              : token("--bg-hover"),
                            color: token("--brand-foreground"),
                          }}
                        >
                          {c.checked ? c.status === "Added" ? <Plus /> : <Check size={11} /> : null}
                        </span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: "block", fontSize: 15.5, fontWeight: 500, color: token("--text-primary"), lineHeight: 1.3 }}>{c.name}</span>
                          <span style={{ display: "block", ...metaFont, fontSize: 12, color: token("--text-muted"), marginTop: 2 }}>{c.ref}</span>
                        </span>
                        {c.checked ? (
                          <span
                            style={{
                              ...metaFont,
                              fontSize: 11.5,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              color: c.status === "Added" ? token("--brand-accent") : token("--semantic-success"),
                            }}
                          >
                            {c.status}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: 14,
                      background: token("--semantic-success", 0.12),
                      border: `1px solid ${token("--semantic-success", 0.3)}`,
                      color: token("--semantic-success"),
                      borderRadius: 12,
                      padding: "13px 16px",
                      fontSize: 15.5,
                      fontWeight: 600,
                      textAlign: "center",
                      opacity: ready ? 1 : 0,
                      transition: "opacity .5s ease",
                    }}
                  >
                    Solicitation ready for review
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DemoStage>
    </div>
  );
}

// ── pieces ──────────────────────────────────────────────────────────────────

function StepLabel({ num, name, small, bare }: { num: string; name: string; small?: boolean; bare?: boolean }) {
  const size = small ? 36 : 44;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        paddingBottom: bare ? 0 : 12,
        borderBottom: bare ? undefined : `2px solid ${token("--text-primary")}`,
        marginBottom: bare ? 0 : 18,
      }}
    >
      <span style={{ fontWeight: 600, fontSize: size, lineHeight: 0.9, letterSpacing: "-0.02em" }}>{num}</span>
      <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size, letterSpacing: "-0.02em", lineHeight: small ? 1 : 0.9 }}>{name}</span>
    </div>
  );
}

function MTile({ size, radius, font }: { size: number; radius: number; font: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        flex: "0 0 auto",
        background: `linear-gradient(180deg, ${token("--brand-primary")} 0%, ${token("--brand-accent")} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: token("--brand-foreground"),
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: font,
        lineHeight: 1,
      }}
    >
      M
    </span>
  );
}

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 6, alignItems: "center", height: "1.45em" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: token("--text-muted"),
            animation: "mai-blink 1.1s steps(2) infinite",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </span>
  );
}

function Dot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        flex: "0 0 auto",
        background: color,
        animation: pulse ? "mai-pulse 1.4s ease-in-out infinite" : undefined,
      }}
    />
  );
}

function Cursor({ on, pressed }: { on: boolean; pressed: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 1744,
        top: 918,
        zIndex: 60,
        pointerEvents: "none",
        opacity: on ? 1 : 0,
        transition: "opacity .25s ease",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 10,
          top: 7,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: `3px solid ${token("--brand-accent")}`,
          transform: `translate(-50%,-50%) scale(${pressed ? 1.6 : 0.4})`,
          opacity: pressed ? 0 : 0,
          transition: "transform .5s ease, opacity .5s ease",
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
  );
}

function Check({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={token("--brand-foreground")} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Plus() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={token("--brand-foreground")} strokeWidth="3" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ArrowUp({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={token("--brand-foreground")} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function FileGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h6" />
    </svg>
  );
}
