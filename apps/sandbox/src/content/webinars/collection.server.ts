import { resolveWebinarAsset } from "./assets";
import { findWebinarByPath } from "./collection";

export function webinarRouteData(pathname: string, origin: string) {
  const webinar = findWebinarByPath(pathname);
  if (!webinar) return null;

  const ogImage = webinar.metadata.ogImageAsset
    ? new URL(resolveWebinarAsset(webinar.metadata.ogImageAsset), origin).toString()
    : undefined;

  return { webinar, ogImage };
}
