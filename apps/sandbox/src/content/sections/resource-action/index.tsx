import { ExternalLink } from "lucide-react";
import { z } from "zod";
import { Button } from "@madison/ui/button";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ResourceActionPropsSchema = z
  .object({
    title: NonEmptyStringSchema,
    description: NonEmptyStringSchema.optional(),
    cta: z
      .object({
        label: NonEmptyStringSchema,
        href: z.string().url().refine((href) => href.startsWith("https://"), {
          message: "must use an https URL",
        }),
      })
      .strict(),
  })
  .strict();

type ResourceActionProps = z.infer<typeof ResourceActionPropsSchema>;

export function parseProps(input: unknown): ResourceActionProps {
  return ResourceActionPropsSchema.parse(input);
}

export default function ResourceActionSection({
  title,
  description,
  cta,
}: ResourceActionProps) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-3xl rounded-2xl border border-default bg-panel p-card text-center shadow-sm lg:p-10">
        <Reveal>
          <h2 className="text-balance font-serif text-3xl font-medium tracking-tight text-primary">
            {title}
          </h2>
          {description ? (
            <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-secondary">
              {description}
            </p>
          ) : null}
          <Button className="mt-8" size="lg" asChild>
            <a href={cta.href} target="_blank" rel="noopener noreferrer">
              {cta.label} <ExternalLink className="size-4" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
