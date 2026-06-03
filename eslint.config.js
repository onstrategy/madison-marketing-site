import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

// Local rule: ban raw, off-system color utilities (Tailwind numbered color scales like
// `bg-indigo-500` and arbitrary hex like `text-[#3b82f6]`) in favor of design tokens.
// This closes the gap typecheck/tests can't see — `bun run check`'s lint step now flags
// the kind of off-system class the promote/contributor flow must reject. Token classes
// (bg-surface, text-primary, bg-success-subtle, …) never match these patterns.
const TAILWIND_COLOR_SCALE =
  /\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|divide|decoration|accent|caret|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;
const ARBITRARY_HEX = /-\[#[0-9a-fA-F]{3,8}\]/;

function findRawColor(value) {
  return (
    value.match(TAILWIND_COLOR_SCALE)?.[0] ?? value.match(ARBITRARY_HEX)?.[0] ?? null
  );
}

const noRawColors = {
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

// Shared flat config for the whole kit. ESLint resolves this from any
// workspace package by walking up to the repo root.
export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/storybook-static/**",
      "**/.turbo/**",
      "**/*.config.{js,ts}",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      northwind: { rules: { "no-raw-colors": noRawColors } },
    },
    rules: {
      "northwind/no-raw-colors": "error",
    },
  },
  {
    // Generator/build scripts run under Node via bun, not part of the src graph.
    files: ["**/scripts/**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
);
