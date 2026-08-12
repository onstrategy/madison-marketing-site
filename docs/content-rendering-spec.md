# Content-driven static rendering

## Status

React Router Framework Mode is the selected routing and static-generation path. The first validated
Client Story entry is implemented as the routing proof. Section discovery and fallback behavior are
agreed but deliberately deferred until the routing acceptance gate passes on a Netlify Deploy
Preview.

## Goal

Generate static pages at build time from small, Git-versioned collections of local JSON entries.
The first collections are Client Stories and News. Each collection may contain a few dozen entries,
so rebuilding every page on every deployment is acceptable.

The result must preserve the existing public URL structure and deploy as static files on Netlify
without a runtime application server.

## Framework direction

Evaluate React Router Framework Mode as the first integration path. It should own the standard
route-module, data-loading, server-rendering, hydration, and prerendering concerns that are currently
handled by custom site infrastructure.

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

## Section discovery and fallback behavior

Page content may be expressed as an ordered `sections` array. Section types are discovered by
convention from React component modules in a dedicated sections folder; adding a section must not
require maintaining a separate central registry by hand. Vite's build-time module discovery is the
preferred mechanism unless a later requirement demonstrates a need for generated source files.

A section module may export a custom `parseProps(input)` function. Discovery supplies a default
passthrough parser when that export is absent, so every discovered section has the same rendering
contract. The default parser provides no section-specific validation and must be treated as such.

An unknown section type has three defensive behaviors:

- During development, render a conspicuous unsupported-section placeholder containing the type,
  source entry, and section position so the rest of the page remains inspectable.
- During build-time collection validation, fail the build so missing content cannot be published
  silently.
- In an already-built production client, render nothing as a final defensive fallback. This branch
  should be unreachable when the build gate is working correctly.

## Implementation sequence

1. Integrate and validate React Router Framework Mode, build-time JSON route mapping, explicit public
   paths, metadata, and Netlify output while retaining the current page rendering where practical.
2. After the routing acceptance gate passes, extract supported sections into convention-based React
   modules and introduce the ordered section renderer and parser/fallback behavior.

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

The local acceptance proof covers every published prototype plus the JSON-owned City of Corona
story, automatic prototype discovery, duplicate-route rejection, build-time JSON validation,
route-specific metadata, hydration data, sitemap filtering, and a prerendered 404 page. The final
framework checkpoint is a Netlify Deploy Preview confirming redirects, headers, assets, hydration,
and real 404 status in the deployment environment.

## Not decided yet

- The JSON schema for News. The initial fixed-template Client Story schema is implemented but may
  evolve when a second story tests its boundaries.
- The detailed JSON shape for ordered sections and their props.
- The set of supported templates and how an entry selects one.
- Asset-location and asset-validation conventions.
- The implementation behind custom `parseProps` functions and stronger prop validation.
- Whether the Deploy Preview exposes any Netlify-specific behavior that requires revisiting the
  accepted trailing-slash contract.
