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
// Logo-only banner (people.json "noPhoto"): just the navy panel, cut from the design so
// the logo sits centred (it spans x 75-391 of the design), clear of the headshot's
// shadow. It shows at 113px wide in the email.
const COMPACT = { left: 38, width: 390 };
const COMPACT_OUTPUT_WIDTH = 290;
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
function leftCornersMask(width) {
  const alpha = Buffer.alloc(width * HEIGHT * 4, 255);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < R; x++) {
      const cy = y < R ? R : y >= HEIGHT - R ? HEIGHT - R : undefined;
      if (cy === undefined) continue;
      const coverage = Math.max(0, Math.min(1, R - Math.hypot(R - (x + 0.5), cy - (y + 0.5)) + 0.5));
      alpha[(y * width + x) * 4 + 3] = Math.round(coverage * 255);
    }
  }
  return alpha;
}
const cardMask = leftCornersMask(WIDTH);
const compactMask = leftCornersMask(COMPACT.width);

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

// Head-and-shoulders framing for people.json "crop": { cx, top, chin } = where the head sits
// in the source photo (centre x, hair top, chin, all as 0-1 fractions). Every head is scaled
// to the same size and centred in the frame, so the team looks consistent. Where the photo
// runs out (the frame wants more headroom than the photo has, or the photo is a circle),
// the gap is filled with a soft blur of the photo's own edge colours.
const HEAD_FRACTION = 0.52; // head height as a share of the frame height
const HEAD_CENTRE_Y = 0.44; // where the middle of the head sits, top to bottom
async function framedHeadshot(person) {
  const frame = { width: PHOTO.width, height: PHOTO.height };
  const { cx, top, chin } = person.crop;
  const { data, info } = await sharp(join(teamDir, person.photo)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;

  // A copy with no transparent corners: round photos get their edge colours pushed outward.
  const opaque = Buffer.from(data);
  const r = Math.min(W, H) / 2;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (data[i + 3] >= 250) continue;
      const dx = x + 0.5 - W / 2;
      const dy = y + 0.5 - H / 2;
      const k = (r - 4) / Math.hypot(dx, dy);
      const sx = Math.min(W - 1, Math.max(0, Math.round(W / 2 + dx * k - 0.5)));
      const sy = Math.min(H - 1, Math.max(0, Math.round(H / 2 + dy * k - 0.5)));
      const j = (sy * W + sx) * 4;
      opaque[i] = data[j];
      opaque[i + 1] = data[j + 1];
      opaque[i + 2] = data[j + 2];
      opaque[i + 3] = 255;
    }
  }

  // Square photos are scaled so they always fill the frame (no gaps) and slid, if needed, to
  // stay inside it. Round photos are scaled to the head size, then lowered so the bottom of
  // the circle meets the bottom of the frame, which leaves the headroom at the top.
  const isCircle = opaque.some((_, i) => i % 4 === 3 && data[i] < 250);
  const head = person.crop.head ?? (isCircle ? 0.56 : HEAD_FRACTION);
  const cover = isCircle ? frame.width / W : Math.max(frame.height / H, frame.width / W);
  // Optional nudges from people.json: zoom (1.1 = 10% larger), dx / dy (fractions of the frame
  // width / height; positive moves the person right / down).
  const scale = Math.max((head * frame.height) / ((chin - top) * H), cover) * (person.crop.zoom ?? 1);
  const scaledW = Math.round(W * scale);
  const scaledH = Math.round(H * scale);
  let left = Math.round(frame.width / 2 - cx * scaledW + (person.crop.dx ?? 0) * frame.width);
  let topPx = Math.round(HEAD_CENTRE_Y * frame.height - ((top + chin) / 2) * scaledH + (person.crop.dy ?? 0) * frame.height);
  if (isCircle) {
    topPx = Math.max(topPx, frame.height - scaledH);
  } else {
    left = Math.min(0, Math.max(frame.width - scaledW, left));
    topPx = Math.min(0, Math.max(frame.height - scaledH, topPx));
  }

  // Soft backdrop: the photo placed the same way, edges stretched outward, then blurred.
  const PAD = 900;
  const scaledOpaque = await sharp(opaque, { raw: { width: W, height: H, channels: 4 } })
    .resize(scaledW, scaledH, { kernel: "lanczos3" })
    .removeAlpha()
    .png()
    .toBuffer();
  const stretched = await sharp(scaledOpaque)
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, extendWith: "copy" })
    .png()
    .toBuffer();
  const backdrop = await sharp(stretched)
    .extract({ left: PAD - left, top: PAD - topPx, width: frame.width, height: frame.height })
    .blur(28)
    .png()
    .toBuffer();

  // The sharp photo itself, with its real (round or square) edge, in the same place.
  const scaledPhoto = await sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .resize(scaledW, scaledH, { kernel: "lanczos3" })
    .png()
    .toBuffer();
  const x0 = Math.max(0, -left);
  const y0 = Math.max(0, -topPx);
  const x1 = Math.min(scaledW, frame.width - left);
  const y1 = Math.min(scaledH, frame.height - topPx);
  const visible = await sharp(scaledPhoto).extract({ left: x0, top: y0, width: x1 - x0, height: y1 - y0 }).png().toBuffer();
  const placed = await sharp({ create: { ...frame, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: visible, left: left + x0, top: topPx + y0 }])
    .png()
    .toBuffer();
  // Feather the photo's edge a little so it melts into the backdrop.
  const { data: px } = await sharp(placed).raw().toBuffer({ resolveWithObject: true });
  const w = frame.width;
  const h = frame.height;
  const BLUR = 8;
  const blurred = Buffer.alloc(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -BLUR; dy <= BLUR; dy++) {
        for (let dx = -BLUR; dx <= BLUR; dx++) {
          const yy = Math.min(h - 1, Math.max(0, y + dy));
          const xx = Math.min(w - 1, Math.max(0, x + dx));
          sum += px[(yy * w + xx) * 4 + 3];
          count++;
        }
      }
      blurred[y * w + x] = sum / count;
    }
  }
  const out = Buffer.from(px);
  // Soften inward only: pixels outside the photo stay fully clear, so no dark rim appears.
  for (let i = 0; i < w * h; i++) out[i * 4 + 3] = Math.min(px[i * 4 + 3], Math.max(0, Math.min(255, Math.round(blurred[i] * 1.2 - 30))));
  const feathered = await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  // Rendered to a picture now: a second composite() on the same pipeline would replace this one.
  return sharp(await sharp(backdrop).composite([{ input: feathered }]).png().toBuffer());
}

async function headshotFor(person) {
  const frame = { width: PHOTO.width, height: PHOTO.height };
  let image;
  if (person.crop) {
    image = await framedHeadshot(person);
  } else if (!person.photo && !person.useDesignPhoto) {
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

// The design's panel with no headshot at all: a straight cut of the original pixels.
const compactPanel = await sharp(design)
  .extract({ left: COMPACT.left, top: 0, width: COMPACT.width, height: HEIGHT })
  .png()
  .toBuffer();

for (const person of selected) {
  const file = join(outDir, `${person.slug}.png`);

  if (person.noPhoto) {
    const compact = await sharp({ create: { width: COMPACT.width, height: HEIGHT, channels: 4, background: { ...CREAM, alpha: 1 } } })
      .composite([
        { input: compactPanel, left: 0, top: 0 },
        { input: compactMask, raw: { width: COMPACT.width, height: HEIGHT, channels: 4 }, blend: "dest-in" },
      ])
      .png()
      .toBuffer();
    await sharp(compact)
      .resize({ width: COMPACT_OUTPUT_WIDTH })
      .png({ palette: true, quality: 90, effort: 10, dither: 1 })
      .toFile(file);
    console.log("wrote", file, "(logo only)");
    continue;
  }

  const headshot = await headshotFor(person);

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
