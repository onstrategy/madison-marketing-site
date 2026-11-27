// One entry per click. The speaker's clicker moves through these in order;
// each scene reads the steps it owns to know what has been revealed so far.
export const S = {
  // 1 · Yes, and
  given: 0,
  /** The time, alone, setting the scene: 9:47 p.m. at the dais. */
  clock947: 1,
  // 2 · 9:47 p.m.
  nine47: 2,
  isThatTrue: 3,
  // 3 · The smart stranger
  stranger: 4,
  connectors: 5,
  getBack: 6,
  // The switch: the city's memory turns on
  memoryOn: 7,
  // 4 · The memory wakes
  minutes: 8,
  sources: 9,
  answer: 10,
  // 5 · Slow motion
  decision: 11,
  dollar: 12,
  permit: 13,
  promise: 14,
  /** Extended version only: the same record, as staff get it. */
  staffAsk: 15,
  /** Extended version only: the same record, as an elected official gets it. */
  officialAsk: 16,
  /** The time, alone: 8:15 a.m. the next morning. */
  clock815: 17,
  // 6 · The next morning
  morning: 18,
  // 7 · The review
  review: 19,
  signed: 20,
  // 8 · One memory
  seats: 21,
  /** Every seat's work drops into one shared answer. */
  unify: 22,
  transparent: 23,
  // 9 · The bar
  bar: 24,
  // 10 · You're not first
  peers: 25,
  /** The hours saved across every deployment. */
  hours: 26,
  // 11 · It isn't hard
  easy: 27,
  // 12 · Close
  beats: 28,
  memory: 29,
  people: 30,
  /** The logo and tagline on their own, left up as the talk ends. */
  signOff: 31,
} as const;

export const TOTAL = 32;

/**
 * Steps that exist only in the extended version of the talk. The standard
 * version's clicker steps straight over them.
 */
export const EXTENDED_ONLY: readonly number[] = [S.staffAsk, S.officialAsk];
