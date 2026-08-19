import { access, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { Config } from "@react-router/dev/config";
import { buildClientStoryCollection } from "../sandbox/src/content/client-stories/schema";
import { buildNewsArticleCollection } from "../sandbox/src/content/news/schema";
import { buildWebinarCollection } from "../sandbox/src/content/webinars/schema";
import { buildResponsibleAiCollection } from "../sandbox/src/content/responsible-ai/schema";

const prototypesDirectory = fileURLToPath(
  new URL("../sandbox/src/prototypes/", import.meta.url),
);
const clientStoriesDirectory = fileURLToPath(
  new URL(
    "../sandbox/src/content/client-stories/entries/",
    import.meta.url,
  ),
);
const newsDirectory = fileURLToPath(
  new URL("../sandbox/src/content/news/entries/", import.meta.url),
);
const webinarsDirectory = fileURLToPath(
  new URL("../sandbox/src/content/webinars/entries/", import.meta.url),
);
const responsibleAiDirectory = fileURLToPath(
  new URL(
    "../sandbox/src/content/responsible-ai/entries/",
    import.meta.url,
  ),
);
const seoAudit = process.env.SEO_AUDIT === "true";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function prerenderRequestPath(path: string): string {
  if (path === "/") return path;
  return path.replace(/\/+$/, "");
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function prototypePaths(): Promise<string[]> {
  const directories = (await readdir(prototypesDirectory, {
    withFileTypes: true,
  }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const paths: string[] = [];
  for (const slug of directories) {
    const directory = join(prototypesDirectory, slug);
    const indexFile = join(directory, "index.tsx");
    const metaFile = join(directory, "meta.ts");
    if (!(await fileExists(indexFile))) continue;
    if (!(await fileExists(metaFile))) {
      throw new Error(`Published prototype is missing meta.ts: ${slug}`);
    }

    const imported: unknown = await import(
      /* @vite-ignore */ pathToFileURL(metaFile).href
    );
    if (!isRecord(imported) || !isRecord(imported.default)) {
      throw new Error(`Prototype meta.ts has no default object export: ${slug}`);
    }

    const meta = imported.default;
    if (typeof meta.title !== "string" || meta.title.trim().length === 0) {
      throw new Error(`Prototype meta.ts has no non-empty title: ${slug}`);
    }
    if (meta.publish !== undefined && typeof meta.publish !== "boolean") {
      throw new Error(`Prototype meta.ts publish must be boolean: ${slug}`);
    }
    if (meta.publish === false) continue;
    if (meta.path !== undefined && typeof meta.path !== "string") {
      throw new Error(`Prototype meta.ts path must be a string: ${slug}`);
    }

    const path = slug === "landing" ? "/" : (meta.path ?? `/${slug}`);
    paths.push(prerenderRequestPath(path));
  }

  return paths;
}

async function clientStoryPaths(): Promise<string[]> {
  const files = (await readdir(clientStoriesDirectory))
    .filter((file) => file.endsWith(".json"))
    .sort();
  const sources = await Promise.all(
    files.map(async (file) => {
      const source = join(clientStoriesDirectory, file);
      const value: unknown = JSON.parse(await readFile(source, "utf8"));
      return { source, value };
    }),
  );
  const result = buildClientStoryCollection(sources);
  if (!result.ok) {
    throw new Error(
      `Invalid client story collection:\n${result.errors.map((error) => `- ${error}`).join("\n")}`,
    );
  }
  return result.value.map((story) => prerenderRequestPath(story.path));
}

async function newsArticlePaths(): Promise<string[]> {
  const files = (await readdir(newsDirectory))
    .filter((file) => file.endsWith(".json"))
    .sort();
  const sources = await Promise.all(
    files.map(async (file) => {
      const source = join(newsDirectory, file);
      const value: unknown = JSON.parse(await readFile(source, "utf8"));
      return { source, value };
    }),
  );
  const result = buildNewsArticleCollection(sources);
  if (!result.ok) {
    throw new Error(
      `Invalid news collection:\n${result.errors.map((error) => `- ${error}`).join("\n")}`,
    );
  }
  return result.value.map((article) => prerenderRequestPath(article.path));
}

async function webinarPaths(): Promise<string[]> {
  const files = (await readdir(webinarsDirectory))
    .filter((file) => file.endsWith(".json"))
    .sort();
  const sources = await Promise.all(
    files.map(async (file) => {
      const source = join(webinarsDirectory, file);
      const value: unknown = JSON.parse(await readFile(source, "utf8"));
      return { source, value };
    }),
  );
  const result = buildWebinarCollection(sources);
  if (!result.ok) {
    throw new Error(
      `Invalid webinar collection:\n${result.errors.map((error) => `- ${error}`).join("\n")}`,
    );
  }
  return result.value.map((webinar) => prerenderRequestPath(webinar.path));
}

async function responsibleAiPaths(): Promise<string[]> {
  const files = (await readdir(responsibleAiDirectory))
    .filter((file) => file.endsWith(".json"))
    .sort();
  const sources = await Promise.all(
    files.map(async (file) => {
      const source = join(responsibleAiDirectory, file);
      const value: unknown = JSON.parse(await readFile(source, "utf8"));
      return { source, value };
    }),
  );
  const result = buildResponsibleAiCollection(sources);
  if (!result.ok) {
    throw new Error(
      `Invalid Responsible AI collection:\n${result.errors.map((error) => `- ${error}`).join("\n")}`,
    );
  }
  return result.value.map((resource) => prerenderRequestPath(resource.path));
}

async function prerenderPaths(): Promise<string[]> {
  const pagePaths = [
    ...(await prototypePaths()),
    ...(await clientStoryPaths()),
    ...(await newsArticlePaths()),
    ...(await webinarPaths()),
    ...(await responsibleAiPaths()),
  ];
  const uniquePaths = new Set<string>();
  for (const path of pagePaths) {
    if (uniquePaths.has(path)) {
      throw new Error(`Duplicate public route discovered during build: ${path}`);
    }
    uniquePaths.add(path);
  }

  return [...uniquePaths, "/404", "/sitemap.xml"];
}

export default {
  appDirectory: "src",
  buildDirectory: seoAudit ? "dist-seo-audit" : "dist",
  async buildEnd() {
    if (!seoAudit) return;

    await writeFile(
      join("dist-seo-audit", "client", "robots.txt"),
      "User-agent: *\nAllow: /\nSitemap: http://127.0.0.1:4174/sitemap.xml\n",
      "utf8",
    );
    console.log(
      "✅ Local SEO audit build is isolated in dist-seo-audit, crawlable, and includes source maps",
    );
  },
  prerender: {
    paths: prerenderPaths,
    concurrency: 4,
  },
  routeDiscovery: { mode: "initial" },
  ssr: false,
} satisfies Config;
