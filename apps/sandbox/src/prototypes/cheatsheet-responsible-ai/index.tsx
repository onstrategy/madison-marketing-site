import cheatsheetSnapshot from "./cheatsheet-snapshot.png";
import {
  LeadMagnetTemplate,
  LEAD_MAGNET_TESTIMONIALS,
  type LeadMagnetData,
} from "../lead-magnet-template/template";

// The gated prompting cheat sheet, recreated from
// madisonai.com/cheatsheet-responsible-ai.
const DATA: LeadMagnetData = {
  hero: {
    kicker: "Free local government AI resource",
    title: "Kickstart Your AI Mastery with this Free AI Quickstart Guide",
    intro: [
      "Are you a city manager, CIO, or clerk looking to use AI to speed up your research, analysis, and report creation processes? To do so effectively, you'll want to use detailed prompts that produce optimal results.",
      "Download our one-page cheat sheet to get practical prompting frameworks and checklists guaranteed to give you better output from your AI tools.",
    ],
    ctaLabel: "Get the Guide",
    media: [
      {
        src: cheatsheetSnapshot,
        alt: "A preview of the one-page prompting cheat sheet",
        width: 1400,
        height: 988,
      },
    ],
  },
  benefits: [
    {
      title: "One-pager",
      description: "Concise, practical content that you'll get through in just 4 minutes.",
    },
    {
      title: "100% free, delivered instantly",
      description:
        "No strings attached, delivered directly to your inbox in under 60 seconds.",
    },
  ],
  insight: {
    title: "AI is only as smart as the instructions you give it.",
    paragraphs: [
      "Generic prompts lead to broad, unhelpful answers. With better prompts, your team can reclaim hours spent researching each week, giving them more time to focus on serving their community.",
    ],
  },
  contents: {
    eyebrow: "What's included",
    items: [
      {
        title: "Anatomy of a Great Prompt",
        description:
          "Learn our 4-part framework to generate highly accurate responses for your everyday work, which includes the goal, context, expectations, and source.",
      },
      {
        title: "6 Pro Tips for Government AI",
        description:
          "Turn scattered institutional knowledge into actionable workflows by being specific and verifying information.",
      },
      {
        title: "Ethical Prompting Checklist",
        description:
          "Keep your municipality safe and secure. Get clear guidelines on protecting sensitive information and private data.",
      },
    ],
  },
  form: {
    title: "Download the Guide",
    description: "Delivered directly to your inbox in under 60 seconds.",
    form: "case-study-download",
  },
  testimonialsTitle: "What Local Government Leaders Are Saying",
  testimonials: LEAD_MAGNET_TESTIMONIALS,
};

export default function CheatsheetResponsibleAiPrototype() {
  return <LeadMagnetTemplate data={DATA} />;
}
