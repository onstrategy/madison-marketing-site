import { ShieldCheck, Compass, Sparkles } from "lucide-react";
import {
  ResponsibleAiTemplate,
  type ResponsibleAiData,
} from "../responsible-ai-template/template";

// Responsible AI guide — "How to Develop Your Government's AI Guiding
// Principles," recreated from madisonai.com/resources/
// how-to-develop-your-governments-ai-guiding-principles.
const DATA: ResponsibleAiData = {
  hero: {
    kicker: "Responsible AI",
    title: "How to Develop Your Government's AI Guiding Principles",
    author: "Heyden Enochson",
    date: "August 20, 2024",
  },
  intro: {
    heading: "Why your government needs AI guiding principles.",
    paragraphs: [
      "AI can genuinely accelerate how a government serves its residents — but only if it's adopted responsibly. Guiding principles are the compass that keeps AI use aligned with your organization's values as the technology, and the risks around it, keep evolving.",
      "Without clear principles, AI use inside an organization becomes ungovernable — every team member making their own judgment calls about data, bias, and appropriate use, with no shared standard to fall back on.",
    ],
  },
  reasonsEyebrow: "Why it matters",
  reasonsTitle: "Three reasons to write them down.",
  reasons: [
    {
      icon: Compass,
      title: "Align use with your values",
      description:
        "Written principles keep every team grounded in the organization's actual values as they adopt AI, instead of improvising case by case.",
    },
    {
      icon: ShieldCheck,
      title: "Create real guardrails",
      description:
        "Clear principles protect against the risks that matter most — data exposure, intellectual property exposure, and unmitigated bias.",
    },
    {
      icon: Sparkles,
      title: "Leave room to experiment",
      description:
        "Good principles give teams a clear boundary and the confidence to experiment safely inside it, rather than freezing adoption altogether.",
    },
  ],
  stepsTitle: "Three steps to develop your principles.",
  steps: [
    {
      step: "Step 1",
      title: "Anchor to your current values",
      description:
        "Start from the core values your organization already has — AI principles should extend them, not invent new ones.",
    },
    {
      step: "Step 2",
      title: "Identify your key themes",
      description:
        "Work through the questions that matter most: how you govern data, your stance on open-source AI, what counts as original work, how AI affects roles, and how you prevent bias in your models and datasets.",
    },
    {
      step: "Step 3",
      title: "Synthesize and write the guidelines",
      description:
        "Make each principle clearly written, positive and actionable (what to do, not just what to avoid), and a genuine reflection of your team's shared intentions.",
    },
  ],
  examplesTitle: "How other organizations have written theirs.",
  examples: [
    {
      org: "OnStrategy",
      principles: [
        "Learn from each other",
        "Protect data",
        "Value human work",
        "Encourage experimentation",
        "Avoid unfair bias",
      ],
    },
    {
      org: "Google",
      principles: [
        "Be socially beneficial",
        "Avoid creating or reinforcing unfair bias",
        "Be built and tested for safety",
        "Be accountable to people",
        "Incorporate privacy design principles",
        "Uphold high standards of scientific excellence",
        "Be made available for uses that align with these principles",
      ],
    },
    {
      org: "Salesforce",
      principles: ["Responsible", "Accountable", "Transparent", "Empowering", "Inclusive"],
    },
  ],
  closing: {
    title: "Make it part of your governance process, not a one-time memo.",
    paragraphs: [
      "Writing your guiding principles is a real commitment to responsible innovation — one that works best built with your team, not handed down to it. AI keeps evolving, and staying responsive to those changes is part of the job.",
    ],
  },
  related: [
    { title: "The Free Miro Template to Build Your AI Governance Policy" },
    { title: "16 AI Governance Policy Examples" },
    { title: "AI Governance Blueprint: A Guide to Ethical AI in Local Government" },
  ],
  cta: {
    title: "See it on your own files.",
    description:
      "We'll load Madison with a sample of your records and walk through it live.",
    primaryCta: "Book a demo",
  },
};

export default function AiGuidingPrinciplesPrototype() {
  return <ResponsibleAiTemplate data={DATA} />;
}
