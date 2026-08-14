// Real vendor wordmarks for the "data sources" connector grid (see
// ConnectorsSection in ../platform-page/template.tsx). Supplied directly by
// the contributor as the actual partner/integration logos — used here to
// show genuine interoperability, the same real-logo treatment as
// ./logos.ts's client marquee (not a fabricated or invented mark).
//
// Matched by substring against the lowercased source name, same convention
// as parts.tsx's SOURCE_ICONS keyword list — first match wins. Sources with
// no entry here keep the generic category-icon stand-in.

import municode from "./source-logos/municode.png";
import laserfiche from "./source-logos/laserfiche.png";
import sharepoint from "./source-logos/sharepoint.png";
import granicus from "./source-logos/granicus.png";
import esri from "./source-logos/esri.png";
import agendalink from "./source-logos/agendalink.png";
import accela from "./source-logos/accela.png";
import civicplus from "./source-logos/civicplus.png";
import escribe from "./source-logos/escribe.png";
import govinity from "./source-logos/govinity.png";
import onbase from "./source-logos/onbase.png";

export const SOURCE_LOGOS: [string, string][] = [
  ["municode", municode],
  ["laserfiche", laserfiche],
  ["sharepoint", sharepoint],
  ["granicus", granicus],
  ["esri", esri],
  ["arcgis", esri],
  ["agendalink", agendalink],
  ["accela", accela],
  ["civicplus", civicplus],
  ["escribe", escribe],
  ["govinity", govinity],
  ["onbase", onbase],
];

export function logoForSource(name: string): string | undefined {
  const key = name.toLowerCase();
  const match = SOURCE_LOGOS.find(([keyword]) => key.includes(keyword));
  return match?.[1];
}
