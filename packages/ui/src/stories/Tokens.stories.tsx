import type { Meta, StoryObj } from "@storybook/react-vite";
import { StyleGuide } from "@northwind/ui/style-guide";

const meta = {
  title: "Design System/Tokens",
  component: StyleGuide,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof StyleGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tokens: Story = {};
