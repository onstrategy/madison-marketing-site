import type { ComponentType } from "react";
import type { SectionProps } from "./schema";

export type SectionPropsParser = (input: unknown) => SectionProps;

type DiscoveredSectionModule = {
  default: ComponentType<SectionProps>;
  parseProps?: SectionPropsParser;
};

export type SectionDefinition = {
  Component: ComponentType<SectionProps>;
  parseProps: SectionPropsParser;
};

function isSectionProps(input: unknown): input is SectionProps {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function passthroughProps(input: unknown): SectionProps {
  if (!isSectionProps(input)) {
    throw new Error("section props must be an object");
  }
  return input;
}

export function sectionTypeFromModulePath(path: string): string {
  const match = /^\.\/([^/]+)\/index\.tsx$/.exec(path);
  if (!match?.[1]) {
    throw new Error(`Invalid section module path: ${path}`);
  }
  return match[1];
}

export function buildSectionRegistry(
  modules: Record<string, DiscoveredSectionModule>,
): ReadonlyMap<string, SectionDefinition> {
  const entries = Object.entries(modules).map(([path, module]) => [
    sectionTypeFromModulePath(path),
    {
      Component: module.default,
      parseProps: module.parseProps ?? passthroughProps,
    },
  ] as const);

  return new Map(entries);
}

const modules = import.meta.glob<DiscoveredSectionModule>("./*/index.tsx", {
  eager: true,
});

export const sectionRegistry = buildSectionRegistry(modules);
