import {
  LegalPageTemplate,
  LegalLink,
  LegalLabel,
  type LegalPageData,
} from "../legal-page-template/template";

// Privacy Policy — content supplied directly by the contributor for this
// build and used verbatim (not paraphrased), per the same convention as
// ../turning-your-acfr-into-indicators-gfoa/index.tsx.
const DATA: LegalPageData = {
  kicker: "Legal",
  title: "Privacy Policy",
  intro: [
    <>
      Thank you for using Madison AI, an AI-driven application built on Microsoft Azure. Your
      privacy is important to us, and this Privacy Policy explains how we collect, use, disclose,
      and protect your information. By using Madison AI, you agree to the collection and use of
      your information in accordance with this Privacy Policy and the{" "}
      <LegalLink href="https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA">
        Microsoft Products and Services Data Protection Addendum
      </LegalLink>
      .
    </>,
  ],
  sections: [
    {
      heading: "1. Overview",
      paragraphs: [
        <>
          Madison AI ("the Application") is powered by Microsoft Azure, and as such, it operates
          under the Microsoft Products and Services Data Protection Addendum. This Privacy Policy
          explains additional details about how Madison AI ("we", "us", or "our") handles your
          data when you use our Application.
        </>,
      ],
    },
    {
      heading: "2. Information We Collect",
      paragraphs: [
        <>When you use the Application, we may collect the following types of information:</>,
      ],
      list: [
        <LegalLabel label="Email">
          We may collect user email addresses for authentication processes.
        </LegalLabel>,
        <LegalLabel label="Openid">
          We may collect openid information from Microsoft for authentication and user sign in.
        </LegalLabel>,
        <LegalLabel label="Microsoft Profile">
          We may collect profile information from Microsoft for authentication.
        </LegalLabel>,
        <LegalLabel label="Usage Data">
          Information about how you interact with the Application, including but not limited to,
          your IP address, browser type, operating system, pages visited, time and date of your
          visit, and other diagnostic data.
        </LegalLabel>,
        <LegalLabel label="Usage User-Provided Content">
          Any information, text, images, or other content that you upload while using the
          Application.
        </LegalLabel>,
        <LegalLabel label="Usage Chat History">
          Prompts you use to generate content and your sentiment about the quality of the
          response.
        </LegalLabel>,
      ],
    },
    {
      heading: "3. How We Use Your Information",
      paragraphs: [
        <>
          Our website may use cookies and similar tracking technologies to enhance your
          experience. Cookies are small files stored on your device that collect data about your
          browsing behavior. You can configure your browser to block cookies, but this may impact
          certain functionalities of our website.
        </>,
      ],
    },
    {
      heading: "4. Disclosure of Your Information",
      paragraphs: [
        <>
          Our website may use cookies and similar tracking technologies to enhance your
          experience. Cookies are small files stored on your device that collect data about your
          browsing behavior. You can configure your browser to block cookies, but this may impact
          certain functionalities of our website.
        </>,
      ],
    },
    {
      heading: "Contact Us",
      paragraphs: [
        <>
          If you have any questions or concerns about our Privacy Policy, please contact us at{" "}
          <LegalLink href="mailto:Justine Sincra@email.com">Justine Sincra@email.com</LegalLink>.
        </>,
      ],
    },
  ],
};

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function PrivacyPolicyPrototype() {
  return <LegalPageTemplate data={DATA} />;
}
