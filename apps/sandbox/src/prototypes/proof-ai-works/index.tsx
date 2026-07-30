import { NewsItemTemplate, type NewsItemData } from "../news-item-template/template";

// Newsroom article — "1,204 Hours Reclaimed: Proof AI Works in the Public
// Sector," recreated from madisonai.com/proof-ai-works-in-the-public-sector.
const DATA: NewsItemData = {
  hero: {
    kicker: "Insights",
    title: "1,204 Hours Reclaimed: Proof AI Works in the Public Sector",
    author: "Erica Olsen",
    role: "CEO, Madison AI",
    opener: "There's a lot of noise around AI right now. Big promises, bigger price tags, and not much proof.",
  },
  intro:
    "Generic AI tools drift, struggle to keep data private, and don't understand how a city or county actually operates. Madison was built the other way around — purpose-made for government, from the ground up. Here are three lessons from doing that for real.",
  lessons: [
    {
      title: "AI has to be built for government data",
      paragraphs: [
        "Agencies keep their institutional knowledge spread across 5 to 10 disconnected systems — permitting and planning records, GIS layers, procurement and contracts, public records, council and board documentation, municipal codes, and (soon) ERP and financial data.",
        "Making AI genuinely useful against that mess takes real forward-deployed engineers customizing the solution to each organization, not a one-size-fits-all connector.",
      ],
    },
    {
      title: "The numbers hold up",
      paragraphs: [
        "The Reno-Tahoe Airport Authority's first year with Madison is a clean example of what adoption actually looks like at scale.",
        "Three things made it work: data quality prepared up front, real executive support, and ongoing engagement — not a \"set it and forget it\" rollout.",
      ],
      stats: [
        { value: "52", label: "people using the tool" },
        { value: "1,119", label: "conversations" },
        { value: "1,204", label: "staff hours recovered" },
        { value: "$120,400", label: "in avoided overhead" },
      ],
    },
    {
      title: "It's a partnership, not a handoff",
      paragraphs: [
        "The model is collaboration over turnkey software — working alongside cities and counties like Aspen, Culver City, Fort Myers Beach, Herriman, Grand Prairie, and Carson City, not just shipping them a license.",
      ],
    },
  ],
  closing:
    "You don't have to choose between AI and the real demands of local government — the right partnership gets you both efficiency and cost savings.",
  cta: {
    title: "See it on your own files.",
    description:
      "We'll load Madison with a sample of your records and walk through it live.",
    primaryCta: "Book a demo",
  },
};

export default function ProofAiWorksPrototype() {
  return <NewsItemTemplate data={DATA} />;
}
