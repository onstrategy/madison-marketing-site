import {
  Search,
  FileText,
  BookOpen,
  ClipboardList,
  BarChart3,
  Presentation,
  CheckCircle2,
  ShieldCheck,
  Layers,
  LayoutGrid,
  Building2,
  FileSearch,
  FileSignature,
} from "lucide-react";
import { PlatformPageTemplate, type PlatformPageData } from "../platform-page/template";

// Citywide AI — one Madison AI grounded across every department's record,
// rather than a single vertical. Built on the same PlatformPageTemplate as
// Community Development AI; see that prototype's index.tsx for the pattern.
const DATA: PlatformPageData = {
  hero: {
    kicker: "The Madison AI platform",
    title: "Citywide AI",
    description:
      "Madison brings finance, HR, public works, the clerk's office, and every other department's record into one AI, so any staff member gets a grounded, cited answer from your government's full corpus.",
    primaryCta: "Book a demo",
    secondaryCta: "How it works",
    card: {
      eyebrow: "Every department, one grounded model.",
      statement: "One AI, grounded across your entire government.",
      description:
        "Finance, HR, public works, the clerk's office, and every other department's record — unified and cited, inside your own tenant.",
    },
  },
  media: {
    title: "Madison AI — Citywide",
  },
  howItWorks: {
    eyebrow: "How it works",
    title:
      "Built from every department's record to support staff and leadership alike.",
    description:
      "One shared corpus, purpose-tuned by role. Pick an audience to see the workflows built for each.",
    roles: [
      {
        id: "staff",
        label: "For department staff",
        steps: [
          {
            title: "Cross-department search",
            description:
              "Ask a question once and get answers grounded across every department's files — no more asking five offices for the same thing.",
            icon: Search,
            rows: [
              { label: "Finance policy on capital reserves", meta: "Answered" },
              { label: "HR leave accrual schedule", meta: "Answered" },
            ],
            footnote: "Cited across 2 departments",
          },
          {
            title: "Cross-department memo drafting",
            description:
              "Draft interdepartmental memos and reports in your government's own tone, grounded in prior examples.",
            icon: FileText,
            rows: [{ label: "Budget transfer memo", meta: "Draft" }],
            footnote: "Drafted in your format",
          },
          {
            title: "Policy & procedure lookup",
            description:
              "Find the governing policy for any process, cited to the exact administrative code or manual section.",
            icon: BookOpen,
            rows: [
              { label: "Procurement threshold", meta: "$50,000" },
              { label: "Travel reimbursement", meta: "Policy 4.2" },
            ],
            footnote: "Cited to your admin code",
          },
        ],
      },
      {
        id: "electeds",
        label: "For electeds & leadership",
        steps: [
          {
            title: "A briefing on any citywide topic",
            description:
              "Ask about any initiative and get a synthesized briefing pulling from every department's record.",
            icon: ClipboardList,
            rows: [{ label: "Capital plan status", meta: "On track" }],
            footnote: "Briefing ready — 5 min read",
          },
          {
            title: "Cross-department trend reports",
            description:
              "See how a metric or issue trends across departments and years, with sources.",
            icon: BarChart3,
            rows: [{ label: "Staff turnover, 3-yr trend", meta: "Cited" }],
          },
          {
            title: "Meeting prep across every agenda item",
            description:
              "Walk into any meeting briefed on every item, regardless of which department owns it.",
            icon: Presentation,
            rows: [{ label: "Council agenda, 8 items", meta: "Briefed" }],
            footnote: "Full recap sent to your inbox",
          },
        ],
      },
    ],
  },
  connectors: {
    eyebrow: "Built from data across your gov.",
    title: "Instantly search across every system your city runs.",
    description:
      "Finance, HR, GIS, permitting, records, and more — plus Tyler, Workday, Laserfiche, Granicus and dozens more.",
    items: [
      "Outlook",
      "Exchange",
      "Teams",
      "Workday",
      "Tyler Technologies",
      "Laserfiche",
      "Granicus",
      "Municode",
      "OnBase",
      "CivicPlus",
      "ClearGov",
      "SharePoint",
      "YouTube",
      "eScribe",
      "Other ERP systems",
    ],
  },
  whatYouGet: {
    eyebrow: "What you get",
    title: "One grounded answer, no matter the department.",
    description:
      "From cross-department memos to citywide trend reports, every output is grounded in your government's full record.",
    benefits: [
      {
        icon: CheckCircle2,
        title: "Every answer cited",
        description:
          "Each answer links to the department record, policy, or document behind it — clickable and exportable to PDF.",
      },
      {
        icon: ShieldCheck,
        title: "Your AI, never sharing your data",
        description:
          "Your own tenant, your own keys. Nothing trains outside models and nothing leaves your environment.",
      },
      {
        icon: Building2,
        title: "Grounded across every department",
        description:
          "Finance, HR, public works, the clerk's office and more — one corpus, no siloed systems to reconcile.",
      },
      {
        icon: Layers,
        title: "One platform, every job",
        description:
          "Staff, electeds, and residents work from the same source of truth, tuned to their role.",
      },
    ],
  },
  suite: {
    eyebrow: "The Madison AI platform",
    title: "One platform. Purpose-built models.",
    description:
      "Citywide AI runs on the same grounded record as the rest of the platform. Explore the other models built for your teams.",
    items: [
      {
        title: "Core platform",
        description: "Staff, electeds, and citizens on one grounded record.",
        icon: LayoutGrid,
        href: "/citywide-ai/",
        current: true,
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
      "Book a 60-minute call. We'll walk citywide workflows live, and answer the security questions your IT and legal teams will ask.",
    bullets: [
      "A live walkthrough across every department",
      "How we're protecting your data and privacy",
      "See how we can start saving real time in weeks",
    ],
    submitLabel: "Book Your Demo",
  },
};

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function CitywideAiPrototype() {
  return <PlatformPageTemplate data={DATA} />;
}
