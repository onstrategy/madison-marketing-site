import { FileText, Building2, Presentation, ClipboardCheck, Sparkles } from "lucide-react";
import { WebinarTemplate, type WebinarData } from "../webinar-template/template";

// AI in Action Webinar — "The Director's Playbook to Put Your AI Assistant to
// Work," recreated from madisonai.com/director-of-ai-assistant.
const DATA: WebinarData = {
  hero: {
    kicker: "AI in Action Webinar",
    title: "The Director's Playbook to Put Your AI Assistant to Work",
    subtitle:
      "Five real work tasks, with downloadable Task Cards for daily use. The core idea: with an AI assistant, you're the director, not the doer — and that takes a different set of skills than doing the task yourself.",
  },
  intro:
    "Rather than polished demos, this session walked through workflows that municipal teams already run every day — presented by executives and planners from cities and counties around the country.",
  tasksEyebrow: "Five real work tasks",
  tasksTitle: "What directing an AI assistant actually looks like.",
  tasks: [
    {
      icon: FileText,
      title: "Legislative history memo",
      description:
        "An assistant city manager in Las Vegas pulled the complete legislative history of Fremont Street through Madison instead of searching SharePoint by hand — then followed up asking about confidence levels and data gaps, and exported the result as email, formatted text, or a Word/PowerPoint doc.",
      quote: {
        text: "Use this as an assistant, not as a Google search box.",
        attribution: "Erica Olsen, Madison AI",
      },
    },
    {
      icon: Building2,
      title: "Approval process letter",
      description:
        "A planner explaining a zoning approval process to a resident had Madison ask clarifying questions first, then worked through the answer step by step — zoning, then process, then a resident-ready letter — with every citation pointing back to code, not council packets.",
    },
    {
      icon: Presentation,
      title: "Council presentation prep",
      description:
        "Using a contested agenda item from Johns Creek, Georgia as the example, Madison pulled prior voting history, flagged where the council was aligned or split, and built a prep checklist — acting as a thinking partner for the meeting, not just a research tool.",
    },
    {
      icon: ClipboardCheck,
      title: "Site plan compliance review",
      description:
        "Golden, Colorado's Planning & Zoning team used an agent to check a site plan against code requirements, flag missing elements, and draft ready-to-send developer correspondence — though geospatial checks still need a human pass.",
    },
    {
      icon: Sparkles,
      title: "On-demand tasks",
      description:
        "Pre-built agents (Code Lookup, Anticipated Questions, Newsletter) give directors a structured, repeatable process. When Madison doesn't have the municipal data it needs, it says so plainly and offers a web search instead — keeping local and external information clearly separated.",
      quote: {
        text: "If you wanna be certain, use one of the pre-built agents.",
        attribution: "Erica Olsen, Madison AI",
      },
    },
  ],
  bestPracticesTitle: "Director skills worth practicing",
  bestPractices: [
    "Ask what data Madison actually has before you start — date ranges, recent transcripts, code updates.",
    "Have Madison ask clarifying questions before it answers.",
    "Reach for a pre-built agent when accuracy matters most; go freeform when you're exploring.",
    "Work through tasks one at a time instead of stacking them.",
    "Check the citation sources, not just the answer.",
    "Ask about confidence levels and what Madison might be missing.",
    "Treat it as a thinking partner: ask what you haven't considered.",
  ],
  cta: {
    title: "See it on your own workflows.",
    description:
      "We'll load Madison with a sample of your records and walk through a real task live.",
    primaryCta: "Book a demo",
  },
};

export default function DirectorOfAiAssistantPrototype() {
  return <WebinarTemplate data={DATA} />;
}
