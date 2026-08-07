import type { PrototypeMeta } from "../../prototype-registry";

const description =
  "One platform for everyone who runs your community — staff, elected officials, and citizens — built from your own record.";

const meta = {
  title: "Madison",
  // The homepage is the one page whose <title> isn't "<name> — Madison AI", so
  // it carries an explicit seoTitle. Final search-result copy for every page we
  // replace should be carried over from the live site at migration time.
  seoTitle: "Madison AI - Official AI for Local Governments",
  description,
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.madisonai.com/#organization",
        name: "Madison AI, Inc.",
        alternateName: "Madison AI",
        url: "https://www.madisonai.com/",
        logo: "https://www.madisonai.com/favicon.svg",
        founder: {
          "@type": "Person",
          name: "Erica Olsen",
          jobTitle: "CEO",
        },
        sameAs: ["https://www.linkedin.com/company/madison-ai/"],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.madisonai.com/#software-application",
        name: "Madison AI",
        url: "https://www.madisonai.com/",
        description,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: "en",
        provider: {
          "@id": "https://www.madisonai.com/#organization",
        },
        featureList: [
          "Staff report drafting",
          "Planning findings",
          "Procurement memo drafting",
          "Code lookup",
          "Parcel research",
          "RFP drafting",
        ],
        audience: {
          "@type": "Audience",
          audienceType: "Local governments and water districts",
        },
      },
    ],
  },
} satisfies PrototypeMeta;

export default meta;
