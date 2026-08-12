import { z } from "zod";

const SectionTypeSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "must be a lowercase kebab-case section type",
  );

export const SectionInputSchema = z
  .object({
    type: SectionTypeSchema,
    props: z.record(z.string(), z.unknown()),
  })
  .strict();

export type SectionInput = z.infer<typeof SectionInputSchema>;
export type SectionProps = SectionInput["props"];
