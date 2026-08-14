import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@madison/ui/tabs";

const meta = {
  title: "Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A tab switcher (Radix Tabs underneath). Two color variants, set once " +
          "on TabsList and picked up by every TabsTrigger inside it: `default` " +
          "(neutral track, bg-hover; active tab lifts to a plain bg-surface " +
          "pill) and `brand` (a blue-toned switcher for light backgrounds — " +
          "pale bg-brand-subtle track with text-brand-accent labels, active " +
          "tab as a solid bg-brand / text-brand-fg pill — the same fill " +
          "pairing as a primary Button). A trigger can still pass its own " +
          "`variant` to override the list's.",
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="w-72 text-sm text-secondary">
        A summary of recent account activity.
      </TabsContent>
      <TabsContent value="activity" className="w-72 text-sm text-secondary">
        A timeline of the last 30 days.
      </TabsContent>
      <TabsContent value="settings" className="w-72 text-sm text-secondary">
        Preferences and notification controls.
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    const overview = canvas.getByRole("tab", { name: "Overview" });
    const activity = canvas.getByRole("tab", { name: "Activity" });
    await expect(overview).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByText("A summary of recent account activity.")).toBeVisible();

    await userEvent.click(activity);
    await expect(activity).toHaveAttribute("aria-selected", "true");
    await expect(overview).toHaveAttribute("aria-selected", "false");
    await expect(canvas.getByText("A timeline of the last 30 days.")).toBeVisible();
  },
};

/**
 * The blue-tone switcher, on a light section — set `variant="brand"` once on
 * TabsList; every TabsTrigger inside picks it up automatically. Designed for
 * exactly this context (a light bg-app/bg-surface section): the pale
 * bg-brand-subtle track and text-brand-accent ink are tuned for AA contrast
 * on light backgrounds, not inside a `dark`-scoped section.
 */
export const Brand: Story = {
  render: () => (
    <div className="rounded-xl bg-app p-8">
      <Tabs defaultValue="webinar">
        <TabsList variant="brand">
          <TabsTrigger value="webinar">AI in Action Webinar</TabsTrigger>
          <TabsTrigger value="responsible">Responsible AI</TabsTrigger>
        </TabsList>
        <TabsContent value="webinar" className="w-80 text-sm text-secondary">
          Session recaps and recordings.
        </TabsContent>
        <TabsContent value="responsible" className="w-80 text-sm text-secondary">
          Guides on ethical, accountable AI use.
        </TabsContent>
      </Tabs>
    </div>
  ),
  play: async ({ canvas }) => {
    const webinar = canvas.getByRole("tab", { name: "AI in Action Webinar" });
    const responsible = canvas.getByRole("tab", { name: "Responsible AI" });
    await expect(webinar).toHaveAttribute("aria-selected", "true");

    await userEvent.click(responsible);
    await expect(responsible).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByText("Guides on ethical, accountable AI use.")).toBeVisible();
  },
};

/** Rounded to a full pill — the shape already used for switchers on the Resources and Platform pages, composed with the brand color variant here. */
export const BrandPill: Story = {
  render: () => (
    <div className="rounded-xl bg-app p-8">
      <Tabs defaultValue="planning">
        <TabsList variant="brand" className="h-auto gap-1 rounded-full p-1.5">
          <TabsTrigger value="planning" className="rounded-full px-5 py-2">
            Planning
          </TabsTrigger>
          <TabsTrigger value="permitting" className="rounded-full px-5 py-2">
            Permitting
          </TabsTrigger>
          <TabsTrigger value="records" className="rounded-full px-5 py-2">
            Records
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  ),
};
