const meta = {
  title: "FOIA Peer Share — October 15",
  description: "Register for Madison AI's FOIA Peer Share session on October 15, 2026.",

  // Requested URL uses an underscore, not the generator's default hyphenated
  // slug — matching the exact link given for this campaign.
  path: "/foia-peer-share-invite_1",

  // Single-occurrence campaign invite tied to one date — kept out of
  // sitemap.xml/search results the same way, since it goes stale after the
  // session and three near-identical dated pages would otherwise read as
  // duplicate content. Flip to false if this should be discoverable too.
  noindex: true,

  // seoTitle: "FOIA Peer Share — October 15 — Madison AI", // defaults to `${title} — Madison AI`
  // ogImage: "https://…/share.jpg",      // image used in social previews
};

export default meta;
