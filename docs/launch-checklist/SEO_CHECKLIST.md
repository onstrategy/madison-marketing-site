# SEO launch checklist

This checklist tracks the remaining SEO work before the Madison marketing site
moves from its Netlify preview domain to `www.madisonai.com`.

## Verified baseline

Verified on 2026-08-27 against `main` at `ef5cff2` and the deployed Netlify site:

- [x] All 66 sitemap URLs return HTTP `200`.
- [x] Every public page is prerendered with a title, description, canonical,
      Open Graph metadata, and Twitter metadata.
- [x] Canonicals match the current Netlify URLs.
- [x] Every public route has one `<h1>`.
- [x] No broken internal page links were found.
- [x] `/landing` permanently redirects to `/`.
- [x] Trailing slashes normalize correctly.
- [x] Unknown routes return a genuine HTTP `404`.
- [x] All 49 migrated content-source URLs preserve their Madison paths.
- [x] `bun run check`, `bun run build`, and `bun run seo:audit:build` pass.

## 1. Improve page-specific metadata

Do this next as a small, focused PR. This is content-data work, not a routing or
template redesign.

- [x] Replace the generic description shared by 39 content pages with accurate,
      page-specific descriptions.
- [x] Review the other duplicate-description pairs; 43 pages previously
      participated in duplicate-description groups.
- [ ] Review the 33 titles longer than 60 characters, prioritizing the 23 longer
      than 70 characters. Treat those numbers as review signals, not hard limits.
- [ ] Correct the three descriptions shorter than 50 characters.
- [ ] Correct the two descriptions longer than 160 characters.
- [x] Prioritize platform pages, client stories, news, webinars, and resources
      that are most likely to appear in search results.
- [x] Rebuild and verify that every sitemap page still has distinct, accurate
      title and description metadata.
- [x] Run `bun run check`, `bun run build`, and `bun run seo:audit:build`.

References:

- [Google guidance for page descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Google guidance for title links](https://developers.google.com/search/docs/appearance/title-link)

## 2. Preserve the remaining legacy URL

Handle this after the metadata PR.

- [ ] Decide whether `/four-ways-to-get-more` should be migrated or retired.
- [ ] If retained, create the page at the same path.
- [ ] If retired or consolidated, add a direct permanent redirect to the most
      relevant replacement page. Do not redirect it generically to the homepage.
- [ ] Verify the final URL or redirect in the built site and the Netlify preview.

Reference: [Google site-migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)

## 3. Final pre-launch verification

- [x] Fix the `preview:seo-audit` command in
      [`apps/site/package.json`](../../apps/site/package.json) so it serves the
      crawlable `dist-seo-audit` output rather than the normal noindexed build.
- [ ] Run a representative Lighthouse audit against the crawlable build.
- [ ] Re-crawl every sitemap URL for HTTP status, canonical, title, description,
      `<h1>`, social metadata, and broken internal links.
- [ ] Confirm all approved design and copy changes are merged.
- [ ] Confirm the production domain will be `www.madisonai.com` and the apex
      domain will redirect to it.

## 4. Cutover: remove index blocking last

The index-blocking controls stay active throughout design, copy, metadata, and
URL work. Removing them is the final repository change before associating the
official domains.

- [ ] Remove the top-level `X-Robots-Tag: noindex, nofollow` header from
      [`netlify.toml`](../../netlify.toml).
- [ ] Change [`apps/site/public/robots.txt`](../../apps/site/public/robots.txt)
      from `Disallow: /` to `Allow: /` and include the official sitemap URL.
- [ ] Set `SITE_WIDE_NOINDEX` to `false` in
      [`apps/site/src/site-meta.ts`](../../apps/site/src/site-meta.ts).
- [ ] Keep the interval between removing those controls and associating the
      official domains as short as practical.
- [ ] Associate `www.madisonai.com` with the Netlify site and make it the primary
      domain.
- [ ] Associate the apex `madisonai.com` domain and verify it permanently
      redirects to `www.madisonai.com`.
- [ ] Trigger a fresh production rebuild after the primary domain is configured.
      [`site-origin.server.ts`](../../apps/site/src/site-origin.server.ts) reads
      Netlify's `URL` value at build time, so this rebuild regenerates canonicals,
      Open Graph URLs, and the sitemap with the official hostname.

## 5. Post-cutover verification

- [ ] Confirm representative official-domain pages return HTTP `200`.
- [ ] Confirm an unknown official-domain URL returns HTTP `404`.
- [ ] Confirm the Netlify hostname does not compete with the official hostname:
      prefer a permanent redirect, and at minimum verify official-domain
      canonicals on every page.
- [ ] Confirm no public page emits a site-wide `noindex` directive or header.
- [ ] Confirm `robots.txt` allows crawling and references the official sitemap.
- [ ] Confirm every sitemap and canonical URL uses `https://www.madisonai.com`.
- [ ] Submit `/sitemap.xml` in Google Search Console.
- [ ] Monitor Search Console indexing, crawl errors, and unexpected `404`s after
      launch.

## Later enhancements

These are useful but do not block the domain cutover:

- [ ] Add suitable structured data beyond the homepage where it provides real
      meaning, such as article metadata for news content.
- [ ] Add image-specific alt metadata and dimensions for the 49 custom Open Graph
      images.
- [ ] Consider adding sitemap `lastmod` values when reliable modification dates
      are available from the content data.
