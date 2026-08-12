import { z } from "zod";
import { SectionInputSchema } from "../sections/schema";

const PublicPathSchema = z
  .string()
  .regex(
    /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)+$/,
    "must be a lowercase public path with a leading and trailing slash",
  );

const NonEmptyStringSchema = z.string().trim().min(1);

const PhotoSchema = z
  .object({
    url: z.string().url().refine((url) => url.startsWith("https://"), {
      message: "must use an https URL",
    }),
    alt: NonEmptyStringSchema,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })
  .strict();

const LogoAssetSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:png|jpe?g|webp|avif)$/);

export const ClientStoryDocumentSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    path: PublicPathSchema,
    order: z.number().int().nonnegative(),
    featured: z.boolean(),
    metadata: z
      .object({
        title: NonEmptyStringSchema,
        description: NonEmptyStringSchema,
        seoTitle: NonEmptyStringSchema.optional(),
        ogImage: z.string().url().optional(),
        noindex: z.boolean().optional(),
      })
      .strict(),
    card: z
      .object({
        kicker: NonEmptyStringSchema,
        title: NonEmptyStringSchema,
        summary: NonEmptyStringSchema,
        clientName: NonEmptyStringSchema,
        photo: PhotoSchema,
        logoAsset: LogoAssetSchema,
        logoAlt: NonEmptyStringSchema,
        logoWidth: z.number().int().positive(),
        logoHeight: z.number().int().positive(),
      })
      .strict(),
    sections: z.array(SectionInputSchema).min(1),
  })
  .strict();

export type ClientStoryDocument = z.infer<typeof ClientStoryDocumentSchema>;

export type ClientStorySource = {
  source: string;
  value: unknown;
};

export type ClientStoryCollectionResult =
  | { ok: true; value: ClientStoryDocument[] }
  | { ok: false; errors: string[] };

function validationMessage(source: string, error: z.ZodError): string {
  const issues = error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "document";
      return `${path}: ${issue.message}`;
    })
    .join("; ");

  return `${source}: ${issues}`;
}

export function buildClientStoryCollection(
  sources: ClientStorySource[],
): ClientStoryCollectionResult {
  const entries: Array<{ source: string; document: ClientStoryDocument }> = [];
  const errors: string[] = [];

  for (const source of sources) {
    const result = ClientStoryDocumentSchema.safeParse(source.value);
    if (!result.success) {
      errors.push(validationMessage(source.source, result.error));
      continue;
    }
    entries.push({ source: source.source, document: result.data });
  }

  const sourceById = new Map<string, string>();
  const sourceByPath = new Map<string, string>();
  for (const { source, document: entry } of entries) {
    const previousIdSource = sourceById.get(entry.id);
    if (previousIdSource) {
      errors.push(
        `${entry.id}: duplicate client story id in ${previousIdSource} and ${source}`,
      );
    } else {
      sourceById.set(entry.id, source);
    }

    const previousPathSource = sourceByPath.get(entry.path);
    if (previousPathSource) {
      errors.push(
        `${entry.path}: duplicate public path used by ${previousPathSource} and ${source}`,
      );
    } else {
      sourceByPath.set(entry.path, source);
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: entries
      .map(({ document }) => document)
      .sort(
        (left, right) =>
          left.order - right.order || left.id.localeCompare(right.id),
      ),
  };
}
