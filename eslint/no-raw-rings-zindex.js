// Standalone ESLint flat-config rule: ban off-system focus-ring and z-index magic numbers in
// favour of the kit's tokens — numbered OR arbitrary ring widths/offsets (`ring-2`, `ring-1`,
// `ring-[3px]`, `ring-offset-2`) and numbered OR arbitrary z-index (`z-50`, `z-[70]`). Sibling to
// no-raw-colors.js / no-raw-dimensions.js in the Northwind governance overlay.
//
//   import { noRawRingsZindex } from "./eslint/no-raw-rings-zindex.js";
//   ... plugins: { northwind: { rules: { "no-raw-rings-zindex": noRawRingsZindex } } },
//       rules: { "northwind/no-raw-rings-zindex": "error" }
//
// Why numbered Tailwind utilities are off-system here (unlike the spacing scale): `ring-2` hardcodes
// 2px and `z-50` hardcodes 50 — neither references the kit's `--ring-width` / `--z-*` tokens.
// (Spacing differs: `p-4` = `--spacing × 4`, genuinely on-token, so no-raw-dimensions allows it.)
//
// ALLOWS:
//   - token ring width/offset:  ring-[length:var(--ring-width)], ring-offset-[length:var(--ring-offset)]
//   - ring colors + modifiers:  ring-brand, ring-error, ring-muted/50, ring-inset, ring-offset-surface
//   - the named z-scale:        z-base, z-dropdown, z-sticky, z-overlay, z-modal, z-popover, z-toast, z-tooltip
// BANS:
//   - numbered/raw ring width:  ring-0/1/2/4/8, ring-[3px]
//   - numbered/raw ring offset: ring-offset-0/1/2/…, ring-offset-[4px]
//   - numbered/raw z-index:     z-0/10/20/30/40/50, z-[70]

const RING_TOKEN = "ring-[length:var(--ring-width)]";
const OFFSET_TOKEN = "ring-offset-[length:var(--ring-offset)]";
const Z_NAMED =
  "a named layer (z-dropdown · z-sticky · z-overlay · z-modal · z-popover · z-toast · z-tooltip)";

// Order matters: test the more specific `ring-offset` before `ring`. The \b boundary lets
// variant/state prefixes through (focus:ring-2, focus-visible:ring-offset-2) without matching
// mid-identifier (during, string). A bracket must hold a bare length/number, so `var(...)` token
// refs (ring-[length:var(--ring-width)], z-[var(--z-modal)]) are allowed.
const PATTERNS = [
  { re: /\bring-offset-\d+\b/, fix: OFFSET_TOKEN },
  { re: /\bring-offset-\[-?[0-9.]+(?:px|rem|em)\]/, fix: OFFSET_TOKEN },
  { re: /\bring-\d+\b/, fix: RING_TOKEN },
  { re: /\bring-\[-?[0-9.]+(?:px|rem|em)\]/, fix: RING_TOKEN },
  { re: /\bz-\d+\b/, fix: Z_NAMED },
  { re: /\bz-\[-?\d+(?:px|rem|em)?\]/, fix: Z_NAMED },
];

function findRawRingOrZ(value) {
  for (const { re, fix } of PATTERNS) {
    const m = value.match(re);
    if (m) return { cls: m[0], fix };
  }
  return null;
}

export const noRawRingsZindex = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Use the kit's focus-ring and z-index tokens, not magic ring widths or z-index numbers.",
    },
    messages: {
      raw: 'Off-system value "{{cls}}". Use {{fix}} instead. See the design-system skill.',
    },
    schema: [],
  },
  create(context) {
    const report = (node, value) => {
      const hit = findRawRingOrZ(value);
      if (hit) context.report({ node, messageId: "raw", data: { cls: hit.cls, fix: hit.fix } });
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

// Ready-to-spread flat-config plugin object (compose with the other overlay rules).
export const northwindRingsZindex = { rules: { "no-raw-rings-zindex": noRawRingsZindex } };
