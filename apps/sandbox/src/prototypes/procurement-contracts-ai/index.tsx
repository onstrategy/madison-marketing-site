import {
  Building2,
  CheckCircle2,
  FileCheck,
  FileSearch,
  FileSignature,
  FileText,
  History,
  Layers,
  LayoutGrid,
  ShieldCheck,
} from "lucide-react";
import { PlatformPageTemplate, type PlatformPageData } from "../platform-page/template";

// Contracts & Procurement AI — built on the same PlatformPageTemplate as
// Community Development AI; see that prototype's index.tsx for the pattern.
// The hero's animated demo is the solicitation builder in
// ../platform-page/demos/.
const DATA: PlatformPageData = {
  hero: {
    kicker: "The Madison AI platform",
    title: "AI for Procurement & Contracts",
    description:
      "Madison brings your contracts, awards, and procurement policy into one AI, so procurement staff, electeds, and the public can get grounded, cited answers in seconds.",
    primaryCta: "Book a demo",
    secondaryCta: "How it works",
    card: {
      eyebrow: "Procurement staff, department leaders, and the public.",
      statement: "One AI, grounded in your contracts, bids, and policy.",
      description:
        "Past contracts, RFPs/RFQs, your procurement manual, budgets, and grants — unified and cited, inside your own tenant.",
    },
  },
  media: {
    title: "Madison AI — Procurement & Contracts",
    demo: "solicitation",
  },
  howItWorks: {
    eyebrow: "How it works",
    title:
      "Built from your procurement standards, contract data, and awards to support procurement staff, electeds, and the public.",
    description:
      "Procurement staff, elected officials, and the public all draw on the same grounded contract record. Pick an audience to see the workflows built for each.",
    roles: [
      {
        id: "staff",
        label: "For procurement staff",
        steps: [
          {
            title: "Contract & award research",
            description:
              "Ask across every past contract, bid, and award and get a cited answer in seconds — no digging through file shares.",
            preview: {
              kind: "ask",
              question: "Which janitorial vendors have we contracted since 2019?",
              answer:
                "Three awards — ProClean (2019, $412K), Sparkle Co. (2021, $498K), and MetroFacility (2023, current, $610K).",
              cite: "1",
            },
          },
          {
            title: "Draft solicitations in your format",
            description:
              "A first draft RFP, RFQ, or IFB in your template, cross-checked against your manual and prior solicitations.",
            preview: {
              kind: "doc",
              tabs: ["RFP", "RFQ", "IFB"],
              title: "RFP 25-118 · Facility Maintenance",
              bars: ["100%", "90%", "82%", "94%"],
              chips: ["Manual §7.2", "Prior: RFP 21-044"],
            },
          },
          {
            title: "Create clear scopes of work",
            description:
              "A complete, well-structured SOW — deliverables, service levels, and acceptance criteria — from the project record.",
            preview: {
              kind: "checklist",
              title: "Scope of Work",
              subtitle: "RFP 25-118 · Section 3",
              items: [
                "Deliverables & schedule",
                "Service-level requirements",
                "Acceptance criteria",
                "Reporting cadence",
              ],
            },
          },
          {
            title: "Bring your procurement manual to life",
            description:
              "Ask a policy question and get the answer with the exact manual section behind it — thresholds, methods, and rules.",
            preview: {
              kind: "ask",
              question: "What's the threshold for a formal sealed bid?",
              answer: (
                <>
                  Purchases over <b>$50,000</b> require a formal sealed-bid process per your procurement manual.
                </>
              ),
              cite: "§4.1",
            },
          },
        ],
      },
      {
        id: "electeds",
        label: "For electeds",
        steps: [
          {
            title: "Research awards & contracts",
            description:
              "Ask what the city has awarded, to whom, and for how much — answered from the contract record and cited.",
            preview: {
              kind: "rows",
              rows: [
                { icon: FileCheck, tone: "brand", label: "MetroFacility · janitorial", meta: "$610K · 2023" },
                { icon: FileCheck, tone: "brand", label: "Pavement Pros · streets", meta: "$1.2M · 2024" },
                { icon: FileCheck, tone: "brand", label: "DataNet · IT services", meta: "$340K · 2024" },
              ],
              banner: "28 active contracts · $14.6M total",
            },
          },
          {
            title: "Find the voting record for contracts",
            description: "Every prior award vote and motion surfaced, with the source one click away.",
            preview: {
              kind: "rows",
              rows: [
                { icon: History, tone: "brand", label: "MetroFacility award (5/6)", meta: "passed 6–1" },
                { icon: History, tone: "brand", label: "Pavement Pros (3/4)", meta: "passed 7–0" },
                { icon: History, tone: "brand", label: "DataNet award (2/6)", meta: "passed 5–2" },
              ],
            },
          },
          {
            title: "Understand the tradeoffs on approval",
            description: "The staff recommendation and the alternatives laid out plainly before you vote.",
            preview: {
              kind: "recommendation",
              eyebrow: "Recommendation",
              callout: (
                <>
                  Staff recommends <b>MetroFacility</b> — highest score on quality; not the lowest bid.
                </>
              ),
              pro: "Pro: service",
              con: "Con: +8% cost",
            },
          },
        ],
      },
      {
        id: "citizens",
        label: "For citizens",
        steps: [
          {
            title: "Find the voting record for awards",
            description: "Residents see how the body voted on each contract award, grounded in the public record.",
            preview: {
              kind: "rows",
              rows: [
                { icon: History, tone: "brand", label: "MetroFacility award (5/6)", meta: "passed 6–1" },
                { icon: History, tone: "brand", label: "Pavement Pros (3/4)", meta: "passed 7–0" },
                { icon: History, tone: "brand", label: "DataNet award (2/6)", meta: "passed 5–2" },
              ],
            },
          },
          {
            title: "Research previous contracts",
            description:
              "Past and active contracts surfaced in plain language — no request or counter visit needed.",
            preview: {
              kind: "rows",
              rows: [
                { icon: FileText, tone: "brand", label: "ProClean (expired)", meta: "2019 · $412K" },
                { icon: FileText, tone: "brand", label: "Sparkle Co. (expired)", meta: "2021 · $498K" },
                { icon: FileCheck, tone: "brand", label: "MetroFacility (active)", meta: "2023 · $610K" },
              ],
            },
          },
          {
            title: "Submit FOIA requests for POs & contracts",
            description:
              "When a formal request is needed, it's scoped precisely and routed the moment it's submitted.",
            preview: {
              kind: "request",
              body: "All purchase orders and contracts with MetroFacility, 2023 to present.",
              meta: "Records request · scoped · POs + contracts",
            },
          },
        ],
      },
    ],
  },
  connectors: {
    eyebrow: "Built from data across your gov.",
    title: "Instantly search across every procurement system your city runs.",
    description:
      "Contracts, bids, budgets, and grants — plus your ERP, SharePoint, and dozens more systems of record.",
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
    ],
    note: "Other e-procurement systems",
  },
  whatYouGet: {
    eyebrow: "What you get",
    title: "Procurement answers, grounded in source record.",
    description:
      "From contract analysis to draft RFPs, every output is grounded in your bids, your policy, and your record.",
    benefits: [
      {
        icon: CheckCircle2,
        title: "Every answer cited",
        description:
          "Each answer links to the contract, bid, PO, or council vote behind it — clickable and exportable to PDF.",
      },
      {
        icon: ShieldCheck,
        title: "Your AI, never sharing your data",
        description:
          "Your own tenant, your own keys. Your contracts, bids, and policy never train outside models and never leave your environment.",
      },
      {
        icon: FileSignature,
        title: "Grounded in your procurement record",
        description:
          "From past contracts and RFPs to your procurement manual and budgets, Madison answers from your corpus only — no drift, no outside content.",
      },
      {
        icon: Layers,
        title: "One platform, every procurement job",
        description:
          "Procurement staff, department leaders, and the public work from the same source of truth — no siloed systems to reconcile.",
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
        current: true,
      },
    ],
  },
  cta: {
    title: "Get a custom demonstration.",
    description:
      "Book a 60-minute call. We'll walk procurement, elected, and public workflows live, and answer the security questions your IT and legal teams will ask.",
    bullets: [
      "A live walkthrough across all three audiences",
      "How we're protecting your data and privacy",
      "See how we can start saving real time in weeks",
    ],
  },
};

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function ProcurementContractsAiPrototype() {
  return <PlatformPageTemplate data={DATA} />;
}
