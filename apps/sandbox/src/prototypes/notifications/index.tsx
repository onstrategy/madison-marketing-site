import { useState } from "react";
import { Mail, MessageSquare, Megaphone, type LucideIcon } from "lucide-react";
import meta from "./meta";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@northwind/ui/card";
import { Separator } from "@northwind/ui/separator";
import { Switch } from "@northwind/ui/switch";

type Channel = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  defaultOn: boolean;
};

const CHANNELS: Channel[] = [
  {
    id: "email",
    icon: Mail,
    title: "Email notifications",
    description: "Account activity, receipts, and security alerts.",
    defaultOn: true,
  },
  {
    id: "sms",
    icon: MessageSquare,
    title: "SMS notifications",
    description: "Time-sensitive alerts sent straight to your phone.",
    defaultOn: false,
  },
  {
    id: "product",
    icon: Megaphone,
    title: "Product updates",
    description: "New features, improvements, and the occasional tip.",
    defaultOn: true,
  },
];

export default function NotificationsPrototype() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CHANNELS.map((channel) => [channel.id, channel.defaultOn])),
  );

  return (
    <div className="min-h-screen bg-app text-primary">
      <div className="mx-auto max-w-2xl space-y-6 px-6 py-16">
        <header className="space-y-2">
          <a
            href="/"
            className="text-sm text-secondary transition-colors hover:text-primary"
          >
            ← All prototypes
          </a>
          <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
          {meta.description ? (
            <p className="text-secondary">{meta.description}</p>
          ) : null}
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification channels</CardTitle>
            <CardDescription>
              Choose how you&apos;d like to hear from us. Changes apply right away.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {CHANNELS.map((channel, i) => {
              const Icon = channel.icon;
              const labelId = `${channel.id}-label`;
              return (
                <div key={channel.id}>
                  {i > 0 ? <Separator /> : null}
                  <div className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-start gap-3">
                      <Icon
                        className="mt-0.5 size-5 shrink-0 text-secondary"
                        aria-hidden
                      />
                      <div className="space-y-1">
                        <p
                          id={labelId}
                          className="text-sm font-medium text-primary"
                        >
                          {channel.title}
                        </p>
                        <p className="text-sm text-secondary">
                          {channel.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={enabled[channel.id] ?? false}
                      onCheckedChange={(next) =>
                        setEnabled((prev) => ({ ...prev, [channel.id]: next }))
                      }
                      aria-labelledby={labelId}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
