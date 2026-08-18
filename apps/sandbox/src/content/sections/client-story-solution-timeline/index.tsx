import { z } from "zod";
import { Reveal, SectionHeading } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ClientStorySolutionTimelinePropsSchema = z
  .object({
    eyebrow: NonEmptyStringSchema,
    title: NonEmptyStringSchema,
    intro: NonEmptyStringSchema.optional(),
    phases: z
      .array(
        z
          .object({
            step: NonEmptyStringSchema.optional(),
            title: NonEmptyStringSchema,
            description: NonEmptyStringSchema,
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

type ClientStorySolutionTimelineProps = z.infer<
  typeof ClientStorySolutionTimelinePropsSchema
>;

export function parseProps(
  input: unknown,
): ClientStorySolutionTimelineProps {
  return ClientStorySolutionTimelinePropsSchema.parse(input);
}

export default function ClientStorySolutionTimelineSection({
  eyebrow,
  title,
  intro,
  phases,
}: ClientStorySolutionTimelineProps) {
  return (
    <section className="border-b border-default bg-app px-gutter py-30">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            align="center"
            className={intro ? "mb-6" : "mb-12"}
          />
          {intro ? (
            <p className="mx-auto mb-12 max-w-2xl text-pretty text-center text-lg text-secondary">
              {intro}
            </p>
          ) : null}
        </Reveal>
        <div>
          {phases.map((phase, index) => {
            const isLast = index === phases.length - 1;
            return (
              <Reveal
                key={`${phase.step ?? "phase"}-${phase.title}`}
                delay={index * 60}
              >
                <div className="flex gap-6">
                  <div className="flex shrink-0 flex-col items-center">
                    <span className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-fg">
                      {index + 1}
                    </span>
                    {isLast ? null : (
                      <div className="flex-1 border-l border-default" aria-hidden />
                    )}
                  </div>
                  <div
                    className={
                      isLast
                        ? "flex-1 rounded-2xl border border-default bg-surface p-7"
                        : "mb-8 flex-1 rounded-2xl border border-default bg-surface p-7"
                    }
                  >
                    {phase.step ? (
                      <div className="font-sans text-sm uppercase tracking-widest text-muted">
                        {phase.step}
                      </div>
                    ) : null}
                    <h3 className="mt-1.5 font-serif text-2xl font-medium tracking-tight text-primary">
                      {phase.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                      {phase.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
