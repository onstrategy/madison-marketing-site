// One entry per click. The speaker's clicker moves through these in order;
// each scene reads the steps it owns to know what has been revealed so far.
export const S = {
  /** Holding slide, on screen before the talk begins. */
  hold: 0,
  // 1 · Yes, and
  given: 1,
  // 2 · 9:47 p.m.
  nine47: 2,
  isThatTrue: 3,
  // 3 · The smart stranger
  stranger: 4,
  connectors: 5,
  getBack: 6,
  // 4 · The memory wakes
  minutes: 7,
  sources: 8,
  answer: 9,
  // 5 · Slow motion
  decision: 10,
  dollar: 11,
  permit: 12,
  promise: 13,
  // 6 · The next morning
  morning: 14,
  // 7 · The review
  review: 15,
  signed: 16,
  // 8 · One memory
  seats: 17,
  transparent: 18,
  // 9 · The bar
  bar: 19,
  // 10 · You're not first
  peers: 20,
  // 11 · It isn't hard
  easy: 21,
  // 12 · Close
  beats: 22,
  memory: 23,
  people: 24,
  /** The logo and tagline on their own, left up as the talk ends. */
  signOff: 25,
} as const;

export const TOTAL = 26;
