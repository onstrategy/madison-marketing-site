/* global process, URL, Buffer, console */
// Builds the left-hand banner image of each team signature (navy panel, logo,
// collage artwork and the person's headshot) into apps/site/public/sig-bumceoquwx/.
//
// Email apps can't layer a photo over a background, so the banner has to be one
// flat image per person. The panel comes from design-reference.jpg (the approved
// design); each person's headshot is swapped in over the original one.
//
// Needs the `sharp` image library, which is not a project dependency:
//   SHARP_ENTRY=/path/to/node_modules/sharp/dist/index.mjs node generate-images.mjs [slug ...]
// With no slugs it rebuilds everyone in people.json.

import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const sharp = (await import(process.env.SHARP_ENTRY ?? "sharp")).default;

const here = fileURLToPath(new URL(".", import.meta.url));
const teamDir = join(here, "../about-us/team");
const outDir = join(here, "../../../../site/public/sig-bumceoquwx");
const design = join(here, "design-reference.jpg");

// Geometry, in pixels of the 1377x516 design.
const HEIGHT = 516;
const PANEL_WIDTH = 495; // navy panel, left of the cream area
const WIDTH = 745; // panel + the headshot's overhang + room for its shadow
const PHOTO = { left: 437, top: 77, width: 282, height: 378, radius: 50 };
const CARD_RADIUS = 42;
// The banner shows at 217px wide in the email; 540px keeps it sharp on retina screens.
const OUTPUT_WIDTH = 540;
const CREAM = { r: 0xea, g: 0xe5, b: 0xdf };

const people = JSON.parse(await readFile(join(here, "people.json"), "utf8"));
const wanted = process.argv.slice(2);
const selected = wanted.length ? people.filter((p) => wanted.includes(p.slug)) : people;

// The design panel, with Heyden's original headshot painted over by smearing the
// column just left of it, so only the new headshot shows there.
const panel = await sharp(design).extract({ left: 0, top: 0, width: PANEL_WIDTH, height: HEIGHT }).toBuffer();
const smearLeft = PHOTO.left - 5;
const smear = await sharp(design)
  .extract({ left: smearLeft - 4, top: 60, width: 1, height: 400 })
  .resize({ width: PANEL_WIDTH - smearLeft, height: 400, fit: "fill", kernel: "nearest" })
  .toBuffer();
const cleanPanel = await sharp(panel).composite([{ input: smear, left: smearLeft, top: 60 }]).toBuffer();

const roundedRect = (w, h, r) =>
  Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}"/></svg>`);

const shadow = await sharp({
  create: { width: PHOTO.width + 160, height: PHOTO.height + 160, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([{ input: roundedRect(PHOTO.width, PHOTO.height, PHOTO.radius), left: 80, top: 80 }])
  .blur(14)
  .linear([1, 1, 1, 0.22], [0, 0, 0, 0])
  .png()
  .toBuffer();
// Where the shadow sits on the banner, trimmed to stay inside it.
const SHADOW_LEFT = PHOTO.left - 80;
const SHADOW_TOP = PHOTO.top - 80 + 10;
const shadowFit = await sharp(shadow)
  .extract({ left: 0, top: 0, width: WIDTH - SHADOW_LEFT, height: HEIGHT - SHADOW_TOP })
  .toBuffer();

// Left corners rounded like the card, right edge square (the text side continues the card).
const R = CARD_RADIUS;
function leftCornersMask() {
  const alpha = Buffer.alloc(WIDTH * HEIGHT * 4, 255);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < R; x++) {
      const cy = y < R ? R : y >= HEIGHT - R ? HEIGHT - R : undefined;
      if (cy === undefined) continue;
      const coverage = Math.max(0, Math.min(1, R - Math.hypot(R - (x + 0.5), cy - (y + 0.5)) + 0.5));
      alpha[(y * WIDTH + x) * 4 + 3] = Math.round(coverage * 255);
    }
  }
  return alpha;
}
const cardMask = leftCornersMask();

// The design's own rounded corners leave a faint light edge just inside the arc. Before
// the arc is cut, repaint that last few pixels from the pixels just inside it.
const FRINGE = 4; // how wide the light edge is
const REACH = 5; // how far in to borrow from
const panelRaw = await sharp(cleanPanel).raw().toBuffer({ resolveWithObject: true });
{
  const { data, info } = panelRaw;
  const source = Buffer.from(data);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < R + FRINGE; x++) {
      const cy = y < R ? R : y >= HEIGHT - R ? HEIGHT - R : undefined;
      if (cy === undefined || x >= R) continue;
      const dx = R - (x + 0.5);
      const dy = cy - (y + 0.5);
      const d = Math.hypot(dx, dy);
      if (d <= R - FRINGE) continue;
      const k = (R - REACH) / d;
      const sx = Math.min(info.width - 1, Math.max(0, Math.round(R - dx * k - 0.5)));
      const sy = Math.min(info.height - 1, Math.max(0, Math.round(cy - dy * k - 0.5)));
      for (let c = 0; c < info.channels; c++) data[(y * info.width + x) * info.channels + c] = source[(sy * info.width + sx) * info.channels + c];
    }
  }
}
const repaintedPanel = await sharp(panelRaw.data, { raw: { width: panelRaw.info.width, height: panelRaw.info.height, channels: panelRaw.info.channels } }).png().toBuffer();

await mkdir(outDir, { recursive: true });

// Headshots with transparent corners (round or rounded-square cut-outs) can't just be
// cropped to the portrait frame, or the empty corners would show. Find the largest
// portrait rectangle that sits fully inside the visible part, and crop to that.
async function insideVisibleArea(path) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const opaque = (x, y) => data[(y * info.width + x) * 4 + 3] > 250;
  const ratio = PHOTO.width / PHOTO.height;
  for (let h = info.height; h > info.height / 3; h--) {
    const w = Math.round(h * ratio);
    const left = Math.round((info.width - w) / 2);
    const top = Math.round((info.height - h) / 2);
    const fits = [[left, top], [left + w - 1, top], [left, top + h - 1], [left + w - 1, top + h - 1]].every(([x, y]) => opaque(x, y));
    if (fits) return { left, top, width: w, height: h };
  }
  return undefined;
}

// Until a headshot is supplied: the person's initials in Dark Navy on a warm neutral.
function initialsFrame(name) {
  const initials = name
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join("");
  return sharp(
    Buffer.from(
      `<svg width="${PHOTO.width}" height="${PHOTO.height}"><rect width="100%" height="100%" fill="#D5CEC4"/>` +
        `<text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="110" fill="#202E3B">${initials}</text></svg>`,
    ),
  );
}

async function headshotFor(person) {
  const frame = { width: PHOTO.width, height: PHOTO.height };
  let image;
  if (!person.photo && !person.useDesignPhoto) {
    image = initialsFrame(person.name);
  } else if (person.useDesignPhoto) {
    // The design's own portrait: use it as shot, trimmed inside its rounded edge.
    image = sharp(design)
      .extract({ left: PHOTO.left + 2, top: PHOTO.top + 2, width: PHOTO.width - 4, height: PHOTO.height - 4 })
      .resize({ ...frame, fit: "fill" });
  } else {
    const path = join(teamDir, person.photo);
    const { hasAlpha } = await sharp(path).metadata();
    const region = hasAlpha ? await insideVisibleArea(path) : undefined;
    image = (region ? sharp(path).extract(region) : sharp(path))
      .flatten({ background: CREAM })
      .resize({ ...frame, fit: "cover", position: region ? "centre" : sharp.strategy.attention, kernel: "lanczos3" })
      .sharpen({ sigma: 0.8 });
  }
  return image
    .composite([{ input: roundedRect(PHOTO.width, PHOTO.height, PHOTO.radius), blend: "dest-in" }])
    .png()
    .toBuffer();
}

for (const person of selected) {
  const headshot = await headshotFor(person);

  const file = join(outDir, `${person.slug}.png`);
  const banner = await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background: { ...CREAM, alpha: 1 } } })
    .composite([
      { input: repaintedPanel, left: 0, top: 0 },
      { input: shadowFit, left: SHADOW_LEFT, top: SHADOW_TOP },
      { input: headshot, left: PHOTO.left, top: PHOTO.top },
      { input: cardMask, raw: { width: WIDTH, height: HEIGHT, channels: 4 }, blend: "dest-in" },
    ])
    .png()
    .toBuffer();
  await sharp(banner)
    .resize({ width: OUTPUT_WIDTH })
    .png({ palette: true, quality: 90, effort: 10, dither: 1 })
    .toFile(file);
  console.log("wrote", file);
}
