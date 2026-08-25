import {
  Archive,
  Building2,
  CalendarClock,
  FileSearch,
  FileSignature,
  FileText,
  LayoutGrid,
  Mail,
  PackageCheck,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { PlatformPageTemplate, type PlatformPageData } from "../platform-page/template";

// AI for Public Records Requests — built on the same PlatformPageTemplate as
// Community Development AI; see that prototype's index.tsx for the pattern.
//
// Unlike its sibling Platform pages, this one's workflow doesn't split by
// audience — it's a single pipeline that runs request → search → triage →
// release. So it supplies one role rather than three, and the template drops
// the tab bar accordingly.
const DATA: PlatformPageData = {
  hero: {
    kicker: "For records & open-government teams",
    title: "AI for Public Records Requests",
    description:
      "Madison AI reads each request, searches every system you already use, triages results by exemption, and packages a defensible release with citations and a full audit trail your county attorney can stand behind.",
    primaryCta: "Schedule a call",
    secondaryCta: "See how it works",
    card: {
      eyebrow: "Defensible and secure by design.",
      statement: "Fulfill records requests in hours, not weeks, without over- or under-disclosing.",
      description:
        "Every withholding and redaction is tied to a cited exemption. It's all captured automatically: who searched what, what was found, and what was held and why — ready to hand to counsel or the requester.",
    },
  },
  media: {
    title: "Madison AI — Public Records Requests",
    demo: "public-records",
  },
  howItWorks: {
    eyebrow: "How it works",
    title:
      "Reduce your FOIA/PRA fulfillment time by 90% with full compliance and audit logs.",
    description:
      "From the moment a request lands to the second you hit release, Madison AI runs the whole pipeline and keeps a human in control of every call.",
    roles: [
      {
        id: "pipeline",
        label: "The fulfillment pipeline",
        steps: [
          {
            title: "Guided search configuration",
            description:
              "Paste or forward the request in plain language. Madison AI parses what's actually being asked — the people, the topic, the date range, and the record types — and turns it into a precise, scoped search.",
            preview: {
              kind: "request",
              body: "Provide all emails between the City Manager and Commissioner Smith regarding pickleball court funding, plus related contracts and budget memos.",
              meta: "Scoping request · 3 record types · 1 date range",
            },
          },
          {
            title: "Find responsive records across your systems, including email",
            description:
              "Email, document management, archives, agendas, file shares: Madison AI searches them all at once, surfacing responsive material wherever it lives instead of waiting on each department to dig.",
            preview: {
              kind: "rows",
              rows: [
                { icon: Mail, tone: "brand", label: "Outlook", meta: "email & calendars" },
                { icon: FileText, tone: "brand", label: "SharePoint", meta: "documents & sites" },
                { icon: Archive, tone: "brand", label: "Laserfiche", meta: "records archive" },
                { icon: ScrollText, tone: "brand", label: "Granicus", meta: "agendas & minutes" },
              ],
              banner: "Searched 6 systems in one pass",
            },
          },
          {
            title: "AI-assisted analysis and pre-sorting",
            description:
              "Each item is sorted into clear buckets — responsive and ready, privileged, or needs a human look — with the reasoning shown. Your team reviews the calls; nothing releases without a sign-off.",
            preview: {
              kind: "buckets",
              buckets: [
                { tone: "success", label: "Reviewed & ready", count: "14 items" },
                { tone: "warning", label: "Privileged", count: "3 items" },
                { tone: "error", label: "Needs human review", count: "2 items" },
                { tone: "neutral", label: "Out of scope", count: "6 items" },
              ],
            },
          },
          {
            title: "AI-assisted review, redact, and release",
            description:
              "Approve the redactions, and Madison AI applies them, cites the exemption behind each one, and packages a clean release set — ready to send, with the full log attached.",
            preview: {
              kind: "release",
              lines: [
                { width: "72%" },
                { width: "100%" },
                { width: "44%", redacted: true },
                { width: "68%" },
                { width: "88%", redacted: true },
                { width: "52%" },
              ],
              file: { name: "Records.zip", meta: "19 documents · redaction log included" },
            },
          },
        ],
      },
    ],
  },
  connectors: {
    eyebrow: "Connected systems",
    title: "Instantly search and retrieve across your government's systems.",
    description:
      "No migration project, no “first get your data in order.” Madison AI connects to the systems your agency runs today and searches across all of them in one pass.",
    items: [
      "Outlook & Exchange",
      "SharePoint",
      "Laserfiche",
      "Granicus",
      "Barracuda",
      "Google Workspace",
      "Network file shares",
      "OnBase",
      "Municode",
      "CivicPlus",
    ],
    note: "Don't see yours? Most line-of-business systems can be connected during onboarding.",
  },
  whatYouGet: {
    eyebrow: "What you get",
    title: "A release you can defend, every time.",
    description:
      "Madison AI doesn't just find documents. It produces the paper trail that protects your agency.",
    benefits: [
      {
        icon: ScrollText,
        title: "Cited redaction log",
        description:
          "Every redaction and withholding mapped to the specific statutory exemption behind it, exportable alongside the release.",
      },
      {
        icon: ShieldCheck,
        title: "Defensible chain of custody",
        description:
          "A timestamped record of what was searched, found, reviewed, and released, ready for counsel or an appeal.",
      },
      {
        icon: PackageCheck,
        title: "Ready-to-send package",
        description:
          "A clean, organized release set with redactions applied and files named and ordered, ready to send straight to the requester.",
      },
      {
        icon: CalendarClock,
        title: "Deadline visibility",
        description:
          "Track every open request against its statutory clock, so nothing slips past the response window.",
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
    title: "See it run on a real request.",
    description:
      "Book a 30-minute call. We'll walk through the full fulfillment flow on a request type your agency actually handles, and answer the security questions your IT and legal teams will ask.",
    bullets: [
      "A live walkthrough on your kind of request",
      "Straight answers on security, CJIS, and data residency",
      "No pressure, no commitment, just a real look",
    ],
    submitLabel: "Request my call",
  },
};

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function PublicRecordsRequestsAiPrototype() {
  return <PlatformPageTemplate data={DATA} />;
}
