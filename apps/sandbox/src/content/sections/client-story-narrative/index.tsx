import { z } from "zod";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ClientStoryNarrativePropsSchema = z
  .object({
    title: NonEmptyStringSchema,
    paragraphs: z.array(NonEmptyStringSchema).min(1),
  })
  .strict();

type ClientStoryNarrativeProps = z.infer<
  typeof ClientStoryNarrativePropsSchema
>;

export function parseProps(input: unknown): ClientStoryNarrativeProps {
  return ClientStoryNarrativePropsSchema.parse(input);
}

export default function ClientStoryNarrativeSection({
  title,
  paragraphs,
}: ClientStoryNarrativeProps) {
  return (
    <section className="border-b border-default bg-app px-gutter py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-balance font-serif text-4xl font-medium tracking-tight text-primary">
            {title}
          </h2>
          <div className="mt-8 space-y-5">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-pretty text-lg text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
