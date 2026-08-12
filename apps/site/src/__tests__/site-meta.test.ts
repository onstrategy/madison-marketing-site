import { describe, expect, it } from "vitest";
import { notFoundMeta, pageMeta } from "../site-meta";

describe("site metadata", () => {
  it("supplies complete default social metadata", () => {
    const metadata = pageMeta(
      { title: "Resources", description: "Madison resources." },
      "/resources/",
      "https://example.com",
    );

    expect(metadata).toContainEqual({
      property: "og:image",
      content: "https://example.com/og-default.png",
    });
    expect(metadata).toContainEqual({
      property: "og:image:alt",
      content: "Madison AI — Dedicated AI for local government",
    });
    expect(metadata).toContainEqual({
      name: "twitter:image",
      content: "https://example.com/og-default.png",
    });
  });

  it("emits structured data through React Router metadata", () => {
    const structuredData = {
      "@context": "https://schema.org",
      name: "Madison AI",
    };

    expect(
      pageMeta(
        { title: "Madison", structuredData },
        "/",
        "https://example.com",
      ),
    ).toContainEqual({ "script:ld+json": structuredData });
  });

  it("keeps explicitly excluded pages and 404s noindexed", () => {
    expect(
      pageMeta(
        { title: "Internal", noindex: true },
        "/internal/",
        "https://example.com",
      ),
    ).toContainEqual({ name: "robots", content: "noindex, nofollow" });
    expect(notFoundMeta()).toContainEqual({
      name: "robots",
      content: "noindex, nofollow",
    });
  });
});
