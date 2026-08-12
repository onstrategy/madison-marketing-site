import { createElement } from "react";
import {
  Nav,
  Footer,
  type ActiveNavItem,
} from "../../prototypes/landing/sections";
import { sectionRegistry } from "./registry";
import type { SectionInput, SectionProps } from "./schema";

export type SectionFailureMode = "placeholder" | "throw" | "omit";

type SectionFailureEnvironment = {
  development: boolean;
  browser: boolean;
};

type SectionFailureContext = {
  source: string;
  type: string;
  position: number;
  error?: unknown;
};

export function sectionFailureMode({
  development,
  browser,
}: SectionFailureEnvironment): SectionFailureMode {
  if (development) return "placeholder";
  return browser ? "omit" : "throw";
}

function errorMessage(error: unknown): string | undefined {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return undefined;
}

export function formatSectionFailure({
  source,
  type,
  position,
  error,
}: SectionFailureContext): string {
  const detail = errorMessage(error);
  const prefix = `${source}: section ${position + 1} ("${type}")`;
  return detail ? `${prefix}: ${detail}` : `${prefix}: unsupported section type`;
}

function UnsupportedSection({ context }: { context: SectionFailureContext }) {
  return (
    <section className="border-y border-error bg-error-subtle px-gutter py-12 text-error">
      <div className="mx-auto max-w-6xl font-sans">
        <p className="text-lg font-semibold">Unsupported content section</p>
        <p className="mt-2 text-sm">{formatSectionFailure(context)}</p>
      </div>
    </section>
  );
}

function handleSectionFailure(
  context: SectionFailureContext,
  key: string,
) {
  const mode = sectionFailureMode({
    development: import.meta.env.DEV,
    browser: typeof document !== "undefined",
  });

  if (mode === "throw") {
    throw new Error(formatSectionFailure(context));
  }
  if (mode === "omit") return null;
  return <UnsupportedSection key={key} context={context} />;
}

function parsedSectionProps(
  parseProps: (input: unknown) => SectionProps,
  input: unknown,
): SectionProps {
  const parsed = parseProps(input);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("parseProps must return an object");
  }
  return parsed;
}

export function SectionRenderer({
  sections,
  source,
}: {
  sections: SectionInput[];
  source: string;
}) {
  return sections.map((section, position) => {
    const key = `${section.type}-${position}`;
    const definition = sectionRegistry.get(section.type);
    if (!definition) {
      return handleSectionFailure(
        { source, type: section.type, position },
        key,
      );
    }

    try {
      const props = parsedSectionProps(definition.parseProps, section.props);
      return createElement(definition.Component, { ...props, key });
    } catch (error) {
      return handleSectionFailure(
        { source, type: section.type, position, error },
        key,
      );
    }
  });
}

export function ContentPage({
  sections,
  source,
  activeNavItem,
}: {
  sections: SectionInput[];
  source: string;
  activeNavItem?: ActiveNavItem;
}) {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Nav sectionAware activeNavItem={activeNavItem} />
      <main>
        <SectionRenderer sections={sections} source={source} />
      </main>
      <Footer />
    </div>
  );
}
