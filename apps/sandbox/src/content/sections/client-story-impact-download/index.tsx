import { Download } from "lucide-react";
import { z } from "zod";
import { Button } from "@madison/ui/button";
import { Input } from "@madison/ui/input";
import { Label } from "@madison/ui/label";
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
        submitLabel: NonEmptyStringSchema,
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

export default function ClientStoryImpactDownloadSection({
  impact,
  download,
}: ClientStoryImpactDownloadProps) {
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
            <h2 className="text-balance text-2xl font-medium tracking-tight text-brand-fg">
              {download.title}
            </h2>
            {download.description ? (
              <p className="mt-3 text-pretty text-sm text-secondary">
                {download.description}
              </p>
            ) : null}
            <form className="mt-6 grid gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="story-name">Full Name</Label>
                <Input id="story-name" name="name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="story-email">
                  Organization e-mail address*
                </Label>
                <Input
                  id="story-email"
                  name="email"
                  type="email"
                  required
                />
              </div>
              <Button type="submit" size="lg">
                {download.submitLabel} <Download className="size-4" />
              </Button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
