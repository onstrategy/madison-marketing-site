import { NotFound } from "../NotFound";
import { notFoundMeta } from "../site-meta";

export function meta() {
  return notFoundMeta();
}

export default function NotFoundRoute() {
  return <NotFound />;
}
