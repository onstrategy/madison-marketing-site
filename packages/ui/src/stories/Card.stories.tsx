import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@northwind/ui/card";
import { Button } from "@northwind/ui/button";
import { Badge } from "@northwind/ui/badge";

const meta = {
  title: "Primitives/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A surface container for grouped content. Composed of `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.",
          "",
          "**Token bindings:**",
          "- `Card` → `bg-surface`, `border-default`, `text-primary`, `shadow-sm`",
          "- `CardDescription` → `text-muted`",
          "",
          "In dark mode `border-default` is very subtle — prefer `border-active` or rely on elevation if a card needs a visible edge. Never hardcode background/border colors.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg">Deployment</CardTitle>
        <CardDescription>Push your changes to production.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-secondary">
        Your project will be deployed to the global edge network. This usually
        takes under a minute.
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Build #1042</CardTitle>
          <Badge variant="secondary">main</Badge>
        </div>
        <CardDescription>Triggered 2 minutes ago.</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="inline-flex items-center rounded-full bg-success-subtle px-2.5 py-0.5 text-xs font-semibold text-success">
          Passing
        </span>
      </CardContent>
    </Card>
  ),
};
