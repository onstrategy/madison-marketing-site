import { ContentPage } from "../sections/renderer";
import type { ResponsibleAiDocument } from "./schema";

export function ResponsibleAiPage({
  resource,
}: {
  resource: ResponsibleAiDocument;
}) {
  return (
    <ContentPage
      sections={resource.sections}
      source={resource.id}
      activeNavItem="resources"
    />
  );
}
