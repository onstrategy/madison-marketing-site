import { describe, expect, it } from "vitest";
import {
  HUBSPOT_FORMS,
  HUBSPOT_PORTAL_ID,
  HUBSPOT_REGION,
  isHubSpotFormName,
} from "../content/forms/hubspot";
import { parseProps } from "../content/sections/hubspot-form";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe("hubspot forms", () => {
  describe("registry", () => {
    it("stores every formId as a HubSpot UUID", () => {
      for (const [name, entry] of Object.entries(HUBSPOT_FORMS)) {
        expect(entry.formId, `formId for "${name}"`).toMatch(UUID_PATTERN);
        expect(entry.description.trim().length).toBeGreaterThan(0);
      }
    });

    it("pins Madison's portal constants", () => {
      expect(HUBSPOT_PORTAL_ID).toBe("54493");
      expect(HUBSPOT_REGION).toBe("na1");
    });

    it("narrows registered names and rejects unknown ones", () => {
      expect(isHubSpotFormName("book-a-demo")).toBe(true);
      expect(isHubSpotFormName("not-a-registered-form")).toBe(false);
    });
  });

  describe("hubspot-form section parseProps", () => {
    it("accepts a registered form name with optional copy", () => {
      const props = parseProps({
        form: "book-a-demo",
        title: "Book a demo today",
        description: "We'll get back to you within one business day.",
      });

      expect(props.form).toBe("book-a-demo");
    });

    it("accepts a bare form reference without copy", () => {
      expect(parseProps({ form: "book-a-demo" })).toEqual({
        form: "book-a-demo",
      });
    });

    it("rejects an unregistered form name and lists what's available", () => {
      expect(() => parseProps({ form: "newsletter-signup" })).toThrow(
        /registered HubSpot form name.*book-a-demo/,
      );
    });

    it("rejects a raw formId where a form name belongs", () => {
      expect(() =>
        parseProps({ form: "0e857ad0-092f-40e8-9baf-14d2aba69006" }),
      ).toThrow(/registered HubSpot form name/);
    });

    it("rejects unknown props", () => {
      expect(() =>
        parseProps({ form: "book-a-demo", portalId: "54493" }),
      ).toThrow();
    });
  });
});
