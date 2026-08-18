import { ArrowRight } from "lucide-react";
import { z } from "zod";
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

const ArticleListItemSchema = z.union([
  NonEmptyStringSchema,
  z
    .object({
      label: NonEmptyStringSchema,
      description: NonEmptyStringSchema,
    })
    .strict(),
]);

const ArticleCopyPropsSchema = z
  .object({
    variant: z.enum(["editorial", "announcement"]).default("editorial"),
    heading: NonEmptyStringSchema.optional(),
    paragraphs: z.array(ArticleParagraphSchema).default([]),
    items: z.array(ArticleListItemSchema).default([]),
    callout: z
      .object({
        title: NonEmptyStringSchema,
        body: NonEmptyStringSchema,
      })
      .strict()
      .optional(),
  })
  .strict()
  .refine(
    ({ heading, paragraphs, items }) =>
      heading !== undefined || paragraphs.length > 0 || items.length > 0,
    { message: "article copy needs a heading, paragraph, or list item" },
  );

type ArticleCopyProps = z.infer<typeof ArticleCopyPropsSchema>;
type ArticleParagraph = z.infer<typeof ArticleParagraphSchema>;
type ArticleListItem = z.infer<typeof ArticleListItemSchema>;

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

function ArticleListItemContent({ item }: { item: ArticleListItem }) {
  if (typeof item === "string") return item;
  return (
    <>
      <span className="font-semibold text-primary">{item.label}</span>{" "}
      {item.description}
    </>
  );
}

export default function ArticleCopySection({
  heading,
  paragraphs,
  items,
  callout,
  variant,
}: ArticleCopyProps) {
  return (
    <section className="border-b border-default bg-app px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          {heading ? (
            <h2
              className={
                variant === "announcement"
                  ? "mb-6 text-balance font-sans text-xl font-semibold tracking-tight text-primary"
                  : "mb-8 text-balance font-serif text-3xl font-medium tracking-tight text-primary"
              }
            >
              {heading}
            </h2>
          ) : null}
          {paragraphs.length > 0 ? (
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
          ) : null}
          {items.length > 0 ? (
            <ul className="mt-8 space-y-3">
              {items.map((item) => (
                <li
                  key={typeof item === "string" ? item : item.label}
                  className="flex items-start gap-3 leading-relaxed text-secondary"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg"
                  >
                    <ArrowRight className="size-4" />
                  </span>
                  <span className="pt-0.5">
                    <ArticleListItemContent item={item} />
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
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
