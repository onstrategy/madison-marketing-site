import type { CSSProperties, ReactNode } from "react";
import { useLocation } from "react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Landmark,
  Gavel,
  Users,
  ShieldCheck,
  Map as MapIcon,
  Lock,
  Building2,
  LandPlot,
  FileSignature,
  FileSearch,
  Plug,
  Target,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@madison/ui/utils";
import { Button } from "@madison/ui/button";
import {
  Navbar,
  NavbarBrand,
  NavbarLinks,
  NavbarLink,
  NavbarActions,
  NavbarMobileTrigger,
  NavbarMobileMenu,
} from "@madison/ui/navbar";
import { NavDropdown } from "@madison/ui/nav-dropdown";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@madison/ui/accordion";
import { Logo } from "@madison/ui/logo";
import { Reveal, Marquee, useInView } from "./parts";
import { CLIENT_LOGOS } from "./logos";
import { IntelDiagram } from "./intel";
import { PHOTOS, type StockPhoto } from "./photos";
import visionCollab from "./vision-collab.jpg";

// ============================================================================
// Madison landing — sections, rebuilt to the "Platform Home 2a" design file.
// Every band, color, and type choice maps to a token: the design's cream
// bands are bg-app / bg-surface, its blue accents are `brand`, Lora
// headlines come from the global h1–h4 serif rule.
// ============================================================================

// The four featured modules — rendered as cards in the "Platform" mega menu
// (below) and, with the same icons, as the four cards on the home page's
// Capabilities section. `description` is the mega menu's card body copy.
const PLATFORM_LINKS = [
  {
    label: "Citywide AI",
    href: "/citywide-ai/",
    icon: Building2,
    description: "One model grounded across every department's record.",
  },
  {
    label: "AI for Community Development",
    href: "/community-development-ai/",
    icon: LandPlot,
    description: "Permitting, zoning, and planning grounded in your GIS.",
  },
  {
    label: "AI for Procurement & Contracts",
    href: "/procurement-contracts-ai/",
    icon: FileSignature,
    description: "RFP drafting and contract review, cited to your record.",
  },
  {
    label: "AI for Public Records Requests",
    href: "/public-records-requests-ai/",
    icon: FileSearch,
    description: "PRA fulfillment from intake to response letter.",
  },
];

// Lighter-weight, cross-cutting properties of the platform rather than
// departmental modules — the mega menu's secondary link row.
const PLATFORM_SECONDARY_LINKS = [
  { label: "Integrations", href: "/integrations/", icon: Plug },
  { label: "Accuracy", href: "#top", icon: Target },
];

const COMPANY_LINKS = [
  { label: "About us", href: "/about-us/" },
  { label: "Newsroom", href: "/updates/" },
  { label: "Contact", href: "/contact/" },
];

// Nav items don't map 1:1 onto route paths. The live site's IA is mixed: client
// stories and resources sit under their index ("/client-stories/city-of-corona"),
// while news items are flat top-level routes ("/proof-ai-works-in-the-public-sector"
// under the "/updates" index). So "which pages count as under this nav item" can't
// be derived from the URL and stays an explicit map here.
const CLIENT_STORIES_PATHS = ["/client-stories", "/client-stories/city-of-corona"];
const RESOURCES_PATHS = [
  "/resources",
  "/director-of-ai-assistant",
  "/resources/how-to-develop-your-governments-ai-guiding-principles",
];
const NEWSROOM_PATHS = ["/updates", "/proof-ai-works-in-the-public-sector"];

export type ActiveNavItem = "client-stories" | "newsroom" | "resources";

/** One row in the mobile menu — same active/icon shape as NavbarLink and NavDropdown's items, just stacked instead of inline. */
function MobileNavLink({
  href,
  active,
  icon: Icon,
  className,
  children,
}: {
  href: string;
  active?: boolean;
  icon?: LucideIcon;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-hover",
        active ? "text-brand-accent" : "text-secondary hover:text-primary",
        className,
      )}
    >
      {Icon ? <Icon aria-hidden="true" className="size-4 shrink-0 text-brand-accent" /> : null}
      {children}
    </a>
  );
}

export function Nav({
  sectionAware = false,
  overDarkHero = false,
  activeNavItem,
}: {
  sectionAware?: boolean;
  overDarkHero?: boolean;
  activeNavItem?: ActiveNavItem;
}) {
  const { pathname } = useLocation();
  const activePath = pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
  const companyLinks = COMPANY_LINKS.map((item) => ({
    ...item,
    active:
      item.href === "/updates/"
        ? activeNavItem === "newsroom" || NEWSROOM_PATHS.includes(activePath)
        : item.href.replace(/\/+$/, "") === activePath,
  }));
  const platformActive = activePath === "/landing";

  return (
    <Navbar contentClassName="mx-auto max-w-6xl" sectionAware={sectionAware} overDarkHero={overDarkHero}>
      <NavbarBrand href="/">
        <Logo />
      </NavbarBrand>
      <NavbarLinks>
        <NavDropdown
          label="Platform"
          items={PLATFORM_LINKS}
          secondaryItems={PLATFORM_SECONDARY_LINKS}
          variant="mega"
          active={platformActive}
        />
        <NavbarLink
          href="/client-stories/"
          active={
            activeNavItem === "client-stories" ||
            CLIENT_STORIES_PATHS.includes(activePath)
          }
        >
          Client Stories
        </NavbarLink>
        <NavbarLink href="/security/" active={activePath === "/security"}>
          Security
        </NavbarLink>
        <NavDropdown label="Company" items={companyLinks} active={companyLinks.some((item) => item.active)} />
        <NavbarLink
          href="/resources/"
          active={
            activeNavItem === "resources" || RESOURCES_PATHS.includes(activePath)
          }
        >
          Resources
        </NavbarLink>
      </NavbarLinks>
      <NavbarActions>
        <Button size="sm" asChild>
          <a href="/demo/">Book a demo</a>
        </Button>
        <NavbarMobileTrigger />
      </NavbarActions>
      {/* Mobile/tablet substitute for NavbarLinks above (which is lg:hidden).
          Every row — plain link or dropdown trigger — shares MobileNavLink's
          exact text style (font-sans text-sm font-medium) so the list reads
          as one consistent set; only the two that are DROPDOWNS on desktop
          (Platform, Company) differ, and only by the trailing chevron +
          being collapsed until tapped, not by how their own label looks.
          `font-sans` on the triggers isn't decorative: AccordionTrigger's
          Radix wrapper renders as an <h3>, and this app's global base layer
          puts every h1–h4 in the Lora serif display face — without an
          explicit reset here, "Platform"/"Company" would silently render in
          a different typeface than every other row. */}
      <NavbarMobileMenu className="flex flex-col gap-0.5">
        <Accordion type="single" collapsible>
          <AccordionItem value="platform" className="border-none">
            <AccordionTrigger
              className={cn(
                "rounded-md px-3 py-2.5 font-sans text-sm font-medium hover:bg-hover",
                platformActive ? "text-brand-accent" : "text-secondary hover:text-primary",
              )}
            >
              Platform
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-0.5 p-0 pb-1">
              {[...PLATFORM_LINKS, ...PLATFORM_SECONDARY_LINKS].map((item) => (
                <MobileNavLink key={item.label} href={item.href} icon={item.icon} className="pl-8">
                  {item.label}
                </MobileNavLink>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <MobileNavLink
          href="/client-stories/"
          active={
            activeNavItem === "client-stories" ||
            CLIENT_STORIES_PATHS.includes(activePath)
          }
        >
          Client Stories
        </MobileNavLink>
        <MobileNavLink href="/security/" active={activePath === "/security"}>
          Security
        </MobileNavLink>
        <MobileNavLink
          href="/resources/"
          active={
            activeNavItem === "resources" || RESOURCES_PATHS.includes(activePath)
          }
        >
          Resources
        </MobileNavLink>
        <Accordion type="single" collapsible>
          <AccordionItem value="company" className="border-none">
            <AccordionTrigger
              className={cn(
                "rounded-md px-3 py-2.5 font-sans text-sm font-medium hover:bg-hover",
                companyLinks.some((item) => item.active) ? "text-brand-accent" : "text-secondary hover:text-primary",
              )}
            >
              Company
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-0.5 p-0 pb-1">
              {companyLinks.map((item) => (
                <MobileNavLink key={item.label} href={item.href} active={item.active} className="pl-8">
                  {item.label}
                </MobileNavLink>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </NavbarMobileMenu>
    </Navbar>
  );
}

/** Lowercase micro-label in brand blue — the design's `.ey` treatment. */
function Kicker({ children }: { children: string }) {
  return (
    <span className="font-sans text-sm uppercase tracking-widest text-brand-accent">
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// LOGO WALL — "Live in 65+ local governments"
// ---------------------------------------------------------------------------

export function ClientLogos() {
  return (
    <section className="light bg-plate px-gutter pb-14 pt-18">
      <div className="mx-auto max-w-6xl">
        <p className="mb-8 text-center font-sans text-sm uppercase tracking-widest text-secondary">
          Live in 65+ local governments
        </p>
        <Marquee
          durationSeconds={60}
          items={CLIENT_LOGOS}
          renderItem={(logo) => (
            <img
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              loading="lazy"
              // Uniform display height; width follows each mark's own aspect
              // ratio, so the wall reads as one optical line.
              className="h-17.5 w-auto object-contain"
            />
          )}
        />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// INTELLIGENCE LAYER — headline over the animated diagram
// ---------------------------------------------------------------------------

export function IntelligenceLayer() {
  return (
    <section className="border-t border-default bg-app px-gutter py-26">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="mx-auto mb-11 max-w-4xl text-balance text-center text-4xl font-medium tracking-tight text-primary">
            We&rsquo;re building your city&rsquo;s AI data layer, and the
            agents to accelerate your work.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <IntelDiagram />
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CAPABILITIES — five jobs, five cards
// ---------------------------------------------------------------------------

const CAPABILITIES = [
  {
    icon: Building2,
    title: "Citywide AI",
    desc: "One model grounded across every department — trained on your government's full record, not just one office's files.",
    href: "/citywide-ai/",
  },
  {
    icon: LandPlot,
    title: "AI for Community Development",
    desc: "Permitting, zoning, and planning answers grounded in your code, GIS, and parcel history.",
    href: "/community-development-ai/",
  },
  {
    icon: FileSignature,
    title: "AI for Procurement & Contracts",
    desc: "RFP drafting, contract review, and vendor history — cited to your own procurement record.",
    href: "/procurement-contracts-ai/",
  },
  {
    icon: FileSearch,
    title: "AI for Public Records Requests",
    desc: "AI-assisted PRA fulfillment, from intake to response letter, grounded in the record you already hold.",
    href: "/public-records-requests-ai/",
  },
];

// Rendered below the card grid, not as cards themselves — Integrations and
// Accuracy are cross-cutting properties of the platform rather than
// departmental modules, so they read as a lighter-weight link row.
const CAPABILITIES_LINKS = [
  { label: "Integrations", href: "/integrations/", icon: Plug },
  { label: "Accuracy", href: "#top", icon: Target },
];

export function Capabilities() {
  // Drives the icon draw-in below — the whole row of icons draws once the card
  // grid reaches the viewport, staggered per card.
  const { ref: gridRef, inView } = useInView<HTMLDivElement>();
  return (
    <section className="dark border-t border-default bg-app px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-6">
            <h5 className="mb-5 font-sans text-xl font-semibold text-brand-accent">
              The assistant you always wanted but could never afford.
            </h5>
            <h2 className="text-balance text-4xl font-medium tracking-tight text-primary">
              Give an assistant to everyone on your staff.
            </h2>
          </div>
          <p className="mb-10 max-w-2xl text-lg text-secondary">
            One platform, four modules — powered by department-specific
            models trained on your government&rsquo;s record.
          </p>
        </Reveal>
        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.title} delay={i * 60}>
              <a
                href={cap.href}
                className="group flex h-full flex-col rounded-2xl border border-active bg-surface p-5 transition-transform hover:-translate-y-1"
              >
                {/* Icon chip — a small gradient tile rather than a flat rectangle.
                    The glyph draws itself in when the grid reaches the viewport:
                    Lucide icons are stroked paths with no fill, so offsetting a
                    dash the length of the whole path hides it, and easing that
                    offset to 0 traces each line back on. 100 user units covers
                    every path in a 24×24 icon, so one value works for all of
                    them without needing per-path lengths. The stagger rides an
                    inherited custom property, since transition-delay itself
                    doesn't inherit down to the paths. */}
                <div
                  style={{ "--draw-delay": `${i * 140}ms` } as CSSProperties}
                  className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-hover shadow-sm"
                >
                  {/* The dash pair is set inline on the <svg>, not via utility
                      classes on its paths: stroke-dasharray/-dashoffset are
                      INHERITED SVG properties, so one inline declaration
                      cascades to every path — and, being inline, it can't lose
                      to a same-specificity utility the way two competing
                      arbitrary classes do. Only the transition lives in
                      classes, on the paths where the value actually changes. */}
                  <cap.icon
                    style={{ strokeDasharray: 100, strokeDashoffset: inView ? 0 : 100 }}
                    className="size-6 text-brand-fg [&_*]:transition-[stroke-dashoffset] [&_*]:[transition-duration:1100ms] [&_*]:[transition-delay:var(--draw-delay)] [&_*]:ease-out motion-reduce:[&_*]:transition-none"
                  />
                </div>
                <div className="mb-1.5 text-lg font-bold tracking-tight text-primary">
                  {cap.title}
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-secondary">
                  {cap.desc}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent">
                  Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={CAPABILITIES.length * 60}>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-default pt-8">
            {CAPABILITIES_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-1.5 font-semibold text-brand-accent"
              >
                <link.icon aria-hidden="true" className="size-4" />
                {link.label} <ArrowRight className="size-4" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CLIENT STORIES — photo-tile grid (two tall + 2×2)
// ---------------------------------------------------------------------------

interface StoryTile {
  name: string;
  kind: "roi" | "quote";
  line: string;
  photo: StockPhoto;
  tall?: boolean;
  href: string;
}

const STORY_TILES: StoryTile[] = [
  {
    name: "Washoe County, NV",
    kind: "roi",
    line: "$41K+ saved every month",
    photo: PHOTOS.govBuildingFlag,
    tall: true,
    href: "/client-stories/washoe-county/",
  },
  {
    name: "City of Reno",
    kind: "roi",
    line: "75% less time on staff reports",
    photo: PHOTOS.meetingPens,
    tall: true,
    href: "/client-stories/",
  },
  {
    name: "Carson City, NV",
    kind: "quote",
    line: "Exactly what I need, faster.",
    photo: PHOTOS.govBuildingWhite,
    href: "/client-stories/carson-city-client-story/",
  },
  {
    name: "City of Corona, CA",
    kind: "quote",
    line: "Every decision at our fingertips.",
    photo: PHOTOS.laptopsTable,
    href: "/client-stories/city-of-corona/",
  },
  {
    name: "Aspen, CO",
    kind: "roi",
    line: "140 hrs reclaimed / month",
    photo: PHOTOS.govBuildingColumns,
    href: "/the-city-of-aspen-co-taps-madison-ai/",
  },
  // Pasadena previously filled the grid's last slot; that slot is now the
  // "Read more client stories" CTA card (see ClientStories below), which
  // absorbed the "See all 60+ customers" link that used to sit above the
  // grid instead.
];

/**
 * A photo tile is an always-dark region (photo under a navy scrim), so its
 * caption block is wrapped in the `dark` token scope: text-primary resolves
 * to warm white and bg-app to Dark Navy in BOTH themes — no raw colors.
 */
function StoryTileCard({ tile }: { tile: StoryTile }) {
  const isInternal = tile.href.startsWith("/");
  return (
    // The whole tile is the link — the "See the story" pill below is now just
    // the visual affordance (a span), since nesting an anchor inside an anchor
    // isn't valid HTML and would swallow part of the card's own hit area.
    <a
      href={tile.href}
      {...(isInternal ? {} : { target: "_blank", rel: "noopener" })}
      className={cn(
        "group relative block cursor-pointer overflow-hidden rounded-2xl transition-transform hover:-translate-y-1",
        tile.tall ? "h-115" : "h-55",
      )}
    >
      <img
        src={tile.photo.url}
        alt={tile.photo.alt}
        width={tile.photo.width}
        height={tile.photo.height}
        loading="lazy"
        className="absolute inset-0 size-full scale-100 object-cover transition-transform [transition-duration:var(--duration-slow)] group-hover:scale-105"
      />
      <div className="dark absolute inset-0">
        {/* Base scrim — always at full opacity, never animated. The small
            tiles are short enough that the text sits much higher up
            proportionally, so theirs both starts at the very top and reaches
            full opacity by 60% down — covering well over half the photo at
            rest, rather than only shading the bottom edge. */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-app",
            tile.tall ? "from-15%" : "from-0% to-60%",
          )}
        />
        {/* Hover scrim STACKS on top of the base one rather than replacing it:
            it only ever fades in, so two scrims are compounding at the end and
            the tile reads genuinely darker. Cross-fading them (base out while
            this one came in) was the flicker — mid-transition both sat at
            partial opacity, so the photo briefly showed through brighter than
            either end state. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-0% to-app opacity-0 transition-opacity group-hover:opacity-100" />
        {/* The button is absolutely positioned (not in normal flow) so it
            reserves no space at rest — the text sits flush at the true
            bottom of the card. On hover it rises + fades in from below,
            and the text rides up further to clear it, reading as the
            button "pushing" the text up rather than two independent moves. */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0",
            tile.tall ? "p-6" : "p-4.5",
          )}
        >
          <div className="transition-transform group-hover:-translate-y-11">
            <div className="mb-2 font-sans text-sm uppercase tracking-widest text-secondary">
              {tile.name}
            </div>
            {/* Same weight/size/family for both kinds — a quote and a number
                callout are equally "the headline" of their card, so neither
                should read as more or less prominent than the other. Only
                the quote marks differ, since that's what actually signals
                which kind of claim this is. */}
            <div
              className={cn(
                "font-sans font-bold tracking-tight text-primary",
                tile.tall ? "text-2xl" : "text-lg",
              )}
            >
              {tile.kind === "quote" ? <>&ldquo;{tile.line}&rdquo;</> : tile.line}
            </div>
          </div>
          <span
            className={cn(
              "absolute inline-flex w-fit translate-y-2 items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-brand-fg opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100",
              // Absolute children align to the parent's border box, not its
              // padding box, so the inset has to restate the parent's own
              // p-6 / p-4.5 explicitly — bottom-0/inset-x-0 would sit flush
              // with the card edge instead of matching the text's margin.
              tile.tall ? "inset-x-6 bottom-6" : "inset-x-4.5 bottom-4.5",
            )}
          >
            See the story <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}

export function ClientStories() {
  return (
    <section className="border-t border-default bg-surface px-gutter py-27">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          {/* No "See all 60+ customers" link here: it moved into the grid's
              last slot as a "Read more client stories" CTA card below. */}
          <h2 className="mb-10 text-balance text-4xl font-medium tracking-tight text-primary">
            Every customer is a community we serve.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="grid gap-3 lg:grid-cols-4">
            <StoryTileCard tile={STORY_TILES[0]} />
            <StoryTileCard tile={STORY_TILES[1]} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2">
              {STORY_TILES.slice(2).map((tile) => (
                <StoryTileCard key={tile.name} tile={tile} />
              ))}
              {/* Absorbs the "See all 60+ customers" link that used to sit
                  above the grid — now the grid's own last card instead of a
                  separate header link. */}
              <a
                href="/client-stories/"
                className="flex h-55 flex-col items-center justify-center rounded-2xl bg-brand-shade p-4.5 text-center transition-transform hover:-translate-y-1"
              >
                {/* A fixed width, not max-width — as a centered flex-column
                    child with no explicit width, the box shrink-fits well
                    below the available space (one word per line), so the
                    width has to be stated directly to land on a clean,
                    predictable 2 lines. text-balance was tried first but
                    picks an even narrower "most even split" (4 lines) for
                    this particular phrase. */}
                <span className="w-32 text-lg font-semibold text-brand-fg">
                  Read more client stories
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// WHO & HOW — three audiences
// ---------------------------------------------------------------------------

const ROLES = [
  {
    icon: Landmark,
    photo: PHOTOS.seatedMeeting,
    cap: "Public records office · Washoe County, NV",
    tag: "for staff",
    title: "Built for the people who run the building.",
    desc: "Clerks, planners, finance directors, and records officers — Madison was co-designed with the staff who use it daily.",
    stat: "5 hrs",
    statLabel: "back to each staff member, weekly",
  },
  {
    icon: Gavel,
    photo: PHOTOS.presenting,
    cap: "Council district overview · Reno, NV",
    tag: "for electeds",
    title: "Five-minute briefings before five-hour meetings.",
    desc: "Hand Madison the agenda packet. Get back a per-item summary with cited history, prior votes, and staff position.",
    stat: "120+",
    statLabel: "council & board members briefed weekly",
  },
  {
    icon: Users,
    photo: PHOTOS.govBuildingWhite,
    cap: "Resident self-service portal",
    tag: "for citizens",
    title: "Answers without the wait.",
    desc: "Public records handled from intake to response letter — and self-service answers that resolve routine questions instantly.",
    stat: "90%",
    statLabel: "faster records fulfillment",
  },
];

export function Roles() {
  return (
    <section className="border-t border-default bg-app px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h3 className="mx-auto mb-10 max-w-3xl text-balance text-center text-3xl font-medium tracking-tight text-primary">
            One platform, three audiences. And the people they&rsquo;re for.
          </h3>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {ROLES.map((role, i) => (
            <Reveal key={role.tag} delay={i * 80}>
              {/* The card itself is inert — no lift, no pointer. The only
                  interactive affordance is the caption pill over the photo. */}
              <div className="h-full overflow-hidden rounded-2xl border border-default bg-surface">
                <div className="relative h-52">
                  <img
                    src={role.photo.url}
                    alt={role.photo.alt}
                    width={role.photo.width}
                    height={role.photo.height}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover"
                  />
                  {/* Caption pill is an always-dark region — `dark` scope keeps
                      it on-token. Named group (`group/cap`) so its own hover
                      drives the arrow nudge without the card reacting too. */}
                  <div className="group/cap dark absolute inset-x-3 bottom-3 flex cursor-pointer items-center justify-between gap-2 rounded-lg bg-app/75 px-3 py-2 text-xs text-primary backdrop-blur-sm transition-colors hover:bg-app/90">
                    <span>{role.cap}</span>
                    <ArrowUpRight className="size-3.5 transition-transform group-hover/cap:translate-x-0.5 group-hover/cap:-translate-y-0.5" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-2.5 flex items-center gap-2">
                    <span className="flex size-6.5 items-center justify-center rounded-md bg-brand-subtle text-brand-accent">
                      <role.icon className="size-4" />
                    </span>
                    <Kicker>{role.tag}</Kicker>
                  </div>
                  <h3 className="mb-2.5 font-sans text-xl font-bold leading-snug tracking-tight text-primary">
                    {role.title}
                  </h3>
                  <p className="mb-4.5 text-sm leading-relaxed text-secondary">
                    {role.desc}
                  </p>
                  <div className="flex items-baseline gap-2 border-t border-default pt-3.5">
                    <span className="text-2xl font-bold text-primary">
                      {role.stat}
                    </span>
                    <span className="text-xs text-muted">{role.statLabel}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// THE MOMENT — big-number proof
// ---------------------------------------------------------------------------

const MOMENT_STATS = [
  { value: "75%", label: "less time on staff report drafting, measured at City of Reno" },
  { value: "5 hrs", label: "given back per staff member each week, across 65+ governments" },
  { value: "$2.1m", label: "annual labor recouped per 100 staff, modeled across departments" },
];

export function TheMoment() {
  return (
    <section className="border-t border-default bg-surface px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="mb-14 max-w-3xl text-balance text-4xl font-medium tracking-tight text-primary">
            AI is changing local government.
          </h2>
        </Reveal>
        <div className="grid items-start gap-8 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <Reveal>
            <p className="max-w-md text-pretty leading-relaxed text-secondary">
              The municipal sector is undergoing its most significant
              operational shift in a generation. Governments that leaned into
              purpose-built AI early are already seeing tangible returns.
              <br />
              <br />
              This is the early framework for what staff and electeds can
              reasonably expect.
            </p>
          </Reveal>
          <div className="flex flex-col">
            {MOMENT_STATS.map((stat, i) => (
              <Reveal key={stat.value} delay={i * 80}>
                <div
                  className={cn(
                    "grid items-baseline gap-4 border-t border-default py-7 sm:grid-cols-[280px_1fr] sm:gap-8",
                    i === MOMENT_STATS.length - 1 && "border-b",
                  )}
                >
                  <div className="font-sans text-5xl font-bold tracking-tight text-primary md:text-6xl">
                    {stat.value}
                  </div>
                  <p className="text-sm leading-normal text-secondary">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// OUR VISION
// ---------------------------------------------------------------------------

export function Vision() {
  return (
    <section className="border-t border-default bg-app px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-14 grid gap-10 lg:grid-cols-[260px_1fr_1fr] lg:gap-16">
            <h2 className="text-balance text-4xl font-medium tracking-tight text-primary">
              Our Vision
            </h2>
            <div className="space-y-4 leading-relaxed text-secondary">
              <p>
                Local government holds the longest, deepest, most decision-rich
                record of how a community lives. That record is currently
                scattered across PDFs, filing cabinets, and three decades of
                meeting tapes.
              </p>
              <p>
                Our vision is to make that record continuously useful — so
                every staff member has the institutional knowledge of a
                thirty-year clerk, on demand, and every elected official walks
                into the room already briefed.
              </p>
            </div>
            <div className="space-y-4 leading-relaxed text-secondary">
              <p>
                Madison is built with — not for — the people who run the
                building. Every workflow we ship was prototyped first in a real
                county office, with the staff who will use it daily.
              </p>
              <p>
                The goal is not to replace civic judgment. The goal is to clear
                the path so judgment can focus on the work that only humans can
                do.
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="grid items-end gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
            <figure className="m-0 aspect-[4/5] overflow-hidden rounded-2xl border border-default">
              <img
                src={visionCollab}
                alt="The people who run the building"
                width={1200}
                height={800}
                loading="lazy"
                className="size-full object-cover"
              />
            </figure>
            <div>
              <div className="mb-1 font-serif text-3xl italic tracking-tight text-primary">
                Erica Olsen
              </div>
              <div className="text-sm text-muted">
                Co-founder &amp; CEO · former Washoe County strategy lead
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECURITY — cool tinted band + four standards
// ---------------------------------------------------------------------------

const STANDARDS = [
  {
    icon: ShieldCheck,
    title: "SOC 2 Type II",
    desc: "Audited annually across security, availability, and confidentiality.",
  },
  {
    icon: Landmark,
    title: "FedRAMP",
    desc: "Authorized for encryption, audit, and residency requirements.",
  },
  {
    icon: MapIcon,
    title: "StateRAMP",
    desc: "In process. Continuous monitoring for SLG cloud workloads.",
  },
  {
    icon: Lock,
    title: "ISO 27001",
    desc: "Information security management to the international standard.",
  },
];

export function Security() {
  return (
    <section className="border-t border-default bg-brand-subtle px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-11 grid gap-8 lg:grid-cols-2 lg:gap-14">
            <h3 className="text-balance text-3xl font-medium tracking-tight text-primary">
              Compliant with the most rigorous public-sector security
              standards.
            </h3>
            <div className="self-end">
              <p className="mb-4 leading-relaxed text-secondary">
                SOC 2 Type II. FedRAMP-authorized. Hosted on Microsoft Azure
                Government. Madison never trains on your data and never shares
                records across tenants.
              </p>
              <a
                href="/security/"
                className="inline-flex items-center gap-1.5 font-semibold text-brand-accent"
              >
                ↳ Read the Trust Center
              </a>
            </div>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STANDARDS.map((std, i) => (
            <Reveal key={std.title} delay={i * 60}>
              <div className="h-full rounded-xl border border-default bg-surface p-5.5">
                <std.icon className="size-5.5 text-brand-accent" />
                <div className="mb-2 mt-3 font-sans text-base font-bold text-primary">
                  {std.title}
                </div>
                <p className="text-xs leading-relaxed text-secondary">
                  {std.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FINAL CTA
// ---------------------------------------------------------------------------

export function FinalCta() {
  return (
    <section className="border-t border-default bg-gradient-to-b from-brand-subtle to-app px-gutter py-38 text-center">
      <Reveal>
        <h2 className="mb-4.5 text-balance text-4xl font-medium tracking-tight text-primary md:text-5xl">
          See it on your own files.
        </h2>
        <p className="mx-auto mb-8.5 max-w-lg text-lg leading-relaxed text-secondary">
          We&rsquo;ll load Madison with a sample of your records and walk
          through it live. Live deployment in four weeks.
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Button size="lg" asChild>
            <a href="/demo/">
              Book a demo <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="bg-surface" asChild>
            <a href="/contact/">Talk to sales</a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FOOTER — always-dark navy band. The `dark` class re-scopes every token
// variable inside it to the dark-mode (Dark Navy foundation) values, so the
// footer stays on-token in both themes with zero raw color.
// ---------------------------------------------------------------------------

const FOOTER_COLUMNS = [
  {
    title: "Platform",
    // Same four modules, same labels/order/links as the nav's Platform
    // dropdown (PLATFORM_LINKS above) — one list, so the footer can't drift
    // out of sync with the nav as modules are added or renamed.
    links: PLATFORM_LINKS.map(({ label, href }) => ({ label, href })),
  },
  {
    title: "Company",
    links: [
      { label: "Client Stories", href: "/client-stories/" },
      { label: "About Us", href: "/about-us/" },
      { label: "Newsroom", href: "/updates/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    title: "Useful Links",
    links: [
      { label: "Security", href: "/security/" },
      {
        label: "Trust Center",
        href: "https://app.vanta.com/madisonai.com/trust/lw17vjg03kvfbqeid6p9/controls",
      },
      { label: "Privacy Policy", href: "/privacy-policy/" },
      { label: "Terms & Conditions", href: "/terms-and-conditions/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="dark bg-app px-gutter pb-10 pt-14">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo className="mb-3.5" />

          <p className="max-w-70 text-sm leading-relaxed text-secondary">
            The vertical AI platform for cities and counties — grounded in
            your own record.
          </p>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <div className="mb-3.5 font-sans text-xs font-semibold uppercase tracking-widest text-brand-accent">

              {col.title}
            </div>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener" }
                      : {})}
                    className="text-sm text-secondary transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-9 flex max-w-6xl flex-wrap justify-between gap-2 border-t border-default pt-5.5 text-xs text-secondary">
        <span>© 2026 Madison AI, Inc.</span>
        <span>Built in Reno · co-created with Washoe County, NV</span>
      </div>
    </footer>
  );
}
