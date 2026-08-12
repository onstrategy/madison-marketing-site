# Content-driven static rendering

## Status

React Router Framework Mode is implemented as the routing and static-generation path. The first
validated Client Story and News entries now use convention-discovered sections and JSON-owned public
routes. News migration has begun with one article; the remaining Newsroom archive is still legacy.

## Goal

Generate static pages at build time from small, Git-versioned collections of local JSON entries.
The first collections are Client Stories and News. Each collection may contain a few dozen entries,
so rebuilding every page on every deployment is acceptable.

The result must preserve the existing public URL structure and deploy as static files on Netlify
without a runtime application server.

## Framework direction

React Router Framework Mode owns the standard
route-module, data-loading, server-rendering, hydration, and prerendering concerns that are currently
required by the site.

Astro is a fallback only if React Router cannot satisfy the requirements without additional custom
post-build plumbing. Introducing Astro would add a second page-templating model to the existing
React project, so that cost requires concrete justification.

## Proposed build-time flow

1. Discover all JSON entries in a collection folder.
2. Parse and validate every entry, failing the build on invalid data or duplicate public paths.
3. Return the collection as a typed array of entries.
4. Give React Router the complete list of public paths to prerender.
5. Load the matching entry into its React route module and template.
6. Emit static HTML and route data for Netlify.

No source-code page files should be generated per JSON entry.

## Entry ownership

Each entry must declare its complete public `path`, for example:

```json
{
  "path": "/client-stories/city-of-corona/"
}
```

The path must not be derived exclusively from the filename. Existing and future content may use
non-standard URL naming, and preserving those URLs is more important than enforcing a filename
convention.

An entry is also the source of truth for:

- the content supplied to the page template;
- the template selection, if multiple templates are supported;
- the document title and description;
- canonical, Open Graph, and social-sharing metadata;
- any collection-card summary required by an index page.

Collection index pages must derive their cards from the same entries rather than duplicate detail
page content in a separate hard-coded array.

For migrations, the existing Madison site is a content source, not a design source. Preserve its
approved copy, metadata, public URL, hierarchy, and assets, but render them through the current
Raz-aligned design system and section vocabulary. Do not carry legacy Webflow layout or styling into
the new templates.

## Section discovery and fallback behavior

Page content is expressed as an ordered array of `{ "type": "...", "props": { ... } }` objects.
Section types are discovered eagerly from `content/sections/<type>/index.tsx` with Vite's build-time
module discovery. The folder name is the public section type, so adding a section requires no
hand-maintained registry or generated source file.

Each module default-exports its React component and may export `parseProps(input)`. Discovery
supplies a default object passthrough parser when that export is absent, so every section has one
rendering contract. TypeScript types remain useful to authors, but runtime content safety comes
from `parseProps`; the passthrough parser deliberately provides no section-specific validation.

The collection schema validates entry-level concerns such as paths, metadata, cards, and the base
section shape. Each section module owns its detailed props schema. The City of Corona story is the
first JSON composition and contains these independently safe units, in order:

1. `client-story-hero-intro`
2. `client-story-quote-stats`
3. `client-story-challenge`
4. `client-story-solution-timeline`
5. `client-story-impact-download`
6. `client-logos`
7. `client-story-cta`

Hero and intro remain one section because their overlapping metadata card makes either fragment
unsafe as a standalone layout. Sections need not support arbitrary ordering; each supported unit
must only render safely in its intended compositions.

An unknown section type has three defensive behaviors:

- During development, render a conspicuous unsupported-section placeholder containing the type,
  source entry, and section position so the rest of the page remains inspectable.
- During build-time collection validation, fail the build so missing content cannot be published
  silently.
- In an already-built production client, render nothing as a final defensive fallback. This branch
  should be unreachable when the build gate is working correctly.

## Implementation sequence

1. React Router Framework Mode, build-time JSON route mapping, explicit public paths, metadata, and
   Netlify output: implemented and locally validated.
2. Convention-based section discovery, ordered rendering, validation, and failure behavior:
   implemented and locally validated on Client Story and News page shapes.
3. News collection routing and the first article composition (`public-records-crisis`): implemented
   and locally validated with `article-hero-split` and `article-copy` sections.
4. Netlify Deploy Preview: remains the deployment-environment acceptance gate.

Keep these phases separable so a section-system redesign cannot hide whether the routing and static
generation integration works on its own.

## Acceptance gate

The React Router integration is acceptable only if it:

- generates every declared public path during the build;
- preserves the existing URL and trailing-slash behavior on Netlify;
- requires no runtime server;
- preserves per-page metadata, canonical URLs, sitemap coverage, and real 404 responses;
- reuses the existing React templates, design system, and sandbox publishing workflow;
- replaces custom routing and prerendering infrastructure instead of wrapping it in another layer;
- fails the build clearly for invalid entries and route collisions.

If meeting these requirements requires another custom post-build pipeline or materially complicates
the existing authoring workflow, reconsider React Router Framework Mode before implementation and
evaluate Astro as the fallback.

## Framework checkpoint

React Router Framework Mode produces prerendered, hydratable HTML, route-owned metadata, route data,
and an exact `sitemap.xml` resource without a runtime server. It emits non-root pages as
`<path>/index.html`; the project explicitly accepts Netlify's canonical trailing-slash URLs instead
of introducing a custom build-output adapter. Slashless requests should redirect once to the
trailing-slash URL, while canonical tags, sitemap entries, and internal links use that final URL.

The local acceptance proof covers every published prototype plus the JSON-owned City of Corona story
and Public Records Crisis article, automatic prototype and section discovery, duplicate-route
rejection, build-time entry and section validation, route-specific metadata, hydration data, sitemap
filtering, and a prerendered 404 page. Existing pages retain parity with the Raz-aligned branch; the
migrated article deliberately adopts that current visual language rather than reproducing Webflow.
The final framework checkpoint is a Netlify Deploy Preview confirming redirects, headers, assets,
hydration, and real 404 status in the deployment environment.

## Not decided yet

- Whether the local per-collection asset folders should become a shared convention after another
  content type demonstrates the same need.
- The section vocabulary required by Team, Company, webinar, and other News article shapes; validate
  those with representative entries rather than generalizing from the first editorial article.
- Whether later page shapes need explicit composition rules beyond per-section prop validation.
- Whether the Deploy Preview exposes any Netlify-specific behavior that requires revisiting the
  accepted trailing-slash contract.
