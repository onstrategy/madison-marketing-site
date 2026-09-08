import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  FileSearch,
  FileSignature,
  History,
  Layers,
  LandPlot,
  ShieldCheck,
} from "lucide-react";
import { PlatformPageTemplate, type PlatformPageData } from "../platform-page/template";

// Citywide AI — the core platform page: one Madison AI grounded in the city's
// whole public record, serving staff, elected officials, and residents from
// the same corpus. Built on the shared PlatformPageTemplate; the hero's
// animated demo is the staff-report walkthrough in ../platform-page/demos/.
const DATA: PlatformPageData = {
  hero: {
    kicker: "The Madison AI platform",
    title: "Citywide AI",
    description:
      "Madison brings your city's public record into one AI, so staff, electeds, and citizens can get grounded, cited answers in seconds.",
    primaryCta: "Book a demo",
    secondaryCta: "How it works",
    card: {
      eyebrow: "Staff, electeds, and citizens.",
      statement: "One AI, grounded in your city's own record.",
      description:
        "Every answer traces back to a document, a vote, or a date in your systems. Nothing invented, nothing outside your tenant.",
    },
  },
  media: {
    title: "Madison AI — Citywide",
    demo: "staff-report",
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "Built from your public record to support staff, electeds, and citizens.",
    description:
      "Staff, elected officials, and citizens all draw on the same grounded record. Pick an audience to see the workflows built for each.",
    roles: [
      {
        id: "staff",
        label: "For staff & executives",
        steps: [
          {
            title: "Find answers across your entire record",
            description:
              "Ask in plain language and Madison answers from decades of minutes, staff reports, permits, and ordinances — in seconds.",
            preview: {
              kind: "ask",
              question: "What did the council decide on STR caps?",
              answer:
                "Adopted Ordinance 24-07, capping STR permits at 7 per 2 acres in residential zones (5–2 vote).",
              cite: "1",
            },
          },
          {
            title: "Draft staff reports in your format",
            description:
              "A first draft in your template and tone, cross-checked against the record and cited before you edit a word.",
            preview: {
              kind: "doc",
              title: "STR Cap Amendment — Fiscal Analysis",
              bars: ["100%", "92%", "80%", "88%"],
              chips: ["Cited · Ord. 24-07", "Cited · FY27 budget"],
            },
          },
          {
            title: "Every answer cited to its source",
            description:
              "Each response links to the exact document, page, and vote behind it — exportable alongside your work.",
            preview: {
              kind: "chat",
              question: "When is the next council meeting?",
              answer: (
                <>
                  The next regular meeting is <b>Tuesday, June 3 at 6:00 PM</b> in Council Chambers. Agenda posted 72
                  hours prior.
                </>
              ),
            },
          },
          {
            title: "Draft minutes, ordinances, and briefings",
            description:
              "The routine writing that fills your week — drafted from the record, in your format, in minutes instead of hours.",
            preview: {
              kind: "doc",
              tabs: ["Minutes", "Ordinance", "Briefing"],
              title: "Regular Meeting — Draft Minutes",
              bars: ["100%", "88%", "94%", "72%"],
              done: "Drafted from the record in 40 seconds",
            },
          },
        ],
      },
      {
        id: "electeds",
        label: "For elected officials",
        steps: [
          {
            title: "Find answers across your entire record",
            description:
              "Ask in plain language and Madison answers from decades of minutes, staff reports, permits, and ordinances — in seconds.",
            preview: {
              kind: "ask",
              question: "What did the council decide on STR caps?",
              answer:
                "Adopted Ordinance 24-07, capping STR permits at 7 per 2 acres in residential zones (5–2 vote).",
              cite: "1",
            },
          },
          {
            title: "Draft staff reports in your format",
            description:
              "A first draft in your template and tone, cross-checked against the record and cited before you edit a word.",
            preview: {
              kind: "doc",
              title: "STR Cap Amendment — Fiscal Analysis",
              bars: ["100%", "92%", "80%", "88%"],
              chips: ["Cited · Ord. 24-07", "Cited · FY27 budget"],
            },
          },
          {
            title: "Every answer cited to its source",
            description:
              "Each response links to the exact document, page, and vote behind it — exportable alongside your work.",
            preview: {
              kind: "chat",
              question: "When is the next council meeting?",
              answer: (
                <>
                  The next regular meeting is <b>Tuesday, June 3 at 6:00 PM</b> in Council Chambers. Agenda posted 72
                  hours prior.
                </>
              ),
            },
          },
          {
            title: "A detailed summary after every meeting",
            description:
              "A clear recap of what was decided, what was tabled, and what comes next — in your inbox when the gavel drops.",
            preview: {
              kind: "rows",
              eyebrow: "Meeting recap · May 20",
              rows: [
                { icon: Check, tone: "success", label: "STR cap amendment", meta: "adopted 5–2" },
                { icon: History, tone: "warning", label: "FY27 budget kickoff", meta: "tabled to 6/3" },
                { icon: ArrowRight, tone: "brand", label: "Lake Tahoe easement", meta: "staff to report back" },
              ],
              banner: "Full recap sent to your inbox",
            },
          },
        ],
      },
      {
        id: "citizens",
        label: "For citizens & records",
        steps: [
          {
            title: "Self-service research on upcoming agendas",
            description:
              "Residents explore what's on the next agenda in plain language, grounded in the posted record — before they ever call your office.",
            preview: {
              kind: "rows",
              rows: [
                { icon: Check, tone: "success", label: "STR cap amendment", meta: "staff: approve" },
                { icon: Check, tone: "success", label: "FY27 budget kickoff", meta: "Parks +$4.2M" },
                { icon: Check, tone: "success", label: "Lake Tahoe easement", meta: "2 comments" },
              ],
              banner: "Briefing ready — 5 min read",
            },
          },
          {
            title: "Research previous council action, no request needed",
            description:
              "Prior votes, motions, and decisions surfaced instantly from the public record — without a formal public-records request.",
            preview: {
              kind: "rows",
              rows: [
                { icon: History, tone: "brand", label: "STR cap (3/18)", meta: "tabled 4–3" },
                { icon: History, tone: "brand", label: "Impact fees (1/14)", meta: "passed 6–1" },
                { icon: History, tone: "brand", label: "Zoning overlay (11/5)", meta: "passed 5–2" },
              ],
            },
          },
          {
            title: "Easily submit deeper records requests",
            description:
              "When a formal request is needed, it's scoped precisely and routed the moment it's submitted.",
            preview: {
              kind: "request",
              body: "Provide all emails between the City Manager and Commissioner Smith regarding pickleball court funding, plus related contracts and budget memos.",
              meta: "Scoping request · 3 record types · 1 date range",
            },
          },
        ],
      },
    ],
  },
  connectors: {
    eyebrow: "Designed for your data and records.",
    title: "Instantly search across every system your city runs.",
    description:
      "Don't see yours? We connect with dozens of other systems across permitting, GIS, procurement, and more.",
    items: [
      "Outlook",
      "Exchange",
      "Teams",
      "esri",
      "Accela",
      "SharePoint",
      "CivicPlus",
      "ClearGov",
      "Laserfiche",
      "Granicus",
      "Barracuda",
      "Municode",
      "OnBase",
      "YouTube",
      "eScribe",
    ],
    note: "Other permitting systems",
  },
  whatYouGet: {
    eyebrow: "What you get",
    title: "Answers grounded in source record.",
    description:
      "Madison doesn't just answer. It produces the paper trail that protects your government.",
    benefits: [
      {
        icon: CheckCircle2,
        title: "Every answer cited",
        description:
          "Each response links to the page, paragraph, and vote behind it — clickable and exportable to PDF.",
      },
      {
        icon: ShieldCheck,
        title: "Your AI, never sharing your data",
        description:
          "Your own tenant, your own keys. Your data never trains outside models and never leaves your environment.",
      },
      {
        icon: Building2,
        title: "Grounded in your record",
        description:
          "From 1998 minutes to last week's report, Madison answers from your corpus only — no drift, no outside content.",
      },
      {
        icon: Layers,
        title: "One platform, every job",
        description:
          "Staff, electeds, and citizens work from the same source of truth — no siloed tools to reconcile.",
      },
    ],
  },
  suite: {
    eyebrow: "The Madison AI platform",
    title: "One platform. Purpose-built models.",
    description:
      "This page covers the core platform. Each specialized model runs on the same grounded record — explore the ones built for your team.",
    items: [
      {
        title: "Citywide AI",
        description: "Staff, electeds, and citizens on one grounded record.",
        icon: Building2,
        href: "/citywide-ai/",
        current: true,
      },
      {
        title: "AI for Public Records Requests",
        description: "Scope, redact, and release requests defensibly.",
        icon: FileSearch,
        href: "/public-records-requests-ai/",
      },
      {
        title: "AI for Community Development",
        description: "Permitting, zoning, and planning, grounded in code.",
        icon: LandPlot,
        href: "/community-development-ai/",
      },
      {
        title: "AI for Procurement & Contracts",
        description: "Draft, compare, and track solicitations and awards.",
        icon: FileSignature,
        href: "/procurement-contracts-ai/",
      },
    ],
  },
  cta: {
    title: "Get a custom demonstration.",
    description:
      "Book a 60-minute call. We'll walk staff, elected, and citizen workflows live, and answer the security questions your IT and legal teams will ask.",
    bullets: [
      "A live walkthrough across all three audiences",
      "How we're protecting your data and privacy",
      "See how we can start saving real time in weeks",
    ],
  },
};

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function CitywideAiPrototype() {
  return <PlatformPageTemplate data={DATA} />;
}
