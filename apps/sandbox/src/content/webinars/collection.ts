import {
  buildWebinarCollection,
  type WebinarDocument,
} from "./schema";

const documents = import.meta.glob<unknown>("./entries/*.json", {
  eager: true,
  import: "default",
});

const result = buildWebinarCollection(
  Object.entries(documents).map(([source, value]) => ({ source, value })),
);

if (!result.ok) {
  throw new Error(
    `Invalid webinar collection:\n${result.errors.map((error) => `- ${error}`).join("\n")}`,
  );
}

export const webinars: WebinarDocument[] = result.value;

function normalizedPath(path: string): string {
  if (path === "/") return path;
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

export function findWebinarByPath(
  path: string,
): WebinarDocument | undefined {
  const normalized = normalizedPath(path);
  return webinars.find((webinar) => webinar.path === normalized);
}
