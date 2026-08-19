const meta = {
  title: "AI in Action Webinar Registration",
  description: "Register to get calendar invites for Madison AI's twice-monthly AI in Action webinar series.",

  // madisonai.com publishes this page at /peer-share-invite. Matching the live
  // URL exactly preserves it on migration; a redirect would only leak its
  // ranking. The folder keeps the descriptive name so the page stays easy to
  // find — same arrangement as ../book-a-demo, which publishes at /demo.
  path: "/peer-share-invite",

  // The published site builds this page's <head> from this file — the title and
  // description above are what search results and link previews actually show.
  // Everything below is optional; uncomment what you need.
  //
  // seoTitle: "AI in Action Webinar Registration — Madison AI", // defaults to `${title} — Madison AI`
  // ogImage: "https://…/share.jpg",      // image used in social previews
  // noindex: true,                       // keep this page out of sitemap.xml
};

export default meta;
