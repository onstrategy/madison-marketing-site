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
}
