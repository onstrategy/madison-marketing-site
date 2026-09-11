// The Integrations page's own logo set — supplied directly by the
// contributor as final vendor artwork (192×108, each pre-composed on its own
// white card), replacing the page's previous placeholder/fuzzy-matched
// marks. Deliberately separate from ../landing/source-logos.ts: that registry
// backs the homepage's enterprise-search diagram, keyed by a DIFFERENT list
// of source names (SYSTEMS in ../landing/intel.tsx) via substring matching —
// folding this page's marks into it would risk silently changing what the
// homepage diagram shows for any name the two lists happen to share
// (Laserfiche, Granicus, Municode, YouTube, OnBase, CivicPlus, ClearGov,
// eScribe all appear on both). This page owns its own list instead.

import municode from "./logos/municode.svg";
import workday from "./logos/workday.svg";
import sovra from "./logos/sovra.svg";
import barracuda from "./logos/barracuda.svg";
import smarsh from "./logos/smarsh.svg";
import cleargov from "./logos/cleargov.svg";
import infor from "./logos/infor.svg";
import esri from "./logos/esri.svg";
import trimble from "./logos/trimble.svg";
import iworq from "./logos/iworq.svg";
import accela from "./logos/accela.svg";
import ecode from "./logos/ecode.svg";
import onbase from "./logos/onbase.svg";
import laserfiche from "./logos/laserfiche.svg";
import govinity from "./logos/govinity.svg";
import opengov from "./logos/opengov.svg";
import youtube from "./logos/youtube.svg";
import escribe from "./logos/escribe.svg";
import civicplus from "./logos/civicplus.svg";
import granicus from "./logos/granicus.svg";
import sharepoint from "./logos/sharepoint.svg";
import teams from "./logos/teams.svg";
import outlook from "./logos/outlook.svg";
import exchange from "./logos/exchange.svg";

/**
 * The three platform-area tabs. Distinct from — and coarser than — the four
 * categories ../landing/sections.tsx's PLATFORM_LINKS uses for the nav and
 * homepage cards: this page groups Citywide and Procurement & Contracts into
 * one tab, matching how the tool list itself splits (most differentiated
 * tools are Public-Records-specific or Community-Development-specific; very
 * few are Citywide-only vs. Procurement-only).
 */
export type IntegrationCategory =
  | "citywide-procurement"
  | "public-records-foia"
  | "community-development";

export const INTEGRATION_CATEGORIES: {
  value: IntegrationCategory;
  label: string;
}[] = [
  { value: "citywide-procurement", label: "Citywide & Procurement" },
  { value: "public-records-foia", label: "Public Records / FOIA" },
  { value: "community-development", label: "Community Development" },
];

export interface IntegrationLogo {
  name: string;
  src: string;
  /** Every logo's native canvas — same for all of them, so this isn't per-entry. */
  width: 192;
  height: 108;
}

/** Every vendor mark this page can show, keyed by name — the per-category
 *  order lists below reference these by key rather than repeating the
 *  {src, width, height} shape three times. */
const LOGOS: Record<string, IntegrationLogo> = {
  Granicus: { name: "Granicus", src: granicus, width: 192, height: 108 },
  CivicPlus: { name: "CivicPlus", src: civicplus, width: 192, height: 108 },
  Laserfiche: { name: "Laserfiche", src: laserfiche, width: 192, height: 108 },
  OnBase: { name: "OnBase", src: onbase, width: 192, height: 108 },
  Municode: { name: "Municode", src: municode, width: 192, height: 108 },
  eCode360: { name: "eCode360", src: ecode, width: 192, height: 108 },
  Govinity: { name: "Govinity", src: govinity, width: 192, height: 108 },
  OpenGov: { name: "OpenGov", src: opengov, width: 192, height: 108 },
  eScribe: { name: "eScribe", src: escribe, width: 192, height: 108 },
  YouTube: { name: "YouTube", src: youtube, width: 192, height: 108 },
  SharePoint: { name: "SharePoint", src: sharepoint, width: 192, height: 108 },
  Infor: { name: "Infor", src: infor, width: 192, height: 108 },
  Workday: { name: "Workday", src: workday, width: 192, height: 108 },
  ClearGov: { name: "ClearGov", src: cleargov, width: 192, height: 108 },
  Sovra: { name: "Sovra", src: sovra, width: 192, height: 108 },
  Teams: { name: "Teams", src: teams, width: 192, height: 108 },
  Outlook: { name: "Outlook", src: outlook, width: 192, height: 108 },
  Exchange: { name: "Exchange", src: exchange, width: 192, height: 108 },
  Barracuda: { name: "Barracuda", src: barracuda, width: 192, height: 108 },
  Smarsh: { name: "Smarsh", src: smarsh, width: 192, height: 108 },
  Esri: { name: "Esri", src: esri, width: 192, height: 108 },
  Accela: { name: "Accela", src: accela, width: 192, height: 108 },
  iWorQ: { name: "iWorQ", src: iworq, width: 192, height: 108 },
  Trimble: { name: "Trimble", src: trimble, width: 192, height: 108 },
};

/**
 * Each tab's exact member list AND display order, contributor-specified —
 * the same vendor can (and does — SharePoint, Laserfiche, Granicus, …) carry
 * a different position in each tab it appears on, so a single shared sort
 * order filtered per tab can't produce this; each category owns its own
 * sequence instead.
 */
const CATEGORY_ORDER: Record<IntegrationCategory, string[]> = {
  "citywide-procurement": [
    "Granicus",
    "CivicPlus",
    "Laserfiche",
    "OnBase",
    "Municode",
    "eCode360",
    "Govinity",
    "OpenGov",
    "eScribe",
    "YouTube",
    "SharePoint",
    "Infor",
    "Workday",
    "ClearGov",
    "Sovra",
  ],
  "public-records-foia": [
    // The four exclusive Microsoft 365 marks, then the FOIA-specific pair,
    // then the same sequence citywide-procurement uses for everything else.
    "SharePoint",
    "Teams",
    "Outlook",
    "Exchange",
    "Barracuda",
    "Smarsh",
    "Granicus",
    "CivicPlus",
    "Laserfiche",
    "OnBase",
    "Municode",
    "eCode360",
    "Govinity",
    "OpenGov",
    "eScribe",
    "YouTube",
    "Infor",
    "Workday",
    "ClearGov",
    "Sovra",
  ],
  "community-development": [
    "Municode",
    "eCode360",
    "Esri",
    "OpenGov",
    "Accela",
    "iWorQ",
    "Trimble",
    "Laserfiche",
    "SharePoint",
    "OnBase",
    "YouTube",
    "Granicus",
    "CivicPlus",
    "eScribe",
    "Govinity",
  ],
};

/** The logos for one tab, in that tab's own contributor-specified order. */
export function logosForCategory(category: IntegrationCategory): IntegrationLogo[] {
  return CATEGORY_ORDER[category].map((name) => LOGOS[name]);
}
