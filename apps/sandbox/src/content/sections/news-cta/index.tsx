import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { Button } from "@madison/ui/button";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const NewsCtaPropsSchema = z
  .object({
    title: NonEmptyStringSchema,
    description: NonEmptyStringSchema,
    primaryCta: NonEmptyStringSchema,
  })
  .strict();

type NewsCtaProps = z.infer<typeof NewsCtaPropsSchema>;

export function parseProps(input: unknown): NewsCtaProps {
  return NewsCtaPropsSchema.parse(input);
}

export default function NewsCtaSection({
  title,
  description,
  primaryCta,
}: NewsCtaProps) {
  return (
    <section className="dark bg-app px-gutter py-30 text-center">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="mb-4 text-balance text-4xl font-medium tracking-tight text-primary">
            {title}
          </h2>
          <p className="mb-8 text-pretty text-lg text-secondary">
            {description}
          </p>
          <Button size="lg" asChild>
            <a href="/demo/">
              {primaryCta} <ArrowRight className="size-4" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
