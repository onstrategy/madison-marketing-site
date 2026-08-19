import { Download } from "lucide-react";
import { z } from "zod";
import { Button } from "@madison/ui/button";
import { resolveWebinarAsset } from "../../webinars/assets";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const WebinarResourceDownloadInputSchema = z
  .object({
    title: NonEmptyStringSchema,
    description: NonEmptyStringSchema,
    asset: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\.pdf$/),
    buttonLabel: NonEmptyStringSchema,
  })
  .strict();

const WebinarResourceDownloadPropsSchema =
  WebinarResourceDownloadInputSchema.transform(({ asset, ...props }) => ({
    ...props,
    assetUrl: resolveWebinarAsset(asset),
  }));

type WebinarResourceDownloadProps = z.infer<
  typeof WebinarResourceDownloadPropsSchema
>;

export function parseProps(input: unknown): WebinarResourceDownloadProps {
  return WebinarResourceDownloadPropsSchema.parse(input);
}

export default function WebinarResourceDownloadSection({
  title,
  description,
  assetUrl,
  buttonLabel,
}: WebinarResourceDownloadProps) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="rounded-2xl border border-default bg-panel p-8 text-center lg:p-10">
            <h2 className="text-balance font-serif text-3xl font-medium tracking-tight text-primary">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-secondary">
              {description}
            </p>
            <Button className="mt-7" size="lg" asChild>
              <a href={assetUrl} download>
                {buttonLabel} <Download className="size-4" />
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
