import { z } from "zod";
import { SectionInputSchema } from "../sections/schema";

const NonEmptyStringSchema = z.string().trim().min(1);
const AssetNameSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:png|jpe?g|webp|avif)$/);
const PublicPathSchema = z
  .string()
  .regex(
    /^\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/,
    "must be a flat lowercase public path with leading and trailing slashes",
  );

export const NewsArticleDocumentSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    path: PublicPathSchema,
    order: z.number().int().nonnegative(),
    category: z.enum(["Insights", "Team", "Company"]),
    sourceUrl: z.string().url().refine((url) => url.startsWith("https://"), {
      message: "must use an https URL",
    }),
    metadata: z
      .object({
        title: NonEmptyStringSchema,
        description: NonEmptyStringSchema,
        seoTitle: NonEmptyStringSchema.optional(),
        ogImageAsset: AssetNameSchema.optional(),
        noindex: z.boolean().optional(),
      })
      .strict(),
    card: z
      .object({
        title: NonEmptyStringSchema,
        description: NonEmptyStringSchema,
        imageAsset: AssetNameSchema,
        imageAlt: NonEmptyStringSchema,
      })
      .strict(),
    sections: z.array(SectionInputSchema).min(1),
  })
  .strict();

export type NewsArticleDocument = z.infer<typeof NewsArticleDocumentSchema>;

export type NewsArticleSource = {
  source: string;
  value: unknown;
};

export type NewsArticleCollectionResult =
  | { ok: true; value: NewsArticleDocument[] }
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

export function buildNewsArticleCollection(
  sources: NewsArticleSource[],
): NewsArticleCollectionResult {
  const entries: Array<{ source: string; document: NewsArticleDocument }> = [];
  const errors: string[] = [];

  for (const source of sources) {
    const result = NewsArticleDocumentSchema.safeParse(source.value);
    if (!result.success) {
      errors.push(validationMessage(source.source, result.error));
      continue;
    }
    entries.push({ source: source.source, document: result.data });
  }

  const sourceById = new Map<string, string>();
  const sourceByPath = new Map<string, string>();
  for (const { source, document } of entries) {
    const previousIdSource = sourceById.get(document.id);
    if (previousIdSource) {
      errors.push(
        `${document.id}: duplicate news id in ${previousIdSource} and ${source}`,
      );
    } else {
      sourceById.set(document.id, source);
    }

    const previousPathSource = sourceByPath.get(document.path);
    if (previousPathSource) {
      errors.push(
        `${document.path}: duplicate public path used by ${previousPathSource} and ${source}`,
      );
    } else {
      sourceByPath.set(document.path, source);
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
