import {
  buildClientStoryCollection,
  type ClientStoryDocument,
} from "./schema";

const documents = import.meta.glob<unknown>("./entries/*.json", {
  eager: true,
  import: "default",
});

const result = buildClientStoryCollection(
  Object.entries(documents).map(([source, value]) => ({ source, value })),
);

if (!result.ok) {
  throw new Error(
    `Invalid client story collection:\n${result.errors.map((error) => `- ${error}`).join("\n")}`,
  );
}

export const clientStories: ClientStoryDocument[] = result.value;

export function findClientStory(id: string): ClientStoryDocument | undefined {
  return clientStories.find((story) => story.id === id);
}

export function findClientStoryByPath(
  pathname: string,
): ClientStoryDocument | undefined {
  const normalizedPath =
    pathname === "/" ? pathname : `${pathname.replace(/\/+$/, "")}/`;
  return clientStories.find((story) => story.path === normalizedPath);
}

export function requireClientStory(id: string): ClientStoryDocument {
  const story = findClientStory(id);
  if (!story) {
    throw new Error(`Missing client story entry: ${id}`);
  }
  return story;
}
