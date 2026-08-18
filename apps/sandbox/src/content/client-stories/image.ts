import { z } from "zod";

const NonEmptyStringSchema = z.string().trim().min(1);

export const ClientStoryAssetNameSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:png|jpe?g|webp|avif)$/);

const ImageDetailsSchema = z
  .object({
    alt: NonEmptyStringSchema,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })
  .strict();

const RemoteImageSchema = ImageDetailsSchema.extend({
  url: z.string().url().refine((url) => url.startsWith("https://"), {
    message: "must use an https URL",
  }),
}).strict();

const LocalImageSchema = ImageDetailsSchema.extend({
  asset: ClientStoryAssetNameSchema,
}).strict();

export const ClientStoryImageInputSchema = z.union([
  RemoteImageSchema,
  LocalImageSchema,
]);

export type ClientStoryImageInput = z.infer<
  typeof ClientStoryImageInputSchema
>;

export type ClientStoryImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};
