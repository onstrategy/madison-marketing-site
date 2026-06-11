import type { Meta, StoryObj } from "@storybook/react-vite";
import { TestimonialCard } from "@northwind/ui/testimonial-card";

const meta = {
  title: "Primitives/TestimonialCard",
  component: TestimonialCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customer testimonial — a quote with an author monogram, name, and role. " +
          "Composes Card/CardContent; neutral-first. Token bindings: surface from Card " +
          "(bg-surface, border-default, shadow-sm); quote glyph text-brand; quote text " +
          "text-secondary; monogram bg-app + border-default + text-primary; name " +
          "text-primary; roleLabel text-muted; optional verified badge text-success; " +
          "spacing gap-6 + p-card.",
      },
    },
  },
  args: {
    quote:
      "Our marketing team ships landing pages without waiting on engineering — and every one is on-brand, because it has to be.",
    name: "Maya Chen",
    roleLabel: "Head of Design, Lumen",
  },
} satisfies Meta<typeof TestimonialCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const Verified: Story = {
  args: { verified: false },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const LongQuote: Story = {
  args: {
    quote:
      "We deleted our second source of truth. Figma reads from the code now, and drift just stopped being something we fight — the whole team moves faster and nothing slips off-brand.",
    name: "Daniel Okoro",
    roleLabel: "Staff Engineer, Patchwork",
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const Grid: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid max-w-5xl gap-6 md:grid-cols-3">
      <TestimonialCard
        quote="Our marketing team ships landing pages without waiting on engineering — and every one is on-brand, because it has to be."
        name="Maya Chen"
        roleLabel="Head of Design, Lumen"
      />
      <TestimonialCard
        quote="We deleted our second source of truth. Figma reads from the code now, and drift just stopped being something we fight."
        name="Daniel Okoro"
        roleLabel="Staff Engineer, Patchwork"
      />
      <TestimonialCard
        quote="I described a pricing page in plain English and reviewed a real pull request an hour later. No redlines, no handoff."
        name="Priya Nair"
        roleLabel="Product Manager, Northstar"
      />
    </div>
  ),
};
