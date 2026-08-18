import { resolveResponsibleAiAsset } from "./assets";
import { findResponsibleAiByPath } from "./collection";

export function responsibleAiRouteData(pathname: string, origin: string) {
  const resource = findResponsibleAiByPath(pathname);
  if (!resource) return null;

  const ogImage = resource.metadata.ogImageAsset
    ? new URL(
        resolveResponsibleAiAsset(resource.metadata.ogImageAsset),
        origin,
      ).toString()
    : undefined;

  return { resource, ogImage };
}
