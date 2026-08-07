// Client logos for the "Live in 65+ local governments" marquee.
//
// These are Madison's own customer logos, pulled from the live madisonai.com
// logo wall. The original transparent PNGs remain alongside lossless WebP
// delivery assets sized to 2x their 70px rendered height. This keeps the marks
// crisp on high-density screens without shipping oversized source images.
//
// They carry ink in a range of dark brand colors, so they need a true white
// plate behind them (`bg-plate`) — the warm-white canvas would tint them.

import addison from "./logos/addison.webp";
import aspen from "./logos/aspen.webp";
import beverlyHills from "./logos/beverly-hills.webp";
import carsonCity from "./logos/carson-city.webp";
import chanhassen from "./logos/chanhassen.webp";
import corona from "./logos/corona.webp";
import fernley from "./logos/fernley.webp";
import fresno from "./logos/fresno.webp";
import golden from "./logos/golden.webp";
import lasVirgenes from "./logos/las-virgenes.webp";
import losAltos from "./logos/los-altos.webp";
import nnph from "./logos/nnph.webp";
import pasadena from "./logos/pasadena.webp";
import pitkinCounty from "./logos/pitkin-county.webp";
import prairie from "./logos/prairie.webp";
import reno from "./logos/reno.webp";
import sanLeandro from "./logos/san-leandro.webp";
import stJohns from "./logos/st-johns.webp";
import sunnyvale from "./logos/sunnyvale.webp";
import surryCounty from "./logos/surry-county.webp";
import tahoe from "./logos/tahoe.webp";
import washoeCounty from "./logos/washoe-county.webp";
import water from "./logos/water.webp";

export interface ClientLogo {
  /** Imported asset URL. */
  src: string;
  /** Accessible name — the jurisdiction, spelled out. */
  name: string;
  /** Intrinsic delivery dimensions — lets browsers reserve the correct aspect ratio before loading. */
  width: number;
  height: number;
}

export const CLIENT_LOGOS: ClientLogo[] = [
  { src: washoeCounty, name: "Washoe County, Nevada", width: 119, height: 140 },
  { src: reno, name: "City of Reno, Nevada", width: 169, height: 140 },
  { src: carsonCity, name: "Carson City, Nevada", width: 301, height: 140 },
  { src: fernley, name: "City of Fernley, Nevada", width: 153, height: 140 },
  { src: nnph, name: "Northern Nevada Public Health", width: 96, height: 140 },
  { src: tahoe, name: "Lake Tahoe", width: 203, height: 140 },
  { src: aspen, name: "City of Aspen, Colorado", width: 132, height: 140 },
  { src: pitkinCounty, name: "Pitkin County, Colorado", width: 130, height: 140 },
  { src: golden, name: "City of Golden, Colorado", width: 223, height: 140 },
  { src: fresno, name: "City of Fresno, California", width: 337, height: 140 },
  { src: pasadena, name: "City of Pasadena, California", width: 152, height: 140 },
  { src: beverlyHills, name: "City of Beverly Hills, California", width: 104, height: 140 },
  { src: sunnyvale, name: "City of Sunnyvale, California", width: 138, height: 140 },
  { src: corona, name: "City of Corona, California", width: 223, height: 140 },
  { src: sanLeandro, name: "City of San Leandro, California", width: 208, height: 140 },
  { src: losAltos, name: "City of Los Altos, California", width: 95, height: 140 },
  { src: lasVirgenes, name: "Las Virgenes Municipal Water District", width: 177, height: 140 },
  { src: water, name: "Valley Water", width: 332, height: 140 },
  { src: chanhassen, name: "City of Chanhassen, Minnesota", width: 115, height: 140 },
  { src: prairie, name: "Grand Prairie, Texas", width: 288, height: 140 },
  { src: addison, name: "Town of Addison, Texas", width: 116, height: 140 },
  { src: stJohns, name: "St. Johns County, Florida", width: 183, height: 140 },
  { src: surryCounty, name: "Surry County, North Carolina", width: 113, height: 140 },
];
