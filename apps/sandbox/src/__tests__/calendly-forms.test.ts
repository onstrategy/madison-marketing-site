import { describe, expect, it } from "vitest";
import { TOKENS } from "@madison/ui/tokens";
import {
  CALENDLY_PRIMARY_COLOR,
  CALENDLY_ROUTING_FORMS,
  isCalendlyRoutingName,
} from "../content/forms/calendly";

// Calendly's snippet gives the routing form as a submissions endpoint whose
// last path segment is the routing form's UUID.
const SUBMISSIONS_URL_PATTERN =
  /^https:\/\/calendly\.com\/api\/form_builder\/forms\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/submissions$/;

describe("calendly routing forms", () => {
  describe("registry", () => {
    it("stores every routing form as a Calendly submissions endpoint", () => {
      for (const [name, entry] of Object.entries(CALENDLY_ROUTING_FORMS)) {
        expect(entry.submissionsUrl, `submissionsUrl for "${name}"`).toMatch(
          SUBMISSIONS_URL_PATTERN,
        );
        expect(entry.description.trim().length).toBeGreaterThan(0);
      }
    });

    it("narrows registered names and rejects unknown ones", () => {
      expect(isCalendlyRoutingName("security-review-routing")).toBe(true);
      expect(isCalendlyRoutingName("not-a-routing-form")).toBe(false);
    });
  });

  describe("modal branding", () => {
    // Calendly's modal is a third-party iframe our stylesheet can't reach, so
    // its one styling hook is fed a literal hex. This is the drift guard: if
    // --brand-primary moves in the token dictionary and this doesn't, the
    // modal quietly stops matching the site.
    it("matches the --brand-primary token, as a bare hex", () => {
      const brandPrimary = TOKENS.brand.find(
        (token) => token.name === "--brand-primary",
      );

      expect(brandPrimary).toBeDefined();
      expect(CALENDLY_PRIMARY_COLOR).toMatch(/^[0-9A-Fa-f]{6}$/);
      expect(`#${CALENDLY_PRIMARY_COLOR}`.toLowerCase()).toBe(
        brandPrimary?.light.toLowerCase(),
      );
    });
  });
});
