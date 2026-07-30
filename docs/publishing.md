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
| `/<slug>` | every prototype | every prototype |
| gallery | yes | **no** — it's an internal surface |
| page transitions | yes | no (every link is a full page load anyway) |
| unknown path | React Router falls through | on-token 404 page |

So a new prototype appears on the site the moment it exists — nobody has to "add it to the site".
That's the whole design. **If you find yourself copying a page into `apps/site/src/`, stop.**

## How the build works

```toml
command = "bunx turbo run build --filter=@madison/site"
publish = "apps/site/dist"
```

The build **must** run from the repo root through turbo. `packages/ui/dist/theme.css` is generated
from `tokens.tsx` and is gitignored, so it doesn't exist on a fresh clone — and
`apps/site/src/index.css` `@import`s it. Turbo's `dependsOn: ["^build"]` resolves the order:

```
@madison/ui#build  →  @madison/sandbox#build  →  @madison/site#build
```

A bare `vite build` inside `apps/site` would fail on the missing CSS import.

`base` is deliberately **unset** (the repo root). Setting it to `apps/site` would make Netlify
install from inside the workspace and fail to resolve `@madison/ui` / `@madison/sandbox`.

### The SPA fallback is mandatory

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Every cross-page link in these pages is a plain `<a href="/slug">` — a full browser load straight
to a deep path. Only `/index.html` exists on disk. Without this rule, **every link on the site
404s**. Netlify serves real files first, so this never shadows `/assets/*` or `/favicon.svg`.

One consequence worth knowing: unknown paths return **HTTP 200** with the React 404 page (a "soft
404"). Fixing that properly needs prerendering or an edge function; it isn't worth it while the
site is noindexed.

## The three contexts

| Context | URL | When |
|---|---|---|
| **Production** | `<site>.netlify.app` | every merge to `main` |
| **Branch deploy** | `preview--<site>.netlify.app` | every push to the `preview` branch |
| **Deploy Preview** | `deploy-preview-<n>--<site>.netlify.app` | every pull request |

`main` is production — **never push to it directly.** Merging a PR is what publishes.

### Getting a preview link

```bash
gh pr checks <number>
```

Read the Netlify check's details URL, or the Netlify comment on the PR. **Never guess or construct
the URL**, and never substitute a one-off deploy-ID permalink — those are per-build and rot.

A red Netlify check is a red gate. Treat it exactly like a failing `bun run check`.

## This deployment is not indexable

It runs on a **demo Netlify account**, so it's kept out of search engines in three places:

1. `netlify.toml` — a top-level `X-Robots-Tag: noindex, nofollow` header. Top-level rather than
   per-context on purpose, so production is covered too.
2. `apps/site/public/robots.txt` — `Disallow: /`.
3. `apps/site/index.html` — a `<meta name="robots">` tag.

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
4. **Remove the `<meta name="robots" content="noindex, nofollow" />`** from `apps/site/index.html`.
5. **Point a custom domain** at the site.
6. *Then* — and only then — add a `sitemap.xml` and submit it. A sitemap on a noindexed site does
   nothing.

Steps 2–4 are the whole "go live" switch, and each one carries a comment pointing back here.

## Troubleshooting

**The site is live but completely unstyled.**
The two `@source` lines in `apps/site/src/index.css` are missing or wrong. Tailwind roots its
automatic source detection at the Vite root (`apps/site`), which contains almost no classes — every
class that matters lives in the sandbox's prototypes and the UI package's primitives. This failure
passes typecheck, lint *and* the build. Catch it with:

```bash
bun run build && grep -c 'bg-app' apps/site/dist/assets/*.css   # expect 1, and a ~90 kB file
```

**Every page is blank, console says `useLocation() may be used only in the context of a <Router>`.**
Two copies of `react-router-dom` — the pages resolve a different copy than the `BrowserRouter` in
`apps/site`. Check `resolve.dedupe` in `apps/site/vite.config.ts` and that the `react-router-dom`
range matches `apps/sandbox`'s exactly. The sandbox keeps working, so this looks like a deploy bug.

**Netlify fails at install with a lockfile error.**
`bun.lock` is stale. Netlify sets `CI=true`, which makes bun enable `--frozen-lockfile`
automatically. Run `bun install`, commit `bun.lock`, and verify with
`bun install --frozen-lockfile` on a clean tree.

**The build log shows `npm install` instead of `bun install`.**
Netlify didn't detect the bun lockfile. `netlify.toml` has no install-command key and neither does
the dashboard, so the fix is to fold it into the build command:
`bun install --frozen-lockfile && bunx turbo run build --filter=@madison/site`.

**A deep link 404s on Netlify but works locally.**
`vite preview` has its own SPA fallback, so local testing can't prove the redirect. Check that the
`/*` → `/index.html` rule is still in `netlify.toml` and that nothing was added above it — Netlify
is first-match-wins.
