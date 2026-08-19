import {
  CALENDLY_PRIMARY_COLOR,
  CALENDLY_ROUTING_FORMS,
  type CalendlyRoutingName,
} from "./calendly";

// The one place the Calendly embed assets exist — the same contract
// HubSpotForm.tsx holds for js.hsforms.net. Pages reference a routing form by
// registry name; no <script> or <link> tag from Calendly's snippet ever lands
// in page code.

const CALENDLY_WIDGET_CSS_HREF =
  "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_FORMS_SCRIPT_SRC =
  "https://assets.calendly.com/assets/external/forms.js";

interface CalendlyInitHubspotFormOptions {
  /** The HubSpot formId whose submissions this routing form listens for. */
  id: string;
  url: string;
  options: {
    hide_gdpr_banner: number;
    primary_color: string;
  };
}

interface CalendlyApi {
  initHubspotForm: (options: CalendlyInitHubspotFormOptions) => void;
}

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

// Module-level singleton so several routed forms on one page share one load.
let scriptLoader: Promise<void> | null = null;

function ensureWidgetCss(): void {
  if (document.querySelector(`link[href="${CALENDLY_WIDGET_CSS_HREF}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = CALENDLY_WIDGET_CSS_HREF;
  document.head.appendChild(link);
}

function loadCalendlyScript(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  if (!scriptLoader) {
    scriptLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = CALENDLY_FORMS_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        // Allow a retry on the next mount instead of caching the failure —
        // and drop the dead tag so retries don't accumulate them in <head>.
        script.remove();
        scriptLoader = null;
        reject(new Error("Failed to load the Calendly forms script"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptLoader;
}

// initHubspotForm registers a page-lifetime listener and exposes no teardown,
// so re-running it (StrictMode's double effect, a remount, two cards for the
// same form) would stack listeners and pop the modal more than once. One init
// per HubSpot formId is both necessary and sufficient.
const initialized = new Set<string>();

/**
 * Wire Calendly's scheduling modal onto a HubSpot form's submission. Resolves
 * once the routing is live; rejects if Calendly's script can't load — callers
 * treat that as non-fatal, since the HubSpot form still submits normally.
 */
export async function attachCalendlyRouting(
  routing: CalendlyRoutingName,
  hubspotFormId: string,
): Promise<void> {
  const { submissionsUrl } = CALENDLY_ROUTING_FORMS[routing];
  ensureWidgetCss();
  await loadCalendlyScript();

  const api = window.Calendly;
  if (!api) {
    throw new Error("Calendly forms script loaded without its API");
  }
  if (initialized.has(hubspotFormId)) return;
  initialized.add(hubspotFormId);

  api.initHubspotForm({
    id: hubspotFormId,
    url: submissionsUrl,
    options: {
      hide_gdpr_banner: 1,
      primary_color: CALENDLY_PRIMARY_COLOR,
    },
  });
}
