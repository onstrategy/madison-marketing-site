// HubSpot form registry — the only place HubSpot identifiers live.
//
// Pages reference forms by friendly name; the raw embed snippet a PM copies
// out of HubSpot is never pasted into page code. To add a form: extract the
// formId from the snippet (see the hubspot-forms skill), add one entry here,
// and reference it by name from a `hubspot-form` section or the
// <HubSpotForm /> component.

// Madison's HubSpot account. Every madisonai.com form shares these two values —
// a pasted snippet with a different portalId or region is a red flag to surface,
// not silently accept.
export const HUBSPOT_PORTAL_ID = "54493";
export const HUBSPOT_REGION = "na1";

export interface HubSpotFormEntry {
  formId: string;
  description: string;
}

export const HUBSPOT_FORMS = {
  "book-a-demo": {
    formId: "02ee5553-47ab-4482-869f-f9ea20ae5f74",
    description:
      "Demo request form used across madisonai.com — also the form on /book-a-security-review, where it carries Calendly routing (see ./calendly.ts)",
  },
  "webinar-registration": {
    formId: "0e857ad0-092f-40e8-9baf-14d2aba69006",
    description:
      "Standing-invite signup for the AI in Action webinar series, on /peer-share-invite",
  },
  "case-study-download": {
    formId: "01c50003-efce-47dd-b185-7576c2f9a22a",
    description:
      "Gated download form on the client-story pages — submitting it releases that story's one-page PDF",
  },
} as const satisfies Record<string, HubSpotFormEntry>;

export type HubSpotFormName = keyof typeof HUBSPOT_FORMS;

export const HUBSPOT_FORM_NAMES = Object.keys(
  HUBSPOT_FORMS,
) as HubSpotFormName[];

export function isHubSpotFormName(value: string): value is HubSpotFormName {
  // Own keys only — `in` would also accept Object.prototype names ("toString").
  return Object.hasOwn(HUBSPOT_FORMS, value);
}
