import { ContentPage } from "../sections/renderer";
import type { WebinarDocument } from "./schema";

export function WebinarPage({ webinar }: { webinar: WebinarDocument }) {
  return (
    <ContentPage
      sections={webinar.sections}
      source={webinar.id}
      activeNavItem="resources"
    />
  );
}
