import {
  FileSignature,
  FileCheck,
  History,
  Search,
  ClipboardList,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Layers,
  LayoutGrid,
  Building2,
  FileSearch,
} from "lucide-react";
import { PlatformPageTemplate, type PlatformPageData } from "../platform-page/template";

// Contracts & Procurement AI — built on the same PlatformPageTemplate as
// Community Development AI; see that prototype's index.tsx for the pattern.
const DATA: PlatformPageData = {
  hero: {
    kicker: "The Madison AI platform",
    title: "AI for Procurement & Contracts",
    description:
      "Madison brings your solicitations, contracts, and vendor history into one AI, so procurement staff and department requesters get grounded, cited answers in seconds.",
    primaryCta: "Book a demo",
    secondaryCta: "How it works",
    card: {
      eyebrow: "Procurement staff, requesters, and leadership.",
      statement: (
        <>
          One AI, <span className="text-brand-accent">grounded</span> in your
          solicitations and contracts.
        </>
      ),
      description:
        "RFPs, RFQs, contracts, amendments, and vendor performance — unified and cited, inside your own tenant.",
    },
  },
  media: {
    title: "Madison AI — Procurement & Contracts",
  },
  howItWorks: {
    eyebrow: "How it works",
    title:
      "Built from your solicitations and contracts to support procurement staff and requesters.",
    description:
      "Procurement staff and department requesters draw on the same grounded contract record. Pick an audience to see the workflows built for each.",
    roles: [
      {
        id: "staff",
        label: "For procurement staff",
        steps: [
          {
            title: "RFP & RFQ drafting",
            description:
              "Draft a solicitation from your own templates and past awards, with the right scope language and evaluation criteria.",
            icon: FileSignature,
            rows: [{ label: "RFP-2025-014 · Fleet maintenance", meta: "Draft" }],
            footnote: "Drafted from 3 prior solicitations",
          },
          {
            title: "Contract & amendment review",
            description:
              "Ask Madison to flag risk clauses, missing terms, or deviations from your standard contract language.",
            icon: FileCheck,
            rows: [
              { label: "Indemnification clause", meta: "Non-standard" },
              { label: "Insurance minimums", meta: "Met" },
            ],
            footnote: "3 flags reviewed",
          },
          {
            title: "Vendor performance lookup",
            description:
              "See a vendor's full history — awards, change orders, and performance notes — before you award again.",
            icon: History,
            rows: [
              { label: "Acme Paving Co.", meta: "4 prior awards" },
              { label: "Change orders", meta: "2" },
            ],
            footnote: "Full vendor timeline",
          },
        ],
      },
      {
        id: "requesters",
        label: "For department requesters",
        steps: [
          {
            title: "Find the right contract, fast",
            description:
              "Ask which contract covers a purchase and Madison points you to the vehicle, terms, and expiration.",
            icon: Search,
            rows: [{ label: "IT hardware purchase", meta: "Covered by MC-2024-08" }],
            footnote: "Cited to the master contract",
          },
          {
            title: "Threshold & policy lookup",
            description:
              "Check purchasing thresholds and required approvals before you start a request.",
            icon: ClipboardList,
            rows: [
              { label: "Purchases under $50,000", meta: "Dept. head approval" },
              { label: "Sole source", meta: "Requires justification" },
            ],
          },
          {
            title: "Requisition status tracking",
            description:
              "Ask where a requisition stands without emailing procurement.",
            icon: Mail,
            rows: [{ label: "REQ-88214", meta: "Pending PO" }],
            footnote: "Updated in real time",
          },
        ],
      },
    ],
  },
  connectors: {
    eyebrow: "Built from data across your gov.",
    title: "Instantly search across every procurement system your city runs.",
    description:
      "Solicitations, contracts, and vendor records — plus Bonfire, OpenGov, Workday, and dozens more.",
    items: [
      "Outlook",
      "Exchange",
      "Teams",
      "Bonfire",
      "OpenGov Procurement",
      "Workday",
      "SharePoint",
      "Laserfiche",
      "DocuSign",
      "Granicus",
      "Municode",
      "OnBase",
      "Other e-procurement systems",
    ],
  },
  whatYouGet: {
    eyebrow: "What you get",
    title: "Procurement answers, grounded in your contract record.",
    description:
      "From RFP drafts to vendor histories, every output is grounded in your solicitations, contracts, and awards.",
    benefits: [
      {
        icon: CheckCircle2,
        title: "Every answer cited",
        description:
          "Each answer links to the solicitation, contract, or amendment behind it — clickable and exportable to PDF.",
      },
      {
        icon: ShieldCheck,
        title: "Your AI, never sharing your data",
        description:
          "Your own tenant, your own keys. Your contracts and vendor data never train outside models.",
      },
      {
        icon: FileSignature,
        title: "Grounded in your contract record",
        description:
          "Every RFP, contract, and amendment your government has ever filed — no drift, no outside content.",
      },
      {
        icon: Layers,
        title: "One platform, every procurement job",
        description:
          "Procurement staff and requesters work from the same source of truth — no siloed systems to reconcile.",
      },
    ],
  },
  suite: {
    eyebrow: "The Madison AI platform",
    title: "One platform. Purpose-built models.",
    description:
      "Procurement & Contracts runs on the same grounded record as the rest of the platform. Explore the other models built for your teams.",
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
      },
      {
        title: "Contracts & Procurement AI",
        description: "Draft, compare, and track solicitations and awards.",
        icon: FileSignature,
        href: "/procurement-contracts-ai/",
        current: true,
      },
    ],
  },
  cta: {
    title: "Get a custom demonstration.",
    description:
      "Book a 60-minute call. We'll walk procurement and contract workflows live, and answer the security questions your IT and legal teams will ask.",
    bullets: [
      "A live walkthrough across procurement and requesters",
      "How we're protecting your data and privacy",
      "See how we can start saving real time in weeks",
    ],
    submitLabel: "Book Your Demo",
  },
};

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function ProcurementContractsAiPrototype() {
  return <PlatformPageTemplate data={DATA} />;
}
