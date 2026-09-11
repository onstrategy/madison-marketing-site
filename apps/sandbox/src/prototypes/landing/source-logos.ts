// Real vendor wordmarks for the "data sources" connector grid (see
// IntelDiagram in ./intel.tsx and the staff-report demo). Sourced from the
// SAME final SVGs the contributor supplied for the Integrations page (see
// ../integrations/logos/) — imported directly from that folder rather than
// duplicated here, so there's one binary per vendor mark, not two. Only the
// categorization in ../integrations/logos.ts is kept separate (per that
// file's own note) — reusing the asset itself carries no such risk.
//
// Matched by substring against the lowercased source name, same convention
// as parts.tsx's SOURCE_ICONS keyword list — first match wins. Sources with
// no entry here keep the generic category-icon stand-in.

import municode from "../integrations/logos/municode.svg";
import laserfiche from "../integrations/logos/laserfiche.svg";
import sharepoint from "../integrations/logos/sharepoint.svg";
import granicus from "../integrations/logos/granicus.svg";
import esri from "../integrations/logos/esri.svg";
import agendalink from "../integrations/logos/agendalink.svg";
import accela from "../integrations/logos/accela.svg";
import civicplus from "../integrations/logos/civicplus.svg";
import escribe from "../integrations/logos/escribe.svg";
import govinity from "../integrations/logos/govinity.svg";
import onbase from "../integrations/logos/onbase.svg";
import youtube from "../integrations/logos/youtube.svg";
import cleargov from "../integrations/logos/cleargov.svg";
import workday from "../integrations/logos/workday.svg";

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
  ["youtube", youtube],
  ["cleargov", cleargov],
  ["workday", workday],
];

export function logoForSource(name: string): string | undefined {
  const key = name.toLowerCase();
  const match = SOURCE_LOGOS.find(([keyword]) => key.includes(keyword));
  return match?.[1];
}
