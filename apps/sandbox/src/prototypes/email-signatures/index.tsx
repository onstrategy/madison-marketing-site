import { useEffect, useState } from "react";
import { Check, Code2, Copy } from "lucide-react";
import { Button } from "@madison/ui/button";
import { Input } from "@madison/ui/input";
import {
  SIGNATURE_PEOPLE,
  Signature,
  signatureHtml,
  signatureText,
  type SignaturePerson,
} from "./signature";

type CopyState = "idle" | "signature" | "html" | "failed";

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page.

async function copySignature(person: SignaturePerson): Promise<void> {
  const html = signatureHtml(person);
  await navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([signatureText(person)], { type: "text/plain" }),
    }),
  ]);
}

function SignatureCard({ person }: { person: SignaturePerson }) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function handleCopySignature() {
    try {
      await copySignature(person);
      setState("signature");
    } catch {
      setState("failed");
    }
  }

  async function handleCopyHtml() {
    try {
      await navigator.clipboard.writeText(signatureHtml(person));
      setState("html");
    } catch {
      setState("failed");
    }
  }

  return (
    <section
      id={person.slug}
      className="rounded-lg border border-default bg-surface p-5 shadow-sm"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{person.name}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={handleCopySignature}>
            {state === "signature" ? <Check /> : <Copy />}
            {state === "signature" ? "Copied" : "Copy signature"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleCopyHtml}>
            {state === "html" ? <Check /> : <Code2 />}
            {state === "html" ? "Copied" : "Copy HTML"}
          </Button>
        </div>
      </div>
      {state === "failed" ? (
        <p role="alert" className="mb-3 text-sm text-error">
          Your browser blocked copying. Click the page once and try again.
        </p>
      ) : null}
      {/* Fixed 400px, exactly as it will appear in an inbox; scrolls on a phone.
          White behind it, like a mail app's message area, so the rounded corners read true. */}
      <div className="overflow-x-auto rounded-md border border-default bg-plate p-4">
        <Signature person={person} imageBase="/sig-bumceoquwx/" />
      </div>
    </section>
  );
}

export default function EmailSignaturesPrototype() {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? SIGNATURE_PEOPLE.filter(({ name, title }) =>
        `${name} ${title ?? ""}`.toLowerCase().includes(needle),
      )
    : SIGNATURE_PEOPLE;

  return (
    <div className="min-h-screen bg-app text-primary">
      <div className="mx-auto max-w-3xl px-gutter py-16">
        <header className="mb-10 space-y-4">
          <h1 className="font-serif text-4xl font-medium">Email signatures</h1>
          <p className="text-secondary">
            Find your name, click <strong>Copy signature</strong>, then paste it
            into your email app’s signature box. In Gmail that is Settings →
            See all settings → Signature. Use <strong>Copy HTML</strong> if your
            email app asks for code instead.
          </p>
          <p className="text-sm text-muted">
            Details come from the staff contact list. If something on yours is
            wrong or missing, tell us and we’ll update it.
          </p>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Find a name</span>
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or title"
            />
          </label>
        </header>

        <div className="space-y-6">
          {visible.map((person) => (
            <SignatureCard key={person.slug} person={person} />
          ))}
          {visible.length === 0 ? (
            <p className="text-secondary">No one matches “{query}”.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
