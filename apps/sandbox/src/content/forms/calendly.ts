// Calendly routing-form registry — the only place Calendly identifiers live.
//
// Some HubSpot forms are wired to a Calendly "routing form": on submit,
// Calendly intercepts the HubSpot submission and opens its scheduling modal, so
// the visitor books a time there and then instead of waiting for a follow-up
// email. Calendly hands this out as a copy-paste <script>/<link> block; here it
// becomes one registry entry referenced by friendly name, exactly like the
// HubSpot registry next door (./hubspot.ts). The snippet itself is discarded.

// Calendly's modal is a third-party iframe our stylesheet can't reach, and
// `primary_color` is the one styling hook its API exposes. This mirrors
// --brand-primary (Neon Blue — the same value in both themes), so the modal's
// buttons read as ours. Hex without the leading "#" is the format Calendly wants.
export const CALENDLY_PRIMARY_COLOR = "147AC2";

export interface CalendlyRoutingEntry {
  /** The routing form's submissions endpoint, lifted from Calendly's snippet. */
  submissionsUrl: string;
  description: string;
}

export const CALENDLY_ROUTING_FORMS = {
  "demo-routing": {
    submissionsUrl:
      "https://calendly.com/api/form_builder/forms/0fed8b94-bc40-4f3e-a1c2-e6ee38e217dd/submissions",
    description:
      "Opens Calendly's scheduling modal on every submission of the book-a-demo form — /demo, the four platform pages, and /book-a-security-review",
  },
} as const satisfies Record<string, CalendlyRoutingEntry>;

export type CalendlyRoutingName = keyof typeof CALENDLY_ROUTING_FORMS;

export const CALENDLY_ROUTING_NAMES = Object.keys(
  CALENDLY_ROUTING_FORMS,
) as CalendlyRoutingName[];

export function isCalendlyRoutingName(
  value: string,
): value is CalendlyRoutingName {
  // Own keys only — `in` would also accept Object.prototype names ("toString").
  return Object.hasOwn(CALENDLY_ROUTING_FORMS, value);
}
