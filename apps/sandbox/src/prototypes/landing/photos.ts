/**
 * Real, freely-licensed stock photography (Unsplash License — free for
 * commercial use, no attribution required) standing in for the design file's
 * empty image slots. We don't hold rights to photos of the actual communities
 * named on the tiles, so these are generic civic/at-work stand-ins — same
 * call as rendering client "logos" as text marks. Every URL was verified to
 * resolve (HTTP 200) before being added here.
 */
export interface StockPhoto {
  url: string;
  alt: string;
  width: number;
  height: number;
}

function unsplash(id: string, alt: string, width: number, height: number): StockPhoto {
  return {
    url: `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`,
    alt,
    width,
    height,
  };
}

export const PHOTOS = {
  govBuildingWhite: unsplash(
    "1625516581237-3d9d0a31538c",
    "Exterior of a government administration building",
    1200,
    825,
  ),
  govBuildingFlag: unsplash(
    "1634508943475-541d357f8a96",
    "Government building exterior with a flag",
    1200,
    800,
  ),
  govBuildingColumns: unsplash(
    "1629333574602-00d8e5dee681",
    "Government building surrounded by trees",
    1200,
    900,
  ),
  meetingPens: unsplash(
    "1517048676732-d65bc937f952",
    "Staff reviewing documents together around a table",
    1200,
    800,
  ),
  groupDiscussion: unsplash(
    "1568992687947-868a62a9f521",
    "A team in discussion during a working meeting",
    1200,
    675,
  ),
  seatedMeeting: unsplash(
    "1606836591695-4d58a73eba1e",
    "Staff seated together during a meeting",
    1200,
    800,
  ),
  laptopsTable: unsplash(
    "1573164574572-cb89e39749b4",
    "Staff working together on laptops at a shared table",
    1200,
    801,
  ),
  presenting: unsplash(
    "1542744173-8e7e53415bb0",
    "A staff member presenting to seated colleagues",
    1200,
    800,
  ),
} satisfies Record<string, StockPhoto>;
