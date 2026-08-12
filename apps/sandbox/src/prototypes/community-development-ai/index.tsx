import {
  LandPlot,
  FileCheck,
  FileText,
  History,
  Search,
  ClipboardList,
  Gavel,
  Mail,
  MapPin,
  Hammer,
  Calendar,
  FileSearch,
  CheckCircle2,
  ShieldCheck,
  Layers,
  LayoutGrid,
  Building2,
  FileSignature,
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
      statement: (
        <>
          One AI, <span className="text-brand-accent">grounded</span> in
          decades of plans, maps, and code.
        </>
      ),
      description:
        "Municipal code, master plans, parcel-level GIS, permit history, and planning-commission records — unified and cited, inside your own tenant.",
    },
  },
  media: {
    title: "Madison AI — Community Development",
  },
  howItWorks: {
    eyebrow: "How it works",
    title:
      "Built from your plans, GIS, and code to support planners, commissioners, and residents.",
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
            icon: LandPlot,
            rows: [
              { label: "Single-family dwelling", meta: "Permitted" },
              { label: "Accessory dwelling unit", meta: "Permitted" },
              { label: "Duplex", meta: "Special use permit" },
              { label: "Short-term rental", meta: "Conditional" },
            ],
            footnote: "Cited to Code §110.302",
          },
          {
            title: "Zoning verification letters",
            description:
              "A drafted verification letter in your format, grounded in the parcel record and the exact code sections it relies on.",
            icon: FileCheck,
            rows: [
              { label: "Zoning", meta: "MDS" },
              { label: "Overlay", meta: "None" },
              { label: "Code sections cited", meta: "3" },
            ],
            footnote: "Drafted in your letterhead format",
          },
          {
            title: "Planning-commission staff reports",
            description:
              "A first draft — findings, analysis, and recommendation — from the case file, cross-checked against code and cited.",
            icon: FileText,
            rows: [
              { label: "PC-2025-042 · Oak Ridge Subdivision", meta: "Draft" },
              { label: "Findings", meta: "Cited" },
              { label: "Recommendation", meta: "Approve" },
            ],
            footnote: "Drafted from the case file in 25 minutes",
          },
          {
            title: "Parcel & permit history",
            description:
              "Every entitlement, permit, and case for a parcel assembled into one dated timeline you can trust.",
            icon: History,
            rows: [
              { label: "Parcel map recorded", meta: "1998" },
              { label: "Building permit · addition", meta: "2011" },
              { label: "Variance granted", meta: "2016" },
              { label: "Lot line adjustment", meta: "2022" },
            ],
            footnote: "Full parcel timeline · 14 records",
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
            icon: Search,
            rows: [
              {
                label: "What did the commission decide on Oak Ridge?",
                meta: "Answered",
              },
              { label: "Approved 5–2, Mar 6, 2025", meta: "Cited" },
            ],
          },
          {
            title: "A briefing on every agenda item",
            description:
              "Walk in prepared. Each item summarized with the staff recommendation and the history behind it.",
            icon: ClipboardList,
            rows: [
              { label: "Oak Ridge subdivision", meta: "staff: approve" },
              { label: "Downtown overlay update", meta: "staff: approve" },
              { label: "Use permit · 220 Main", meta: "1 comment" },
            ],
            footnote: "Briefing ready — 5 min read",
          },
          {
            title: "See how the commission voted before",
            description:
              "Every prior motion and vote surfaced, with the source one click away.",
            icon: Gavel,
            rows: [
              { label: "Hillside overlay (2/6)", meta: "passed 6–1" },
              { label: "ADU standards (12/5)", meta: "passed 7–0" },
              { label: "Density bonus (10/3)", meta: "tabled 4–3" },
            ],
          },
          {
            title: "A detailed summary after every meeting",
            description:
              "A clear recap of what was approved, continued, and what comes next — in your inbox when the gavel drops.",
            icon: Mail,
            rows: [
              { label: "Oak Ridge subdivision", meta: "approved 5–1" },
              { label: "Downtown overlay", meta: "continued to 4/3" },
              { label: "Use permit · 220 Main", meta: "findings requested" },
            ],
            footnote: "Full recap sent to your inbox",
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
            icon: MapPin,
            rows: [
              { label: "1420 Oak Ridge Dr.", meta: "MDS zoning" },
              { label: "APN 084-142-11", meta: "No overlay" },
            ],
          },
          {
            title: "Permit history lookup",
            description:
              "See the permits and cases on a property without calling the counter or filing a request.",
            icon: Hammer,
            rows: [
              { label: "Building permit · addition", meta: "2011 · final" },
              { label: "Reroof", meta: "2018 · final" },
              { label: "Electrical · solar", meta: "2021 · final" },
            ],
            footnote: "7 permits on this parcel since 1998",
          },
          {
            title: "Planning-commission lookup",
            description:
              "Upcoming agendas, packets, and hearings surfaced from the public record.",
            icon: Calendar,
            rows: [
              { label: "Regular meeting", meta: "Apr 3 · 6pm" },
              { label: "Agenda packet", meta: "Posted" },
              { label: "Oak Ridge Ph. 2", meta: "Public hearing" },
            ],
          },
          {
            title: "AI-assisted PRA submissions",
            description:
              "When a formal request is needed, it's scoped precisely and routed the moment it's submitted.",
            icon: FileSearch,
            rows: [
              {
                label: "Case files, Oak Ridge subdivision, 2023–present",
                meta: "Scoped",
              },
            ],
            footnote: "Records request · 2 record types",
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
      "Other permitting systems",
    ],
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
        title: "Core platform",
        description: "Staff, electeds, and citizens on one grounded record.",
        icon: LayoutGrid,
        href: "/citywide-ai/",
      },
      {
        title: "FOIA / Public Records Fulfillment",
        description: "Scope, redact, and release requests defensibly.",
        icon: FileSearch,
        href: "/public-records-requests-ai/",
      },
      {
        title: "Community Development AI",
        description: "Permitting, zoning, and planning, grounded in code.",
        icon: Building2,
        href: "/community-development-ai/",
        current: true,
      },
      {
        title: "Contracts & Procurement AI",
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
    submitLabel: "Book Your Demo",
  },
};

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function CommunityDevelopmentAiPrototype() {
  return <PlatformPageTemplate data={DATA} />;
}
