import type { Meta, StoryObj } from "@storybook/react-vite";
import { Logo, LogoMark } from "@madison/ui/logo";

const meta = {
  title: "Primitives/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "The Madison Ai brand logo — real brand artwork, not a placeholder. `Logo` is the full lockup (mark + wordmark); `LogoMark` is the glyph on its own.",
          "",
          "**Token bindings:**",
          "- `LogoMark` (and the lockup's mark) → `text-brand` (Neon Blue `#1479C0`) by default — recolor via `className`",
          "- `Logo` wordmark → `text-primary` — inverts automatically in dark mode",
          "",
          "Wrap `Logo` in an anchor to make it a home link. Neon Blue here is the reserved brand mark, not a status signal.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Logo />,
};

export const MarkOnly: Story = {
  render: () => <LogoMark />,
};

export const AsLink: Story = {
  render: () => (
    <a href="#" className="inline-flex">
      <Logo />
    </a>
  ),
};
