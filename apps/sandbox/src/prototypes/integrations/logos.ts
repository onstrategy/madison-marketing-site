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

import agendalink from "./logos/agendalink.svg";
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
import opentext from "./logos/opentext.svg";
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
  /** Every logo's native canvas — same for all 22, so this isn't per-entry. */
  width: 192;
  height: 108;
  categories: IntegrationCategory[];
}

const ALL_CATEGORIES: IntegrationCategory[] = [
  "citywide-procurement",
  "public-records-foia",
  "community-development",
];

/**
 * Tool → tab assignment, straight from the contributor's split: a handful of
 * tools are exclusive to one platform area, and everything else appears on
 * all three tabs.
 */
export const INTEGRATION_LOGOS: IntegrationLogo[] = [
  { name: "AgendaLink", src: agendalink, width: 192, height: 108, categories: ALL_CATEGORIES },
  { name: "Municode", src: municode, width: 192, height: 108, categories: ALL_CATEGORIES },
  {
    name: "Workday",
    src: workday,
    width: 192,
    height: 108,
    categories: ["citywide-procurement"],
  },
  { name: "Sovra", src: sovra, width: 192, height: 108, categories: ["citywide-procurement"] },
  {
    name: "Barracuda",
    src: barracuda,
    width: 192,
    height: 108,
    categories: ["public-records-foia"],
  },
  { name: "Smarsh", src: smarsh, width: 192, height: 108, categories: ["public-records-foia"] },
  {
    name: "ClearGov",
    src: cleargov,
    width: 192,
    height: 108,
    categories: ["citywide-procurement"],
  },
  { name: "Infor", src: infor, width: 192, height: 108, categories: ALL_CATEGORIES },
  { name: "Esri", src: esri, width: 192, height: 108, categories: ["community-development"] },
  {
    name: "Trimble",
    src: trimble,
    width: 192,
    height: 108,
    categories: ["community-development"],
  },
  { name: "iWorQ", src: iworq, width: 192, height: 108, categories: ["community-development"] },
  {
    name: "Accela",
    src: accela,
    width: 192,
    height: 108,
    categories: ["community-development"],
  },
  { name: "eCode360", src: ecode, width: 192, height: 108, categories: ALL_CATEGORIES },
  { name: "OpenText", src: opentext, width: 192, height: 108, categories: ALL_CATEGORIES },
  { name: "OnBase", src: onbase, width: 192, height: 108, categories: ALL_CATEGORIES },
  { name: "Laserfiche", src: laserfiche, width: 192, height: 108, categories: ALL_CATEGORIES },
  { name: "Govinity", src: govinity, width: 192, height: 108, categories: ALL_CATEGORIES },
  { name: "OpenGov", src: opengov, width: 192, height: 108, categories: ALL_CATEGORIES },
  { name: "YouTube", src: youtube, width: 192, height: 108, categories: ALL_CATEGORIES },
  { name: "eScribe", src: escribe, width: 192, height: 108, categories: ALL_CATEGORIES },
  { name: "CivicPlus", src: civicplus, width: 192, height: 108, categories: ALL_CATEGORIES },
  { name: "Granicus", src: granicus, width: 192, height: 108, categories: ALL_CATEGORIES },
  {
    name: "SharePoint",
    src: sharepoint,
    width: 192,
    height: 108,
    categories: ["public-records-foia"],
  },
  { name: "Teams", src: teams, width: 192, height: 108, categories: ["public-records-foia"] },
  {
    name: "Outlook",
    src: outlook,
    width: 192,
    height: 108,
    categories: ["public-records-foia"],
  },
  {
    name: "Exchange",
    src: exchange,
    width: 192,
    height: 108,
    categories: ["public-records-foia"],
  },
];
