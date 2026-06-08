// Standalone ESLint flat-config rule: ban raw, off-system spacing & type values —
// arbitrary Tailwind length utilities for padding/margin/gap/space (e.g. `p-[17px]`,
// `-mt-[4px]`, `gap-[13px]`) and arbitrary font sizes (e.g. `text-[40px]`, `text-[10px]`) —
// in favour of the tokenized scale. Sibling to no-raw-colors.js; part of the Northwind
// governance overlay. Drop into any flat config:
//
//   import { noRawDimensions } from "./eslint/no-raw-dimensions.js";
//   export default [
//     ...,
//     { files: ["**/*.{ts,tsx}"], plugins: { northwind: { rules: { "no-raw-dimensions": noRawDimensions } } },
//       rules: { "northwind/no-raw-dimensions": "error" } },
//   ];
//
// ALLOWS (all on-token):
//   - the numeric scale, which derives from --spacing:  p-4, py-24, gap-8, mt-16
//   - named layout-intent steps:                        py-section, p-card, px-gutter, gap-stack
//   - the type scale:                                   text-xs … text-5xl, text-display
//   - arbitrary values that REFERENCE a token:          text-[length:var(--x)], p-[var(--spacing-card)]
//     (anything whose bracket content is not a bare length literal)
// BANS:
//   - a bracketed RAW length on a spacing/type prefix:  p-[17px], text-[40px], gap-[1.5rem]
//
// Out of scope on purpose (separate token families — candidates for a follow-up rule):
// width/height/inset/grid (often legitimately arbitrary), ring-width (`ring-[3px]`),
// z-index (`z-[70]`). This rule governs the spacing rhythm and the type scale only.

// `\b<prefix>-[<raw length>]` — the \b boundary lets variant/negative prefixes through
// (lg:py-[..], hover:gap-[..], -mt-[..]) while never matching mid-identifier (backdrop, min-w).
// The bracket must contain ONLY a length literal, so `var(...)`/`length:var(...)` refs are allowed.
const SPACING_TYPE_ARBITRARY =
  /\b(?:p[xytblrse]?|m[xytblrse]?|gap(?:-[xy])?|space-[xy]|text)-\[-?[0-9.]+(?:px|rem|em|ch|ex|vh|vw|vmin|vmax|pt|cm|mm|in)\]/;

function findRawDimension(value) {
  return value.match(SPACING_TYPE_ARBITRARY)?.[0] ?? null;
}

export const noRawDimensions = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Use the tokenized spacing/type scale, not arbitrary length values.",
    },
    messages: {
      raw: 'Off-system spacing/type value "{{cls}}". Use the tokenized scale instead — the numeric scale (p-4, py-24), a named step (py-section, p-card, px-gutter), or the type scale (text-xs…text-5xl, text-display). See the design-system skill.',
    },
    schema: [],
  },
  create(context) {
    const report = (node, value) => {
      const hit = findRawDimension(value);
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

// Ready-to-spread flat-config plugin object (compose with no-raw-colors under one namespace).
export const northwindDimensions = { rules: { "no-raw-dimensions": noRawDimensions } };
