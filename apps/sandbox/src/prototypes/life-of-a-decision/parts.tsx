import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { SANS, SERIF, token, type Style } from "./engine";

// ============================================================================
// The small, repeated pieces of the deck: kickers, seats, the assistant
// window, document mockups and cards.
//
// Two color rules run through all of them, and they carry the talk's argument:
// neon blue is only ever the wisp and what it touches (the AI's work), and
// terracotta is only ever people and their decisions (the seats, the
// resident's words, the sign-off stamp). The AI reads; people decide.
//
// Nothing meant to be read is set smaller than 24px on the 1920 stage, so it
// holds up on a projected screen.
// ============================================================================

export const PEOPLE = "--semantic-info";

/** The city every document in the deck belongs to. Illustrative, not a real place. */
export const CITY = "City of Alder Falls";

/** The small all-caps line that names a scene. */
export function Kicker({ children, style }: { children: ReactNode; style?: Style }) {
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: token("--brand-accent"),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A person: one of the three seats the answer has to reach. */
export function Seat({
  x,
  y,
  r = 46,
  label,
  side = "below",
  opacity = 1,
}: {
  /** Center of the seat, in stage coordinates. */
  x: number;
  y: number;
  r?: number;
  label: string;
  side?: "below" | "above" | "none";
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        opacity,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: token("--bg-app"),
          boxShadow: `inset 0 0 0 ${r * 2}px ${token(PEOPLE, 0.16)}`,
          border: `3px solid ${token(PEOPLE)}`,
          boxSizing: "border-box",
        }}
      />
      {side === "none" ? null : (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            ...(side === "below" ? { top: r * 2 + 14 } : { bottom: r * 2 + 14 }),
            whiteSpace: "nowrap",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: token(PEOPLE),
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

/** The window staff already use. Same frame every time it appears. */
export function AppWindow({
  title,
  tag,
  tagLit = false,
  style,
  children,
}: {
  title: string;
  tag?: string;
  /** The tag reads as the city's own once its memory is behind the assistant. */
  tagLit?: boolean;
  style?: Style;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        borderRadius: 22,
        background: token("--bg-panel"),
        border: `2px solid ${token("--border-active")}`,
        boxShadow: "var(--elevation-2xl)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          height: 68,
          padding: "0 26px",
          borderBottom: `2px solid ${token("--border-default")}`,
          flex: "0 0 auto",
        }}
      >
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              border: `2px solid ${token("--border-active")}`,
              boxSizing: "border-box",
            }}
          />
        ))}
        <span style={{ marginLeft: 12, fontSize: 24, color: token("--text-muted") }}>{title}</span>
        {tag ? (
          <span
            style={{
              marginLeft: "auto",
              padding: "5px 16px",
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 600,
              transition: "background .5s, color .5s, border-color .5s",
              border: `2px solid ${tagLit ? token("--brand-accent") : token("--border-active")}`,
              background: tagLit ? token("--brand-accent", 0.16) : "transparent",
              color: tagLit ? token("--brand-accent") : token("--text-muted"),
            }}
          >
            {tag}
          </span>
        ) : null}
      </div>
      <div style={{ position: "relative", flex: 1, minHeight: 0, padding: 30 }}>{children}</div>
    </div>
  );
}

/** A line in a conversation: the person's question, or the assistant's reply. */
export function Bubble({
  from,
  children,
  style,
}: {
  from: "person" | "assistant";
  children: ReactNode;
  style?: Style;
}) {
  const person = from === "person";
  return (
    <div style={{ display: "flex", justifyContent: person ? "flex-end" : "flex-start", ...style }}>
      <div
        style={{
          maxWidth: "86%",
          padding: "16px 24px",
          borderRadius: 18,
          fontSize: 32,
          lineHeight: 1.3,
          border: `2px solid ${person ? token("--border-active") : "transparent"}`,
          background: person ? token("--bg-surface") : token("--bg-hover"),
          color: token("--text-primary"),
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** A labelled card: a passage, a source, a stop on the timeline. */
export function InfoCard({
  kicker,
  children,
  lit = false,
  icon,
  style,
}: {
  kicker?: ReactNode;
  children: ReactNode;
  /** Touched by the wisp. */
  lit?: boolean;
  icon?: ReactNode;
  style?: Style;
}) {
  return (
    <div
      style={{
        position: "absolute",
        boxSizing: "border-box",
        padding: "18px 24px",
        borderRadius: 16,
        background: token("--bg-surface"),
        border: `2px solid ${lit ? token("--brand-accent") : token("--border-active")}`,
        boxShadow: lit ? `0 0 44px ${token("--brand-accent", 0.28)}` : "none",
        transition: "border-color .5s, box-shadow .5s",
        ...style,
      }}
    >
      {kicker ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: lit ? token("--brand-accent") : token("--text-muted"),
            transition: "color .5s",
          }}
        >
          {icon}
          {kicker}
        </div>
      ) : null}
      <div style={{ fontSize: 30, lineHeight: 1.25, fontWeight: 500, textWrap: "balance" }}>{children}</div>
    </div>
  );
}

/** The numbered marker that ties a line of an answer back to its source. */
export function SourcePill({ n, size = 44, dashed = false }: { n: number; size?: number; dashed?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        width: size,
        height: size,
        borderRadius: "50%",
        boxSizing: "border-box",
        border: `2.5px ${dashed ? "dashed" : "solid"} ${token("--brand-accent")}`,
        background: token("--brand-accent", 0.14),
        color: token("--brand-accent"),
        fontSize: size * 0.55,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {n}
    </span>
  );
}

/** Stand-in body text: rows of bars, the way a page reads from across a room. */
export function TextBars({
  rows,
  gap = 22,
  height = 10,
  blur = 0,
  style,
}: {
  /** Row widths, as fractions of the container. */
  rows: number[];
  gap?: number;
  height?: number;
  blur?: number;
  style?: Style;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        filter: blur ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      {rows.map((width, i) => (
        <div
          key={`${i}-${width}`}
          style={{
            width: `${width * 100}%`,
            height,
            borderRadius: height / 2,
            background: token("--text-muted", 0.42),
          }}
        />
      ))}
    </div>
  );
}

/** The small padlock on a system that is walled off. */
export function LockBadge({ size = 30, lit = false }: { size?: number; lit?: boolean }) {
  return (
    <Lock
      size={size}
      strokeWidth={2.2}
      color={lit ? token("--brand-accent") : token("--text-muted")}
      style={{ flex: "0 0 auto", transition: "color .5s" }}
    />
  );
}

/** A person's approval. Terracotta, because people decide. */
export function Stamp({ size = 56, style }: { size?: number; style?: Style }) {
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${size * 0.16}px ${size * 0.42}px`,
        borderRadius: size * 0.22,
        border: `${Math.max(3, size * 0.09)}px solid ${token(PEOPLE)}`,
        background: token(PEOPLE, 0.12),
        color: token(PEOPLE),
        fontFamily: SANS,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "0.02em",
        lineHeight: 1.1,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      Signed off
    </div>
  );
}

/** The large serif line that carries a scene's message. */
export function Headline({
  children,
  size = 96,
  style,
}: {
  children: ReactNode;
  size?: number;
  style?: Style;
}) {
  return (
    <div
      style={{
        fontFamily: SERIF,
        fontSize: size,
        fontWeight: 500,
        lineHeight: 1.1,
        letterSpacing: "-0.015em",
        color: token("--text-primary"),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
