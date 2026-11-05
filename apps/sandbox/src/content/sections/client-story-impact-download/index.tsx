import { useCallback, useState } from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { z } from "zod";
import { Button } from "@madison/ui/button";
import { Input } from "@madison/ui/input";
import { Label } from "@madison/ui/label";
import { resolveClientStoryAsset } from "../../client-stories/assets";
import { HubSpotForm } from "../../forms/HubSpotForm";
import {
  HUBSPOT_FORM_NAMES,
  isHubSpotFormName,
} from "../../forms/hubspot";
import { Reveal, Eyebrow } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ClientStoryImpactDownloadPropsSchema = z
  .object({
    impact: z
      .object({
        eyebrow: NonEmptyStringSchema,
        title: NonEmptyStringSchema,
        paragraphs: z.array(NonEmptyStringSchema).min(1),
      })
      .strict(),
    download: z
      .object({
        title: NonEmptyStringSchema,
        description: NonEmptyStringSchema.optional(),
        // Names the story in the post-submit confirmation ("your copy of the
        // City of Corona case study is ready"). Omitted, the confirmation just
        // says "the case study".
        clientName: NonEmptyStringSchema.optional(),
        // Omitted while the one-page PDF isn't ready: the box still shows,
        // but its form is a placeholder that sends nothing.
        asset: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\.pdf$/)
          .optional(),
        form: NonEmptyStringSchema.refine(isHubSpotFormName, {
          message: `must be a registered HubSpot form name (available: ${HUBSPOT_FORM_NAMES.join(", ")})`,
        }),
      })
      .strict(),
  })
  .strict();

type ClientStoryImpactDownloadProps = z.infer<
  typeof ClientStoryImpactDownloadPropsSchema
>;

export function parseProps(
  input: unknown,
): ClientStoryImpactDownloadProps {
  return ClientStoryImpactDownloadPropsSchema.parse(input);
}

export function downloadConfirmation(clientName?: string): string {
  return clientName
    ? `Your copy of the ${clientName} case study is ready.`
    : "Your copy of the case study is ready.";
}

// Stand-in for the real download form until the PDF exists. Mirrors the
// layout of the live "case-study-download" HubSpot form (see
// forms/hubspot-form.css) but collects and sends nothing.
function PlaceholderDownloadForm() {
  return (
    <form onSubmit={(event) => event.preventDefault()} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="download-first-name" className="mb-1.5 block">
            First name
          </Label>
          <Input
            id="download-first-name"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
          />
        </div>
        <div>
          <Label htmlFor="download-last-name" className="mb-1.5 block">
            Last name
          </Label>
          <Input
            id="download-last-name"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
          />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="download-email" className="mb-1.5 block">
          Organization e-mail address*
        </Label>
        <Input
          id="download-email"
          type="email"
          autoComplete="email"
          placeholder="Organization Email Address"
        />
      </div>
      <Button type="submit" size="lg" className="mt-6 w-full">
        Get the case study PDF
      </Button>
    </form>
  );
}

export default function ClientStoryImpactDownloadSection({
  impact,
  download,
}: ClientStoryImpactDownloadProps) {
  const downloadUrl = download.asset
    ? resolveClientStoryAsset(download.asset)
    : undefined;
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitted = useCallback(() => {
    setSubmitted(true);
  }, []);

  return (
    <section
      id="download"
      className="border-b border-default bg-surface px-gutter py-21 sm:py-30"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <Eyebrow className="mb-6">{impact.eyebrow}</Eyebrow>
          <h2 className="mb-6 text-balance text-4xl font-medium tracking-tight text-primary">
            {impact.title}
          </h2>
          <div className="space-y-4">
            {impact.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-pretty text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="dark rounded-2xl border border-default bg-panel p-8">
            {submitted && downloadUrl ? (
              <div role="status">
                <CheckCircle2
                  aria-hidden
                  className="size-8 text-success"
                />
                <h2 className="mt-4 text-balance text-2xl font-medium tracking-tight text-brand-fg">
                  Thank you!
                </h2>
                <p className="mt-3 text-pretty text-sm text-secondary">
                  {downloadConfirmation(download.clientName)} It opens in a new
                  tab, where you can read it or save a copy.
                </p>
                <Button className="mt-6" size="lg" asChild>
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open the PDF <ExternalLink className="size-4" />
                  </a>
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-balance text-2xl font-medium tracking-tight text-brand-fg">
                  {download.title}
                </h2>
                {download.description ? (
                  <p className="mt-3 text-pretty text-sm text-secondary">
                    {download.description}
                  </p>
                ) : null}
                <div className="mt-6">
                  {downloadUrl ? (
                    <HubSpotForm
                      form={download.form}
                      onSubmitted={handleSubmitted}
                    />
                  ) : (
                    <PlaceholderDownloadForm />
                  )}
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
