import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

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
  },
  {
    // Generator/build scripts run under Node via bun, not part of the src graph.
    files: ["**/scripts/**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
);
