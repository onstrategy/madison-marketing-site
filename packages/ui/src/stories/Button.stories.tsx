import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@northwind/ui/button";

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "The primary action primitive. Every variant maps to design tokens — never hardcode colors.",
          "",
          "**Token bindings by variant:**",
          "- `default` → `bg-brand` / `text-brand-fg` (hover `bg-brand/90`)",
          "- `destructive` → `bg-error` / `text-error-fg`",
          "- `success` → `bg-success` / `text-success-fg`",
          "- `warning` → `bg-warning` / `text-warning-fg`",
          "- `outline` → `border-default` + hover `bg-hover`",
          "- `secondary` → `bg-brand-subtle` / `text-brand`",
          "- `ghost` → transparent + hover `bg-hover` / `text-primary`",
          "- `link` → `text-primary`",
          "",
          "Focus ring: `border-brand` + `ring-brand/50`. Sizes: `sm` `default` `lg` `icon` `icon-sm` `icon-lg`.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">Variants</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">
          Semantic outlines & ghosts
        </h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="outline-destructive">Outline Destructive</Button>
          <Button variant="outline-success">Outline Success</Button>
          <Button variant="ghost-destructive">Ghost Destructive</Button>
          <Button variant="ghost-warning">Ghost Warning</Button>
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center p-6">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Search">
        <Search />
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center p-6">
      <Button variant="default">
        <Search /> Search
      </Button>
      <Button variant="success">
        <CheckCircle2 /> Done
      </Button>
      <Button variant="outline-warning">
        <AlertTriangle /> Warning
      </Button>
      <Button variant="ghost-destructive" size="icon" rounded="full" aria-label="Delete">
        <Trash2 />
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center p-6">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};
