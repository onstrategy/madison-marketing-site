import { z } from "zod";
import { cn } from "@madison/ui/utils";
import { Reveal } from "../../../prototypes/landing/parts";

const NewsIntroPropsSchema = z
  .object({
    intro: z.string().trim().min(1),
    // Defaults to true (the original behavior everywhere this was already
    // used) — set false for an instance sandwiched between contained cards
    // (e.g. announcement-quote) that shouldn't have a line cutting across
    // the gap next to them.
    divider: z.boolean().optional(),
  })
  .strict();

type NewsIntroProps = z.infer<typeof NewsIntroPropsSchema>;

export function parseProps(input: unknown): NewsIntroProps {
  return NewsIntroPropsSchema.parse(input);
}

export default function NewsIntroSection({ intro, divider = true }: NewsIntroProps) {
  return (
    <section className={cn("bg-app px-gutter py-16", divider && "border-b border-default")}>
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-pretty leading-relaxed text-secondary">{intro}</p>
        </Reveal>
      </div>
    </section>
  );
}
