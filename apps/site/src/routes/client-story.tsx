import { data } from "react-router";
import { findClientStory } from "@madison/sandbox/content/client-stories";
import {
  ClientStoryPage,
  clientStoryMetadata,
} from "@madison/sandbox/content/client-stories/page";
import { pageMeta } from "../site-meta";
import { siteOrigin } from "../site-origin.server";
import type { Route } from "./+types/client-story";

export function loader({ params }: Route.LoaderArgs) {
  const story = params.slug ? findClientStory(params.slug) : undefined;
  if (!story) {
    throw data("Client story not found", { status: 404 });
  }
  return { story, origin: siteOrigin() };
}

export function meta({ data: loaderData }: Route.MetaArgs) {
  if (!loaderData) return [];
  return pageMeta(
    clientStoryMetadata(loaderData.story, loaderData.origin),
    loaderData.story.path,
    loaderData.origin,
  );
}

export default function ClientStoryRoute({ loaderData }: Route.ComponentProps) {
  return <ClientStoryPage story={loaderData.story} />;
}
