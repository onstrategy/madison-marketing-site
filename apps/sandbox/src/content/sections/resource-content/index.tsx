import type { ReactNode } from "react";
import { z } from "zod";
import { resolveResponsibleAiAsset } from "../../responsible-ai/assets";
import { Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);
const HttpsUrlSchema = z.string().url().refine((href) => href.startsWith("https://"), {
  message: "must use an https URL",
});

const InlinePartSchema = z.union([
  NonEmptyStringSchema,
  z
    .object({
      type: z.literal("link"),
      text: NonEmptyStringSchema,
      href: HttpsUrlSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal("strong"),
      text: NonEmptyStringSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal("emphasis"),
      text: NonEmptyStringSchema,
    })
    .strict(),
]);

const InlineContentSchema = z.array(InlinePartSchema).min(1);

const ResourceBlockSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("heading"),
      level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
      content: InlineContentSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal("paragraph"),
      content: InlineContentSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal("list"),
      style: z.enum(["ordered", "unordered"]),
      items: z.array(InlineContentSchema).min(1),
    })
    .strict(),
  z
    .object({
      type: z.literal("image"),
      asset: NonEmptyStringSchema,
      alt: NonEmptyStringSchema,
      caption: NonEmptyStringSchema.optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal("video"),
      provider: z.literal("youtube"),
      videoId: z.string().regex(/^[A-Za-z0-9_-]{6,20}$/),
      title: NonEmptyStringSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal("quote"),
      content: InlineContentSchema,
    })
    .strict(),
]);

const ResourceContentPropsSchema = z
  .object({
    blocks: z.array(ResourceBlockSchema).min(1),
  })
  .strict();

type InlinePart = z.infer<typeof InlinePartSchema>;
type ResourceBlock = z.infer<typeof ResourceBlockSchema>;
type ResourceContentProps = z.infer<typeof ResourceContentPropsSchema>;

export function parseProps(input: unknown): ResourceContentProps {
  return ResourceContentPropsSchema.parse(input);
}

function InlineContent({ content }: { content: InlinePart[] }) {
  return content.map((part): ReactNode => {
    if (typeof part === "string") return part;
    if (part.type === "strong") {
      return <strong key={JSON.stringify(part)}>{part.text}</strong>;
    }
    if (part.type === "emphasis") {
      return <em key={JSON.stringify(part)}>{part.text}</em>;
    }
    return (
      <a
        key={JSON.stringify(part)}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-brand-accent underline-offset-4 hover:underline"
      >
        {part.text}
      </a>
    );
  });
}

function HeadingBlock({ block }: { block: Extract<ResourceBlock, { type: "heading" }> }) {
  if (block.level === 2) {
    return (
      <h2 className="mb-5 mt-14 text-balance font-serif text-3xl font-medium tracking-tight text-primary first:mt-0">
        <InlineContent content={block.content} />
      </h2>
    );
  }
  if (block.level === 3) {
    return (
      <h3 className="mb-4 mt-10 text-balance font-serif text-2xl font-medium tracking-tight text-primary first:mt-0">
        <InlineContent content={block.content} />
      </h3>
    );
  }
  return (
    <h4 className="mb-3 mt-8 font-sans text-lg font-semibold text-primary first:mt-0">
      <InlineContent content={block.content} />
    </h4>
  );
}

function ResourceBlockView({ block }: { block: ResourceBlock }) {
  if (block.type === "heading") return <HeadingBlock block={block} />;
  if (block.type === "paragraph") {
    return (
      <p className="my-5 text-pretty leading-relaxed text-secondary">
        <InlineContent content={block.content} />
      </p>
    );
  }
  if (block.type === "list") {
    const List = block.style === "ordered" ? "ol" : "ul";
    return (
      <List
        className={`my-6 ml-6 space-y-3 leading-relaxed text-secondary ${
          block.style === "ordered" ? "list-decimal" : "list-disc"
        }`}
      >
        {block.items.map((item) => (
          <li key={JSON.stringify(item)}>
            <InlineContent content={item} />
          </li>
        ))}
      </List>
    );
  }
  if (block.type === "image") {
    return (
      <figure className="my-10">
        <img
          src={resolveResponsibleAiAsset(block.asset)}
          alt={block.alt}
          loading="lazy"
          className="w-full rounded-2xl border border-default bg-surface"
        />
        {block.caption ? (
          <figcaption className="mt-3 text-center text-sm text-muted">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }
  if (block.type === "video") {
    return (
      <div className="my-10 overflow-hidden rounded-2xl border border-default bg-surface shadow-sm">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${block.videoId}`}
          title={block.title}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="aspect-video w-full"
        />
      </div>
    );
  }
  return (
    <blockquote className="my-10 border-l-4 border-brand pl-6 font-serif text-xl leading-relaxed text-primary">
      <InlineContent content={block.content} />
    </blockquote>
  );
}

export default function ResourceContentSection({ blocks }: ResourceContentProps) {
  return (
    <section className="border-b border-default bg-app px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          {blocks.map((block) => (
            <ResourceBlockView key={JSON.stringify(block)} block={block} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
