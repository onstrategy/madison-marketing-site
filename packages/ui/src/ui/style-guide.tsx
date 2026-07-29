import React, { useState } from "react";
import {
  Sun,
  Moon,
  Palette,
  Type,
  Layers,
  Zap,
  Copy,
  Check,
  MousePointerClick,
  Ruler,
  Square,
  Gauge,
  Monitor,
} from "lucide-react";
import { TOKENS, generateCSS, type TokenDefinition } from "./tokens";
import { hexToHslChannels } from "./utils";

// ============================================================================
// MAIN COMPONENT — living spec / visual-QA surface for the token system.
// ============================================================================
export function StyleGuide() {
  const [isDark, setIsDark] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(generateCSS(TOKENS));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 bg-app text-primary ${isDark ? "theme-dark dark" : "theme-light"}`}
    >
      {/* INJECT DYNAMIC CSS VARIABLES */}
      <StyleGuideStyles />

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-sticky border-b border-default bg-panel px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-surface border border-default flex items-center justify-center">
            <Palette className="w-4 h-4 text-info" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide">
              Madison Design System
            </h1>
            <p className="text-2xs uppercase tracking-widest text-muted font-mono">
              Token Dictionary &amp; Guidelines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCopyCSS}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-default rounded-md bg-surface text-secondary hover:text-primary hover:border-active transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied CSS" : "Export Tokens (CSS)"}
          </button>

          <div className="w-px h-6 border-l border-default" />

          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-hover text-primary transition-colors"
          >
            {isDark ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5" />
            )}
            {isDark ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="max-w-6xl mx-auto p-8 space-y-12">
        {/* SECTION: App Customization Guide */}
        <section className="p-6 border border-default rounded-md bg-surface">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center shrink-0">
              <Palette className="w-4 h-4 text-brand-fg" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary mb-2">
                How to Customize for Your App
              </h2>
              <div className="text-sm text-secondary space-y-3">
                <p>
                  <strong className="text-primary">Brand tokens</strong> are
                  intentionally neutral by default. Each app overrides{" "}
                  <code className="text-xs bg-hover px-1.5 py-0.5 rounded">
                    --brand-*
                  </code>{" "}
                  tokens in its own CSS to match its identity.
                </p>
                <p>
                  <strong className="text-primary">Semantic tokens</strong>{" "}
                  (success, error, warning, info) remain
                  <strong className="text-info"> constant</strong> across all
                  apps — they signal status only.
                </p>
                <div className="mt-4 p-3 bg-app rounded-md font-mono text-xs">
                  <span className="text-success">
                    /* Example: override in your app's CSS */
                  </span>
                  <br />
                  <span className="text-muted">:root {"{"}</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-info">--brand-primary</span>:{" "}
                  <span className="text-error">255 70% 55%</span>;{" "}
                  <span className="text-muted">/* HSL channels */</span>
                  <br />
                  &nbsp;&nbsp;
                  <span className="text-info">--brand-foreground</span>:{" "}
                  <span className="text-error">0 0% 100%</span>;
                  <br />
                  &nbsp;&nbsp;<span className="text-info">--brand-subtle</span>:{" "}
                  <span className="text-error">255 80% 97%</span>;
                  <br />
                  <span className="text-muted">{"}"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Core Palette */}
        <section>
          <SectionHeader
            icon={<Palette />}
            title="Core Neutral Palette"
            description="Strict neutral-first palette defining the structure of the application."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <TokenGroup title="Backgrounds" tokens={TOKENS.backgrounds} isDark={isDark} />
            <TokenGroup title="Borders" tokens={TOKENS.borders} isDark={isDark} />
            <TokenGroup title="Typography" tokens={TOKENS.typography} isDark={isDark} />
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Brand & Accent */}
        <section>
          <SectionHeader
            icon={<MousePointerClick />}
            title="Brand & Accent"
            description="Explicit tokens for primary calls-to-action, independent from semantic info colors."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <TokenGroup title="Brand Tokens" tokens={TOKENS.brand} isDark={isDark} />

            {/* Interactive Preview */}
            <div className="lg:col-span-2 flex items-center justify-center p-8 border border-default rounded-md bg-panel bg-[radial-gradient(var(--border-default)_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="flex gap-4">
                <button className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-brand text-brand-fg">
                  Primary Action
                </button>
                <button className="px-4 py-2 text-sm font-medium rounded-md transition-colors border border-default hover:border-active bg-brand-subtle text-primary">
                  Secondary Action
                </button>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Semantic Colors */}
        <section>
          <SectionHeader
            icon={<Zap />}
            title="Semantic Triads"
            description="Reserved strictly for status indicators. Base, Subtle, and Foreground levels only."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TOKENS.semantics.map((token) => {
              const subtleHex = isDark ? token.subtleDark : token.subtleLight;
              return (
                <div
                  key={token.id}
                  className="border border-default rounded-md bg-surface overflow-hidden flex"
                >
                  {/* Base Color Showcase */}
                  <div
                    className="w-1/3 p-4 flex flex-col justify-between border-r border-default"
                    style={{ backgroundColor: token.base, color: token.fg }}
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      {token.icon} {token.label}
                    </div>
                    <div>
                      <div className="text-2xs font-mono opacity-80 mt-4">
                        --semantic-{token.id}
                      </div>
                      <div className="text-xs font-mono font-bold">
                        {token.base}
                      </div>
                    </div>
                  </div>

                  {/* Subtle & Foreground Breakdown */}
                  <div className="w-2/3 flex flex-col">
                    <div
                      className="flex-1 p-3 border-b border-default flex items-center justify-between"
                      style={{ backgroundColor: subtleHex }}
                    >
                      <div>
                        <div className="text-2xs font-mono text-muted">
                          --semantic-{token.id}-subtle
                        </div>
                        <div className="text-xs font-mono font-medium text-primary">
                          {subtleHex}
                        </div>
                      </div>
                      <span
                        className="px-2 py-1 text-2xs font-medium rounded border"
                        style={{
                          backgroundColor: subtleHex,
                          color: token.base,
                          borderColor: "currentColor",
                        }}
                      >
                        Badge Demo
                      </span>
                    </div>

                    <div className="flex-1 p-3 flex items-center justify-between bg-surface">
                      <div>
                        <div className="text-2xs font-mono text-muted">
                          --semantic-{token.id}-fg
                        </div>
                        <div className="text-xs font-mono font-medium text-primary">
                          {token.fg}
                        </div>
                      </div>
                      <button
                        className="px-3 py-1.5 text-xs font-medium rounded transition-opacity hover:opacity-90"
                        style={{ backgroundColor: token.base, color: token.fg }}
                      >
                        Action
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Architecture & Elevation */}
        <section>
          <SectionHeader
            icon={<Layers />}
            title="Structural Elevation"
            description="How backgrounds nest within each other to create depth without drop shadows."
          />

          <div className="p-8 border border-default rounded-xl bg-app">
            <span className="text-xs font-mono text-muted mb-2 block">--bg-app</span>

            <div className="p-6 border border-default rounded-md bg-panel shadow-sm">
              <span className="text-xs font-mono text-muted mb-2 block">
                --bg-panel
              </span>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 border border-default rounded-md bg-surface hover:border-active transition-colors cursor-pointer">
                  <span className="text-xs font-mono text-muted mb-2 block">
                    --bg-surface (Hoverable)
                  </span>
                  <div className="h-8 rounded bg-hover flex items-center px-3 text-xs text-secondary">
                    --bg-hover
                  </div>
                </div>
                <div className="p-4 border border-default rounded-md bg-surface">
                  <span className="text-xs font-mono text-muted mb-2 block">
                    --bg-surface
                  </span>
                  <div className="h-8 rounded border border-active flex items-center px-3 text-xs text-secondary">
                    --border-active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Typography */}
        <section>
          <SectionHeader
            icon={<Type />}
            title="Typography Scale & Hierarchy"
            description="System fonts combined with the strict 3-tier color hierarchy."
          />

          <div className="border border-default rounded-xl bg-surface p-6 md:p-10 flex flex-col gap-8">
            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] items-baseline gap-4 border-b border-default pb-6">
              <span className="text-xs font-mono text-muted">
                --text-primary
                <br />
                (text-2xl)
              </span>
              <h1 className="text-2xl font-semibold text-primary">
                The quick brown fox jumps over the lazy dog.
              </h1>
            </div>

            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] items-baseline gap-4 border-b border-default pb-6">
              <span className="text-xs font-mono text-muted">
                --text-primary
                <br />
                (text-base)
              </span>
              <p className="text-base text-primary">
                Madison keeps the design system in code as the single source of
                truth, so the same tokens drive every surface and stay in sync
                across light and dark mode.
              </p>
            </div>

            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] items-baseline gap-4 border-b border-default pb-6">
              <span className="text-xs font-mono text-muted">
                --text-secondary
                <br />
                (text-sm)
              </span>
              <p className="text-sm text-secondary leading-relaxed">
                Secondary text carries metadata, descriptions, and supporting
                copy — present but quieter than the primary hierarchy, never
                competing with headings for attention.
              </p>
            </div>

            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] items-baseline gap-4">
              <span className="text-xs font-mono text-muted">
                --text-muted
                <br />
                (text-xs)
              </span>
              <p className="text-xs text-muted font-mono uppercase tracking-widest">
                Last synced: 2026-02-28 14:32 UTC
              </p>
            </div>
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Type Scale */}
        <section>
          <SectionHeader
            icon={<Type />}
            title="Type Scale"
            description="Font sizes paired with line-heights. The display step is reserved for hero headings."
          />
          <div className="border border-default rounded-lg bg-surface p-card">
            {TOKENS.fontSizes.map((token) => (
              <div
                key={token.name}
                className="flex items-baseline gap-6 border-b border-default py-3 last:border-0"
              >
                <span className="w-20 shrink-0 text-xs font-mono text-muted">
                  {token.name.replace("--text-", "")}
                </span>
                <span
                  className="flex-1 truncate text-primary"
                  style={{
                    fontSize: `var(${token.name})`,
                    lineHeight: token.lineHeight,
                    letterSpacing: token.tracking,
                    fontWeight: token.weight ? Number(token.weight) : undefined,
                  }}
                >
                  The quick brown fox
                </span>
                <span className="shrink-0 text-xs font-mono text-secondary">
                  {token.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Font Families */}
        <section>
          <SectionHeader
            icon={<Type />}
            title="Font Families"
            description="Madison pairs Lora (display / large headings) with Inter (body + UI); JetBrains Mono for code. Apply the family with font-serif / font-sans / font-mono."
          />
          <div className="border border-default rounded-lg bg-surface p-card flex flex-col gap-6">
            {TOKENS.fontFamilies.map((token) => (
              <div
                key={token.name}
                className="grid grid-cols-1 gap-2 border-b border-default pb-6 last:border-0 last:pb-0 md:grid-cols-[180px_1fr] md:items-baseline md:gap-6"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-primary">
                    {token.label}
                  </span>
                  <span className="text-2xs font-mono text-muted">
                    {token.name}
                  </span>
                </div>
                <p
                  className="truncate text-2xl text-primary"
                  style={{ fontFamily: `var(${token.name})` }}
                >
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Line Height */}
        <section>
          <SectionHeader
            icon={<Type />}
            title="Line Height"
            description="The override scale — every type step already carries its own line-height, so reach for these only when copy needs to breathe (or tighten) at the same size."
          />
          <div className="border border-default rounded-lg bg-surface p-card flex flex-col gap-6">
            {TOKENS.lineHeights.map((token) => (
              <div
                key={token.name}
                className="border-b border-default pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <span className="text-xs font-mono text-muted">
                    {token.name.replace("--leading-", "leading-")} · {token.value}
                  </span>
                  <span className="shrink-0 text-xs text-secondary">{token.label}</span>
                </div>
                <p
                  className="mt-2 max-w-prose text-base text-primary"
                  /* Render through the generated var, not the raw value: this makes the
                     style guide prove --leading-* actually reaches the browser. */
                  style={{ lineHeight: `var(${token.name})` }}
                >
                  Madison is a code-first design system. The tokens live in code, generate the
                  CSS, and every page composes from the same vocabulary.
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Font Weights */}
        <section>
          <SectionHeader
            icon={<Type />}
            title="Font Weights"
            description="The weight ramp — body 400, labels 500, headings & buttons 600, strong emphasis 700."
          />
          <div className="border border-default rounded-lg bg-surface p-card flex flex-col gap-3">
            {TOKENS.fontWeights.map((token) => (
              <div
                key={token.name}
                className="flex items-baseline justify-between gap-6 border-b border-default py-3 last:border-0"
              >
                <span
                  className="text-xl text-primary"
                  style={{ fontWeight: Number(token.value) }}
                >
                  The quick brown fox
                </span>
                <span className="shrink-0 text-xs font-mono text-muted">
                  {token.name.replace("--font-weight-", "font-")} · {token.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Letter Spacing */}
        <section>
          <SectionHeader
            icon={<Type />}
            title="Letter Spacing"
            description="Tracking steps — tighten large display headings, open up uppercase overlines and eyebrows."
          />
          <div className="border border-default rounded-lg bg-surface p-card flex flex-col gap-3">
            {TOKENS.letterSpacing.map((token) => (
              <div
                key={token.name}
                className="flex items-baseline justify-between gap-6 border-b border-default py-3 last:border-0"
              >
                <span
                  className="text-lg uppercase text-primary"
                  style={{ letterSpacing: token.value }}
                >
                  Madison Design
                </span>
                <span className="shrink-0 text-xs font-mono text-muted">
                  {token.name.replace("--tracking-", "tracking-")} · {token.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Spacing Scale */}
        <section>
          <SectionHeader
            icon={<Ruler />}
            title="Spacing Scale"
            description="Named layout rhythm. Reach for these utilities (p-card, px-gutter, gap-section) instead of ad-hoc numbers."
          />
          <div className="border border-default rounded-lg bg-surface p-card flex flex-col gap-3">
            {TOKENS.spacing.map((token) => (
              <div key={token.name} className="flex items-center gap-4">
                <span className="w-28 shrink-0 text-sm text-secondary">
                  {token.label}
                </span>
                <div
                  className="h-4 rounded bg-brand"
                  style={{ width: `var(${token.name})` }}
                />
                <span className="ml-auto text-xs font-mono text-muted">
                  {token.name} · {token.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Layout Container */}
        <section>
          <SectionHeader
            icon={<Ruler />}
            title="Layout Container"
            description="Max width of centered page content — nav, hero, and sections align to it. Apply with max-w-[var(--container-page)] mx-auto."
          />
          <div className="rounded-lg border border-default bg-surface p-card">
            {TOKENS.globals
              .filter((token) => token.name === "--container-page")
              .map((token) => (
                <div key={token.name} className="flex items-center gap-4">
                  <span className="w-28 shrink-0 text-sm text-secondary">
                    {token.label}
                  </span>
                  <div className="h-4 flex-1 rounded border border-active bg-brand-subtle" />
                  <span className="ml-auto font-mono text-xs text-muted">
                    {token.name} · {token.value}
                  </span>
                </div>
              ))}
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Breakpoints */}
        <section>
          <SectionHeader
            icon={<Monitor />}
            title="Breakpoints"
            description="Responsive min-width thresholds driving md:, lg:, … Override to shift a client's responsive layout in one place."
          />
          <div className="border border-default rounded-lg bg-surface p-card flex flex-col gap-3">
            {TOKENS.breakpoints.map((token) => {
              const rem = parseFloat(token.value);
              const px = Math.round(rem * 16);
              return (
                <div key={token.name} className="flex items-center gap-4">
                  <span className="w-28 shrink-0 text-sm text-secondary">
                    {token.label}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded bg-app">
                    <div
                      className="h-full rounded bg-brand"
                      style={{ width: `${(rem / 96) * 100}%` }}
                    />
                  </div>
                  <span className="ml-auto shrink-0 text-xs font-mono text-muted">
                    {token.name.replace("--breakpoint-", "")} · {token.value} ·{" "}
                    {px}px
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Corner Radii */}
        <section>
          <SectionHeader
            icon={<Square />}
            title="Corner Radii"
            description="Every step derives from the --radius base, so softening all corners is a one-token change."
          />
          <div className="flex flex-wrap gap-6">
            {TOKENS.radii.map((token) => (
              <div key={token.name} className="flex flex-col items-center gap-2">
                <div
                  className="w-20 h-20 bg-brand-subtle border border-active"
                  style={{ borderRadius: `var(${token.name})` }}
                />
                <span className="text-xs font-mono text-muted">
                  {token.name.replace("--radius-", "rounded-")}
                </span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Elevation */}
        <section>
          <SectionHeader
            icon={<Layers />}
            title="Elevation"
            description="Theme-aware shadows — heavier in dark mode so depth still reads. Toggle the theme to compare."
          />
          <div className="flex flex-wrap gap-8 p-card">
            {TOKENS.shadows.map((token) => {
              const step = token.name.replace("--shadow-", "");
              return (
                <div
                  key={token.name}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className="w-24 h-24 rounded-lg bg-surface border border-default"
                    style={{ boxShadow: `var(--elevation-${step})` }}
                  />
                  <span className="text-xs font-mono text-muted">
                    shadow-{step}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Motion */}
        <section>
          <SectionHeader
            icon={<Gauge />}
            title="Motion"
            description="Durations and easings. Every transition-* utility adopts the base duration + easing by default."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-default rounded-lg bg-surface p-card flex flex-col gap-3">
              {[...TOKENS.durations, ...TOKENS.easings].map((token) => (
                <div
                  key={token.name}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm text-secondary">{token.label}</span>
                  <span className="text-xs font-mono text-muted">
                    {token.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="group border border-default rounded-lg bg-surface p-card flex flex-col justify-center gap-3">
              <span className="text-xs text-muted">Hover this panel →</span>
              <div className="h-3 w-12 rounded-full bg-brand transition-all group-hover:w-full" />
            </div>
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Layering */}
        <section>
          <SectionHeader
            icon={<Layers />}
            title="Layering (z-index)"
            description="A named stacking scale so overlays, modals, and toasts never fight over magic numbers."
          />
          <div className="border border-default rounded-lg bg-surface p-card grid gap-2 sm:grid-cols-2">
            {TOKENS.zIndex.map((token) => (
              <div
                key={token.name}
                className="flex items-center justify-between gap-4 rounded-md bg-app px-3 py-2"
              >
                <span className="text-sm font-mono text-secondary">
                  z-{token.name.replace("--z-", "")}
                </span>
                <span className="text-xs font-mono text-muted">
                  {token.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-default" />

        {/* SECTION: Interaction */}
        <section>
          <SectionHeader
            icon={<MousePointerClick />}
            title="Interaction"
            description="Standardized focus ring, disabled affordance, and cursor. Tab to the button to see the ring."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-default rounded-lg bg-surface p-card flex items-center gap-4">
              <button className="px-4 py-2 text-sm font-medium rounded-md bg-brand text-brand-fg outline-none transition-all focus-visible:ring-[length:var(--ring-width)] focus-visible:ring-brand/50">
                Focusable
              </button>
              <button
                disabled
                className="px-4 py-2 text-sm font-medium rounded-md bg-brand text-brand-fg opacity-[var(--disabled-opacity)] cursor-not-allowed"
              >
                Disabled
              </button>
            </div>
            <div className="border border-default rounded-lg bg-surface p-card flex flex-col gap-2">
              {TOKENS.interaction.map((token) => (
                <div
                  key={token.name}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm text-secondary">{token.label}</span>
                  <span className="text-xs font-mono text-muted">
                    {token.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ============================================================================
// INTERNAL STYLES COMPONENT
// ============================================================================
function StyleGuideStyles() {
  const styles = `
    .theme-light {
      ${TOKENS.backgrounds.map((t) => `${t.name}: ${hexToHslChannels(t.light)};`).join("\n")}
      ${TOKENS.borders.map((t) => `${t.name}: ${hexToHslChannels(t.light)};`).join("\n")}
      ${TOKENS.typography.map((t) => `${t.name}: ${hexToHslChannels(t.light)};`).join("\n")}
      ${TOKENS.brand.map((t) => `${t.name}: ${hexToHslChannels(t.light)};`).join("\n")}
      ${TOKENS.semantics
        .map(
          (t) => `
        --semantic-${t.id}: ${hexToHslChannels(t.base)};
        --semantic-${t.id}-fg: ${hexToHslChannels(t.fg)};
        --semantic-${t.id}-subtle: ${hexToHslChannels(t.subtleLight)};
      `,
        )
        .join("\n")}
      ${TOKENS.globals.map((t) => `${t.name}: ${t.value};`).join("\n")}
    }
    .theme-dark {
      ${TOKENS.backgrounds.map((t) => `${t.name}: ${hexToHslChannels(t.dark)};`).join("\n")}
      ${TOKENS.borders.map((t) => `${t.name}: ${hexToHslChannels(t.dark)};`).join("\n")}
      ${TOKENS.typography.map((t) => `${t.name}: ${hexToHslChannels(t.dark)};`).join("\n")}
      ${TOKENS.brand.map((t) => `${t.name}: ${hexToHslChannels(t.dark)};`).join("\n")}
      ${TOKENS.semantics
        .map(
          (t) => `
        --semantic-${t.id}: ${hexToHslChannels(t.base)};
        --semantic-${t.id}-fg: ${hexToHslChannels(t.fg)};
        --semantic-${t.id}-subtle: ${hexToHslChannels(t.subtleDark)};
      `,
        )
        .join("\n")}
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}

// ============================================================================
// ATOMIC COMPONENTS
// ============================================================================

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-primary mb-2">
        {React.isValidElement(icon)
          ? React.cloneElement(
              icon as React.ReactElement<{ className?: string }>,
              { className: "w-5 h-5" },
            )
          : icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <p className="text-sm text-secondary">{description}</p>
    </div>
  );
}

function TokenGroup({
  title,
  tokens,
  isDark,
}: {
  title: string;
  tokens: TokenDefinition[];
  isDark: boolean;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
        {title}
      </h3>
      <div className="flex flex-col gap-2.5">
        {tokens.map((token) => {
          const activeHex = isDark ? token.dark : token.light;
          return (
            <div
              key={token.name}
              className="flex items-center gap-3 p-2 rounded-md border border-transparent hover:border-default hover:bg-hover transition-colors group"
            >
              <div
                className="w-10 h-10 rounded-md border border-active shadow-sm shrink-0 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor:
                    title === "Typography" ? "var(--bg-surface)" : activeHex,
                  color: title === "Typography" ? activeHex : "transparent",
                }}
              >
                {title === "Typography" && "Aa"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-primary truncate">
                  {token.label}
                </span>
                <span className="text-2xs font-mono text-muted truncate">
                  {token.name}
                </span>
              </div>
              <div className="ml-auto text-xs font-mono text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                {activeHex}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
