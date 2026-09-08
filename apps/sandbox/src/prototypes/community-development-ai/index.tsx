import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck,
  FileSearch,
  FileSignature,
  FileText,
  Gavel,
  LandPlot,
  Hammer,
  History,
  Layers,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { PlatformPageTemplate, type PlatformPageData } from "../platform-page/template";

// Community Development AI — the first page built on the shared
// PlatformPageTemplate. A future Platform-dropdown page (Contracts &
// Procurement AI, FOIA / Public Records, …) is just a new object like this
// one; the layout code lives once in ../platform-page/template.tsx.
const DATA: PlatformPageData = {
  hero: {
    kicker: "The Madison AI platform",
    title: "Community Development AI",
    description:
      "Madison brings your plans, permits, GIS, and code into one AI, so planners, commissioners, and residents can get grounded, cited answers in seconds.",
    primaryCta: "Book a demo",
    secondaryCta: "How it works",
    card: {
      eyebrow: "Planners, engineers, and planning commissions.",
      statement: "One AI, grounded in decades of plans, maps, and code.",
      description:
        "Municipal code, master plans, parcel-level GIS, permit history, and planning-commission records — unified and cited, inside your own tenant.",
    },
  },
  media: {
    title: "Madison AI — Community Development",
    demo: "staff-report",
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "Built from your plans, GIS, and code to support planners, commissioners, and residents.",
    description:
      "Planning staff, elected officials, and the public all draw on the same grounded planning record. Pick an audience to see the workflows built for each.",
    roles: [
      {
        id: "staff",
        label: "For planners & engineers",
        steps: [
          {
            title: "Allowed-use lookup on any parcel",
            description:
              "Ask what a parcel allows and Madison resolves zoning, overlays, and conditions against your code — with the section cited.",
            preview: {
              kind: "record",
              title: "APN 084-142-11",
              subtitle: "Zoning: MDS (Medium Density Suburban)",
              badge: { text: "Allowed", tone: "success" },
              items: [
                { label: "Single-family dwelling", value: "Permitted" },
                { label: "Accessory dwelling unit", value: "Permitted" },
                { label: "Duplex", value: "Special use permit" },
                { label: "Short-term rental", value: "Conditional" },
              ],
              chip: "Code §110.302",
            },
          },
          {
            title: "Zoning verification letters",
            description:
              "A drafted verification letter in your format, grounded in the parcel record and the exact code sections it relies on.",
            preview: {
              kind: "doc",
              title: "Zoning Verification Letter",
              subtitle: "RE: APN 084-142-11 · 1420 Oak Ridge Dr.",
              bars: ["100%", "92%", "84%", "96%"],
              chips: ["Zoning: MDS", "Code §110.302", "Overlay: none"],
            },
          },
          {
            title: "Planning-commission staff reports",
            description:
              "A first draft — findings, analysis, and recommendation — from the case file, cross-checked against code and cited.",
            preview: {
              kind: "doc",
              tabs: ["Staff report", "Findings"],
              title: "PC-2025-042 · Oak Ridge Subdivision",
              bars: ["100%", "88%", "94%", "72%"],
              done: "Drafted from the case file in 25 minutes",
            },
          },
          {
            title: "Parcel & permit history",
            description:
              "Every entitlement, permit, and case for a parcel assembled into one dated timeline you can trust.",
            preview: {
              kind: "rows",
              rows: [
                { icon: FileText, tone: "brand", label: "Parcel map recorded", meta: "1998" },
                { icon: Hammer, tone: "warning", label: "Building permit · addition", meta: "2011" },
                { icon: Gavel, tone: "brand", label: "Variance granted", meta: "2016" },
                { icon: FileCheck, tone: "brand", label: "Lot line adjustment", meta: "2022" },
              ],
              banner: "Full parcel timeline · 14 records",
            },
          },
        ],
      },
      {
        id: "electeds",
        label: "For commissioners & electeds",
        steps: [
          {
            title: "Find answers across the planning record",
            description:
              "Ask in plain language and Madison answers from decades of plans, minutes, permits, and code — in seconds.",
            preview: {
              kind: "ask",
              question: "What did the commission decide on the Oak Ridge subdivision?",
              answer: (
                <>
                  Approved with conditions on <b>Mar 6, 2025</b> — 18-lot tentative map, 5–1 vote, subject to a traffic
                  study.
                </>
              ),
              cite: "1",
            },
          },
          {
            title: "A briefing on every agenda item",
            description:
              "Walk in prepared. Each item summarized with the staff recommendation and the history behind it.",
            preview: {
              kind: "rows",
              rows: [
                { icon: FileCheck, tone: "success", label: "Oak Ridge subdivision", meta: "staff: approve" },
                { icon: FileCheck, tone: "success", label: "Downtown overlay update", meta: "staff: approve" },
                { icon: FileCheck, tone: "success", label: "Use permit · 220 Main", meta: "1 comment" },
              ],
              banner: "Briefing ready — 5 min read",
            },
          },
          {
            title: "See how the commission voted before",
            description: "Every prior motion and vote surfaced, with the source one click away.",
            preview: {
              kind: "rows",
              rows: [
                { icon: History, tone: "brand", label: "Hillside overlay (2/6)", meta: "passed 6–1" },
                { icon: History, tone: "brand", label: "ADU standards (12/5)", meta: "passed 7–0" },
                { icon: History, tone: "brand", label: "Density bonus (10/3)", meta: "tabled 4–3" },
              ],
            },
          },
          {
            title: "A detailed summary after every meeting",
            description:
              "A clear recap of what was approved, continued, and what comes next — in your inbox when the gavel drops.",
            preview: {
              kind: "rows",
              eyebrow: "PC recap · Mar 6",
              rows: [
                { icon: FileCheck, tone: "success", label: "Oak Ridge subdivision", meta: "approved 5–1" },
                { icon: History, tone: "warning", label: "Downtown overlay", meta: "continued to 4/3" },
                { icon: ArrowRight, tone: "brand", label: "Use permit · 220 Main", meta: "findings requested" },
              ],
              banner: "Full recap sent to your inbox",
            },
          },
        ],
      },
      {
        id: "citizens",
        label: "For residents & applicants",
        steps: [
          {
            title: "Parcel & zoning lookup",
            description:
              "Residents check what a parcel is zoned and what it allows in plain language, grounded in your code.",
            preview: {
              kind: "record",
              title: "1420 Oak Ridge Dr.",
              subtitle: "APN 084-142-11",
              badge: { text: "MDS zoning", tone: "brand" },
              body: "Medium Density Suburban. Single-family and ADUs permitted; duplexes by special use permit. Not in a flood or hillside overlay.",
            },
          },
          {
            title: "Permit history lookup",
            description: "See the permits and cases on a property without calling the counter or filing a request.",
            preview: {
              kind: "rows",
              rows: [
                { icon: Hammer, tone: "warning", label: "Building permit · addition", meta: "2011 · final" },
                { icon: Hammer, tone: "warning", label: "Reroof", meta: "2018 · final" },
                { icon: Zap, tone: "brand", label: "Electrical · solar", meta: "2021 · final" },
              ],
              banner: "7 permits on this parcel since 1998",
            },
          },
          {
            title: "Planning-commission lookup",
            description: "Upcoming agendas, packets, and hearings surfaced from the public record.",
            preview: {
              kind: "rows",
              eyebrow: "Upcoming · Planning Commission",
              rows: [
                { icon: Calendar, tone: "brand", label: "Regular meeting", meta: "Apr 3 · 6pm" },
                { icon: FileText, tone: "brand", label: "Agenda packet", meta: "posted" },
                { icon: Users, tone: "brand", label: "Oak Ridge Ph. 2", meta: "public hearing" },
              ],
            },
          },
          {
            title: "AI-assisted PRA submissions",
            description:
              "When a formal request is needed, it's scoped precisely and routed the moment it's submitted.",
            preview: {
              kind: "request",
              body: "All case files and correspondence for the Oak Ridge subdivision, 2023 to present.",
              meta: "Records request · scoped · 2 record types",
            },
          },
        ],
      },
    ],
  },
  connectors: {
    eyebrow: "Built from data across your gov.",
    title: "Instantly search across every planning system your city runs.",
    description:
      "Parcel data, GIS, permit history, and code — plus Tyler, Accela, ArcGIS, SharePoint, Granicus and dozens more.",
    items: [
      "Outlook",
      "Exchange",
      "Teams",
      "Esri / ArcGIS",
      "Accela",
      "SharePoint",
      "CivicPlus",
      "ClearGov",
      "Laserfiche",
      "Granicus",
      "Municode",
      "OnBase",
      "YouTube",
      "eScribe",
    ],
    note: "Other permitting systems",
  },
  whatYouGet: {
    eyebrow: "What you get",
    title: "Planning answers, grounded in source record.",
    description:
      "From parcel timelines to draft findings, every output is grounded in your code, your maps, and your record.",
    benefits: [
      {
        icon: CheckCircle2,
        title: "Every answer cited",
        description:
          "Each answer links to the parcel record, code section, or commission vote behind it — clickable and exportable to PDF.",
      },
      {
        icon: ShieldCheck,
        title: "Your AI, never sharing your data",
        description:
          "Your own tenant, your own keys. Your plans, maps, and permits never train outside models and never leave your environment.",
      },
      {
        icon: LandPlot,
        title: "Grounded in your planning record",
        description:
          "From decades of maps and master plans to last week's agenda packet, Madison answers from your corpus only — no drift, no outside content.",
      },
      {
        icon: Layers,
        title: "One platform, every planning job",
        description:
          "Planners, commissioners, and residents work from the same source of truth — no siloed systems to reconcile.",
      },
    ],
  },
  suite: {
    eyebrow: "The Madison AI platform",
    title: "One platform. Purpose-built models.",
    description:
      "Community Development runs on the same grounded record as the rest of the platform. Explore the other models built for your teams.",
    items: [
      {
        title: "Citywide AI",
        description: "Staff, electeds, and citizens on one grounded record.",
        icon: Building2,
        href: "/citywide-ai/",
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
        current: true,
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
      "Book a 60-minute call. We'll walk planning staff, elected, and public workflows live, and answer the security questions your IT and legal teams will ask.",
    bullets: [
      "A live walkthrough across all three audiences",
      "How we're protecting your data and privacy",
      "See how we can start saving real time in weeks",
    ],
  },
};

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function CommunityDevelopmentAiPrototype() {
  return <PlatformPageTemplate data={DATA} />;
}
