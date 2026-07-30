import { Alert, AlertTitle, AlertDescription } from "@madison/ui/alert";

export default function AlertsPrototype() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <div className="mx-auto max-w-2xl px-6 py-16 space-y-6">
        <header className="space-y-2">
          <a
            href="/"
            className="text-sm text-secondary transition-colors hover:text-primary"
          >
            ← Home
          </a>
          <h1 className="text-3xl font-semibold tracking-tight">Alerts</h1>
          <p className="text-secondary">
            Built from the promoted{" "}
            <code className="rounded bg-hover px-1.5 py-0.5 text-sm">
              @madison/ui/alert
            </code>{" "}
            primitive — no inline styles, fully on-token.
          </p>
        </header>

        <div className="space-y-4">
          <Alert variant="info">
            <AlertTitle>Welcome back</AlertTitle>
            <AlertDescription>
              You have 3 prototypes pending review.
            </AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Promotion complete</AlertTitle>
            <AlertDescription>
              Alert is now a real primitive in <code>packages/ui</code> and shows
              up in the Storybook MCP manifest.
            </AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Off-system classes detected</AlertTitle>
            <AlertDescription>
              The promote checklist rewrites shadcn-style classes via
              migration.md before merge.
            </AlertDescription>
          </Alert>
          <Alert variant="error">
            <AlertTitle>Check failed</AlertTitle>
            <AlertDescription>
              Run <code>bun run check</code> locally before opening the PR.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
