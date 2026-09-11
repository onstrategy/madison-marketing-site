import { useEffect, useRef } from "react";
import { CALENDLY_PRIMARY_COLOR } from "./calendly";
import {
  CALENDLY_INLINE_WIDGETS,
  type CalendlyInlineWidgetName,
} from "./calendly-inline";
// Not otherwise used here — importing it is what brings ./calendly-routing's
// ambient `Window.Calendly` augmentation (shared by both embed styles) into
// this file's view, so `window.Calendly.initInlineWidget` below type-checks
// against the same global shape rather than needing its own declaration.
import "./calendly-routing";

// The one place the Calendly widget embed script exists. Everything else in
// the repo references a scheduling page by registry name — never by script
// tag or raw URL (see ./calendly-inline.ts).

const CALENDLY_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

// Module-level singleton so multiple widgets (or remounts) on one page share
// a single script load — same pattern as HubSpotForm's loadHubSpotScript.
let scriptLoader: Promise<void> | null = null;

function loadCalendlyScript(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  if (!scriptLoader) {
    scriptLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = CALENDLY_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        // Allow a retry on the next mount instead of caching the failure —
        // and drop the dead tag so retries don't accumulate them in <head>.
        script.remove();
        scriptLoader = null;
        reject(new Error("Failed to load the Calendly widget script"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptLoader;
}

export interface CalendlyInlineWidgetProps {
  person: CalendlyInlineWidgetName;
}

/**
 * A Calendly scheduling page, embedded inline (not the routing-form modal —
 * see ./calendly-routing.ts for that). Uses Calendly's own `initInlineWidget`
 * JS API rather than the static `<div class="calendly-inline-widget">` +
 * script-auto-scan approach Calendly's copy-paste snippet uses: the
 * auto-scan only picks up widgets present in the DOM at the moment the
 * script itself finishes loading, which breaks for a widget that mounts
 * later (client-side navigation between pages, e.g. /heyden → /connor,
 * doesn't reload the script) — `initInlineWidget` works regardless of when
 * it's called.
 */
export function CalendlyInlineWidget({ person }: CalendlyInlineWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { url } = CALENDLY_INLINE_WIDGETS[person];
  // hide_event_type_details/hide_gdpr_banner trim Calendly's own chrome to
  // just the picker; primary_color is Madison's actual brand blue (the same
  // constant the routing modal uses), not whatever shade happened to be in
  // the pasted snippet.
  const dataUrl = `${url}?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=${CALENDLY_PRIMARY_COLOR}`;

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    loadCalendlyScript()
      .then(() => {
        if (cancelled || !window.Calendly) return;
        container.innerHTML = "";
        window.Calendly.initInlineWidget({ url: dataUrl, parentElement: container });
      })
      .catch(() => {
        console.warn(`Calendly widget failed to load for "${person}".`);
      });

    return () => {
      cancelled = true;
      container.innerHTML = "";
    };
  }, [dataUrl, person]);

  return (
    // min-w-80 (320px) + h-175 (700px) — the same dimensions Calendly's own
    // copy-paste snippet specifies (min-width:320px; height:700px), on the
    // numeric spacing scale rather than an arbitrary/inline value.
    <div ref={containerRef} className="min-w-80 h-175" />
  );
}
