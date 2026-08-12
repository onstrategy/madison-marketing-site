import { z } from "zod";
import { Reveal } from "../../../prototypes/landing/parts";

const NewsClosingPropsSchema = z
  .object({
    closing: z.string().trim().min(1),
  })
  .strict();

type NewsClosingProps = z.infer<typeof NewsClosingPropsSchema>;

export function parseProps(input: unknown): NewsClosingProps {
  return NewsClosingPropsSchema.parse(input);
}

export default function NewsClosingSection({ closing }: NewsClosingProps) {
  return (
    <section className="border-b border-default bg-app px-gutter py-20 text-center">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <p className="text-balance font-serif text-2xl font-medium tracking-tight text-primary">
            {closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
