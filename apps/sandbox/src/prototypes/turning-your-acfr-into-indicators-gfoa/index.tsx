import {
  WebinarRecapTemplate,
  type WebinarRecapData,
} from "../webinar-recap-template/template";

// Turning Your ACFR into Indicators, with GFOA — an "AI in Action" session
// recap. Content is Madison's own, supplied directly for this build and used
// here verbatim (not paraphrased) at the contributor's request — see
// ../webinar-recap-template/template.tsx for the reusable shape a future
// recap should follow.
const DATA: WebinarRecapData = {
  hero: {
    kicker: "AI in Action Webinar",
    title: "Turning Your ACFR into Indicators, with GFOA",
    subtitle:
      "Most annual financial reports take months to build, then sit. Nearly half of GFOA members rate the value of that report as neutral or negative.",
  },
  intro:
    "This week on AI In Action, Shayne Kavanagh of GFOA joined Erica Olsen of Madison AI to ask a better question: what if the data inside your ACFR helped your leaders make decisions all year, in language your council already understands? Here's what we covered, including what's working and what's still hard:",
  segments: [
    {
      title: "Three frictions every finance leader knows",
      body: [
        "Public finance carries the same three tensions year after year. Long-term planning is valuable, but a heavy analytical lift, and still, four in ten governments do it with no mandate to. Reserves raise the same question every cycle with no single right answer. And the annual financial report consumes months, then too often goes unread.",
        "Each one follows the same pattern: a core idea that clearly matters, a real-world constraint that gets in the way, and a gap between. That gap is where the right AI can help.",
      ],
      video: "Watch the webinar segment",
    },
    {
      title: "Change the conversation, not just the number",
      body: [
        "Take reserves. When you defend a reserve level as an industry norm, the explanation runs out fast. Reframe it as self-insurance and the whole conversation changes. You're no longer arguing over a percentage. You're weighing real risks and real trade-offs.",
        "Boards engage differently when the question is “what are we protecting against?” instead of “why that number?”",
      ],
      quote: {
        text: "In GFOA's 125-year history, the most popular question every year is what is the right amount of reserves we should have. And the challenge is, it's not one size fits all.",
        attribution: "Shayne Kavanagh, GFOA",
      },
      video: "Watch the webinar segment",
    },
    {
      title: "The Three Clocks",
      body: [
        "GFOA built its financial health framework by asking elected officials what they actually want to know about their finances. The answers sorted into three time horizons:",
      ],
      list: [
        { label: "Annual Clock", description: "Will we end the year in balance?" },
        {
          label: "Trajectory Clock",
          description: "Are we headed in the right direction during my term?",
        },
        {
          label: "Generational Clock",
          description: "What are we handing to the next generation?",
        },
      ],
      quote: {
        text: "These are all temporal questions. They're not money questions, they're time questions.",
        attribution: "Shayne Kavanagh, GFOA",
      },
      video: "Watch the webinar segment",
    },
    {
      title: "From raw reports to council-ready decisions",
      body: [
        "At the AI In Action, we demonstrated this model, which is really an on-demand financial advisor. Here's what makes it work:",
      ],
      list: [
        {
          label: "Accurate extraction first",
          description:
            "Madison pulls the figures from the ACFR, then checks its own work by extracting the numbers around each one and confirming they add up. Reading an ACFR is hard. Getting the data right is the whole game.",
        },
        {
          label: "GFOA expertise on top",
          description: "The exact meaning behind every indicator and guidance where it helps.",
        },
        {
          label: "Comparison that actually fits",
          description:
            "Build a peer group that holds up, tuned by population, growth, region, even by indicator, so you compare what's truly comparable.",
        },
        {
          label: "Outputs you can hand off",
          description:
            "A scorecard across the Three Clocks and a memo for your manager or council, in minutes.",
        },
      ],
      video: "Watch the webinar segment",
    },
  ],
  whyItMatters: {
    title: "Why it matters",
    body: [
      "This is still a proof of concept, and that's the point of the AI In Action. We show what's working and what's hard while it's being built, so you start from a better place.",
      "The bigger opportunity is connecting the reporting process to budgeting and planning. The data is already in your ACFR. The question is whether your leaders can use it. When the Three Clocks open your budget season, a year-end obligation becomes the first question of next year's decisions.",
    ],
  },
  whatsNext: {
    title: "What's next",
    bullets: [
      "Want to see your agency's numbers in it? Madison customers get first access, and we're lining up beta testers now.",
      "GFOA's Three Clocks paper is coming this summer, with a companion piece on folding it into budgeting and planning.",
      "Next AI In Action: Thursday, July 16 (we are taking 7/2 off due to the holiday)",
      "Email us at hello@madisonai.com and we'll send you the session materials.",
    ],
    video: "Full Session Video",
    wistiaId: "vbzd0parx7",
  },
  cta: {
    title: "Want to see your agency's numbers in it?",
    description:
      "Madison customers get first access as we line up beta testers — reach out and we'll send over the session materials.",
    primaryCta: "Book a demo",
    contactEmail: "hello@madisonai.com",
  },
};

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function TurningYourAcfrIntoIndicatorsGfoaPrototype() {
  return <WebinarRecapTemplate data={DATA} />;
}
