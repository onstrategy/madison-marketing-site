import getAlignedSpread from "./playbook-get-aligned.avif";
import setGuardrailsSpread from "./playbook-set-guardrails.avif";
import startWithYourDataSpread from "./playbook-start-with-your-data.avif";
import {
  LeadMagnetTemplate,
  LEAD_MAGNET_TESTIMONIALS,
  type LeadMagnetData,
} from "../lead-magnet-template/template";

// The gated playbook download, recreated from madisonai.com/playbook.
const DATA: LeadMagnetData = {
  hero: {
    kicker: "Adopt AI safely in just six steps",
    title: "The Practical AI Playbook for California Cities",
    intro: [
      "Built on real-world lessons from California's most innovative jurisdictions, this playbook shows you how to safely fast-track your agency from the initial planning phase to a successful AI deployment.",
    ],
    ctaLabel: "Get the Playbook",
    // The live hero loops these three spreads. Ordered by the playbook's own
    // pagination (pages 4, 7, 13) so the loop walks the framework forwards.
    media: [
      {
        src: getAlignedSpread,
        alt: "Playbook spread for step one, Get Aligned: an effort and impact grid for choosing a first use case",
        width: 3840,
        height: 2160,
      },
      {
        src: setGuardrailsSpread,
        alt: "Playbook spread for step two, Set Guardrails: the five themes your AI guiding principles should address",
        width: 3840,
        height: 2160,
      },
      {
        src: startWithYourDataSpread,
        alt: "Playbook spread for step three, Start With Your Data: common starting points by department",
        width: 3840,
        height: 2160,
      },
    ],
  },
  benefits: [
    {
      title: "Step-by-step",
      description:
        "Realistic timeframes for each milestone so you can confidently plan your AI rollout.",
    },
    {
      title: "Practical",
      description:
        "Real-world examples, testimonials from city leaders and resources ready to be used.",
    },
    {
      title: "100% free",
      description:
        "No strings attached, delivered directly to your inbox in under 60 seconds.",
    },
  ],
  insight: {
    title: "Your agency is more ready than you think.",
    paragraphs: [
      "Many cities delay AI adoption because of the daunting idea of the preparation needed to make the process seamless. For instance, there is a common misconception that a city's data could be too messy to easily clean up.",
      "This playbook busts that myth. The secret isn't cleaning everything; it's knowing exactly which files to feed the AI first. Unlock the six-step framework to get you started on your journey to a highly valuable, easy-to-navigate AI database.",
    ],
  },
  contents: {
    eyebrow: "The 6-step framework",
    items: [
      {
        title: "Get Aligned",
        description:
          "You will be introduced to the “5-Hour Question” exercise and our Effort & Impact Grid that will help your team identify the repetitive tasks eating up time.",
      },
      {
        title: "Set Guardrails",
        description:
          "Discover how to build a concise governance plan focused on data protection, bias prevention, and job security that includes clear accountability rules for staff.",
      },
      {
        title: "Start With Your Data",
        description:
          "Learn the one golden rule of government AI data: only load final, board-adopted versions of documents, never drafts.",
      },
      {
        title: "Pick Your First Win",
        description:
          "Choose a first use case narrow enough to prove value fast — a repetitive, high-volume task with a clear owner and an obvious before-and-after.",
      },
      {
        title: "Train by Doing",
        description:
          "Build staff confidence through hands-on work on real tasks, so the team learns the tool on the job rather than in a one-off training session.",
      },
      {
        title: "Expand When Ready",
        description:
          "Roll out to the next department once the first win holds up, using what you have learned to make each expansion faster than the last.",
      },
    ],
  },
  form: {
    title: "Download the Playbook",
    description: "Delivered directly to your inbox in under 60 seconds.",
    form: "case-study-download",
  },
  testimonialsTitle: "What Local Government Leaders Are Saying",
  testimonials: LEAD_MAGNET_TESTIMONIALS,
  testimonialsLayout: "carousel",
};

export default function PlaybookPrototype() {
  return <LeadMagnetTemplate data={DATA} />;
}
