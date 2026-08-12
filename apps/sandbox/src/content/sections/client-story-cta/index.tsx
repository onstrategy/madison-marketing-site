import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { Button } from "@madison/ui/button";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ClientStoryCtaPropsSchema = z
  .object({
    title: NonEmptyStringSchema,
    description: NonEmptyStringSchema,
    primaryCta: NonEmptyStringSchema,
  })
  .strict();

type ClientStoryCtaProps = z.infer<typeof ClientStoryCtaPropsSchema>;

export function parseProps(input: unknown): ClientStoryCtaProps {
  return ClientStoryCtaPropsSchema.parse(input);
}

export default function ClientStoryCtaSection({
  title,
  description,
  primaryCta,
}: ClientStoryCtaProps) {
  return (
    <section className="dark bg-app px-gutter py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-balance text-4xl font-medium tracking-tight text-primary">
            {title}
          </h2>
          <p className="mt-4 text-pretty text-lg text-secondary">
            {description}
          </p>
          <Button size="lg" className="mt-8" asChild>
            <a href="/demo/">
              {primaryCta} <ArrowRight className="size-4" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
