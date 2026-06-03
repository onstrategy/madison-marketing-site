import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { dirname } from "path";
import { fileURLToPath } from "url";

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-themes", "@storybook/addon-mcp"],
  framework: getAbsolutePath("@storybook/react-vite"),
  features: {
    // Generate the components manifest consumed by the MCP server (addon-mcp).
    // Exposed at http://localhost:6007/mcp when running `storybook dev`.
    componentsManifest: true,
  },
  viteFinal: async (viteConfig) => {
    return {
      ...viteConfig,
      plugins: [...(viteConfig.plugins || []), tailwindcss()],
    };
  },
};

export default config;
