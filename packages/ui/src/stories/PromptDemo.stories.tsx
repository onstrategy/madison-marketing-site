import type { Meta, StoryObj } from "@storybook/react-vite";
import { PromptDemo, type PromptDemoItem } from "@madison/ui/prompt-demo";

const ITEMS: PromptDemoItem[] = [
  {
    id: "staff",
    label: "For staff",
    prompt: "Draft a staff report on the STR permit cap.",
    reply:
      "Pulling your report template, five prior reports, and Ordinance 24-07 — a first draft is ready to edit.",
  },
  {
    id: "electeds",
    label: "For Elected",
    prompt: "Brief me on tonight's agenda.",
    reply:
      "Summarizing all twelve items, the packet, and prior votes — your briefing is ready before the meeting.",
  },
  {
    id: "foia",
    label: "For FOIA Requests",
    prompt: "Process this public records request.",
    reply:
      "Scoping the request, flagging exemptions, and drafting the response letter — ready for your review.",
  },
];

function Avatar() {
  return (
    <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-fg">
      M
    </span>
  );
}

const meta = {
  title: "Primitives/PromptDemo",
  component: PromptDemo,
  tags: ["autodocs"],
  args: {
    items: ITEMS,
    avatar: <Avatar />,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "A frosted-glass assistant demo. Each persona tab types its prompt out (with a blinking caret), then reveals the answer. Self-contained — typing, caret blink, and reduced-motion handling all live inside; pass `items` (the data) and an optional `avatar`.",
          "",
          "**Token bindings:**",
          "- card → `bg-surface/30`, `backdrop-blur-xl`, `shadow-xl`, translucent `--bg-surface` border",
          "- active tab / caret / send → `bg-brand`, `text-brand-fg`",
          "- reply → `text-secondary`",
          "",
          "Designed to float over imagery (hence the frosted background) — the backdrop here stands in for a hero illustration.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof PromptDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center bg-gradient-to-br from-panel via-hover to-app p-10">
      <PromptDemo {...args} className="w-full max-w-md" />
    </div>
  ),
};
