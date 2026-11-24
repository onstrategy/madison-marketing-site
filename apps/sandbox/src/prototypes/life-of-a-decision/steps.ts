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
  /** The time, alone: 8:15 a.m. the next morning. */
  clock815: 15,
  // 6 · The next morning
  morning: 16,
  // 7 · The review
  review: 17,
  signed: 18,
  // 8 · One memory
  seats: 19,
  /** Every seat's work drops into one shared answer. */
  unify: 20,
  transparent: 21,
  // 9 · The bar
  bar: 22,
  // 10 · You're not first
  peers: 23,
  // 11 · It isn't hard
  easy: 24,
  // 12 · Close
  beats: 25,
  memory: 26,
  people: 27,
  /** The logo and tagline on their own, left up as the talk ends. */
  signOff: 28,
} as const;

export const TOTAL = 29;
