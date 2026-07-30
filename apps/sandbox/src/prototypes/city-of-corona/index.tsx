import { Clock, Database, FileSearch } from "lucide-react";
import { ClientStoryTemplate, type ClientStoryData } from "../client-story-template/template";
import { PHOTOS } from "../landing/photos";
import coronaLogo from "../landing/logos/corona.png";

// City of Corona — the first page built on the shared ClientStoryTemplate.
// A future Client Story (Washoe County, Carson City, …) is just a new object
// like this one; the layout code lives once in ../client-story-template/template.tsx.
// Copy below is reproduced verbatim from the live Madison AI client story
// (madisonai.com/client-stories/city-of-corona), not paraphrased.
const DATA: ClientStoryData = {
  hero: {
    kicker: "Client Story",
    title: "Reclaiming $11,000 in Staff Time Monthly with Instant Institutional Knowledge",
    clientName: "City of Corona",
    agencyType: "City",
    modelsUsed: [
      "Agency-Wide General Assistance Model",
      "Procurement and Contracts Model",
      "Community Development",
    ],
    photo: PHOTOS.govBuildingFlag,
    logo: { src: coronaLogo, alt: "City of Corona, California" },
  },
  intro: {
    headline:
      "How the City of Corona is cutting through administrative complexity, streamlining research, and empowering over 70 active users.",
    paragraphs: [
      "The City of Corona's Chief Information Officer Chris McMasters is one of local government's most forward-thinking voices on AI. He doesn't just see AI as a tool for efficiency. He sees it as a fundamental shift in how cities serve their communities.",
      "When Corona's staff were losing valuable hours navigating decades of scattered records and complex procurement standards, McMasters and his team didn't settle for an incremental fix. They embraced Madison AI and pushed the Madison AI team to build something new: a citywide assistant and a procurement assistant purpose-built for municipal workflows. That collaboration helped shape products that are now helping cities work smarter across California.",
      "McMasters and his team are helping create the future of AI for local government. Not by waiting for it, but by building it alongside the people making the technology.",
    ],
    photo: PHOTOS.govBuildingColumns,
  },
  quote: {
    text: "We have every previous decision and action at our fingertips. It's so powerful, and it's been so helpful.",
    attribution: "Assistant City Manager, City of Corona",
  },
  stats: {
    eyebrow: "Results",
    items: [
      { value: "$11,000", label: "In staff time savings per month (in the first 6 months)" },
      { value: "72", label: "Staff members using Madison AI assistants" },
      { value: "104", label: "Staff hours saved per month" },
      { value: "649", label: "Unique topics asked and answered" },
    ],
  },
  challenge: {
    eyebrow: "The challenge",
    title: "Tackling Administrative Complexity",
    intro:
      "Like many municipalities, the City of Corona faced growing service demands alongside increasing logistical hurdles. With 860 employees serving a population of nearly 157,000, managing the sheer volume of citywide data had become a daily operational bottleneck.",
    items: [
      {
        icon: Clock,
        title: "Elongated Research Times",
        description:
          "City staff were spending significant time manually researching complex procurement standards and reviewing contracts.",
      },
      {
        icon: Database,
        title: "Scattered Historical Data",
        description:
          "Decades of municipal records were spread across multiple departments, making it tedious to track down past decisions.",
      },
      {
        icon: FileSearch,
        title: "Manual Document Retrieval",
        description:
          "Staff were forced to dig through files to draft reports and prepare for council meetings, draining valuable hours.",
      },
    ],
  },
  solution: {
    eyebrow: "The solution",
    title: "Corona's Data, Revolutionized by AI",
    phases: [
      {
        step: "Day 1",
        title: "Pinpointing Operational Friction",
        description:
          "City leadership focused on understanding the specific friction points around citywide governance and procurement to ensure the AI would solve their most pressing needs.",
      },
      {
        step: "Day 60",
        title: "Deployment & Data Integration",
        description:
          "Madison AI deployed custom AI models tailored to the City, rolling out over 30 pre-built agents. To keep information current without manual updates, they implemented weekly auto-indexed data lakes.",
      },
      {
        step: "Day 90",
        title: "Empowering Staff",
        description:
          "Staff began leveraging the new tools to bypass manual research, securing instant answers on contracts, budgets, council decisions, and planning records.",
      },
      {
        step: "Day 120",
        title: "Full Adoption",
        description:
          "The system saw rapid and widespread uptake across departments, reaching 72 active users who engaged the AI systems across 649 unique topics and conversations.",
      },
      {
        step: "Month 6",
        title: "Expanding Capabilities",
        description:
          "Based on the early success of the initial deployment between September 2025 and February 2026, the City is already planning an additional community development assistant.",
      },
    ],
  },
  impact: {
    eyebrow: "The impact",
    title: "Reclaiming 104 Staff Hours Every Month",
    paragraphs: [
      "In just the first six months of deployment, Madison AI completely transformed how the City of Corona manages its data and institutional knowledge. Staff now get instant answers on contracts, budgets, council decisions, and planning records, successfully eliminating tedious manual research and saving staff hours every single month.",
      "This immediate access to critical data freed Corona's staff to focus on what matters most: delivering reliable, high-quality services to their residents.",
    ],
    highlight: "104 hrs reclaimed every month",
  },
  download: {
    title: "Download this case study as a one-page PDF",
    submitLabel: "Download case study",
  },
  cta: {
    title: "Book a demo today",
    description: "Fill in the form below, and our team will get back to you within one business day.",
    primaryCta: "Book a demo",
  },
};

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function CityOfCoronaPrototype() {
  return <ClientStoryTemplate data={DATA} />;
}
