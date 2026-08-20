import { useCallback, useState } from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { z } from "zod";
import { Button } from "@madison/ui/button";
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
        asset: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\.pdf$/),
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

export default function ClientStoryImpactDownloadSection({
  impact,
  download,
}: ClientStoryImpactDownloadProps) {
  const downloadUrl = resolveClientStoryAsset(download.asset);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitted = useCallback(() => {
    setSubmitted(true);
  }, []);

  return (
    <section
      id="download"
      className="border-b border-default bg-surface px-gutter py-30"
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
            {submitted ? (
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
                  <HubSpotForm
                    form={download.form}
                    onSubmitted={handleSubmitted}
                  />
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
