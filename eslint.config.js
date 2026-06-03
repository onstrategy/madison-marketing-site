import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { northwind } from "./eslint/no-raw-colors.js";

// Shared flat config for the whole kit. ESLint resolves this from any
// workspace package by walking up to the repo root.
// The `northwind/no-raw-colors` rule (eslint/no-raw-colors.js) bans off-system color
// classes — it's shippable on its own as part of the governance overlay.
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
