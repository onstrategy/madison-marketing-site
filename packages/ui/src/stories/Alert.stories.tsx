import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, AlertTitle, AlertDescription } from "@madison/ui/alert";

const meta = {
  title: "Primitives/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A status callout. Color is the signal — the subtle background, soft semantic border, and colored icon carry meaning, while the title/description text stays neutral and readable (neutral-first).",
          "",
          "**Token bindings by variant:**",
          "- `default` → `bg-surface`, `border-default`, icon `text-secondary`",
          "- `info` → `bg-info-subtle`, `border-info/30`, icon `text-info`",
          "- `success` → `bg-success-subtle`, `border-success/30`, icon `text-success`",
          "- `warning` → `bg-warning-subtle`, `border-warning/30`, icon `text-warning`",
          "- `error` → `bg-error-subtle`, `border-error/30`, icon `text-error`",
          "",
          "`AlertTitle` → `text-primary`; `AlertDescription` → `text-secondary`. A default icon is chosen per variant — override with the `icon` prop, or pass `icon={null}` to hide it.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "info", "success", "warning", "error"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        A neutral alert on <code>bg-surface</code> with a default border.
      </AlertDescription>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      <Alert variant="info">
        <AlertTitle>Did you know?</AlertTitle>
        <AlertDescription>Brand tokens are overridable per app.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Deployed</AlertTitle>
        <AlertDescription>Your changes are live on the edge.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>This action will rebuild the index.</AlertDescription>
      </Alert>
      <Alert variant="error">
        <AlertTitle>Build failed</AlertTitle>
        <AlertDescription>2 type errors in packages/ui.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Alert variant="success">
      <AlertTitle>Saved</AlertTitle>
    </Alert>
  ),
};
