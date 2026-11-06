import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../../../..");
const toml = readFileSync(resolve(repoRoot, "netlify.toml"), "utf8");

type Rule = { from: string; to: string; status: string };

function downloadRules(): Rule[] {
  return toml
    .split("[[redirects]]")
    .slice(1)
    .map((block) => ({
      from: block.match(/from\s*=\s*"([^"]+)"/)?.[1] ?? "",
      to: block.match(/to\s*=\s*"([^"]+)"/)?.[1] ?? "",
      status: block.match(/status\s*=\s*(\d+)/)?.[1] ?? "",
    }))
    .filter((rule) => rule.from.endsWith("-download"));
}

function noindexHeaderPaths(): string[] {
  return toml
    .split("[[headers]]")
    .slice(1)
    .filter((block) => /X-Robots-Tag\s*=\s*"noindex, nofollow"/.test(block))
    .map((block) => block.match(/for\s*=\s*"([^"]+)"/)?.[1] ?? "");
}

describe("client-story PDF download links", () => {
  const rules = downloadRules();

  it("defines the campaign links", () => {
    expect(rules.map((rule) => rule.from).sort()).toEqual(
      [
        "/addison-download",
        "/carson-download",
        "/corona-download",
        "/los-altos-hills-download",
        "/lvmwd-download",
        "/washoe-download",
        "/wrcog-download",
      ].sort(),
    );
  });

  it.each(rules)("$from serves a PDF that exists", ({ to, status }) => {
    expect(status).toBe("200");
    expect(to).toMatch(/^\/story-downloads\/[a-z-]+\.pdf$/);
    expect(existsSync(resolve(repoRoot, "apps/site/public", `.${to}`))).toBe(
      true,
    );
  });

  it.each(rules)("$from is kept out of search engines", ({ from }) => {
    expect(noindexHeaderPaths()).toContain(from);
  });

  it("keeps the PDF folder out of search engines", () => {
    expect(noindexHeaderPaths()).toContain("/story-downloads/*");
  });

  it("matches before the catch-all 404 rule", () => {
    const lastDownload = toml.lastIndexOf('to = "/story-downloads/');
    const catchAll = toml.indexOf('from = "/*"');
    expect(lastDownload).toBeLessThan(catchAll);
  });
});
