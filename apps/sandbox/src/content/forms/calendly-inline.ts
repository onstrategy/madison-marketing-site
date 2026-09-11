// Calendly inline-widget registry — the only place these per-rep scheduling
// links live. Same convention as ./calendly.ts and ./hubspot.ts: a page
// references a widget by friendly name; the raw embed snippet a rep pastes
// out of Calendly (a <div data-url> + a <script src> tag) is never inlined
// into page code, and never enters the repo with its own hide_*/primary_color
// query params baked in — CalendlyInlineWidget supplies those itself, once,
// consistently, on-brand.

export interface CalendlyInlineEntry {
  /** The scheduling page URL, lifted from Calendly's snippet's `data-url` —
   *  query params stripped; CalendlyInlineWidget adds its own. */
  url: string;
  description: string;
}

export const CALENDLY_INLINE_WIDGETS = {
  heyden: {
    url: "https://calendly.com/d/cwhq-g42-7km/madison-ai-demo-call-with-heyden-enochson",
    description: "Heyden Enochson's demo-call scheduling page, on /heyden",
  },
  connor: {
    url: "https://calendly.com/d/cygp-8n6-v65/madison-ai-discovery-call-with-connor-ferris",
    description: "Connor Ferris's discovery-call scheduling page, on /connor",
  },
  kendal: {
    url: "https://calendly.com/d/cxk5-cpg-p72/madison-ai-discovery-call-with-kendal",
    description: "Kendal's discovery-call scheduling page, on /kendal",
  },
} as const satisfies Record<string, CalendlyInlineEntry>;

export type CalendlyInlineWidgetName = keyof typeof CALENDLY_INLINE_WIDGETS;

export const CALENDLY_INLINE_WIDGET_NAMES = Object.keys(
  CALENDLY_INLINE_WIDGETS,
) as CalendlyInlineWidgetName[];

export function isCalendlyInlineWidgetName(
  value: string,
): value is CalendlyInlineWidgetName {
  // Own keys only — `in` would also accept Object.prototype names ("toString").
  return Object.hasOwn(CALENDLY_INLINE_WIDGETS, value);
}
