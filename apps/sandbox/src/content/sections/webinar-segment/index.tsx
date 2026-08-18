import { useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import { z } from "zod";
import { cn } from "@madison/ui/utils";
import { resolveWebinarAsset } from "../../webinars/assets";
import { Eyebrow, Reveal } from "../../../prototypes/landing/parts";

const NonEmptyStringSchema = z.string().trim().min(1);
const AssetNameSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:png|jpe?g|webp|avif)$/);
const WistiaIdSchema = z.string().regex(/^[a-z0-9]+$/);

const WebinarListItemSchema = z.union([
  NonEmptyStringSchema,
  z
    .object({
      label: NonEmptyStringSchema,
      description: NonEmptyStringSchema,
    })
    .strict(),
]);

const WebinarQuoteInputSchema = z
  .object({
    quote: NonEmptyStringSchema,
    attribution: NonEmptyStringSchema.optional(),
    portrait: z
      .object({
        asset: AssetNameSchema,
        alt: NonEmptyStringSchema,
      })
      .strict()
      .optional(),
  })
  .strict();

const WebinarVideoSchema = z
  .object({
    title: NonEmptyStringSchema,
    wistiaId: WistiaIdSchema,
  })
  .strict();

const WebinarCalloutSchema = z
  .object({
    title: NonEmptyStringSchema,
    description: NonEmptyStringSchema.optional(),
    link: z
      .object({
        label: NonEmptyStringSchema,
        href: z.string().refine(
          (href) => href.startsWith("https://") || href.startsWith("mailto:"),
          { message: "must use an https or mailto URL" },
        ),
      })
      .strict()
      .optional(),
  })
  .strict();

const WebinarSegmentInputSchema = z
  .object({
    eyebrow: NonEmptyStringSchema.optional(),
    heading: NonEmptyStringSchema,
    paragraphs: z.array(NonEmptyStringSchema).default([]),
    items: z.array(WebinarListItemSchema).default([]),
    quotes: z.array(WebinarQuoteInputSchema).default([]),
    videos: z.array(WebinarVideoSchema).default([]),
    callout: WebinarCalloutSchema.optional(),
  })
  .strict();

const WebinarSegmentPropsSchema = WebinarSegmentInputSchema.transform(
  ({ quotes, ...props }) => ({
    ...props,
    quotes: quotes.map(({ portrait, ...quote }) => ({
      ...quote,
      portrait: portrait
        ? { ...portrait, url: resolveWebinarAsset(portrait.asset) }
        : undefined,
    })),
  }),
);

type WebinarSegmentProps = z.infer<typeof WebinarSegmentPropsSchema>;
type WebinarListItem = z.infer<typeof WebinarListItemSchema>;
type WebinarVideo = z.infer<typeof WebinarVideoSchema>;

export function parseProps(input: unknown): WebinarSegmentProps {
  return WebinarSegmentPropsSchema.parse(input);
}

function SegmentVideo({ video }: { video: WebinarVideo }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="light overflow-hidden rounded-xl border border-default bg-surface">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-3.5 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-3.5 text-sm font-semibold text-primary">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg transition-transform group-hover:scale-110">
            <Play className="size-4 fill-current" aria-hidden="true" />
          </span>
          {video.title}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 text-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="relative aspect-video border-t border-default">
          <iframe
            src={`https://fast.wistia.net/embed/iframe/${video.wistiaId}?web_component=true&seo=true`}
            title={video.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full"
          />
        </div>
      ) : null}
    </div>
  );
}

function ItemContent({ item }: { item: WebinarListItem }) {
  if (typeof item === "string") return item;
  return (
    <>
      <span className="font-semibold text-primary">{item.label}</span>{" "}
      {item.description}
    </>
  );
}

export default function WebinarSegmentSection({
  eyebrow,
  heading,
  paragraphs,
  items,
  quotes,
  videos,
  callout,
}: WebinarSegmentProps) {
  return (
    <section className="border-b border-default bg-app px-gutter py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
          <h2 className="text-balance font-serif text-3xl font-medium tracking-tight text-primary">
            {heading}
          </h2>
          {paragraphs.length > 0 ? (
            <div className="mt-6 space-y-4">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-pretty leading-relaxed text-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
        </Reveal>

        {items.length > 0 ? (
          <Reveal delay={60}>
            <ul className="mt-8 space-y-3">
              {items.map((item) => (
                <li
                  key={typeof item === "string" ? item : item.label}
                  className="flex items-start gap-3 rounded-xl border border-default bg-surface p-5 leading-relaxed text-secondary"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                  <span>
                    <ItemContent item={item} />
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {quotes.map((quote, index) => (
          <Reveal
            key={`${quote.quote}-${quote.attribution ?? ""}`}
            delay={80 + index * 30}
          >
            <figure className="mt-8 flex flex-col gap-5 rounded-2xl border border-default bg-panel p-6 sm:flex-row lg:p-8">
              {quote.portrait ? (
                <img
                  src={quote.portrait.url}
                  alt={quote.portrait.alt}
                  className="size-20 shrink-0 rounded-full border border-active object-cover"
                />
              ) : null}
              <div>
                <blockquote className="text-pretty font-serif text-xl font-medium italic tracking-tight text-primary">
                  {quote.quote}
                </blockquote>
                {quote.attribution ? (
                  <figcaption className="mt-3 text-sm font-semibold text-secondary">
                    {quote.attribution}
                  </figcaption>
                ) : null}
              </div>
            </figure>
          </Reveal>
        ))}

        {callout ? (
          <Reveal delay={120}>
            <aside className="dark mt-8 rounded-2xl bg-brand-subtle p-6 lg:p-8">
              <h3 className="font-serif text-2xl font-medium tracking-tight text-primary">
                {callout.title}
              </h3>
              {callout.description ? (
                <p className="mt-3 leading-relaxed text-secondary">
                  {callout.description}
                </p>
              ) : null}
              {callout.link ? (
                <a
                  href={callout.link.href}
                  {...(callout.link.href.startsWith("https://")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="mt-4 inline-flex text-sm font-semibold text-brand-accent hover:underline"
                >
                  {callout.link.label}
                </a>
              ) : null}
            </aside>
          </Reveal>
        ) : null}

        {videos.length > 0 ? (
          <div className="mt-8 space-y-4">
            {videos.map((video, index) => (
              <Reveal key={video.wistiaId} delay={140 + index * 30}>
                <SegmentVideo video={video} />
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
