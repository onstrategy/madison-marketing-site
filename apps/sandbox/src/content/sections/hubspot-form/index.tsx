import { z } from "zod";
import { HubSpotForm } from "../../forms/HubSpotForm";
import {
  HUBSPOT_FORM_NAMES,
  isHubSpotFormName,
} from "../../forms/hubspot";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

// `form` must be a registry name, never a raw HubSpot formId — a typo or an
// unregistered form fails validation at build time instead of rendering an
// empty embed in production.
const HubSpotFormSectionPropsSchema = z
  .object({
    form: NonEmptyStringSchema.refine(isHubSpotFormName, {
      message: `must be a registered HubSpot form name (available: ${HUBSPOT_FORM_NAMES.join(", ")})`,
    }),
    title: NonEmptyStringSchema.optional(),
    description: NonEmptyStringSchema.optional(),
  })
  .strict();

type HubSpotFormSectionProps = z.infer<typeof HubSpotFormSectionPropsSchema>;

export function parseProps(input: unknown): HubSpotFormSectionProps {
  return HubSpotFormSectionPropsSchema.parse(input);
}

export default function HubSpotFormSection({
  form,
  title,
  description,
}: HubSpotFormSectionProps) {
  return (
    <section className="bg-app px-gutter py-24">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          {title ? (
            <h2 className="text-balance text-center text-4xl font-medium tracking-tight text-primary">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-4 text-pretty text-center text-lg text-secondary">
              {description}
            </p>
          ) : null}
          <div
            className={`light rounded-2xl border border-default bg-surface p-8 ${
              title || description ? "mt-10" : ""
            }`}
          >
            <HubSpotForm form={form} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
