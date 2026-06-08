import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { noRawColors } from "./eslint/no-raw-colors.js";
import { noRawDimensions } from "./eslint/no-raw-dimensions.js";
import { noRawRingsZindex } from "./eslint/no-raw-rings-zindex.js";

// Shared flat config for the whole kit. ESLint resolves this from any
// workspace package by walking up to the repo root.
// The Northwind governance overlay composes the off-system rules into one plugin
// namespace: `no-raw-colors` (eslint/no-raw-colors.js) bans off-system color classes;
// `no-raw-dimensions` (eslint/no-raw-dimensions.js) bans arbitrary spacing/type lengths.
// Each rule is shippable on its own.
const northwind = {
  rules: {
    "no-raw-colors": noRawColors,
    "no-raw-dimensions": noRawDimensions,
    "no-raw-rings-zindex": noRawRingsZindex,
  },
};
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
    plugins: { northwind },
    rules: {
      "northwind/no-raw-colors": "error",
      "northwind/no-raw-dimensions": "error",
      "northwind/no-raw-rings-zindex": "error",
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
