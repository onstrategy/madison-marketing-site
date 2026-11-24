import { H, W, clamp, ease, lerp, token } from "./engine";

// ============================================================================
// The wisp — the decision itself, drawn as a soft ribbon of neon-blue air.
//
// It is the one character in the deck: it rises from the resident's question,
// travels through every document the decision touched, and settles into the
// line under the closing words. Neon blue is reserved for it and for whatever
// it touches.
//
// A wisp follows a path through stage waypoints. `head` (0..1) is how far
// along that path its leading orb has travelled; the scenes animate that one
// number. Everything else — the gentle wave, the taper, the breathing orb — is
// derived here from the ambient clock, so a wisp that is "holding" while the
// speaker talks still looks alive.
// ============================================================================

export type Pt = readonly [number, number];

export interface WispPath {
  pts: Pt[];
  nrm: Pt[];
}

/** Distance between the resampled points of a path, in stage pixels. */
const SPACING = 8;

const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 *
  (2 * p1 +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);

/** A smooth curve through `way`, resampled to even spacing with its normals. */
export function makePath(way: Pt[]): WispPath {
  const at = (i: number) => way[clamp(i, 0, way.length - 1)];
  const dense: Pt[] = [];
  for (let i = 0; i < way.length - 1; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    for (let k = 0; k < 48; k++) {
      const t = k / 48;
      dense.push([
        catmull(p0[0], p1[0], p2[0], p3[0], t),
        catmull(p0[1], p1[1], p2[1], p3[1], t),
      ]);
    }
  }
  dense.push(at(way.length - 1));

  const pts: Pt[] = [dense[0]];
  let carry = 0;
  for (let i = 1; i < dense.length; i++) {
    let ax = dense[i - 1][0];
    let ay = dense[i - 1][1];
    const [bx, by] = dense[i];
    let seg = Math.hypot(bx - ax, by - ay);
    while (seg > 0 && carry + seg >= SPACING) {
      const r = (SPACING - carry) / seg;
      ax += (bx - ax) * r;
      ay += (by - ay) * r;
      pts.push([ax, ay]);
      seg = Math.hypot(bx - ax, by - ay);
      carry = 0;
    }
    carry += seg;
  }

  const nrm: Pt[] = pts.map((_, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    return [-dy / len, dx / len];
  });

  return { pts, nrm };
}

/** How far along `path` (0..1) the point nearest `target` sits. */
export function fracAt(path: WispPath, target: Pt): number {
  let best = 0;
  let bestDist = Infinity;
  path.pts.forEach(([x, y], i) => {
    const dist = Math.hypot(x - target[0], y - target[1]);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best / (path.pts.length - 1);
}

/** Travel easing: unhurried at both ends, never a dart. */
export const glide = (p: number) => (p + ease(p)) / 2;

const join = (points: Pt[]) =>
  points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

interface WispProps {
  path: WispPath;
  /** How far along the path the leading orb is, 0..1. */
  head: number;
  /** Ambient clock, in seconds. */
  g: number;
  opacity?: number;
  /** Length of the bright ribbon behind the orb, in stage pixels. */
  ribbon?: number;
  /** Wave amplitude, in stage pixels. */
  amp?: number;
  /** Opacity of the thin line left behind the ribbon — the way back to the source. */
  trail?: number;
  /** A settled wisp: an even glowing line with no taper. */
  line?: boolean;
  /** False once the wisp has moved on: only the thin line it left stays. */
  orb?: boolean;
}

export function Wisp({
  path,
  head,
  g,
  opacity = 1,
  ribbon = 380,
  amp = 9,
  trail = 0.3,
  line = false,
  orb = true,
}: WispProps) {
  const last = path.pts.length - 1;
  const hi = clamp(head, 0, 1) * last;
  if (opacity <= 0.01 || hi <= 0.5) return null;

  // The wave rides along the path and eases off at the origin, so the wisp
  // stays anchored where it began; a travelling wisp also calms toward its
  // orb, so the orb can come to rest on a target.
  const point = (i: number): Pt => {
    const [x, y] = path.pts[i];
    const [nx, ny] = path.nrm[i];
    const s = i * SPACING;
    const fromHead = (hi - i) * SPACING;
    const env =
      Math.min(1, s / 90) * (line ? 1 : 0.3 + 0.7 * Math.min(1, fromHead / 160));
    const off =
      amp * env * (Math.sin(s / 62 - g * 1.7) * 0.7 + Math.sin(s / 147 + g * 0.9) * 0.5);
    return [x + nx * off, y + ny * off];
  };

  const whole = Math.floor(hi);
  const points: Pt[] = [];
  for (let i = 0; i <= whole; i++) points.push(point(i));
  if (whole < last) {
    const a = point(whole);
    const b = point(whole + 1);
    const f = hi - whole;
    points.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f)]);
  }
  const tip = points[points.length - 1];
  const blue = token("--brand-accent");
  const core = token("--brand-tint-pale");
  const breath = 1 + 0.14 * Math.sin(g * 2.3);

  const svg = {
    position: "absolute",
    left: 0,
    top: 0,
    overflow: "visible",
    pointerEvents: "none",
    opacity,
  } as const;

  if (line) {
    const all = join(points);
    return (
      <svg width={W} height={H} style={svg} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={all} stroke={blue} strokeWidth={30} opacity={0.07} />
        <polyline points={all} stroke={blue} strokeWidth={14} opacity={0.16} />
        <polyline points={all} stroke={blue} strokeWidth={4.5} />
        <polyline points={all} stroke={core} strokeWidth={1.5} opacity={0.8} />
        {head < 0.995 ? (
          <>
            <circle cx={tip[0]} cy={tip[1]} r={26 * breath} fill={blue} opacity={0.14} />
            <circle cx={tip[0]} cy={tip[1]} r={7} fill={core} />
          </>
        ) : null}
      </svg>
    );
  }

  if (!orb) {
    return (
      <svg width={W} height={H} style={svg} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={join(points)} stroke={blue} strokeWidth={2.5} opacity={trail} />
      </svg>
    );
  }

  // The ribbon: the bright stretch behind the orb, built from short chunks
  // that widen and brighten toward the head.
  const ribbonCount = Math.min(points.length, Math.max(2, Math.round(ribbon / SPACING)));
  const ribbonPts = points.slice(points.length - ribbonCount);
  const CHUNKS = 14;
  const chunks: { pts: string; f: number }[] = [];
  for (let k = 0; k < CHUNKS; k++) {
    const from = Math.floor((k / CHUNKS) * (ribbonPts.length - 1));
    const to = Math.floor(((k + 1) / CHUNKS) * (ribbonPts.length - 1));
    if (to > from) {
      chunks.push({ pts: join(ribbonPts.slice(from, to + 1)), f: (k + 1) / CHUNKS });
    }
  }

  return (
    <svg width={W} height={H} style={svg} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {trail > 0 ? (
        <polyline points={join(points)} stroke={blue} strokeWidth={2} opacity={trail} />
      ) : null}
      <polyline points={join(ribbonPts)} stroke={blue} strokeWidth={22} opacity={0.06} />
      {chunks.map((chunk) => (
        <polyline
          key={chunk.f}
          points={chunk.pts}
          stroke={blue}
          strokeWidth={lerp(1.5, 6.5, chunk.f)}
          opacity={Math.pow(chunk.f, 1.3)}
        />
      ))}
      <circle cx={tip[0]} cy={tip[1]} r={38 * breath} fill={blue} opacity={0.08} />
      <circle cx={tip[0]} cy={tip[1]} r={20 * breath} fill={blue} opacity={0.2} />
      <circle cx={tip[0]} cy={tip[1]} r={9} fill={blue} />
      <circle cx={tip[0]} cy={tip[1]} r={5} fill={core} />
    </svg>
  );
}
