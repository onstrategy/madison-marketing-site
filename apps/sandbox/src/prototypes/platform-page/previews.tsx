import { type ReactNode } from "react";
import { ArrowRight, ArrowUp, Check, FileArchive, type LucideIcon } from "lucide-react";
import { cn } from "@madison/ui/utils";

// ============================================================================
// The small product mocks that sit beside each "How it works" step.
//
// Every platform page's steps illustrate a different artifact — a cited chat
// answer, a drafting document, a dated timeline, a zoning record — so rather
// than one generic list, this module renders a set of purpose-built shapes and
// each page supplies the content. `StepPreviewSpec` is the union of shapes;
// add a new `kind` here rather than special-casing inside a page.
// ============================================================================

/** Which semantic color a row's icon and a badge carry. */
export type PreviewTone = "brand" | "success" | "warning" | "error" | "info" | "neutral";

const TONE_TEXT: Record<PreviewTone, string> = {
  brand: "text-brand-accent",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  info: "text-info",
  neutral: "text-muted",
};

/** The same tones as a filled swatch — used where a status reads as a category, not an icon. */
const TONE_BG: Record<PreviewTone, string> = {
  brand: "bg-brand",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
  neutral: "bg-hover",
};

export interface PreviewRow {
  icon: LucideIcon;
  tone: PreviewTone;
  label: string;
  meta: string;
}

export type StepPreviewSpec =
  /** A question typed into Madison, answered with a source citation. */
  | { kind: "ask"; question: string; answer: ReactNode; cite?: string }
  /** The same exchange as a conversation — a resident's question, Madison's reply. */
  | { kind: "chat"; question: string; answer: ReactNode }
  /** A document mid-draft: optional format tabs, a title, filling body lines. */
  | {
      kind: "doc";
      tabs?: string[];
      title: string;
      subtitle?: string;
      /** Widths of the placeholder body lines, as CSS lengths. */
      bars: string[];
      chips?: string[];
      done?: string;
    }
  /** A dated list of records, votes, or permits. */
  | { kind: "rows"; eyebrow?: string; rows: PreviewRow[]; banner?: string }
  /** A structured document outline that's been assembled and checked off. */
  | { kind: "checklist"; title: string; subtitle?: string; items: string[] }
  /** A looked-up record: an identifier, a status badge, and what it allows. */
  | {
      kind: "record";
      title: string;
      subtitle: string;
      badge: { text: string; tone: PreviewTone };
      items?: { label: string; value: string }[];
      body?: string;
      chip?: string;
    }
  /** A scoped records request, ready to route. */
  | { kind: "request"; body: string; meta: string }
  /** Items sorted into review buckets, each with its own status color and count. */
  | { kind: "buckets"; buckets: { tone: PreviewTone; label: string; count: string }[] }
  /**
   * A document with redactions applied, packaged for release — the redacted
   * lines are solid bars rather than placeholder greys, so the blackout reads
   * as the point of the image.
   */
  | {
      kind: "release";
      lines: { width: string; redacted?: boolean }[];
      file: { name: string; meta: string };
    }
  /** A staff recommendation with its tradeoff laid out. */
  | { kind: "recommendation"; eyebrow: string; callout: ReactNode; pro: string; con: string };

function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full rounded-xl border border-default bg-surface p-4 shadow-md", className)}>
      {children}
    </div>
  );
}

/** Madison's mark, as it appears beside an answer in-product. */
function Mark() {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand font-serif text-xs font-semibold text-brand-fg">
      M
    </span>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2.5 font-sans text-2xs font-semibold uppercase tracking-widest text-brand-accent">
      {children}
    </div>
  );
}

function Banner({ children }: { children: ReactNode }) {
  return (
    <div className="mt-1.5 rounded-md bg-brand-subtle px-3 py-2 text-center text-xs font-semibold text-brand-accent">
      {children}
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-brand-subtle px-2.5 py-1 text-2xs font-semibold text-brand-accent">
      {children}
    </span>
  );
}

/** A citation marker, matching the superscript Madison renders inline. */
function Cite({ children }: { children: ReactNode }) {
  return (
    <sup className="ml-1 rounded-sm border border-[hsl(var(--brand-accent)/0.25)] bg-brand-subtle px-1 py-px align-super text-2xs font-bold text-brand-accent">
      {children}
    </sup>
  );
}

function Bar({ width }: { width: string }) {
  return <div className="mb-2.5 h-2 rounded-sm bg-hover" style={{ width }} />;
}

export function StepPreview({ spec }: { spec: StepPreviewSpec }) {
  if (spec.kind === "ask") {
    return (
      <Shell>
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-default pb-3">
          <span className="text-sm text-primary">{spec.question}</span>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand text-brand-fg">
            <ArrowUp className="size-3.5" />
          </span>
        </div>
        <div className="flex gap-2.5">
          <Mark />
          <p className="text-xs leading-relaxed text-secondary">
            {spec.answer}
            {spec.cite ? <Cite>{spec.cite}</Cite> : null}
          </p>
        </div>
      </Shell>
    );
  }

  if (spec.kind === "chat") {
    return (
      <Shell>
        <div className="mb-3 flex justify-end">
          <span className="max-w-[82%] rounded-lg rounded-br-sm border border-default bg-panel px-3 py-2 text-xs text-primary">
            {spec.question}
          </span>
        </div>
        <div className="flex gap-2.5">
          <Mark />
          <p className="text-xs leading-relaxed text-secondary">{spec.answer}</p>
        </div>
      </Shell>
    );
  }

  if (spec.kind === "doc") {
    return (
      <Shell>
        {spec.tabs ? (
          <div className="mb-3.5 flex flex-wrap gap-1.5">
            {spec.tabs.map((tab, i) => (
              <span
                key={tab}
                className={cn(
                  "rounded-full px-2.5 py-1 text-2xs font-semibold",
                  i === 0 ? "bg-brand text-brand-fg" : "bg-hover text-muted",
                )}
              >
                {tab}
              </span>
            ))}
          </div>
        ) : null}
        <div className="text-sm font-semibold text-primary">{spec.title}</div>
        {spec.subtitle ? <div className="mt-1 text-2xs text-muted">{spec.subtitle}</div> : null}
        <div className="mt-3">
          {spec.bars.map((w, i) => (
            <Bar key={i} width={w} />
          ))}
        </div>
        {spec.chips ? (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {spec.chips.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        ) : null}
        {spec.done ? (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-success">
            <Check className="size-3.5" />
            {spec.done}
          </div>
        ) : null}
      </Shell>
    );
  }

  if (spec.kind === "rows") {
    return (
      <Shell>
        {spec.eyebrow ? <Eyebrow>{spec.eyebrow}</Eyebrow> : null}
        {spec.rows.map((row) => (
          <div
            key={row.label}
            className="mb-2 flex items-center gap-2.5 rounded-md border border-default bg-app px-3 py-2 last:mb-0"
          >
            <row.icon className={cn("size-4 shrink-0", TONE_TEXT[row.tone])} />
            <span className="truncate text-xs font-medium text-primary">{row.label}</span>
            <span className="ml-auto shrink-0 text-2xs text-muted">{row.meta}</span>
          </div>
        ))}
        {spec.banner ? <Banner>{spec.banner}</Banner> : null}
      </Shell>
    );
  }

  if (spec.kind === "checklist") {
    return (
      <Shell>
        <div className="text-sm font-semibold text-primary">{spec.title}</div>
        {spec.subtitle ? <div className="mt-1 mb-3 text-2xs text-muted">{spec.subtitle}</div> : null}
        <div className="mt-3 flex flex-col gap-2">
          {spec.items.map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-xs text-primary">
              <Check className="size-3.5 shrink-0 text-success" />
              {item}
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  if (spec.kind === "record") {
    return (
      <Shell>
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-default pb-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-primary">{spec.title}</div>
            <div className="truncate text-2xs text-muted">{spec.subtitle}</div>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-2xs font-semibold",
              spec.badge.tone === "success"
                ? "bg-success-subtle text-success"
                : "bg-brand-subtle text-brand-accent",
            )}
          >
            {spec.badge.text}
          </span>
        </div>
        {spec.items ? (
          <div className="flex flex-col gap-1.5">
            {spec.items.map((item) => (
              <div key={item.label} className="flex justify-between gap-3 text-xs">
                <span className="text-primary">{item.label}</span>
                <span className="shrink-0 text-secondary">{item.value}</span>
              </div>
            ))}
          </div>
        ) : null}
        {spec.body ? <p className="text-xs leading-relaxed text-secondary">{spec.body}</p> : null}
        {spec.chip ? (
          <div className="mt-3">
            <Chip>{spec.chip}</Chip>
          </div>
        ) : null}
      </Shell>
    );
  }

  if (spec.kind === "buckets") {
    return (
      <Shell>
        {spec.buckets.map((b) => (
          <div
            key={b.label}
            className="mb-2 flex items-center gap-2.5 rounded-md border border-default bg-app px-3 py-2 last:mb-0"
          >
            <span className={cn("size-2.5 shrink-0 rounded-sm", TONE_BG[b.tone])} />
            <span className="truncate text-xs font-medium text-primary">{b.label}</span>
            <span className="ml-auto shrink-0 text-2xs text-muted">{b.count}</span>
          </div>
        ))}
      </Shell>
    );
  }

  if (spec.kind === "release") {
    return (
      <Shell>
        <div className="mb-3">
          {spec.lines.map((line, i) => (
            <div
              key={i}
              className={cn("mb-2.5 h-2 rounded-sm", line.redacted ? "bg-primary" : "bg-hover")}
              style={{ width: line.width }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2.5 rounded-md border border-default bg-app px-3 py-2">
          <FileArchive className="size-4 shrink-0 text-brand-accent" />
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold text-primary">{spec.file.name}</span>
            <span className="block truncate text-2xs text-muted">{spec.file.meta}</span>
          </span>
        </div>
      </Shell>
    );
  }

  if (spec.kind === "request") {
    return (
      <Shell>
        <p className="mb-3 border-b border-default pb-3 text-sm leading-normal text-primary">{spec.body}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-2xs text-muted">{spec.meta}</span>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg">
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <Eyebrow>{spec.eyebrow}</Eyebrow>
      <div className="rounded-r-md border-l-[3px] border-warning bg-warning-subtle px-3 py-2.5 text-xs leading-normal text-secondary">
        {spec.callout}
      </div>
      <div className="mt-3 flex gap-2">
        <span className="flex-1 rounded-md bg-success-subtle px-2 py-1.5 text-center text-2xs font-semibold text-success">
          {spec.pro}
        </span>
        <span className="flex-1 rounded-md bg-warning-subtle px-2 py-1.5 text-center text-2xs font-semibold text-warning">
          {spec.con}
        </span>
      </div>
    </Shell>
  );
}
