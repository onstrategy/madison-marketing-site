import {
  buildResponsibleAiCollection,
  type ResponsibleAiDocument,
} from "./schema";

const documents = import.meta.glob<unknown>("./entries/*.json", {
  eager: true,
  import: "default",
});

const result = buildResponsibleAiCollection(
  Object.entries(documents).map(([source, value]) => ({ source, value })),
);

if (!result.ok) {
  throw new Error(
    `Invalid Responsible AI collection:\n${result.errors.map((error) => `- ${error}`).join("\n")}`,
  );
}

export const responsibleAiResources: ResponsibleAiDocument[] = result.value;

function normalizedPath(path: string): string {
  if (path === "/") return path;
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

export function findResponsibleAiByPath(
  path: string,
): ResponsibleAiDocument | undefined {
  const normalized = normalizedPath(path);
  return responsibleAiResources.find((resource) => resource.path === normalized);
}
