import {
  ShieldCheck,
  Landmark,
  Cloud,
  Lock,
  Server,
  MapPin,
  KeyRound,
  Eraser,
  Cpu,
  Layers,
  HeartHandshake,
  Eye,
  History,
  UserCheck,
  HeartPulse,
  FileCheck,
  GraduationCap,
  ArrowRight,
  Download,
} from "lucide-react";
import { Button } from "@madison/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@madison/ui/accordion";
import { Nav, Footer, ClientLogos } from "../landing/sections";
import { Reveal, Eyebrow, SectionHeading } from "../landing/parts";

// ============================================================================
// Security — recreated from madisonai.com/security. Structure and section
// order match the live page; body copy is paraphrased from the source
// (condensed, not verbatim) rather than reproduced wholesale. Built entirely
// from existing primitives + the landing prototype's shared Nav/Footer/
// ClientLogos and Reveal/Eyebrow/SectionHeading parts.
// ============================================================================

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "SOC 2 Type II", desc: "Independently audited annually." },
  { icon: Landmark, title: "GovAI Coalition", desc: "Founding member." },
  { icon: Cloud, title: "Microsoft Azure", desc: "Enterprise cloud partner." },
  { icon: Lock, title: "Dedicated isolation", desc: "A separate environment per customer." },
];

const INFRASTRUCTURE_CARDS = [
  {
    icon: Server,
    title: "Dedicated per customer",
    description:
      "Every agency gets its own isolated environment — separate data stores, separate search indexes, separate processing. Never shared infrastructure between clients.",
  },
  {
    icon: MapPin,
    title: "U.S. Azure regions only",
    description:
      "Storage, search, and AI processing all stay inside U.S.-based Azure commercial cloud regions. No offshore processing, no third-party routing.",
  },
  {
    icon: KeyRound,
    title: "Your identity, your policies",
    description:
      "Staff sign in through your existing Microsoft Entra ID, so your MFA, conditional access, and role-based policies carry straight into Madison.",
  },
];

const DATA_PROMISES = [
  {
    icon: Eraser,
    title: "PII scrubbed on entry",
    description:
      "Data only enters through secure, authenticated channels — SharePoint connectors, secure transfer, or direct upload — and is screened for personally identifiable information the moment it arrives.",
  },
  {
    icon: Cpu,
    title: "Enterprise AI models only",
    description:
      "AI runs exclusively on Microsoft Azure's enterprise services. Your data never touches a consumer endpoint, never trains a model, and is never retained by the model provider.",
  },
  {
    icon: Layers,
    title: "Separated and cited",
    description:
      "Agency data, your staff's own work, and the broader web stay in clearly separated layers — and every answer tells you exactly where it came from.",
  },
  {
    icon: HeartHandshake,
    title: "You own it. We never will.",
    description:
      "We're a service provider, not a data company — we don't sell, share, or monetize your information. If you ever leave, we securely delete everything and confirm it in writing.",
  },
];

const OBSERVABILITY_FEATURES = [
  {
    icon: Eye,
    title: "Every answer is traceable",
    description:
      "Madison grounds every response in your own documents and cites its sources — nothing pulled from general internet knowledge — so your team can verify any answer against the original record.",
  },
  {
    icon: History,
    title: "Full audit trail",
    description:
      "Every chat and response is saved for compliance, FOIA, or internal review, under a retention policy you control.",
  },
  {
    icon: UserCheck,
    title: "AI assists, humans decide",
    description:
      "Madison never publishes, executes, or enforces anything on its own — a staff member always reviews before an output goes anywhere. By design, not by limitation.",
  },
];

const COMPLIANCE_CERTS = [
  { icon: ShieldCheck, title: "SOC 2 Type II", status: "Completed" },
  { icon: HeartPulse, title: "HIPAA eligible", status: "Azure HIPAA-eligible services" },
  { icon: FileCheck, title: "NIST 800-53", status: "Aligned, selected controls" },
  { icon: Landmark, title: "FedRAMP Moderate", status: "Inherited via Microsoft Azure" },
];

const RESOURCES = [
  {
    title: "How to Develop Your Government's AI Guiding Principles",
    description: "A 4-step blueprint for bringing AI into your government ethically.",
  },
  {
    title: "How to Select Your AI Governance Structure",
    description: "A practical framework for structuring AI oversight and ownership.",
  },
  {
    title: "AI Governance Blueprint: A Guide to Ethical AI in Local Government",
    description: "A 4-step blueprint for bringing AI into your government ethically.",
  },
];

const FAQS = [
  {
    id: "train",
    question: "Does our data train AI models?",
    answer:
      "No. Your data is never used to train, fine-tune, or improve any AI model — not by Madison, not by Microsoft, not by anyone. This is enforced at the infrastructure level through our Microsoft Azure enterprise agreement, not just a policy promise.",
  },
  {
    id: "leave",
    question: "What happens to our data if we leave?",
    answer:
      "Everything in your dedicated environment — documents, interactions, outputs — is securely deleted. You can export it all first, and we confirm the deletion in writing once it's complete.",
  },
  {
    id: "access",
    question: "Who at Madison can access our data?",
    answer:
      "No one, without your explicit written approval. When access is needed for a support issue, it's time-limited, logged, and revoked immediately after. Your data is your data — we don't browse it.",
  },
  {
    id: "accuracy",
    question: "How do we know the AI's answers are accurate?",
    answer:
      "Every response cites its source documents so your staff can verify before they act. When someone flags an inaccurate answer, a real member of our team reviews the feedback and makes a targeted improvement — no automated black box.",
  },
];

function HeroSection() {
  return (
    <section className="dark border-b border-default bg-app px-gutter pb-24 pt-28 lg:px-0 lg:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-brand-accent">Security &amp; Trust</Eyebrow>
          <h1 className="mb-6 text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            Responsible by design.
          </h1>
          <p className="text-pretty text-lg text-secondary">
            The communities you serve deserve AI built with the same care your team brings to its
            work — starting with how we handle your data, protect your environment, and earn your
            trust.
          </p>
        </Reveal>
      </div>
      <div className="mx-auto mt-14 max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_BADGES.map((badge, i) => (
            <Reveal key={badge.title} delay={100 + i * 60}>
              <div className="flex h-full items-center gap-3 rounded-xl border border-active bg-surface p-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-brand-accent">
                  <badge.icon className="size-4" />
                </span>
                <div>
                  <div className="font-sans text-sm font-semibold text-primary">{badge.title}</div>
                  <div className="text-xs text-secondary">{badge.desc}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfrastructureSection() {
  return (
    <section className="border-b border-default bg-app px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            title="Built on Azure. Isolated by design."
            blurb="Madison runs entirely on Microsoft Azure, with dedicated resources for every agency. Your environment never shares data stores, search indexes, or processing with another customer — by default, not as a paid upgrade."
            className="mb-12 max-w-2xl"
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {INFRASTRUCTURE_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-default bg-surface p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-fg">
                  <card.icon className="size-4" />
                </span>
                <h3 className="mt-4 font-sans text-xl font-semibold tracking-tight text-primary">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary">{card.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DataProtectionSection() {
  return (
    <section className="border-b border-default bg-surface px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow className="mb-6">Our promise</Eyebrow>
          <h2 className="mb-6 max-w-2xl text-balance text-4xl font-medium tracking-tight text-primary">
            What happens to your data.
          </h2>
          <p className="mb-12 max-w-2xl text-pretty text-lg text-secondary">
            Every document, query, and AI output that enters Madison is protected at every stage.
            Here&rsquo;s how.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {DATA_PROMISES.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-default bg-app p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-fg">
                  <item.icon className="size-4" />
                </span>
                <h3 className="mt-4 font-sans text-xl font-semibold tracking-tight text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ObservabilitySection() {
  return (
    <section className="border-b border-default bg-app px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            title="You see everything. We hide nothing."
            blurb="Every interaction, every output, every piece of feedback is logged, traceable, and available whenever you need it."
            className="mb-12 max-w-2xl"
          />
        </Reveal>
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          {OBSERVABILITY_FEATURES.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-default bg-surface p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-fg">
                  <item.icon className="size-4" />
                </span>
                <h3 className="mt-4 font-sans text-xl font-semibold tracking-tight text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={180}>
          <div className="dark rounded-2xl bg-app p-8 lg:p-10">
            <h3 className="max-w-xl text-balance font-serif text-2xl font-medium tracking-tight text-primary">
              Real people review every piece of feedback.
            </h3>
            <p className="mt-3 max-w-2xl text-pretty text-secondary">
              When your staff flags a bad answer, it doesn&rsquo;t vanish into an algorithm —
              someone on our team reads it, diagnoses the issue, and makes a targeted fix.
              That&rsquo;s how Madison gets smarter every week.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ComplianceSection() {
  return (
    <section className="border-b border-default bg-surface px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            title="The bar is high. We get it."
            blurb="You need infrastructure you can defend in a council meeting, justify to an auditor, and trust with decades of institutional knowledge."
            className="mb-12 max-w-2xl"
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COMPLIANCE_CERTS.map((cert, i) => (
            <Reveal key={cert.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-default bg-app p-6 text-center">
                <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-brand-subtle text-brand-accent">
                  <cert.icon className="size-5" />
                </span>
                <div className="mt-4 font-sans text-lg font-semibold tracking-tight text-primary">
                  {cert.title}
                </div>
                <p className="mt-1.5 text-sm text-secondary">{cert.status}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResourcesSection() {
  return (
    <section className="border-b border-default bg-app px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading title="Watch our training on responsible AI" className="mb-12 max-w-2xl" />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {RESOURCES.map((resource, i) => (
            <Reveal key={resource.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-default bg-surface p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-subtle text-brand-accent">
                  <GraduationCap className="size-4" />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-primary">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{resource.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="border-b border-default bg-surface px-gutter py-30">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading
            title="Questions we hear in every evaluation."
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
        </Reveal>
        <Reveal delay={60}>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left text-base font-semibold text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-secondary">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="dark bg-app px-gutter py-30 text-center">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="mb-4 text-balance text-4xl font-medium tracking-tight text-primary">
            See what responsible AI looks like in practice.
          </h2>
          <p className="mb-8 text-pretty text-lg text-secondary">
            We&rsquo;re happy to walk your IT team through our architecture, complete a security
            questionnaire, or connect you with a customer who&rsquo;s already been through the
            evaluation.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Button size="lg" asChild>
              <a href="#top">
                Schedule a security review <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#top">
                Vendor fact sheet <Download className="size-4" />
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function SecurityPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware />
      <main>
        <HeroSection />
        <InfrastructureSection />
        <DataProtectionSection />
        <ObservabilitySection />
        <ComplianceSection />
        <ResourcesSection />
        <FaqSection />
        <FinalCtaSection />
        <ClientLogos />
      </main>
      <Footer />
    </div>
  );
}
