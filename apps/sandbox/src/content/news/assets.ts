const assets = import.meta.glob<string>("./assets/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
  query: "?url",
});

export function resolveNewsAsset(asset: string): string {
  const resolved = assets[`./assets/${asset}`];
  if (!resolved) {
    throw new Error(`News asset not found: ${asset}`);
  }
  return resolved;
}
