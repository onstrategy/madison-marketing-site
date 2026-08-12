import { ContentPage } from "../sections/renderer";
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
): { src: string; alt: string; width: number; height: number } {
  return {
    src: resolveLogo(story.card.logoAsset),
    alt: story.card.logoAlt,
    width: story.card.logoWidth,
    height: story.card.logoHeight,
  };
}
