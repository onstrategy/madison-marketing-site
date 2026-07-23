// Standalone ESLint flat-config rule: ban raw, off-system color utilities — Tailwind numbered
// color scales (e.g. `bg-indigo-500`) and arbitrary hex (e.g. `text-[#3b82f6]`) — in favour of
// design tokens. Part of the Madison governance overlay; drop into any flat config:
//
//   import { madison } from "./eslint/no-raw-colors.js";
//   export default [
//     ...,
//     { files: ["**/*.{ts,tsx}"], plugins: { madison }, rules: { "madison/no-raw-colors": "error" } },
//   ];
//
// Token classes (bg-surface, text-primary, bg-success-subtle, …) never match these patterns.

const TAILWIND_COLOR_SCALE =
  /\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|divide|decoration|accent|caret|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;
const ARBITRARY_HEX = /-\[#[0-9a-fA-F]{3,8}\]/;

function findRawColor(value) {
  return (
    value.match(TAILWIND_COLOR_SCALE)?.[0] ?? value.match(ARBITRARY_HEX)?.[0] ?? null
  );
}

export const noRawColors = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Use design tokens, not raw Tailwind color scales or arbitrary hex values.",
    },
    messages: {
      raw: 'Off-system color "{{cls}}". Use a design token instead (see the design-system skill).',
    },
    schema: [],
  },
  create(context) {
    const report = (node, value) => {
      const hit = findRawColor(value);
      if (hit) context.report({ node, messageId: "raw", data: { cls: hit } });
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
export const madison = { rules: { "no-raw-colors": noRawColors } };
