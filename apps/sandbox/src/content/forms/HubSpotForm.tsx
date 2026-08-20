import { useEffect, useId, useRef, useState } from "react";
import {
  HUBSPOT_FORMS,
  HUBSPOT_PORTAL_ID,
  HUBSPOT_REGION,
  type HubSpotFormName,
} from "./hubspot";
import { type CalendlyRoutingName } from "./calendly";
import { attachCalendlyRouting } from "./calendly-routing";
import "./hubspot-form.css";

// The one place the HubSpot embed script exists. Everything else in the repo
// references forms by registry name — never by script tag or raw formId.

const HUBSPOT_SCRIPT_SRC = "https://js.hsforms.net/forms/embed/v2.js";

// hbspt.forms.create has no failure callback — if the form-definition fetch
// fails (form deleted, request blocked), onFormReady simply never fires. This
// bounds how long we wait before showing the error card's mailto fallback.
const EMBED_READY_TIMEOUT_MS = 15_000;

interface HubSpotFormsCreateOptions {
  portalId: string;
  formId: string;
  region: string;
  target: string;
  onFormReady?: () => void;
  onFormSubmitted?: () => void;
}

interface HubSpotFormsApi {
  forms: {
    create: (options: HubSpotFormsCreateOptions) => void;
  };
}

declare global {
  interface Window {
    hbspt?: HubSpotFormsApi;
  }
}

// Module-level singleton so many forms on one page share a single script load.
let scriptLoader: Promise<void> | null = null;

function loadHubSpotScript(): Promise<void> {
  if (window.hbspt) return Promise.resolve();
  if (!scriptLoader) {
    scriptLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = HUBSPOT_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        // Allow a retry on the next mount instead of caching the failure —
        // and drop the dead tag so retries don't accumulate them in <head>.
        script.remove();
        scriptLoader = null;
        reject(new Error("Failed to load the HubSpot forms script"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptLoader;
}

type EmbedState = "loading" | "ready" | "error";

export interface HubSpotFormProps {
  form: HubSpotFormName;
  /**
   * Optional Calendly routing form (see ./calendly.ts). When set, submitting
   * this form opens Calendly's scheduling modal instead of ending at HubSpot's
   * thank-you message.
   */
  calendlyRouting?: CalendlyRoutingName;
  /**
   * Defaults to "white" — fields are always a solid white/light well (see
   * the .hubspot-form--white-fields rule in ./hubspot-form.css), regardless
   * of the card or section color behind them. Only the field wells are
   * forced; the surrounding form container keeps whatever background the
   * page gives it. "transparent" opts back into the old behavior (fields
   * blend into whatever card they sit in) for a page that wants that look.
   */
  fieldBackground?: "transparent" | "white";
  onSubmitted?: () => void;
}

export function HubSpotForm({
  form,
  calendlyRouting,
  fieldBackground = "white",
  onSubmitted,
}: HubSpotFormProps) {
  const { formId } = HUBSPOT_FORMS[form];
  // useId emits colons, which are invalid in the CSS selector HubSpot's
  // `target` option expects — strip to a selector-safe id.
  const domId = `hubspot-form-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<EmbedState>("loading");

  useEffect(() => {
    let cancelled = false;
    let readyTimeout: number | undefined;
    const container = containerRef.current;
    if (!container) return;

    loadHubSpotScript()
      .then(() => {
        if (cancelled) return;
        const api = window.hbspt;
        if (!api) {
          throw new Error("HubSpot forms script loaded without its API");
        }
        container.innerHTML = "";
        readyTimeout = window.setTimeout(() => {
          if (!cancelled) setState("error");
        }, EMBED_READY_TIMEOUT_MS);
        api.forms.create({
          portalId: HUBSPOT_PORTAL_ID,
          formId,
          region: HUBSPOT_REGION,
          target: `#${domId}`,
          onFormReady: () => {
            window.clearTimeout(readyTimeout);
            if (!cancelled) setState("ready");
          },
          onFormSubmitted: () => {
            if (!cancelled) onSubmitted?.();
          },
        });
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimeout);
      container.innerHTML = "";
    };
  }, [formId, domId, onSubmitted]);

  // Kept separate from the embed effect, and deliberately not awaited by it:
  // Calendly only needs its listener in place before a human finishes typing,
  // and if its script never loads the HubSpot form must still submit normally
  // (lead captured, no modal) rather than fail with it.
  useEffect(() => {
    if (!calendlyRouting) return;
    let cancelled = false;
    attachCalendlyRouting(calendlyRouting, formId).catch(() => {
      if (!cancelled) {
        console.warn(
          `Calendly routing "${calendlyRouting}" failed to load; the form will submit to HubSpot only.`,
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [calendlyRouting, formId]);

  if (state === "error") {
    return (
      <div className="rounded-lg border border-default bg-surface p-card text-center">
        <p className="text-base text-primary">
          The form couldn&apos;t load. Please refresh the page, or email{" "}
          <a
            href="mailto:info@madisonai.com"
            className="font-semibold text-brand-accent"
          >
            info@madisonai.com
          </a>{" "}
          and we&apos;ll get back to you.
        </p>
      </div>
    );
  }

  return (
    // While loading, min-h reserves space for the embedded form so the page
    // doesn't shift (the prerendered HTML ships only the skeleton); once the
    // form is ready its own height takes over. `hubspot-form` scopes the
    // on-token adapter stylesheet (hubspot-form.css) for HubSpot's markup.
    <div
      className={[
        "hubspot-form relative",
        fieldBackground === "white" ? "hubspot-form--white-fields" : "",
        state === "loading" ? "min-h-96" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div id={domId} ref={containerRef} />
      {state === "loading" ? (
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse space-y-stack"
        >
          <div className="h-10 rounded-sm bg-hover" />
          <div className="h-10 rounded-sm bg-hover" />
          <div className="h-24 rounded-sm bg-hover" />
          <div className="h-10 w-40 rounded-md bg-hover" />
        </div>
      ) : null}
    </div>
  );
}
