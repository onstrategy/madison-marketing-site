import meta from "./meta";
import { Card } from "@northwind/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@northwind/ui/accordion";

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    id: "q1",
    question: "Frequently asked question number one?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "q2",
    question: "Frequently asked question number two?",
    answer:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: "q3",
    question: "Frequently asked question number three?",
    answer:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    id: "q4",
    question: "Frequently asked question number four?",
    answer:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est qui dolorem ipsum quia dolor.",
  },
  {
    id: "q5",
    question: "Frequently asked question number five?",
    answer:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
  },
];

export default function FaqPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-8">
        <header className="space-y-2">
          <a
            href="/"
            className="text-sm text-secondary transition-colors hover:text-primary"
          >
            ← All prototypes
          </a>
          <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
          <p className="text-secondary">{meta.description}</p>
        </header>

        <Card className="overflow-hidden">
          {/* Independent toggles, first question open by default — now powered by the
              promoted @northwind/ui/accordion primitive. */}
          <Accordion type="multiple" defaultValue={["q1"]}>
            {FAQS.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </div>
  );
}
