import { z } from "zod";
import { Reveal } from "../../../prototypes/landing/parts";

const NewsIntroPropsSchema = z
  .object({
    intro: z.string().trim().min(1),
  })
  .strict();

type NewsIntroProps = z.infer<typeof NewsIntroPropsSchema>;

export function parseProps(input: unknown): NewsIntroProps {
  return NewsIntroPropsSchema.parse(input);
}

export default function NewsIntroSection({ intro }: NewsIntroProps) {
  return (
    <section className="border-b border-default bg-app px-gutter py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-pretty leading-relaxed text-secondary">{intro}</p>
        </Reveal>
      </div>
    </section>
  );
}
