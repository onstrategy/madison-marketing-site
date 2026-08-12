import { requireClientStory } from "../../content/client-stories/collection";
import { ClientStoryPage } from "../../content/client-stories/page";

const story = requireClientStory("city-of-corona");

// The prototype remains the sandbox preview surface. The JSON collection owns
// the public route, metadata, index card, and template data used here and by
// @madison/site's React Router route module.
export default function CityOfCoronaPrototype() {
  return <ClientStoryPage story={story} />;
}
