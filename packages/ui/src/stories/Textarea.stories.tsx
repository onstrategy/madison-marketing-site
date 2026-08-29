import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "@madison/ui/textarea";
import { Label } from "@madison/ui/label";

const meta = {
  title: "Primitives/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Tell us a bit about your team…",
  },
  render: (args) => (
    <div className="w-96">
      <Textarea {...args} />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="How can we help?" />
    </div>
  ),
};

/**
 * `Textarea` carries the `light` class, so the field stays a white well even
 * inside a `dark`-scoped section — the same behaviour as `Input`.
 */
export const OnDarkSection: Story = {
  render: () => (
    <div className="dark w-96 rounded-2xl border border-default bg-panel p-8">
      <div className="space-y-2">
        <Label htmlFor="message-dark">Message</Label>
        <Textarea id="message-dark" placeholder="How can we help?" />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-96">
      <Textarea placeholder="Disabled" disabled />
    </div>
  ),
};
