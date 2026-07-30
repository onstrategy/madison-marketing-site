// Client logos for the "Live in 65+ local governments" marquee.
//
// These are Madison's own customer logos, pulled from the live madisonai.com
// logo wall. Each is a transparent-background PNG normalized to a 252px source
// height (widths vary by mark), so they can all be rendered at one uniform
// display height and stay optically consistent along the marquee track.
//
// They carry ink in a range of dark brand colors, so they need a true white
// plate behind them (`bg-plate`) — the warm-white canvas would tint them.

import addison from "./logos/addison.png";
import aspen from "./logos/aspen.png";
import beverlyHills from "./logos/beverly-hills.png";
import carsonCity from "./logos/carson-city.png";
import chanhassen from "./logos/chanhassen.png";
import corona from "./logos/corona.png";
import fernley from "./logos/fernley.png";
import fresno from "./logos/fresno.png";
import golden from "./logos/golden.png";
import lasVirgenes from "./logos/las-virgenes.png";
import losAltos from "./logos/los-altos.png";
import nnph from "./logos/nnph.png";
import pasadena from "./logos/pasadena.png";
import pitkinCounty from "./logos/pitkin-county.png";
import prairie from "./logos/prairie.png";
import reno from "./logos/reno.png";
import sanLeandro from "./logos/san-leandro.png";
import stJohns from "./logos/st-johns.png";
import sunnyvale from "./logos/sunnyvale.png";
import surryCounty from "./logos/surry-county.png";
import tahoe from "./logos/tahoe.png";
import washoeCounty from "./logos/washoe-county.png";
import water from "./logos/water.png";

export interface ClientLogo {
  /** Imported asset URL. */
  src: string;
  /** Accessible name — the jurisdiction, spelled out. */
  name: string;
}

export const CLIENT_LOGOS: ClientLogo[] = [
  { src: washoeCounty, name: "Washoe County, Nevada" },
  { src: reno, name: "City of Reno, Nevada" },
  { src: carsonCity, name: "Carson City, Nevada" },
  { src: fernley, name: "City of Fernley, Nevada" },
  { src: nnph, name: "Northern Nevada Public Health" },
  { src: tahoe, name: "Lake Tahoe" },
  { src: aspen, name: "City of Aspen, Colorado" },
  { src: pitkinCounty, name: "Pitkin County, Colorado" },
  { src: golden, name: "City of Golden, Colorado" },
  { src: fresno, name: "City of Fresno, California" },
  { src: pasadena, name: "City of Pasadena, California" },
  { src: beverlyHills, name: "City of Beverly Hills, California" },
  { src: sunnyvale, name: "City of Sunnyvale, California" },
  { src: corona, name: "City of Corona, California" },
  { src: sanLeandro, name: "City of San Leandro, California" },
  { src: losAltos, name: "City of Los Altos, California" },
  { src: lasVirgenes, name: "Las Virgenes Municipal Water District" },
  { src: water, name: "Valley Water" },
  { src: chanhassen, name: "City of Chanhassen, Minnesota" },
  { src: prairie, name: "Grand Prairie, Texas" },
  { src: addison, name: "Town of Addison, Texas" },
  { src: stJohns, name: "St. Johns County, Florida" },
  { src: surryCounty, name: "Surry County, North Carolina" },
];
