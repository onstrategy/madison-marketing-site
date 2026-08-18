import type { ClientStoryImage, ClientStoryImageInput } from "./image";

const assets = import.meta.glob<string>(
  "./assets/*.{png,jpg,jpeg,webp,avif,pdf}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);

export function resolveClientStoryAsset(asset: string): string {
  const resolved = assets[`./assets/${asset}`];
  if (!resolved) {
    throw new Error(`Client story asset not found: ${asset}`);
  }
  return resolved;
}

export function resolveClientStoryImage(
  image: ClientStoryImageInput,
): ClientStoryImage {
  return {
    url: "asset" in image ? resolveClientStoryAsset(image.asset) : image.url,
    alt: image.alt,
    width: image.width,
    height: image.height,
  };
}
