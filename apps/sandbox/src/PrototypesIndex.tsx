import { Link } from "react-router-dom";
import type { PrototypeSummary } from "./prototype-registry";

export function PrototypesIndex({
  prototypes,
}: {
  prototypes: PrototypeSummary[];
}) {
  return (
    <div className="min-h-screen bg-app text-primary">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Madison Sandbox
          </h1>
          <p className="text-secondary">
            On-system prototypes. Run{" "}
            <code className="rounded bg-hover px-1.5 py-0.5 text-sm">
              bun run gen:prototype
            </code>{" "}
            to add one — it self-registers here with zero edits.
          </p>
        </header>

        {prototypes.length === 0 ? (
          <p className="mt-10 text-muted">
            No prototypes yet. Generate one to get started.
          </p>
        ) : (
          <ul className="mt-10 space-y-3">
            {prototypes.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/${p.slug}`}
                  className="block rounded-lg border border-default bg-surface p-5 transition-colors hover:border-active hover:bg-hover"
                >
                  <div className="text-lg font-medium text-primary">
                    {p.title}
                  </div>
                  {p.description && (
                    <div className="mt-1 text-sm text-secondary">
                      {p.description}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
