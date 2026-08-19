const assets = import.meta.glob<string>(
  "./assets/*.{png,jpg,jpeg,webp,avif,pdf}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);

export function resolveWebinarAsset(asset: string): string {
  const resolved = assets[`./assets/${asset}`];
  if (!resolved) {
    throw new Error(`Webinar asset not found: ${asset}`);
  }
  return resolved;
}
