import {
  LegalPageTemplate,
  LegalLink,
  LegalLabel,
  type LegalPageData,
} from "../legal-page-template/template";

// Terms & Conditions — content supplied directly by the contributor for this
// build and used verbatim (not paraphrased), per the same convention as
// ../turning-your-acfr-into-indicators-gfoa/index.tsx. Two of its links
// point at pages this same build added (Privacy Policy, Contact) — routed
// internally rather than to the external madisonai.com URLs the source text
// gave, since this site now owns those pages itself.
const DATA: LegalPageData = {
  kicker: "Legal",
  title: "Terms & Conditions",
  intro: [
    <>
      Welcome to Madison AI, an AI-driven application built on Microsoft Azure. By accessing or
      using our application, the Licensee agrees to comply with and be bound by the following
      terms and conditions ("Terms"). Please read these Terms carefully. If you do not agree to
      these Terms, you must not use our application.
    </>,
  ],
  sections: [
    {
      heading: "1. Acceptance of Terms",
      paragraphs: [
        <>
          By using Madison AI ("the Application"), the Licensee agrees to these Terms and any
          additional terms and conditions that may apply to specific sections of the Application
          or to products and services available through the Application.
        </>,
      ],
    },
    {
      heading: "2. Use of the Application",
      paragraphs: [
        <LegalLabel label="Permitted Use">
          The Licensee may use the Application for personal or internal business purposes, in
          compliance with these Terms.
        </LegalLabel>,
        <LegalLabel label="Prohibited Use">The Licensee shall not:</LegalLabel>,
      ],
      list: [
        <>Use the Application for any illegal or unauthorized purpose.</>,
        <>
          Attempt to gain unauthorized access to any part of the Application or any other systems
          or networks connected to the Application.
        </>,
        <>Use any automated means (e.g., bots, scripts, etc.) to access the Application.</>,
        <>Modify, adapt, translate, or reverse-engineer any portion of the Application.</>,
        <>Interfere with or disrupt the security, integrity, or performance of the Application.</>,
      ],
    },
    {
      heading: "3. User Account",
      paragraphs: [
        <LegalLabel label="Registration">
          To access the Application, the Licensee must have an authorized Microsoft account with
          Your Company.
        </LegalLabel>,
        <LegalLabel label="Account Security">
          The Licensee is responsible for maintaining the confidentiality of the account
          credentials and for all activities that occur under your account. The Licensee agrees
          to notify us immediately of any unauthorized use of the account.
        </LegalLabel>,
      ],
    },
    {
      heading: "4. Intellectual Property Rights",
      paragraphs: [
        <LegalLabel label="Ownership">
          All intellectual property rights in the Application, including but not limited to
          software, content, text, images, graphics, video, audio, and other materials, are owned
          by Madison AI or its Licensee.
        </LegalLabel>,
        <LegalLabel label="License">
          Madison AI grants the Licensee a limited, non-exclusive, non-transferable, revocable
          license to access and use the Application solely as permitted by these Terms.
        </LegalLabel>,
      ],
    },
    {
      heading: "5. Data & Security",
      paragraphs: [
        <LegalLabel label="User Data">
          The Licensee retains all rights to any data input or upload to the Application ("User
          Data"). The Licensee grants Madison AI a non-exclusive, worldwide, royalty-free license
          to use, host, store, reproduce, modify, create derivative works from, and display User
          Data solely for the purpose of providing and improving the Application.
        </LegalLabel>,
        <LegalLabel label="Third-Party Data">
          The Application may integrate or use data from third-party services. Madison AI is not
          responsible for the content or practices of third-party services.
        </LegalLabel>,
        <LegalLabel label="Microsoft Data Protection">
          The Application is an Azure App compliant with and covered by{" "}
          <LegalLink href="https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy?context=%2Fazure%2Fcognitive-services%2Fopenai%2Fcontext%2Fcontext">
            Microsoft's Data Protection policy
          </LegalLink>
          .
        </LegalLabel>,
        <LegalLabel label="Limits on Madison AI">
          We will not use, or allow anyone else to use, Licensee Data except as the Licensee
          directs. We will use Licensee Data only in order to provide the service to the Licensee
          and only as permitted by applicable law, this Agreement, and our{" "}
          <LegalLink href="/privacy-policy">Privacy Policy, located here</LegalLink>.
        </LegalLabel>,
        <LegalLabel label="Personal Data">
          Madison AI does not collect any personal information.
        </LegalLabel>,
        <LegalLabel label="Selling/Sharing of Data">
          Madison AI does not and will not sell the personal information of its Licensors.
        </LegalLabel>,
        <LegalLabel label="Security Policy and Mutual Confidentiality">
          Madison AI is governed by{" "}
          <LegalLink href="https://www.microsoft.com/licensing/docs/customeragreement">
            Microsoft's Customer Agreement
          </LegalLink>
          .
        </LegalLabel>,
        <LegalLabel label="Protection of Confidential Information">
          The Licensee must use the same degree of care that it uses to protect the
          confidentiality of its own confidential information (but in no event less than
          reasonable care) not to disclose or use any Confidential Information of Madison for any
          purpose outside the scope of this agreement.
        </LegalLabel>,
        <LegalLabel label="Marketing">
          Madison AI may use without Licensee's express written consent Licensee's name, logo and
          related trademarks in any of our marketing for the promotional purpose of highlighting
          that you use Madison AI Services. If Licensee does not want Madison AI to use this
          information, <LegalLink href="/contact">please contact us</LegalLink>.
        </LegalLabel>,
      ],
    },
    {
      heading: "6. Service Level Commitment",
      paragraphs: [
        <LegalLabel label="Technical Support">
          Phone support for the Application is available 9 a.m. to 5 p.m. Pacific Time, Monday
          through Thursday, excluding US national holidays. We accept webform support questions 24
          Hours per Day x 7 Days per Week. Webform responses are provided during phone support
          hours only.
        </LegalLabel>,
        <LegalLabel label="Availability">
          We try to make the Application available 24 hours a day, 7 days a week, except for
          planned down-time for maintenance. The Application is subject to Microsoft's downtime
          and upgrades, which may impact availability from time to time. We will make every effort
          to inform users in advance.
        </LegalLabel>,
      ],
    },
    {
      heading: "7. Fees and Payment",
      paragraphs: [
        <LegalLabel label="Fee">
          Licensee agrees to pay Licensor a total fee ("Annual License Fee"), which includes data
          deployment and annual access to Madison AI. All fees will be billed upon contract
          signing and due net 30.
        </LegalLabel>,
        <LegalLabel label="Usage Tokens">
          The License Fee includes usage tokens with a limit of $250 per month or $3,000 per year.
          Any usage beyond this limit will be tracked but not immediately billed and will be
          subject to adjustment upon renewal as specified in Section 3.3. Tokens are priced at
          cost by Microsoft ($0.005/1,000 input and $0.015/1,000 output){" "}
          <LegalLink href="https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/">
            here
          </LegalLink>
          . (Ex: Each search costs ~ $0.0676 using GTP-4o Regional.) If the Licensee elects not to
          renew the Agreement, any accrued overage fees for the prior term will be invoiced
          following expiration of the then-current term and shall be payable within thirty (30)
          days after the end of such term.
        </LegalLabel>,
        <LegalLabel label="Renewal Adjustment for Usage Fees">
          If the Licensee exceeds the monthly usage limit of $250 or $3,000 for the 12-month
          period, the overage will not incur immediate additional charges. Instead, the Licensor
          will track actual usage throughout the contract term. At the time of annual renewal, the
          License Fee for the upcoming renewal will be adjusted ("trued up") to reflect the
          Licensee's level of usage over the previous term. This ensures that future pricing
          aligns with actual consumption while avoiding unpredictable monthly overage charges. Any
          increase in the License Fee due to the true-up will apply to the subsequent renewal
          period and will be provided to the Licensee 30 days in advance of the renewal date.
        </LegalLabel>,
        <LegalLabel label="Cost of Living Increase">
          Licenses will auto renew with a 3% cost of living increase each year.
        </LegalLabel>,
        <LegalLabel label="AI Model Cost Escalation">
          Upon each annual renewal, the fees under this Agreement may be subject to an increase.
          Any such increase shall be directly proportional to any price increases imposed by
          Microsoft Azure for the software required to support Licensee's use of Madison. The
          Licensor shall notify the Licensee of any increase in fees at least forty-five (45) days
          prior to the renewal date. If Microsoft Azure does not increase its pricing, the fees
          will remain unchanged for the subsequent renewal term.
        </LegalLabel>,
      ],
    },
    {
      heading: "8. Deployment and Data Index Updating",
      paragraphs: [
        <LegalLabel label="Initial Deployment">
          Licensor will deploy the AI Knowledge Assistant in approximately (8) weeks, and it will
          include approximately ten (10) years of data from existing agendas, minutes, and staff
          reports.
        </LegalLabel>,
        <LegalLabel label="Data Index Updates">
          Throughout the Term, Licensor shall update the data pile once monthly to ensure the
          application has access to the most current governmental data to reference.
        </LegalLabel>,
      ],
    },
    {
      heading: "9. Licensee Obligations and Restrictions",
      paragraphs: [
        <LegalLabel label="Compliance with Laws">
          Licensee agrees to use Madison AI in compliance with all applicable laws and
          regulations, including but not limited to all federal and Nevada state laws.
        </LegalLabel>,
        <LegalLabel label="Restriction">
          Licensee shall not and shall not permit any third party to: (a) reverse engineer,
          decompile, or disassemble Madison AI; (b) modify or create derivative works of Madison
          AI; (c) sublicense, lease, rent, or distribute Madison AI to any third party; or (d) use
          Madison AI for any purpose other than as expressly permitted under this Agreement.
        </LegalLabel>,
      ],
    },
    {
      heading: "10. Termination",
      paragraphs: [
        <LegalLabel label="Termination for Convenience">
          Either party may terminate this Agreement for any reason upon thirty (30) days' prior
          written notice to the other party.
        </LegalLabel>,
        <LegalLabel label="Termination for Breach">
          Either party may terminate this Agreement immediately upon written notice if the other
          party breaches any material term or condition of this Agreement and fails to cure such
          breach within thirty (30) days after receiving written notice thereof.
        </LegalLabel>,
        <LegalLabel label="Effect of Termination">
          Upon termination of this Agreement, Licensee shall cease all use of Madison AI. The
          License Fee will be prorated on a monthly basis, net of the initial setup fee and token
          usage to date. Termination shall not relieve Licensee of its obligation to pay any fees
          accrued or payable to Licensor prior to the effective date of termination. If the
          Licensee elects to terminate the Agreement, any accrued overage fees will be invoiced
          and be payable within thirty (30) days. Madison AI will delete all data related to the
          Licensee, to include chat history and backups.
        </LegalLabel>,
      ],
    },
    {
      heading: "11. Warranty Disclaimer",
      paragraphs: [
        <>
          Madison AI and all content is provided to Licensee strictly on an "as is" basis; and all
          conditions, representations, and warranties, whether express, implied, statutory, or
          otherwise, including, without limitation, any implied warranty of merchantability,
          fitness for a particular purpose, or non-infringement of third party rights, or any
          warranties arising out of course of dealing or usage of trade; are hereby disclaimed to
          the maximum extent permitted by applicable law by Madison AI and its licensors.
        </>,
      ],
    },
    {
      heading: "12. Limitation of Liability",
      paragraphs: [
        <LegalLabel label="Limitation">
          Licensor's liability for damages hereunder shall in no event exceed the amount of fees
          paid by licensee to licensor under this agreement. Licensor agrees to indemnify, hold
          harmless and defend Licensee and the employees, officers and agents of Licensee from any
          liabilities, damages, losses, claims, actions or proceedings, including, without
          limitation, reasonable attorneys' fees and costs, to the extent that such liabilities,
          damages, losses, claims, actions or proceedings are caused by the negligence, errors,
          omissions, recklessness or intentional misconduct of Licensor or the employees or agents
          of the Licensor (1) in the performance of the agreement, or (2) which are, or are not,
          based upon or arising out of the professional services of Licensor, to the full extent
          allowed by law.
        </LegalLabel>,
      ],
    },
    {
      heading: "13. General",
      paragraphs: [
        <LegalLabel label="Governing Law and Dispute Resolution">
          This Agreement shall be governed by and construed in accordance with the laws of the
          state in which the Licensee resides, without regard to its conflict of law principles.
          By using Madison AI (Software), the Licensee agrees that any disputes, claims, or
          controversies arising out of or relating to the use of the Software, including but not
          limited to performance, data use, or service-related issues (collectively referred to as
          "Disputes"), will be resolved exclusively through mediation as the initial step in the
          dispute resolution process, in accordance with the laws of the state in which the
          Licensee resides.
        </LegalLabel>,
        <LegalLabel label="Entire Agreement">
          This Agreement constitutes the entire agreement between the parties with respect to the
          subject matter hereof and supersedes all prior or contemporaneous understandings or
          agreements, written or oral, regarding such subject matter.
        </LegalLabel>,
        <LegalLabel label="Amendments">
          No amendment or modification of this Agreement shall be binding unless in writing and
          signed by both parties.
        </LegalLabel>,
        <LegalLabel label="Waiver">
          No waiver of any term or condition of this Agreement shall be deemed a continuing waiver
          or a waiver of any other term or condition.
        </LegalLabel>,
        <LegalLabel label="Severability">
          If any provision of this Agreement is held to be invalid or unenforceable, the remaining
          provisions shall continue in full force and effect.
        </LegalLabel>,
        <LegalLabel label="Assignment">
          Licensee may not assign or transfer its rights or obligations under this Agreement
          without the prior written consent of Licensor and Licensee.
        </LegalLabel>,
      ],
    },
  ],
};

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function TermsAndConditionsPrototype() {
  return <LegalPageTemplate data={DATA} />;
}
