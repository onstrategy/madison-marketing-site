import type { PlopTypes } from "@turbo/gen";

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/;

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("prototype", {
    description:
      "Scaffold a new on-token prototype page in apps/sandbox (self-registers via import.meta.glob)",
    prompts: [
      {
        type: "input",
        name: "slug",
        message: "Prototype slug (e.g. pricing-page):",
        validate: (value: string) =>
          SLUG_PATTERN.test(value)
            ? true
            : "Use lowercase letters, numbers, and hyphens only",
      },
      {
        type: "input",
        name: "title",
        message: "Title (shown in the sandbox gallery):",
        validate: (value: string) =>
          value.trim().length > 0 ? true : "Title is required",
      },
      {
        type: "input",
        name: "description",
        message: "One-line description (optional):",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "apps/sandbox/src/prototypes/{{slug}}",
        base: "templates/prototype",
        templateFiles: "templates/prototype/**",
        globOptions: { dot: true },
      },
    ],
  });

  plop.setGenerator("promote", {
    description:
      "Promote a validated prototype component into a packages/ui primitive (primitive + story, and wires the exports map + barrel)",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Primitive slug (e.g. stat-card):",
        validate: (value: string) =>
          SLUG_PATTERN.test(value)
            ? true
            : "Use lowercase letters, numbers, and hyphens only",
      },
      {
        type: "input",
        name: "description",
        message: "One-line description (optional):",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/ui/src/primitives/{{kebabCase name}}.tsx",
        templateFile: "templates/promote/primitive.tsx.hbs",
      },
      {
        type: "add",
        path: "packages/ui/src/stories/{{pascalCase name}}.stories.tsx",
        templateFile: "templates/promote/stories.tsx.hbs",
      },
      {
        // Add the subpath export to packages/ui's public API (first entry under "exports").
        type: "modify",
        path: "packages/ui/package.json",
        pattern: /("exports": \{)/,
        template:
          '$1\n    "./{{kebabCase name}}": "./src/primitives/{{kebabCase name}}.tsx",',
      },
      {
        // Add the explicit named re-export to the primitives barrel (above the anchor).
        type: "modify",
        path: "packages/ui/src/primitives/index.ts",
        pattern: /(\n\/\/ @gen:promote anchor)/,
        template:
          '\nexport { {{pascalCase name}} } from "./{{kebabCase name}}";$1',
      },
    ],
  });
}
