import {
  FileSearch,
  Search,
  Mail,
  ShieldCheck,
  FileCheck,
  ClipboardList,
  CheckCircle2,
  Layers,
  LayoutGrid,
  Building2,
  FileSignature,
} from "lucide-react";
import { PlatformPageTemplate, type PlatformPageData } from "../platform-page/template";

// AI for Public Records Requests — built on the same PlatformPageTemplate as
// Community Development AI; see that prototype's index.tsx for the pattern.
const DATA: PlatformPageData = {
  hero: {
    kicker: "The Madison AI platform",
    title: "AI for Public Records Requests",
    description:
      "Madison brings requests, responsive records, and exemption history into one AI, so records staff and requesters move from intake to response faster and more defensibly.",
    primaryCta: "Book a demo",
    secondaryCta: "How it works",
    card: {
      eyebrow: "Records staff, legal, and requesters.",
      statement: "One AI, grounded in your records-request history.",
      description:
        "Intake, search, redaction history, and response letters — unified and cited, inside your own tenant.",
    },
  },
  media: {
    title: "Madison AI — Public Records Requests",
  },
  howItWorks: {
    eyebrow: "How it works",
    title:
      "Built from your request history to support records staff and legal review.",
    description:
      "Records staff and legal reviewers draw on the same grounded request record. Pick an audience to see the workflows built for each.",
    roles: [
      {
        id: "staff",
        label: "For records staff",
        steps: [
          {
            title: "Scope a request in seconds",
            description:
              "Ask Madison to identify the record types and custodians for an incoming request, grounded in your record map.",
            icon: FileSearch,
            rows: [
              { label: "All emails re: Main St. project, 2023–24", meta: "Scoped" },
            ],
            footnote: "2 custodians identified",
          },
          {
            title: "Search across every system at once",
            description:
              "Search email, case management, and shared drives together instead of one at a time.",
            icon: Search,
            rows: [{ label: "Responsive documents found", meta: "142" }],
            footnote: "Searched 4 systems",
          },
          {
            title: "Draft the response letter",
            description:
              "A drafted response letter citing the records produced and any claimed exemptions.",
            icon: Mail,
            rows: [{ label: "PRA-2025-0312", meta: "Draft" }],
            footnote: "Drafted in your format",
          },
        ],
      },
      {
        id: "legal",
        label: "For legal & compliance",
        steps: [
          {
            title: "Exemption history lookup",
            description:
              "See how a similar request was handled before, with the exemptions claimed and their basis.",
            icon: ShieldCheck,
            rows: [{ label: "Personnel records exemption", meta: "Applied 3x in 2024" }],
            footnote: "Cited to prior determinations",
          },
          {
            title: "Redaction review",
            description:
              "Flag likely-exempt content for review before release, with the statutory basis suggested.",
            icon: FileCheck,
            rows: [
              { label: "SSNs detected", meta: "4" },
              { label: "Attorney-client content", meta: "1 flag" },
            ],
          },
          {
            title: "Deadline & status tracking",
            description:
              "See every open request, its statutory deadline, and where it stands.",
            icon: ClipboardList,
            rows: [{ label: "PRA-2025-0312", meta: "Due in 4 days" }],
            footnote: "3 requests open",
          },
        ],
      },
    ],
  },
  connectors: {
    eyebrow: "Built from data across your gov.",
    title: "Instantly search across every system your records live in.",
    description:
      "Email, case management, shared drives, and more — plus NextRequest, GovQA, Laserfiche and dozens more.",
    items: [
      "Outlook",
      "Exchange",
      "Teams",
      "NextRequest",
      "GovQA",
      "Laserfiche",
      "SharePoint",
      "OnBase",
      "Granicus",
      "Municode",
      "CivicPlus",
      "Other records-request platforms",
    ],
  },
  whatYouGet: {
    eyebrow: "What you get",
    title: "Records answers, grounded in your request history.",
    description:
      "From scoping to response letters, every output is grounded in your government's own record and prior determinations.",
    benefits: [
      {
        icon: CheckCircle2,
        title: "Every answer cited",
        description:
          "Each answer links to the record, exemption determination, or prior request behind it — clickable and exportable to PDF.",
      },
      {
        icon: ShieldCheck,
        title: "Your AI, never sharing your data",
        description:
          "Your own tenant, your own keys. Requester data and records never train outside models.",
      },
      {
        icon: FileSearch,
        title: "Grounded in your request record",
        description:
          "Every prior request, exemption, and response your government has filed — no drift, no outside content.",
      },
      {
        icon: Layers,
        title: "One platform, every records job",
        description:
          "Records staff, legal, and requesters work from the same source of truth — no siloed systems to reconcile.",
      },
    ],
  },
  suite: {
    eyebrow: "The Madison AI platform",
    title: "One platform. Purpose-built models.",
    description:
      "Public Records Requests runs on the same grounded record as the rest of the platform. Explore the other models built for your teams.",
    items: [
      {
        title: "Citywide AI",
        description: "Staff, electeds, and citizens on one grounded record.",
        icon: LayoutGrid,
        href: "/citywide-ai/",
      },
      {
        title: "AI for Public Records Requests",
        description: "Scope, redact, and release requests defensibly.",
        icon: FileSearch,
        href: "/public-records-requests-ai/",
        current: true,
      },
      {
        title: "AI for Community Development",
        description: "Permitting, zoning, and planning, grounded in code.",
        icon: Building2,
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
      "Book a 60-minute call. We'll walk records-request workflows live, and answer the security questions your IT and legal teams will ask.",
    bullets: [
      "A live walkthrough across records staff and legal review",
      "How we're protecting your data and privacy",
      "See how we can start saving real time in weeks",
    ],
  },
};

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function PublicRecordsRequestsAiPrototype() {
  return <PlatformPageTemplate data={DATA} />;
}
