import { z } from "zod";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const NewsLessonsPropsSchema = z
  .object({
    lessons: z
      .array(
        z
          .object({
            title: NonEmptyStringSchema,
            paragraphs: z.array(NonEmptyStringSchema).min(1),
            stats: z
              .array(
                z
                  .object({
                    value: NonEmptyStringSchema,
                    label: NonEmptyStringSchema,
                  })
                  .strict(),
              )
              .min(1)
              .optional(),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

type NewsLessonsProps = z.infer<typeof NewsLessonsPropsSchema>;

export function parseProps(input: unknown): NewsLessonsProps {
  return NewsLessonsPropsSchema.parse(input);
}

export default function NewsLessonsSection({ lessons }: NewsLessonsProps) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-20">
      <div className="mx-auto max-w-3xl space-y-16">
        {lessons.map((lesson, index) => (
          <Reveal key={lesson.title} delay={index * 60}>
            <div>
              <h2 className="mb-4 text-balance text-3xl font-medium tracking-tight text-primary">
                Lesson {index + 1}: {lesson.title}
              </h2>
              <div className="space-y-4">
                {lesson.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-pretty leading-relaxed text-secondary"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {lesson.stats ? (
                <div className="mt-6 grid grid-cols-2 gap-6 rounded-2xl border border-default bg-panel p-6 sm:grid-cols-4">
                  {lesson.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="font-serif text-3xl font-medium tracking-tight text-brand-accent">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-xs text-secondary">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
