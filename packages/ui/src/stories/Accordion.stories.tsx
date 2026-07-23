import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@madison/ui/accordion";

const meta = {
  title: "Primitives/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          'A vertically stacked set of collapsible disclosure sections, backed by Radix — keyboard navigation and ARIA wiring are handled for you. Use `type="single"` with `collapsible` for one-open-at-a-time, or `type="multiple"` for independent toggles.',
          "",
          "**Token bindings:**",
          "- `AccordionItem` divider → `border-default` (subtle row divider, `last:border-b-0`)",
          "- `AccordionTrigger` label → `text-primary`; hover → `bg-hover`; focus ring → `ring-brand/50` (inset)",
          "- Chevron icon → `text-secondary`, rotates 180° while `data-[state=open]`",
          "- `AccordionContent` body → `text-secondary`",
          "",
          "Compose as `Accordion > AccordionItem (value) > AccordionTrigger + AccordionContent`.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const FAQS = [
  {
    value: "what",
    question: "What is Madison?",
    answer:
      "An AI-native, code-first design system kit. Code is the single source of truth for design tokens and components.",
  },
  {
    value: "who",
    question: "Who can contribute?",
    answer:
      "Anyone — designers, PMs, and marketing ship real components through Claude Code, made safe by governance-as-code.",
  },
  {
    value: "how",
    question: "How does a prototype become official?",
    answer:
      "A validated prototype is promoted into a packages/ui primitive through a draft PR that an engineer reviews.",
  },
];

export const Single: Story = {
  args: { type: "single" },
  render: () => (
    <Accordion
      type="single"
      collapsible
      defaultValue="what"
      className="mx-auto max-w-2xl"
    >
      {FAQS.map((faq) => (
        <AccordionItem key={faq.value} value={faq.value}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: { type: "multiple" },
  render: () => (
    <Accordion
      type="multiple"
      defaultValue={["what", "how"]}
      className="mx-auto max-w-2xl"
    >
      {FAQS.map((faq) => (
        <AccordionItem key={faq.value} value={faq.value}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
