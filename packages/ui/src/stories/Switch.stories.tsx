import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent } from "storybook/test";
import { Switch } from "@madison/ui/switch";

const meta = {
  title: "Primitives/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An on/off toggle switch, controlled via checked / onCheckedChange. Renders a " +
          "real <button role=\"switch\"> for native focus + keyboard (Space/Enter); label it " +
          "with aria-label / aria-labelledby. Token bindings: track bg-brand (on) / bg-hover " +
          "(off); thumb bg-surface + shadow-sm; focus ring ring-brand at var(--ring-width); " +
          "disabled opacity var(--disabled-opacity); geometry h-6 w-11 rounded-full with a " +
          "size-5 thumb sliding translate-x-5.",
      },
    },
  },
  // Switch is controlled, so the visible stories drive state via render(); these
  // satisfy the required props for the args table / autodocs.
  args: {
    checked: false,
    onCheckedChange: () => {},
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Stateful wrapper — Switch is controlled, so stories own the on/off state. */
function ToggleDemo({
  initialOn = false,
  disabled = false,
  label = "Notifications",
}: {
  initialOn?: boolean;
  disabled?: boolean;
  label?: string;
}) {
  const [on, setOn] = useState(initialOn);
  return (
    <Switch
      checked={on}
      onCheckedChange={setOn}
      disabled={disabled}
      aria-label={label}
    />
  );
}

export const Default: Story = {
  render: () => <ToggleDemo />,
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", { name: "Notifications" });
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  },
};

export const On: Story = {
  render: () => <ToggleDemo initialOn />,
};

export const Disabled: Story = {
  render: () => <ToggleDemo initialOn disabled label="Locked setting" />,
};

const CHANNELS = [
  {
    id: "email",
    title: "Email",
    description: "Receipts and security alerts.",
    initialOn: true,
  },
  {
    id: "sms",
    title: "SMS",
    description: "Time-sensitive alerts.",
    initialOn: false,
  },
  {
    id: "product",
    title: "Product updates",
    description: "New features and tips.",
    initialOn: true,
  },
];

/** Realistic usage: a labeled settings list, each row wired to its own switch. */
function SettingsList() {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CHANNELS.map((channel) => [channel.id, channel.initialOn])),
  );
  return (
    <div className="w-80 space-y-4 rounded-lg border border-default bg-surface p-card">
      {CHANNELS.map((channel) => {
        const labelId = `${channel.id}-row`;
        return (
          <div
            key={channel.id}
            className="flex items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <p id={labelId} className="text-sm font-medium text-primary">
                {channel.title}
              </p>
              <p className="text-sm text-secondary">{channel.description}</p>
            </div>
            <Switch
              checked={state[channel.id] ?? false}
              onCheckedChange={(next) =>
                setState((prev) => ({ ...prev, [channel.id]: next }))
              }
              aria-labelledby={labelId}
            />
          </div>
        );
      })}
    </div>
  );
}

export const SettingsGroup: Story = {
  parameters: { layout: "padded" },
  render: () => <SettingsList />,
};
