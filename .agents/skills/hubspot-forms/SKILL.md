---
name: hubspot-forms
description: REQUIRED whenever a request involves putting a form on a page — "add the demo form", "add a contact/signup form", or a pasted HubSpot embed snippet (script tags referencing js.hsforms.net / hbspt.forms.create). Covers the form registry (friendly names → formIds), the HubSpotForm component and hubspot-form section, and the extraction rules for turning a pasted embed snippet into a one-line registry entry. Core rule: raw script tags and formIds never enter page code — only registered form names do.
---

# HubSpot Forms

Madison's marketing forms live in HubSpot. On the old Webflow site, PMs pasted a
`<script>` embed snippet per form. In this codebase that snippet **never enters page
code** — forms are referenced by a friendly name from a registry, and one component
owns the embed script.

## The four layers

| Layer | File | What it is |
|-------|------|------------|
| Registry | `apps/sandbox/src/content/forms/hubspot.ts` | Portal constants + named forms (`"book-a-demo"` → formId). The **only** file where HubSpot identifiers live. |
| Component | `apps/sandbox/src/content/forms/HubSpotForm.tsx` | Loads the embed script once, mounts the form client-side, shows an on-token skeleton in the prerendered HTML (reserved height, no CLS) and a mailto fallback on script failure. |
| Styling | `apps/sandbox/src/content/forms/hubspot-form.css` | On-token adapter mapping HubSpot's injected markup (`.hs-input`, `.hs-button`, `.hs-error-msg`, …) onto theme CSS variables, scoped under `.hubspot-form`. Mirrors the Input/Button primitives. |
| Section | `apps/sandbox/src/content/sections/hubspot-form/` | `hubspot-form` section type for JSON-driven content pages — zod-validates that `form` is a registered name. |

## Workflow: "add the demo form to this page"

The form already exists. Look up its name in `HUBSPOT_FORMS` (match on name/description),
then either:

- **JSON content page** — add a section:

  ```json
  {
    "type": "hubspot-form",
    "props": {
      "form": "book-a-demo",
      "title": "Book a demo today",
      "description": "Fill in the form below, and our team will get back to you within one business day."
    }
  }
  ```

- **Hand-built prototype** — compose the component inside the page's own layout:

  ```tsx
  import { HubSpotForm } from "../../content/forms/HubSpotForm";
  // inside a token-styled card/section:
  <HubSpotForm form="book-a-demo" />
  ```

`title` and `description` are optional — omit them when the page already provides its
own heading around the form.

## Workflow: the contributor pastes a HubSpot embed snippet

A PM will paste something like:

```html
<script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({ portalId: "54493", formId: "0e857ad0-…", region: "na1" });
</script>
```

1. **Extract** `formId` from the snippet. Validate it's a UUID
   (`^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`).
2. **Check** `portalId` and `region` against `HUBSPOT_PORTAL_ID` / `HUBSPOT_REGION` in
   the registry file. A mismatch means the snippet is from a different HubSpot account —
   stop and surface that in plain language instead of accepting it.
3. **Check for an existing entry** with the same formId — if one exists, use its name;
   don't add a duplicate.
4. **Name it.** Ask in plain language ("what should we call this form?") or derive a
   kebab-case name from what they said ("the newsletter signup form" → `newsletter-signup`).
5. **Add one entry** to `HUBSPOT_FORMS` with a one-line `description` of where/what it is.
6. **Discard the snippet.** Then follow the "add the form to a page" workflow above.

## Hard rules

- **Never inline a `<script>` tag** (or `dangerouslySetInnerHTML`) for a form into a page,
  prototype, or section. `js.hsforms.net` appears in exactly one file: `HubSpotForm.tsx`.
- **Never pass a raw formId** where a form name belongs — the section schema rejects it,
  and that's the point: page content stays reviewable, identifiers stay in the registry.
- **Never edit portal constants** to make a foreign snippet fit — mismatches are surfaced,
  not absorbed.
- The embed injects unstyled markup; `hubspot-form.css` is the **only** place it gets styled.
  A new HubSpot field type that renders off-token gets its rule added there (on theme CSS
  variables, mirroring the primitives) — never inline styles or per-page overrides.

## Verification

`bun run check` covers it: registry/section validation is unit-tested
(`apps/sandbox/src/__tests__/hubspot-forms.test.ts`), and a bad `form` reference in page
JSON fails the content-collection tests at build time. The live embed renders only in a
browser — confirm visually on the dev server or the Deploy Preview, not in the static build
output (which correctly contains just the skeleton).
