import { Clock, Database, FileSearch, type LucideIcon } from "lucide-react";
import { z } from "zod";
import { Reveal, SectionHeading } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);
const ChallengeIconSchema = z.enum(["clock", "database", "file-search"]);

const challengeIcons: Record<z.infer<typeof ChallengeIconSchema>, LucideIcon> = {
  clock: Clock,
  database: Database,
  "file-search": FileSearch,
};

const ClientStoryChallengePropsSchema = z
  .object({
    eyebrow: NonEmptyStringSchema,
    title: NonEmptyStringSchema,
    intro: NonEmptyStringSchema,
    items: z
      .array(
        z
          .object({
            icon: ChallengeIconSchema,
            title: NonEmptyStringSchema,
            description: NonEmptyStringSchema,
          })
          .strict(),
      )
      .min(1),
  })
  .strict()
  .transform((data) => ({
    ...data,
    items: data.items.map((item) => ({
      ...item,
      icon: challengeIcons[item.icon],
    })),
  }));

type ClientStoryChallengeProps = z.output<
  typeof ClientStoryChallengePropsSchema
>;

export function parseProps(input: unknown): ClientStoryChallengeProps {
  return ClientStoryChallengePropsSchema.parse(input);
}

export default function ClientStoryChallengeSection({
  eyebrow,
  title,
  intro,
  items,
}: ClientStoryChallengeProps) {
  return (
    <section className="border-b border-default bg-surface px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            className="mb-6 max-w-2xl"
          />
        </Reveal>
        <Reveal delay={40}>
          <p className="mb-12 max-w-3xl text-pretty text-lg text-secondary">
            {intro}
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 60}>
              <div className="h-full rounded-2xl border border-default bg-panel p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-info text-info-fg">
                  <item.icon className="size-4" />
                </span>
                <h3 className="mt-4 font-sans text-xl font-semibold tracking-tight text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
