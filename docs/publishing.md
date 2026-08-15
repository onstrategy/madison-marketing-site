# Publishing and previews

Madison's pages are deployed to Netlify from [`apps/site`](../apps/site). The deploy contract is
checked into [`netlify.toml`](../netlify.toml) — no clicking required to understand how a build
works.

The point of this setup: a contributor builds a page in plain language through Claude Code, submits
it, and gets back **a real web link** they can open on their phone or send to anyone. Not a diff,
not a localhost URL.

## What gets published

`apps/site` **owns no page content.** It's a routing shell over
[`apps/sandbox/src/prototype-registry.ts`](../apps/sandbox/src/prototype-registry.ts) — the same
`import.meta.glob` that powers the local sandbox gallery. Both apps render the same components.

| | `apps/sandbox` (local) | `apps/site` (published) |
|---|---|---|
| `/` | the prototype gallery | the **landing page** |
| `/landing` | the landing page | **301 → `/`** |
| `/<slug>` | every prototype | every published prototype at `/<slug>/` |
| content entry | n/a | its explicit JSON `path` |
| gallery | yes | **no** — it's an internal surface |
| page transitions | yes | no (every link is a full page load anyway) |
| unknown path | React Router falls through | on-token 404 page |

So a new prototype appears on the site the moment it exists — nobody has to "add it to the site".
That's the whole design. **If you find yourself copying a page into `apps/site/src/`, stop.**

## How the build works

```toml
command = "bunx turbo run build --filter=@madison/site"
publish = "apps/site/dist/client"
```

The build **must** run from the repo root through turbo. `packages/ui/dist/theme.css` is generated
from `tokens.tsx` and is gitignored, so it doesn't exist on a fresh clone — and
`apps/site/src/index.css` `@import`s it. Turbo's `dependsOn: ["^build"]` resolves the order:

```
@madison/ui#build  →  @madison/sandbox#build  →  @madison/site#build
```

A bare React Router build inside `apps/site` would fail on the missing CSS import.

`base` is deliberately **unset** (the repo root). Setting it to `apps/site` would make Netlify
install from inside the workspace and fail to resolve `@madison/ui` / `@madison/sandbox`.

### Static routes and real 404s

```toml
[[redirects]]
  from = "/*"
  to = "/404/"
  status = 404
```

React Router receives the complete public route list at build time and emits one directory-index
HTML file per route. Netlify serves those real files before redirects, so the wildcard applies only
to unknown paths and returns the prerendered Madison 404 with HTTP 404. It must never point to
React Router's generated `__spa-fallback.html`, which would turn unknown URLs into soft 404s.

Non-root public URLs end in `/`. Netlify redirects a slashless request such as `/about-us` to
`/about-us/`; canonical tags, sitemap entries, and internal links use the latter directly.

## The three contexts

| Context | URL | When |
|---|---|---|
| **Production** | `madison-marketing-site.netlify.app` | every merge to `main` |
| **Branch deploy** | `preview--madison-marketing-site.netlify.app` | every push to the `preview` branch |
| **Deploy Preview** | `deploy-preview-<n>--madison-marketing-site.netlify.app` | every pull request |

`main` is production — **never push to it directly.** Merging a PR is what publishes.

### Getting a preview link

```bash
gh pr checks <number>
```

Read the Netlify check's details URL, or the Netlify comment on the PR. **Never guess or construct
the URL**, and never substitute a one-off deploy-ID permalink — those are per-build and rot.

A red Netlify check is a red gate. Treat it exactly like a failing `bun run check`.

## Hosted Storybook

Storybook is a second Netlify project connected to this same repository. Keeping it separate from
the published site gives the component reference its own stable production URL and its own Deploy
Preview for every pull request, without coupling its redirects, headers, or build artifact to the
marketing site.

Its checked-in build contract lives in
[`packages/ui/netlify.toml`](../packages/ui/netlify.toml). The Netlify project settings are:

| Setting | Value |
|---|---|
| Package directory | `packages/ui` |
| Base directory | unset (repository root) |
| Production branch | `main` |
| Build command | `bun --filter @madison/ui build && bun --filter @madison/ui build-storybook` |
| Publish directory | `packages/ui/storybook-static` |

The design-system build runs first because Storybook imports generated token CSS from
`packages/ui/dist`. The hosted Storybook is intentionally served with `X-Robots-Tag: noindex,
nofollow`; it is a development and review surface, not a search destination.

As with the published site, read each preview URL from the PR's Netlify check or comment. Never
guess it. If only one of the two Netlify projects reports a check, enable multiple repository
webhooks in the Netlify team's Git settings.

## This deployment is not indexable

It runs on a **demo Netlify account**, so it's kept out of search engines in three places:

1. `netlify.toml` — a top-level `X-Robots-Tag: noindex, nofollow` header. Top-level rather than
   per-context on purpose, so production is covered too.
2. `apps/site/public/robots.txt` — `Disallow: /`.
3. `apps/site/src/site-meta.ts` — `SITE_WIDE_NOINDEX` controls the document-level robots tag.

Don't "fix" any of them individually. They come off together, during handover.

Note this hides the site from search, but anyone with the URL can still open it. Password
protection is a paid Netlify feature.

## Handover: going live on the client's account

When Madison takes this over and deploys from their own Netlify account:

1. **Connect the repo.** `netlify init` from the repo root — it reads `netlify.toml`, so the build
   command and publish directory fill themselves in. Then in the Netlify UI: production branch
   `main`, Deploy Previews on, and branch deploys for `preview`.
2. **Delete the `DEMO DEPLOY: not indexable` `[[headers]]` block** from `netlify.toml`.
3. **Flip `apps/site/public/robots.txt`** to `Allow: /`.
4. **Set `SITE_WIDE_NOINDEX` to `false`** in `apps/site/src/site-meta.ts`. Entries explicitly
   marked `noindex` remain excluded after this site-wide switch is removed.
5. **Point a custom domain** at the site.
6. *Then* submit the already-generated `/sitemap.xml` to the search engines. A sitemap on a
   noindexed site does nothing.

Steps 2–4 are the whole "go live" switch, and each one carries a comment pointing back here.

## Troubleshooting

**The site is live but completely unstyled.**
The two `@source` lines in `apps/site/src/index.css` are missing or wrong. Tailwind roots its
automatic source detection at the Vite root (`apps/site`), which contains almost no classes — every
class that matters lives in the sandbox's prototypes and the UI package's primitives. This failure
passes typecheck, lint *and* the build. Catch it with:

```bash
bun run build && grep -c 'bg-app' apps/site/dist/client/assets/*.css
```

**Every page is blank, console says `useLocation() may be used only in the context of a <Router>`.**
Two copies of React Router — the pages resolve a different copy than the framework shell. Check
`resolve.dedupe` in `apps/site/vite.config.ts` and the resolved dependency versions. The sandbox
can keep working, so this looks like a deploy bug.

**Netlify fails at install with a lockfile error.**
`bun.lock` is stale. Netlify sets `CI=true`, which makes bun enable `--frozen-lockfile`
automatically. Run `bun install`, commit `bun.lock`, and verify with
`bun install --frozen-lockfile` on a clean tree.

**The build log shows `npm install` instead of `bun install`.**
Netlify didn't detect the bun lockfile. `netlify.toml` has no install-command key and neither does
the dashboard, so the fix is to fold it into the build command:
`bun install --frozen-lockfile && bunx turbo run build --filter=@madison/site`.

**A deep link 404s on Netlify but works locally.**
Confirm that the page's path appears in React Router's prerender build output and that Netlify's
publish directory is `apps/site/dist/client`. Local preview cannot prove Netlify redirects.

**An unknown URL returns 200 instead of 404.**
The wildcard redirect is missing or points at `__spa-fallback.html`. It must rewrite `/*` to
`/404/` with `status = 404`; verify the actual status on the Deploy Preview.
