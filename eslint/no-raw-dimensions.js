// Standalone ESLint flat-config rule: ban raw, off-system spacing & type values —
// arbitrary Tailwind length utilities for padding/margin/gap/space (e.g. `p-[17px]`,
// `-mt-[4px]`, `gap-[13px]`) and arbitrary font sizes (e.g. `text-[40px]`, `text-[10px]`) —
// in favour of the tokenized scale. Sibling to no-raw-colors.js; part of the Madison
// governance overlay. Drop into any flat config:
//
//   import { noRawDimensions } from "./eslint/no-raw-dimensions.js";
//   export default [
//     ...,
//     { files: ["**/*.{ts,tsx}"], plugins: { madison: { rules: { "no-raw-dimensions": noRawDimensions } } },
//       rules: { "madison/no-raw-dimensions": "error" } },
//   ];
//
// ALLOWS (all on-token):
//   - the numeric scale, which derives from --spacing:  p-4, py-24, gap-8, mt-16
//   - named layout-intent steps:                        py-section, p-card, px-gutter, gap-stack
//   - the type scale:                                   text-xs … text-5xl, text-display
//   - the line-height override scale:                   leading-tight … leading-loose
//   - `leading-none` — a Tailwind STATIC utility hardcoded to line-height:1. It sits outside
//     the --leading-* namespace so no token governs it, but it also never reads the theme,
//     so it cannot drift. The kit uses it deliberately for single-line labels and titles.
//   - arbitrary values that REFERENCE a token:          text-[length:var(--x)], p-[var(--spacing-card)],
//     (anything whose bracket content is not a bare      leading-[var(--leading-snug)]
//     length literal)
// BANS:
//   - a bracketed RAW length on a spacing/type prefix:  p-[17px], text-[40px], gap-[1.5rem]
//   - a bracketed RAW line-height:                      leading-[1.4], leading-[28px]
//   - the NUMERIC line-height form:                     leading-7, leading-10
//     Tailwind resolves `leading-<number>` through --spacing into a fixed rem, which pins the
//     line-height against the font-size instead of scaling with it. Unitless ratios only.
//
// Out of scope on purpose (separate token families — candidates for a follow-up rule):
// width/height/inset/grid (often legitimately arbitrary), ring-width (`ring-[3px]`),
// z-index (`z-[70]`). This rule governs the spacing rhythm and the type scale only.

// `\b<prefix>-[<raw length>]` — the \b boundary lets variant/negative prefixes through
// (lg:py-[..], hover:gap-[..], -mt-[..]) while never matching mid-identifier (backdrop, min-w).
// The bracket must contain ONLY a length literal, so `var(...)`/`length:var(...)` refs are allowed.
const SPACING_TYPE_ARBITRARY =
  /\b(?:p[xytblrse]?|m[xytblrse]?|gap(?:-[xy])?|space-[xy]|text)-\[-?[0-9.]+(?:px|rem|em|ch|ex|vh|vw|vmin|vmax|pt|cm|mm|in)\]/;

// Line-height gets its own pattern: unlike every other scale here, its values are
// commonly UNITLESS (`leading-[1.4]`), so the unit group has to be optional. `%` is
// allowed in the unit list for the same reason — a percentage line-height is valid CSS
// and just as off-system, whereas `p-[50%]` is a layout width and out of this rule's
// scope. Token references (`leading-[var(--leading-snug)]`) still pass — the bracket
// must hold a bare number or length for this to fire.
const LEADING_ARBITRARY =
  /\bleading-\[-?[0-9.]+(?:px|rem|em|ch|ex|vh|vw|vmin|vmax|pt|cm|mm|in|%)?\]/;

// Tailwind also accepts `leading-<number>`, which resolves through --spacing to a FIXED
// rem (leading-7 → 1.75rem). That pins line-height against the font-size instead of
// scaling with it, and no --leading-* token governs it. The lookbehind keeps this off
// CSS custom properties (`--leading-7`) while still catching variants (`lg:leading-7`).
const LEADING_NUMERIC = /(?<![\w-])leading-\d+\b/;

function findRawDimension(value) {
  return (
    value.match(SPACING_TYPE_ARBITRARY)?.[0] ??
    value.match(LEADING_ARBITRARY)?.[0] ??
    value.match(LEADING_NUMERIC)?.[0] ??
    null
  );
}

export const noRawDimensions = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Use the tokenized spacing/type scale, not arbitrary length values.",
    },
    messages: {
      raw: 'Off-system spacing/type value "{{cls}}". Use the tokenized scale instead — the numeric scale (p-4, py-24), a named step (py-section, p-card, px-gutter), the type scale (text-xs…text-5xl, text-display), or the line-height scale (leading-tight…leading-loose, plus leading-none for single-line text). See the design-system skill.',
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
export const madisonDimensions = { rules: { "no-raw-dimensions": noRawDimensions } };
