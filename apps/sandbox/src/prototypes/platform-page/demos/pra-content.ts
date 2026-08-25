// Content for the public-records fulfillment demo (./pra-demo.tsx), lifted
// verbatim from the approved diagram so the on-screen record reads exactly as
// designed. Kept in its own module because it is data, not layout: five email
// rows in the review buckets, and the five document pages they open.
//
// Text is stored as runs rather than plain strings so the demo can mark which
// spans are personally identifiable — those are the ones that get blacked out
// when the redaction pass runs. `t` is ordinary text; `r` is redactable.

/** One span of document text: plain (`t`) or redactable PII (`r`). */
export type Run = ["t" | "r", string];

export interface DemoEmail {
  /** Which review bucket the row sits in. */
  bucket: "responsive" | "private";
  from: Run[];
  date: string;
  subject: string;
  snippet: Run[];
}

export interface DemoPage {
  eyebrow: string;
  title: string;
  tag: { kind: "responsive" | "private"; label: string };
  meta: [string, Run[]][];
  paragraphs: Run[][];
}

export const DEMO_EMAILS: DemoEmail[] = [
  {
    bucket: "responsive",
    from: [["t", "manager → smith"]],
    date: "Apr 8",
    subject: "Re: Veterans Park courts, process & calendar",
    snippet: [["t", "Routing through Parks & Rec. P. Reyes direct: (714) 555-0142. Forwarding complaint from "], ["r", "Linda Hutchins"], ["t", ", DOB "], ["r", "3/14/1958"], ["t", "."]],
  },
  {
    bucket: "responsive",
    from: [["t", "parks → smith"]],
    date: "Mar 28",
    subject: "Sub-contractor estimate, courts package",
    snippet: [["t", "Site-prep estimate received. Sub PM reachable at "], ["r", "(714) 555-0189"], ["t", ". Lien waiver and W-9 on file."]],
  },
  {
    bucket: "responsive",
    from: [["t", "smith → manager"]],
    date: "Mar 22",
    subject: "Personal note, pickleball priority for FY25",
    snippet: [["t", "Sending from "], ["r", "bob.smith1962@yahoo.com"], ["t", " for speed. Backup "], ["r", "rsmith.personal@gmail.com"], ["t", ". Cell "], ["r", "(714) 555-0173"], ["t", "."]],
  },
  {
    bucket: "private",
    from: [["t", "smith → greenfield"]],
    date: "Mar 30",
    subject: "Site walk & references, Veterans Park",
    snippet: [["t", "Tom, reach at "], ["r", "tgreenfield.contracts@gmail.com"], ["t", ", cell "], ["r", "(562) 555-0318"], ["t", ". Reference Maria, "], ["r", "(949) 555-0247"], ["t", "."]],
  },
  {
    bucket: "private",
    from: [["r", "bob.smith1962"], ["t", " → "], ["r", "t.greenfield"]],
    date: "Apr 4",
    subject: "Off-record: bid pricing & timeline",
    snippet: [["t", "Using "], ["r", "bob.smith1962@yahoo.com"], ["t", ", easier. Cell "], ["r", "(714) 555-0173"], ["t", ". Ping "], ["r", "tgreenfield.contracts@gmail.com"], ["t", " when ready."]],
  },
];

export const DEMO_PAGES: DemoPage[] = [
  {
    eyebrow: "Email · Page 1 of 23",
    title: "Re: Veterans Park courts, process & calendar",
    tag: { kind: "responsive", label: "Responsive" },
    meta: [
      ["FROM", [["t", "manager@cedarhollow.gov"]]],
      ["TO", [["t", "bsmith@cedarhollow.gov"]]],
      ["CC", [["t", "p.reyes@cedarhollow.gov, City Clerk"]]],
      ["DATE", [["t", "April 8, 2024 · 10:14 AM"]]],
    ],
    paragraphs: [
      [["t", "Commissioner, thanks for the note. To keep the record clean, please route the Veterans Park courts request through Parks & Rec on Form B-12 so it lands on the Council agenda properly. P. Reyes is your direct line, desk "], ["r", "(714) 555-0142"], ["t", ", after-hours cell "], ["r", "(714) 555-0167"], ["t", "."]],
      [["t", "I'm also forwarding the original constituent complaint we received last fall from "], ["r", "Linda Hutchins, 4427 Oak Ridge Dr."], ["t", ", DOB "], ["r", "3/14/1958"], ["t", ", who flagged noise and lighting concerns. She prefers contact via "], ["r", "lhutchins.55@aol.com"], ["t", " and asked to be kept informed when it returns to Council."]],
      [["t", "Once Parks signs off on scope and Finance confirms the encumbrance, we'll calendar the budget hearing for April 22 and brief Council in open session. All future correspondence on this matter should go through City of Cedar Hollow channels for the public record."]],
    ],
  },
  {
    eyebrow: "Email · Page 4 of 23",
    title: "Sub-contractor estimate, courts package",
    tag: { kind: "responsive", label: "Responsive" },
    meta: [
      ["FROM", [["t", "p.reyes@cedarhollow.gov"]]],
      ["TO", [["t", "bsmith@cedarhollow.gov"]]],
      ["DATE", [["t", "March 28, 2024 · 4:02 PM"]]],
    ],
    paragraphs: [
      [["t", "Commissioner, forwarding the site-prep estimate from our pre-qualified subcontractor pool. Base scope covers grading, sub-base, drainage tie-in, and acoustic-fence footings."]],
      [["t", "Sub PM is reachable directly at "], ["r", "(714) 555-0189"], ["t", " for technical questions; lien waiver and W-9 are already on file with Finance."]],
      [["t", "Recommend we lock the alternate pricing through award. Happy to discuss at the Friday standup."]],
    ],
  },
  {
    eyebrow: "Email · Page 7 of 23",
    title: "Personal note, pickleball priority for FY25",
    tag: { kind: "responsive", label: "Responsive" },
    meta: [
      ["FROM", [["t", "bob.smith1962@yahoo.com"]]],
      ["TO", [["t", "manager@cedarhollow.gov"]]],
      ["CC", [["t", "rsmith.personal@gmail.com"]]],
      ["DATE", [["t", "March 22, 2024 · 9:47 AM"]]],
    ],
    paragraphs: [
      [["t", "Manager, sending from "], ["r", "bob.smith1962@yahoo.com"], ["t", " for speed; please loop my backup at "], ["r", "rsmith.personal@gmail.com"], ["t", " on anything time-sensitive."]],
      [["t", "The pickleball courts at Veterans Park are my top FY25 priority. Residents on the east side have been asking for two years. I'd like to see this on the April 22 agenda, not pushed to a later cycle."]],
      [["t", "I've already done some legwork with potential vendors so we can move fast once funding clears. Reach me on cell "], ["r", "(714) 555-0173"], ["t", " evenings and weekends."]],
    ],
  },
  {
    eyebrow: "Email · Page 12 of 23",
    title: "Site walk & references, Veterans Park",
    tag: { kind: "private", label: "Contains PII" },
    meta: [
      ["FROM", [["t", "bsmith@cedarhollow.gov"]]],
      ["TO", [["t", "tgreenfield.contracts@gmail.com"]]],
      ["DATE", [["t", "March 30, 2024 · 6:48 PM"]]],
    ],
    paragraphs: [
      [["t", "Tom, great meeting at the chamber mixer. Best way to reach you for the Veterans Park walkthrough is "], ["r", "tgreenfield.contracts@gmail.com"], ["t", "; I'll text your cell at "], ["r", "(562) 555-0318"], ["t", " the morning of."]],
      [["t", "For references, you should call Maria over at Highland Parks District, "], ["r", "(949) 555-0247"], ["t", ". She used your firm on their phase-two courts and can speak to schedule and finish quality."]],
      [["t", "Goal is a four-court complex with lighting and acoustic fencing, FY25 capital. Let's plan the site walk for the week of April 8."]],
    ],
  },
  {
    eyebrow: "Email · Page 14 of 23",
    title: "Off-record: bid pricing & timeline",
    tag: { kind: "private", label: "Contains PII" },
    meta: [
      ["FROM", [["t", "bob.smith1962@yahoo.com"]]],
      ["TO", [["t", "tgreenfield.contracts@gmail.com"]]],
      ["DATE", [["t", "April 4, 2024 · 9:18 PM"]]],
    ],
    paragraphs: [
      [["t", "Tom, using "], ["r", "bob.smith1962@yahoo.com"], ["t", " on this one, easier than the city account for back-and-forth. Cell "], ["r", "(714) 555-0173"], ["t", " is fine after hours."]],
      [["t", "Heads up: Parks is going to ask for a value-engineered alternate. If you can land the base under $490K and pre-stage the acoustic-fence package, that gives us cover at the April 22 hearing."]],
      [["t", "Once you've got numbers, ping "], ["r", "tgreenfield.contracts@gmail.com"], ["t", " me directly, don't loop the city inbox until I say so. We'll do the formal submission through Parks once we know it lands clean."]],
    ],
  },
];
