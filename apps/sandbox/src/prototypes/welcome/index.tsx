import { useState } from "react";
import { ArrowLeft, Rocket, Info } from "lucide-react";
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
const STATUS = [
  { label: "Success", className: "bg-success-subtle text-success" },
  { label: "Error", className: "bg-error-subtle text-error" },
  { label: "Warning", className: "bg-warning-subtle text-warning" },
  { label: "Info", className: "bg-info-subtle text-info" },
];

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
