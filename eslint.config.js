import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { noRawColors } from "./eslint/no-raw-colors.js";
import { noRawDimensions } from "./eslint/no-raw-dimensions.js";
import { noRawRingsZindex } from "./eslint/no-raw-rings-zindex.js";
import { noFontMono } from "./eslint/no-font-mono.js";

// Shared flat config for the whole kit. ESLint resolves this from any
// workspace package by walking up to the repo root.
// The Madison governance overlay composes the off-system rules into one plugin
// namespace: `no-raw-colors` (eslint/no-raw-colors.js) bans off-system color classes;
// `no-raw-dimensions` (eslint/no-raw-dimensions.js) bans arbitrary spacing/type lengths;
// `no-font-mono` (eslint/no-font-mono.js) bans the retired JetBrains Mono family.
// Each rule is shippable on its own.
const madison = {
  rules: {
    "no-raw-colors": noRawColors,
    "no-raw-dimensions": noRawDimensions,
    "no-raw-rings-zindex": noRawRingsZindex,
    "no-font-mono": noFontMono,
  },
};
export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      // @madison/site's prerender bundle — build output, same as dist.
      "**/dist-ssr/**",
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
    plugins: { madison },
    rules: {
      "madison/no-raw-colors": "error",
      "madison/no-raw-dimensions": "error",
      "madison/no-raw-rings-zindex": "error",
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
