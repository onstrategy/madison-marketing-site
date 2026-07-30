import { useState, type ReactNode } from "react";
import { ArrowLeft, Rocket, Info } from "lucide-react";
import { cn } from "@madison/ui/utils";
import { TOKENS, type TokenDefinition } from "@madison/ui/tokens";
import { Button } from "@madison/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@madison/ui/card";
import { Badge } from "@madison/ui/badge";
import { Input } from "@madison/ui/input";
import { Label } from "@madison/ui/label";
import { Checkbox } from "@madison/ui/checkbox";
import { Separator } from "@madison/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@madison/ui/tabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@madison/ui/tooltip";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@madison/ui/select";

// Gallery metadata lives in ./meta.ts (eager-loaded by App.tsx for the gallery).

/**
 * Every step in Madison's type scale (packages/ui/src/ui/tokens.tsx
 * `fontSizes`) — HERO through the 2xs micro step. Sizes, line-heights, and
 * the -1% tracking on Lora steps are exactly what `--text-*` emits; nothing
 * here is invented. `sample` renders live with the real token classes so
 * "simulated style" and "specs" always agree with what's actually on screen.
 */
const TYPE_SCALE: {
  token: string;
  label: string;
  className: string;
  family: string;
  weight: string;
  size: string;
  leading: string;
  tracking?: string;
  sample: ReactNode;
}[] = [
  {
    token: "text-display",
    label: "HERO",
    className: "font-serif font-medium text-display",
    family: "Lora (font-serif)",
    weight: "500 · Medium",
    size: "4.5rem / 72px",
    leading: "1.05",
    tracking: "-0.01em",
    sample: "Dedicated AI.",
  },
  {
    token: "text-5xl",
    label: "h1",
    className: "font-serif font-medium text-5xl",
    family: "Lora (font-serif)",
    weight: "500 · Medium",
    size: "4rem / 64px",
    leading: "5rem / 80px",
    tracking: "-0.01em",
    sample: "Page headline",
  },
  {
    token: "text-4xl",
    label: "h2",
    className: "font-serif font-medium text-4xl",
    family: "Lora (font-serif)",
    weight: "500 · Medium",
    size: "3rem / 48px",
    leading: "4rem / 64px",
    tracking: "-0.01em",
    sample: "Section heading",
  },
  {
    token: "text-3xl",
    label: "h3",
    className: "font-serif font-medium text-3xl",
    family: "Lora (font-serif)",
    weight: "500 · Medium",
    size: "2rem / 32px",
    leading: "3rem / 48px",
    tracking: "-0.01em",
    sample: "Subsection heading",
  },
  {
    token: "text-2xl",
    label: "h4",
    className: "font-serif font-medium text-2xl",
    family: "Lora (font-serif)",
    weight: "500 · Medium",
    size: "1.5rem / 24px",
    leading: "2.25rem / 36px",
    tracking: "-0.01em",
    sample: "Card title",
  },
  {
    token: "text-xl",
    label: "h5",
    className: "font-sans font-semibold text-xl",
    family: "Inter (font-sans)",
    weight: "600 · Semibold",
    size: "1.25rem / 20px",
    leading: "1.875rem / 30px",
    sample: "Subheading text",
  },
  {
    token: "text-lg",
    label: "h6",
    className: "font-sans font-semibold text-lg",
    family: "Inter (font-sans)",
    weight: "600 · Semibold",
    size: "1.125rem / 18px",
    leading: "1.75rem / 28px",
    sample: "Small heading",
  },
  {
    token: "text-base",
    label: "Body 1 / Subtitle 1",
    className: "font-sans font-normal text-base",
    family: "Inter (font-sans)",
    weight: "400 · Normal",
    size: "1rem / 16px",
    leading: "1.5rem / 24px",
    sample: "Default body copy reads at 16px.",
  },
  {
    token: "text-sm",
    label: "Body 2 / Subtitle 2",
    className: "font-sans font-normal text-sm",
    family: "Inter (font-sans)",
    weight: "400 · Normal",
    size: "0.875rem / 14px",
    leading: "1.25rem / 20px",
    sample: "Secondary text, labels, table cells.",
  },
  {
    token: "text-xs",
    label: "Caption",
    className: "font-sans font-normal text-xs",
    family: "Inter (font-sans)",
    weight: "400 · Normal",
    size: "0.75rem / 12px",
    leading: "1rem / 16px",
    sample: "Captions and dense metadata.",
  },
  {
    token: "text-2xs",
    label: "2X Small",
    className: "font-sans font-normal text-2xs uppercase tracking-widest",
    family: "Inter (font-sans)",
    weight: "400 · Normal",
    size: "0.625rem / 10px",
    leading: "0.875rem / 14px",
    sample: "Overline label",
  },
];

const STATUS = [
  { label: "Success", className: "bg-success-subtle text-success" },
  { label: "Error", className: "bg-error-subtle text-error" },
  { label: "Warning", className: "bg-warning-subtle text-warning" },
  { label: "Info", className: "bg-info-subtle text-info" },
];

/**
 * The full color dictionary (packages/ui/src/ui/tokens.tsx), grouped exactly
 * as the token file groups it. Every hex value rendered here is read straight
 * off `TOKENS` — nothing is retyped, so this can't drift from the real
 * source of truth.
 */
const COLOR_GROUPS: { title: string; tokens: TokenDefinition[] }[] = [
  { title: "Backgrounds", tokens: TOKENS.backgrounds },
  { title: "Borders", tokens: TOKENS.borders },
  { title: "Typography", tokens: TOKENS.typography },
  { title: "Brand", tokens: TOKENS.brand },
];

/** One token's light + dark hue, side by side, with both hex codes underneath. */
function ColorSwatch({ token }: { token: TokenDefinition }) {
  return (
    <div className="overflow-hidden rounded-lg border border-default bg-surface">
      <div className="grid grid-cols-2">
        <div className="h-14" style={{ backgroundColor: token.light }} />
        <div className="h-14" style={{ backgroundColor: token.dark }} />
      </div>
      <div className="grid grid-cols-2 border-t border-default font-sans text-sm text-secondary">
        <div className="truncate border-r border-default p-1.5">{token.light}</div>
        <div className="truncate p-1.5">{token.dark}</div>
      </div>
      <div className="border-t border-default p-2.5">
        <div className="truncate text-sm font-medium text-primary">
          {token.label}
        </div>
        <div className="truncate font-sans text-sm text-muted">
          {token.name}
        </div>
      </div>
    </div>
  );
}

/** A semantic triad (base + fg + subtle in each theme) — its own layout since the shape differs from TokenDefinition. */
function SemanticSwatch({ token }: { token: (typeof TOKENS.semantics)[number] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-default bg-surface">
      <div
        className="flex items-center gap-2 p-3 text-sm font-semibold"
        style={{ backgroundColor: token.base, color: token.fg }}
      >
        {token.icon}
        {token.label}
      </div>
      <div className="grid grid-cols-3 border-t border-default font-sans text-sm text-secondary">
        <div className="border-r border-default p-1.5">
          <div className="text-muted">base</div>
          {token.base}
        </div>
        <div className="border-r border-default p-1.5">
          <div className="text-muted">fg</div>
          {token.fg}
        </div>
        <div className="p-1.5">
          <div className="text-muted">subtle</div>
          {token.subtleLight} / {token.subtleDark}
        </div>
      </div>
    </div>
  );
}

export default function WelcomePrototype() {
  const [subscribed, setSubscribed] = useState(true);
  const [plan, setPlan] = useState("team");

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-app text-primary">
        <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
          <header className="space-y-3">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> All prototypes
            </a>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-brand-fg">
                <Rocket className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome to Madison
                </h1>
                <p className="text-sm text-secondary">
                  Every element below is driven by design tokens — no hardcoded
                  colors.
                </p>
              </div>
            </div>
          </header>

          {/* Type scale */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
              Type scale
            </h2>
            <div className="overflow-x-auto rounded-lg border border-default">
              <table className="w-full min-w-175 border-collapse text-left">
                <thead>
                  <tr className="border-b border-default bg-panel">
                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">
                      Token
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">
                      Simulated style
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">
                      Specs
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TYPE_SCALE.map((row, i) => (
                    <tr
                      key={row.token}
                      className={cn(
                        "border-b border-default last:border-b-0",
                        i % 2 === 1 && "bg-stripe",
                      )}
                    >
                      <td className="whitespace-nowrap p-4 align-top">
                        <div className="font-sans text-sm text-brand">
                          {row.token}
                        </div>
                        <div className="mt-0.5 text-xs text-muted">
                          {row.label}
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <div className={row.className}>{row.sample}</div>
                      </td>
                      <td className="whitespace-nowrap p-4 align-top font-sans text-sm leading-relaxed text-secondary">
                        <div>{row.family}</div>
                        <div>{row.weight}</div>
                        <div>
                          {row.size} · {row.leading} leading
                        </div>
                        {row.tracking ? <div>{row.tracking} tracking</div> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-secondary">
              HERO through h4 are set in Lora (<code>font-serif</code>); h5 and
              below are Inter (<code>font-sans</code>) — apply the family
              class explicitly on non-heading elements, since only the{" "}
              <code>h1</code>–<code>h4</code> tags default to serif.
            </p>
          </section>

          <Separator />

          {/* Color palette */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
              Color palette
            </h2>
            {COLOR_GROUPS.map((group) => (
              <div key={group.title} className="space-y-2.5">
                <h3 className="text-sm font-semibold text-primary">
                  {group.title}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {group.tokens.map((token) => (
                    <ColorSwatch key={token.name} token={token} />
                  ))}
                </div>
              </div>
            ))}
            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-primary">Semantics</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {TOKENS.semantics.map((token) => (
                  <SemanticSwatch key={token.id} token={token} />
                ))}
              </div>
            </div>
            <p className="text-sm text-secondary">
              Left half of every swatch is the light-theme hue, right half is
              dark — every hex code shown is read straight from{" "}
              <code>tokens.tsx</code>, the single source of truth.
            </p>
          </section>

          <Separator />

          {/* Buttons */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
              Buttons
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="More info">
                    <Info />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tokens drive every state</TooltipContent>
              </Tooltip>
            </div>
          </section>

          <Separator />

          {/* Badges */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
              Badges &amp; status
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              {STATUS.map((s) => (
                <span
                  key={s.label}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </section>

          <Separator />

          {/* Form card */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
              Form
            </h2>
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="text-lg">Create your workspace</CardTitle>
                <CardDescription>
                  Inputs, selects, and checkboxes all share the token system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workspace">Workspace name</Label>
                  <Input id="workspace" placeholder="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">Plan</Label>
                  <Select value={plan} onValueChange={setPlan}>
                    <SelectTrigger id="plan">
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="subscribe"
                    checked={subscribed}
                    onCheckedChange={(c) => setSubscribed(c === true)}
                  />
                  <Label htmlFor="subscribe">Email me product updates</Label>
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="ghost">Cancel</Button>
                <Button>Create workspace</Button>
              </CardFooter>
            </Card>
          </section>

          <Separator />

          {/* Tabs */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
              Tabs
            </h2>
            <Tabs defaultValue="overview" className="max-w-md">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="text-sm text-secondary">
                Neutral-first surfaces with brand accents only where they matter.
              </TabsContent>
              <TabsContent value="activity" className="text-sm text-secondary">
                Active tab uses <code>bg-surface</code> over the{" "}
                <code>bg-hover</code> track.
              </TabsContent>
              <TabsContent value="settings" className="text-sm text-secondary">
                Toggle dark mode (system-driven) to see tokens adapt.
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </TooltipProvider>
  );
}
