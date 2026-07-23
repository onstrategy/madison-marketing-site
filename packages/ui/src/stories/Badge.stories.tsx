import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@madison/ui/badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A compact label / status primitive.",
          "",
          "**Token bindings by variant:**",
          "- `default` → `bg-brand` / `text-brand-fg`",
          "- `secondary` → `bg-brand-subtle` / `text-brand`",
          "- `destructive` → `bg-error` / `text-error-fg`",
          "- `outline` → `text-primary` + border",
          "",
          "For status, use the semantic triad pattern: `bg-<status>-subtle` + `text-<status>` where `<status>` is `success` | `error` | `warning` | `info` (see the Status story).",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  name: "Status (semantic triads)",
  render: () => (
    <div className="flex flex-wrap gap-4">
      <span className="inline-flex items-center rounded-full bg-success-subtle px-2.5 py-0.5 text-xs font-semibold text-success">
        Success
      </span>
      <span className="inline-flex items-center rounded-full bg-error-subtle px-2.5 py-0.5 text-xs font-semibold text-error">
        Error
      </span>
      <span className="inline-flex items-center rounded-full bg-warning-subtle px-2.5 py-0.5 text-xs font-semibold text-warning">
        Warning
      </span>
      <span className="inline-flex items-center rounded-full bg-info-subtle px-2.5 py-0.5 text-xs font-semibold text-info">
        Info
      </span>
    </div>
  ),
};
