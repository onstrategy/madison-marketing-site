// Standalone ESLint flat-config rule: ban `font-mono` outright. Madison retired
// JetBrains Mono — the `--font-mono` token no longer exists in tokens.tsx, so
// this class would silently fall back to Tailwind's own default monospace
// stack instead of failing loudly. Use `font-sans` (Inter) instead; for the
// micro/overline-label role JetBrains Mono used to play, pair it with `text-2xs`.
// Sibling to no-raw-colors.js / no-raw-dimensions.js; part of the Madison
// governance overlay. Drop into any flat config:
//
//   import { noFontMono } from "./eslint/no-font-mono.js";
//   export default [
//     ...,
//     { files: ["**/*.{ts,tsx}"], plugins: { madison: { rules: { "no-font-mono": noFontMono } } },
//       rules: { "madison/no-font-mono": "error" } },
//   ];

const FONT_MONO = /\bfont-mono\b/;

function findFontMono(value) {
  return value.match(FONT_MONO)?.[0] ?? null;
}

export const noFontMono = {
  meta: {
    type: "problem",
    docs: {
      description:
        "JetBrains Mono is retired — never use font-mono. Use font-sans (Inter), paired with text-2xs for the old micro-label role.",
    },
    messages: {
      raw: '"font-mono" is banned — JetBrains Mono is retired from this design system. Use "font-sans" instead (pair with "text-2xs" for micro/overline labels).',
    },
    schema: [],
  },
  create(context) {
    const report = (node, value) => {
      const hit = findFontMono(value);
      if (hit) context.report({ node, messageId: "raw" });
    };
    return {
      Literal(node) {
        if (typeof node.value === "string") report(node, node.value);
      },
      TemplateElement(node) {
        report(node, node.value.raw);
      },
    };
  },
};

// Ready-to-spread flat-config plugin object.
export const madisonFontMono = { rules: { "no-font-mono": noFontMono } };
