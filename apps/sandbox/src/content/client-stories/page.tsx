import { Clock, Database, FileSearch, type LucideIcon } from "lucide-react";
import {
  ClientStoryTemplate,
  type ClientStoryData,
} from "../../prototypes/client-story-template/template";
import type {
  ClientStoryChallengeIcon,
  ClientStoryDocument,
} from "./schema";

const logoAssets = import.meta.glob<string>(
  "../../prototypes/landing/logos/*.{png,jpg,jpeg,webp,avif}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);

const challengeIcons: Record<ClientStoryChallengeIcon, LucideIcon> = {
  clock: Clock,
  database: Database,
  "file-search": FileSearch,
};

function resolveLogo(asset: string): string {
  const path = `../../prototypes/landing/logos/${asset}`;
  const resolved = logoAssets[path];
  if (!resolved) {
    throw new Error(`Client story logo asset not found: ${asset}`);
  }
  return resolved;
}

export function toClientStoryData(story: ClientStoryDocument): ClientStoryData {
  const { content } = story;
  return {
    ...content,
    hero: {
      ...content.hero,
      logo: {
        src: resolveLogo(content.hero.logoAsset),
        alt: content.hero.logoAlt,
        width: content.hero.logoWidth,
        height: content.hero.logoHeight,
      },
    },
    challenge: {
      ...content.challenge,
      items: content.challenge.items.map((item) => ({
        ...item,
        icon: challengeIcons[item.icon],
      })),
    },
  };
}

export function ClientStoryPage({ story }: { story: ClientStoryDocument }) {
  return <ClientStoryTemplate data={toClientStoryData(story)} />;
}

export function clientStoryLogo(
  story: ClientStoryDocument,
): ClientStoryData["hero"]["logo"] {
  return {
    src: resolveLogo(story.content.hero.logoAsset),
    alt: story.content.hero.logoAlt,
    width: story.content.hero.logoWidth,
    height: story.content.hero.logoHeight,
  };
}
