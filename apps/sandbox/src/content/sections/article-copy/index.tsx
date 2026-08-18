import { z } from "zod";
import { cn } from "@madison/ui/utils";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ArticleLinkSchema = z
  .object({
    type: z.literal("link"),
    text: NonEmptyStringSchema,
    href: z.string().url().refine((href) => href.startsWith("https://"), {
      message: "must use an https URL",
    }),
  })
  .strict();

const ArticleParagraphSchema = z.union([
  NonEmptyStringSchema,
  z
    .object({
      content: z.array(z.union([NonEmptyStringSchema, ArticleLinkSchema])).min(1),
      emphasis: z.boolean().optional(),
    })
    .strict(),
]);

const ArticleCopyPropsSchema = z
  .object({
    heading: NonEmptyStringSchema,
    paragraphs: z.array(ArticleParagraphSchema).min(1),
    callout: z
      .object({
        title: NonEmptyStringSchema,
        body: NonEmptyStringSchema,
      })
      .strict()
      .optional(),
    // Defaults to true (the original behavior everywhere this was already
    // used) — set false to drop the line under this instance.
    divider: z.boolean().optional(),
  })
  .strict();

type ArticleCopyProps = z.infer<typeof ArticleCopyPropsSchema>;
type ArticleParagraph = z.infer<typeof ArticleParagraphSchema>;

export function parseProps(input: unknown): ArticleCopyProps {
  return ArticleCopyPropsSchema.parse(input);
}

function ArticleParagraphContent({ paragraph }: { paragraph: ArticleParagraph }) {
  if (typeof paragraph === "string") return paragraph;
  return paragraph.content.map((part, index) =>
    typeof part === "string" ? (
      part
    ) : (
      <a
        key={`${part.href}-${index}`}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-brand-accent underline-offset-4 hover:underline"
      >
        {part.text}
      </a>
    ),
  );
}

export default function ArticleCopySection({
  heading,
  paragraphs,
  callout,
  divider = true,
}: ArticleCopyProps) {
  return (
    <section className={cn("bg-app px-gutter py-20", divider && "border-b border-default")}>
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="mb-8 text-balance font-serif text-3xl font-medium tracking-tight text-primary">
            {heading}
          </h2>
          <div className="space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={
                  typeof paragraph !== "string" && paragraph.emphasis
                    ? "text-pretty font-semibold leading-relaxed text-primary"
                    : "text-pretty leading-relaxed text-secondary"
                }
              >
                <ArticleParagraphContent paragraph={paragraph} />
              </p>
            ))}
          </div>
          {callout ? (
            <aside className="dark mt-10 rounded-2xl bg-brand-subtle p-6 lg:p-8">
              <h3 className="font-serif text-2xl font-medium tracking-tight text-primary">
                {callout.title}
              </h3>
              <p className="mt-3 leading-relaxed text-secondary">{callout.body}</p>
            </aside>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
