import { z } from "zod";
import { resolveClientStoryImage } from "../../client-stories/assets";
import { ClientStoryImageInputSchema } from "../../client-stories/image";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);

const ParagraphBlockSchema = z
  .object({
    type: z.literal("paragraph"),
    text: NonEmptyStringSchema,
    emphasis: z.boolean().optional(),
  })
  .strict();

const HeadingBlockSchema = z
  .object({
    type: z.literal("heading"),
    text: NonEmptyStringSchema,
  })
  .strict();

const QuoteBlockSchema = z
  .object({
    type: z.literal("quote"),
    text: NonEmptyStringSchema,
    attribution: NonEmptyStringSchema,
    photo: ClientStoryImageInputSchema.optional(),
  })
  .strict();

const ImageBlockSchema = z
  .object({
    type: z.literal("image"),
    photo: ClientStoryImageInputSchema,
    caption: NonEmptyStringSchema.optional(),
  })
  .strict();

const BulletsBlockSchema = z
  .object({
    type: z.literal("bullets"),
    title: NonEmptyStringSchema.optional(),
    items: z.array(NonEmptyStringSchema).min(1),
  })
  .strict();

const StatsBlockSchema = z
  .object({
    type: z.literal("stats"),
    title: NonEmptyStringSchema.optional(),
    items: z
      .array(
        z
          .object({
            value: NonEmptyStringSchema,
            label: NonEmptyStringSchema,
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

const ListBlockSchema = z
  .object({
    type: z.literal("list"),
    title: NonEmptyStringSchema.optional(),
    items: z
      .array(
        z
          .object({
            title: NonEmptyStringSchema,
            description: NonEmptyStringSchema,
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

const AnnouncementBlockSchema = z.discriminatedUnion("type", [
  ParagraphBlockSchema,
  HeadingBlockSchema,
  QuoteBlockSchema,
  ImageBlockSchema,
  BulletsBlockSchema,
  StatsBlockSchema,
  ListBlockSchema,
]);

const ClientStoryAnnouncementBodyInputSchema = z
  .object({
    blocks: z.array(AnnouncementBlockSchema).min(1),
  })
  .strict();

const ClientStoryAnnouncementBodyPropsSchema =
  ClientStoryAnnouncementBodyInputSchema;

type ClientStoryAnnouncementBodyProps = z.infer<
  typeof ClientStoryAnnouncementBodyPropsSchema
>;
type AnnouncementBlock = ClientStoryAnnouncementBodyProps["blocks"][number];

export function parseProps(input: unknown): ClientStoryAnnouncementBodyProps {
  return ClientStoryAnnouncementBodyPropsSchema.parse(input);
}

function AnnouncementBlockContent({ block }: { block: AnnouncementBlock }) {
  if (block.type === "heading") {
    return (
      <h2 className="pt-4 text-balance font-serif text-3xl font-medium tracking-tight text-primary">
        {block.text}
      </h2>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p
        className={
          block.emphasis
            ? "text-pretty text-lg font-semibold leading-relaxed text-primary"
            : "text-pretty text-lg leading-relaxed text-secondary"
        }
      >
        {block.text}
      </p>
    );
  }

  if (block.type === "image") {
    const photo = resolveClientStoryImage(block.photo);
    return (
      <figure>
        <img
          src={photo.url}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          className="w-full rounded-2xl border border-default object-cover"
        />
        {block.caption ? (
          <figcaption className="mt-3 text-sm text-muted">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "bullets") {
    return (
      <div className="rounded-2xl border border-default bg-panel p-6">
        {block.title ? (
          <h3 className="font-sans text-lg font-semibold text-primary">
            {block.title}
          </h3>
        ) : null}
        <ul className={block.title ? "mt-4 space-y-3" : "space-y-3"}>
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-secondary">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (block.type === "stats") {
    return (
      <div className="dark overflow-hidden rounded-2xl border border-default bg-app">
        {block.title ? (
          <h2 className="px-8 pt-8 text-balance font-serif text-2xl font-medium tracking-tight text-primary">
            {block.title}
          </h2>
        ) : null}
        <div className="grid gap-px bg-panel p-px sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item) => (
            <div key={item.label} className="bg-app p-6">
              <div className="font-serif text-3xl font-medium tracking-tight text-primary">
                {item.value}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <div className="space-y-5 pt-4">
        {block.title ? (
          <h2 className="text-balance font-serif text-3xl font-medium tracking-tight text-primary">
            {block.title}
          </h2>
        ) : null}
        <ul className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-default bg-panel p-6"
            >
              <h3 className="font-sans text-lg font-semibold text-primary">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-secondary">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const photo = block.photo
    ? resolveClientStoryImage(block.photo)
    : undefined;

  return (
    <aside className="rounded-2xl border border-default bg-surface p-7 lg:p-9">
      {photo ? (
        <img
          src={photo.url}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          className="mb-6 size-24 rounded-full border border-active object-cover shadow-md"
        />
      ) : null}
      <blockquote className="text-balance font-serif text-2xl font-medium italic tracking-tight text-primary">
        &ldquo;{block.text}&rdquo;
      </blockquote>
      <p className="mt-4 text-sm font-semibold text-brand-accent">
        {block.attribution}
      </p>
    </aside>
  );
}

export default function ClientStoryAnnouncementBodySection({
  blocks,
}: ClientStoryAnnouncementBodyProps) {
  return (
    <section className="border-b border-default bg-app px-gutter py-24">
      <div className="mx-auto max-w-3xl space-y-8">
        {blocks.map((block, index) => (
          <Reveal key={JSON.stringify(block)} delay={index * 30}>
            <AnnouncementBlockContent block={block} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
