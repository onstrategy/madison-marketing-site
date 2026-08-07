import { describe, expect, it } from "vitest";
import {
  isStructuredData,
  socialImageMetadata,
  stripAuditRobotsMeta,
  structuredDataTag,
} from "../prerender-metadata";

describe("prerender metadata", () => {
  describe("isStructuredData", () => {
    it("accepts nested JSON-compatible structured data", () => {
      expect(
        isStructuredData({
          "@context": "https://schema.org",
          name: "Madison AI",
          offers: [{ price: 0, available: true }],
        }),
      ).toBe(true);
    });

    it("rejects values that JSON-LD cannot represent", () => {
      expect(isStructuredData({ run: () => "not JSON" })).toBe(false);
      expect(isStructuredData(undefined)).toBe(false);
    });
  });

  describe("stripAuditRobotsMeta", () => {
    it("removes the site-wide robots directive", () => {
      const template = '<head>\n<meta name="robots" content="noindex, nofollow" />\n</head>';
      expect(stripAuditRobotsMeta(template)).toBe("<head>\n</head>");
    });

    it("fails loudly when the template no longer matches", () => {
      expect(() => stripAuditRobotsMeta("<head></head>")).toThrow(
        "could not strip the site-wide robots meta",
      );
    });
  });

  describe("socialImageMetadata", () => {
    it("supplies complete metadata for the verified default image", () => {
      expect(socialImageMetadata(undefined, "https://example.com")).toEqual({
        url: "https://example.com/og-default.png",
        alt: "Madison AI — Dedicated AI for local government",
        width: 1200,
        height: 630,
      });
    });

    it("does not attach default metadata to a page-specific image", () => {
      expect(
        socialImageMetadata("https://cdn.example.com/page.png", "https://example.com"),
      ).toEqual({ url: "https://cdn.example.com/page.png" });
    });
  });

  describe("structuredDataTag", () => {
    it("escapes markup that could terminate the JSON-LD script", () => {
      expect(structuredDataTag({ name: "</script>" })).toContain(
        "\\u003c/script>",
      );
    });
  });
});
