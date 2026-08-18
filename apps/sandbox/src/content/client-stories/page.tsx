import { ContentPage } from "../sections/renderer";
import {
  resolveClientStoryAsset,
  resolveClientStoryImage,
} from "./assets";
import type { ClientStoryImage } from "./image";
import type { ClientStoryDocument } from "./schema";

const logoAssets = import.meta.glob<string>(
  "../../prototypes/landing/logos/*.{png,jpg,jpeg,webp,avif}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);

function resolveLogo(asset: string): string {
  const path = `../../prototypes/landing/logos/${asset}`;
  const resolved = logoAssets[path];
  if (!resolved) {
    throw new Error(`Client story logo asset not found: ${asset}`);
  }
  return resolved;
}

export function ClientStoryPage({ story }: { story: ClientStoryDocument }) {
  return (
    <ContentPage
      sections={story.sections}
      source={story.id}
      activeNavItem="client-stories"
    />
  );
}

export function clientStoryLogo(
  story: ClientStoryDocument,
): { src: string; alt: string; width: number; height: number } | undefined {
  if (!story.card.logo) return undefined;

  return {
    src: resolveLogo(story.card.logo.asset),
    alt: story.card.logo.alt,
    width: story.card.logo.width,
    height: story.card.logo.height,
  };
}

export function clientStoryCardPhoto(
  story: ClientStoryDocument,
): ClientStoryImage {
  return resolveClientStoryImage(story.card.photo);
}

export function clientStoryMetadata(
  story: ClientStoryDocument,
  origin: string,
) {
  const { ogImageAsset, ...metadata } = story.metadata;
  if (!ogImageAsset) return metadata;

  return {
    ...metadata,
    ogImage: new URL(resolveClientStoryAsset(ogImageAsset), origin).toString(),
  };
}
