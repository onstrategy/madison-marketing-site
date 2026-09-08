// How long a client-story quote is allowed to get before it steps down a size.
//
// Client stories quote real people at whatever length they actually spoke, and
// the spread is wide — the shortest quote we publish is ~105 characters, the
// longest ~490. A single size can't serve both: the size that gives a one-line
// quote its punch turns a five-sentence one into a wall of large italic serif,
// and the size that keeps the long one readable makes the short one look timid.
//
// So the size is a function of the length, defined here ONCE and shared by
// every section that renders a client-story quote, rather than each component
// (or each entry's copy) deciding for itself. Sections differ in how prominent
// their quote is — the standalone pull-quote starts bigger than a quote set
// inside running text — so each passes its own starting step and the same
// thresholds apply relative to it.

/** Character counts at which a quote drops to the next step down. */
const ONE_STEP_DOWN = 220;
const TWO_STEPS_DOWN = 360;

/**
 * Type steps per starting size, largest first. Each entry is
 * [base, one step down, two steps down] — all on the Madison type scale.
 */
const STEPS = {
  /** The standalone, centered pull-quote (client-story-quote-stats). */
  "3xl": ["text-3xl", "text-2xl", "text-xl"],
  /** A quote set within body copy (client-story-announcement-body). */
  "2xl": ["text-2xl", "text-xl", "text-lg"],
} as const;

export type ClientStoryQuoteScale = keyof typeof STEPS;

/**
 * The type-size class for a client-story quote of this length.
 *
 * Counts characters rather than words: what actually overwhelms the layout is
 * how much ink lands in the column, and long words cost more than short ones.
 */
export function clientStoryQuoteSize(
  text: string,
  scale: ClientStoryQuoteScale,
): string {
  const steps = STEPS[scale];
  if (text.length > TWO_STEPS_DOWN) return steps[2];
  if (text.length > ONE_STEP_DOWN) return steps[1];
  return steps[0];
}
