import { renderToStaticMarkup } from "react-dom/server";
import people from "./people.json";

// ============================================================================
// The Madison AI email signature.
//
// This is email HTML, not site UI, so it follows email rules rather than the
// site's token classes: a fixed-width table, inline styles, literal hex colors
// (mail apps can't read our CSS variables), web-safe fonts, and images by
// absolute URL. The colors below are the brand's Dark Navy, Warm White and
// Terracotta, copied from the approved design.
// ============================================================================

export interface SignaturePerson {
  slug: string;
  name: string;
  title?: string;
  email: string;
  phone?: string;
}

export const SIGNATURE_PEOPLE: SignaturePerson[] = people;

/** Where the banner images live once the site is published. */
export const SIGNATURE_IMAGE_ORIGIN = "https://www.madisonai.com/sig-bumceoquwx/";
const WEBSITE = "https://www.madisonai.com";
const TAGLINE = "AI Built from Your Gov’s Institutional Knowledge";

const NAVY = "#202E3B";
const CREAM = "#EAE5DF";
const TERRACOTTA = "#C75A3B";
const FONT = "Arial, Helvetica, sans-serif";

// 400px wide, scaled from the 1377px design.
const CARD_WIDTH = 400;
const BANNER_WIDTH = 217;
const BANNER_HEIGHT = 150;
const RADIUS = 11;

function plainLink(color: string, bold: boolean) {
  return {
    color,
    textDecoration: "none",
    fontWeight: bold ? ("bold" as const) : ("normal" as const),
  };
}

export function Signature({
  person,
  imageBase,
}: {
  person: SignaturePerson;
  imageBase: string;
}) {
  // Long titles get tighter lettering so they stay on one line.
  const longTitle = (person.title?.length ?? 0) > 20;
  return (
    <table
      role="presentation"
      cellPadding={0}
      cellSpacing={0}
      border={0}
      width={CARD_WIDTH}
      style={{
        width: CARD_WIDTH,
        borderCollapse: "separate",
        borderSpacing: 0,
        backgroundColor: CREAM,
        borderRadius: RADIUS,
        fontFamily: FONT,
      }}
    >
      <tbody>
        <tr>
          <td
            width={BANNER_WIDTH}
            valign="top"
            style={{ width: BANNER_WIDTH, padding: 0, lineHeight: 0, fontSize: 0 }}
          >
            <img
              src={`${imageBase}${person.slug}.png`}
              alt={`Madison AI · ${person.name}`}
              width={BANNER_WIDTH}
              height={BANNER_HEIGHT}
              style={{
                display: "block",
                border: 0,
                width: BANNER_WIDTH,
                height: BANNER_HEIGHT,
              }}
            />
          </td>
          <td
            valign="middle"
            style={{
              padding: "0 7px 0 9px",
              backgroundColor: CREAM,
              borderRadius: `0 ${RADIUS}px ${RADIUS}px 0`,
              fontFamily: FONT,
            }}
          >
            <table
              role="presentation"
              cellPadding={0}
              cellSpacing={0}
              border={0}
              width="100%"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      fontFamily: FONT,
                      fontSize: 17,
                      lineHeight: "20px",
                      fontWeight: "bold",
                      color: NAVY,
                      padding: person.title ? 0 : "0 0 9px 0",
                    }}
                  >
                    {person.name}
                  </td>
                </tr>
                {person.title ? (
                <tr>
                  <td
                    style={{
                      fontFamily: FONT,
                      fontSize: longTitle ? 7.5 : 8.5,
                      lineHeight: "10px",
                      fontWeight: "bold",
                      letterSpacing: longTitle ? "0.8px" : "1.3px",
                      color: TERRACOTTA,
                      padding: "4px 0 9px 0",
                    }}
                  >
                    {person.title.toUpperCase()}
                  </td>
                </tr>
                ) : null}
                <tr>
                  <td
                    style={{
                      borderTop: `1px solid ${NAVY}`,
                      fontSize: 0,
                      lineHeight: 0,
                      height: 1,
                      padding: 0,
                    }}
                  >
                    &nbsp;
                  </td>
                </tr>
                {person.phone ? (
                  <tr>
                    <td
                      style={{
                        fontFamily: FONT,
                        fontSize: 11.5,
                        lineHeight: "14px",
                        fontWeight: "bold",
                        color: NAVY,
                        padding: "8px 0 0 0",
                      }}
                    >
                      <a
                        href={`tel:${person.phone.replace(/[^+\d]/g, "")}`}
                        style={plainLink(NAVY, true)}
                      >
                        {person.phone}
                      </a>
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td
                    style={{
                      fontFamily: FONT,
                      fontSize: 11.5,
                      lineHeight: "14px",
                      color: NAVY,
                      padding: person.phone ? "3px 0 8px 0" : "8px 0 8px 0",
                    }}
                  >
                    <a
                      href={`mailto:${person.email}`}
                      style={plainLink(NAVY, false)}
                    >
                      {person.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      borderTop: `1px solid ${NAVY}`,
                      fontSize: 0,
                      lineHeight: 0,
                      height: 1,
                      padding: 0,
                    }}
                  >
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontFamily: FONT,
                      fontSize: 11.5,
                      lineHeight: "14px",
                      fontWeight: "bold",
                      color: TERRACOTTA,
                      padding: "7px 0 2px 0",
                    }}
                  >
                    <a href={WEBSITE} style={plainLink(TERRACOTTA, true)}>
                      www.MadisonAI.com
                    </a>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontFamily: FONT,
                      fontSize: 7.5,
                      lineHeight: "9px",
                      color: NAVY,
                      padding: 0,
                    }}
                  >
                    {TAGLINE}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** The signature as copy-ready HTML, with its images pointing at the live site. */
export function signatureHtml(person: SignaturePerson): string {
  return (
    renderToStaticMarkup(
      <Signature person={person} imageBase={SIGNATURE_IMAGE_ORIGIN} />,
    )
      // React adds an image-preload <link> for page speed; it has no place in an email.
      .replace(/<link[^>]*>/g, "")
  );
}

/** Plain-text version, used when a mail app only accepts text. */
export function signatureText(person: SignaturePerson): string {
  return [
    person.name,
    person.title,
    person.phone,
    person.email,
    "www.MadisonAI.com",
    TAGLINE,
  ]
    .filter(Boolean)
    .join("\n");
}
