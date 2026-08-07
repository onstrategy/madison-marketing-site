import { useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Landmark,
  Gavel,
  Users,
  ShieldCheck,
  Map as MapIcon,
  Lock,
  MessageSquare,
  FileText,
  Workflow,
  Presentation,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@madison/ui/utils";
import { Button } from "@madison/ui/button";
import {
  Navbar,
  NavbarBrand,
  NavbarLinks,
  NavbarLink,
  NavbarActions,
} from "@madison/ui/navbar";
import { NavDropdown } from "@madison/ui/nav-dropdown";
import { Logo } from "@madison/ui/logo";
import { Reveal, Marquee } from "./parts";
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

// Icons mirror the ones on the Capabilities section below — same job, same glyph.
const PLATFORM_LINKS = [
  { label: "Overview", href: "#top", icon: LayoutDashboard },
  { label: "Chat", href: "#top", icon: MessageSquare },
  { label: "Reports", href: "#top", icon: FileText },
  { label: "Workflows", href: "#top", icon: Workflow },
  { label: "Briefings", href: "#top", icon: Presentation },
  { label: "Analysis", href: "#top", icon: BarChart3 },
];

const COMPANY_LINKS = [
  { label: "About us", href: "/about-us" },
  { label: "Newsroom", href: "/updates" },
  { label: "Contact", href: "/contact" },
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

export function Nav({ sectionAware = false, overDarkHero = false }: { sectionAware?: boolean; overDarkHero?: boolean }) {
  const { pathname } = useLocation();
  const companyLinks = COMPANY_LINKS.map((item) => ({
    ...item,
    active:
      item.href === "/updates" ? NEWSROOM_PATHS.includes(pathname) : item.href === pathname,
  }));

  return (
    <Navbar contentClassName="mx-auto max-w-6xl" sectionAware={sectionAware} overDarkHero={overDarkHero}>
      <NavbarBrand href="/">
        <Logo />
      </NavbarBrand>
      <NavbarLinks>
        <NavDropdown label="Platform" items={PLATFORM_LINKS} active={pathname === "/landing"} />
        <NavbarLink href="/client-stories" active={CLIENT_STORIES_PATHS.includes(pathname)}>
          Client Stories
        </NavbarLink>
        <NavbarLink href="/security" active={pathname === "/security"}>
          Security
        </NavbarLink>
        <NavDropdown label="Company" items={companyLinks} active={companyLinks.some((item) => item.active)} />
        <NavbarLink href="/resources" active={RESOURCES_PATHS.includes(pathname)}>
          Resources
        </NavbarLink>
      </NavbarLinks>
      <NavbarActions>
        {/*
          The one intentional placeholder left in the site: there is no sign-in
          prototype to point at, and the marketing pages don't own the app's
          auth route. Every other `#top` has been resolved to a real page.
        */}
        <a
          href="#top"
          className="hidden text-sm font-medium text-primary transition-colors hover:text-brand-accent sm:block"
        >
          Sign in
        </a>
        <Button size="sm" asChild>
          <a href="/demo">Book a demo</a>
        </Button>
      </NavbarActions>
    </Navbar>
  );
}

/** Lowercase micro-label in brand blue — the design's `.ey` treatment. */
function Kicker({ children }: { children: string }) {
  return (
    <span className="font-sans text-sm lowercase tracking-wide text-brand-accent">
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
    icon: MessageSquare,
    title: "Chat",
    desc: "Ask anything across every file your government has ever filed. Cited to the page, paragraph, and vote.",
  },
  {
    icon: FileText,
    title: "Reports",
    desc: "Staff reports, planning findings, and procurement memos drafted in your county's format and tone.",
  },
  {
    icon: Workflow,
    title: "Workflows",
    desc: "Pre-built agents for the work your office already does — code lookup, parcel research, RFP drafting.",
  },
  {
    icon: Presentation,
    title: "Briefings",
    desc: "Hand Madison an agenda packet — get a five-minute briefing per item with cited history and prior votes.",
  },
  {
    icon: BarChart3,
    title: "Analysis",
    desc: "Fiscal impact models, comparable-jurisdiction analysis, and trend reports across your corpus.",
  },
];

export function Capabilities() {
  return (
    <section className="dark border-t border-default bg-app px-gutter py-30">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-6">
            <Kicker>The assistant you always wanted but could never afford.</Kicker>
            <h2 className="text-balance text-4xl font-medium tracking-tight text-primary">
              Give an assistant to everyone on your staff.
            </h2>
          </div>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-2xl text-lg text-secondary">
              One platform, five jobs — powered by department-specific models
              trained on your government&rsquo;s record.
            </p>
            <a
              href="/community-development-ai"
              className="inline-flex items-center gap-1.5 whitespace-nowrap pb-1 font-semibold text-brand-accent"
            >
              See the full platform <ArrowRight className="size-4" />
            </a>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.title} delay={i * 60}>
              {/* Non-interactive: a static summary tile, not a link. */}
              <div className="flex h-full flex-col rounded-2xl border border-active bg-surface p-5">
                {/* Icon chip — a small gradient tile rather than a flat rectangle,
                    with a soft duplicate icon behind the main glyph for depth. */}
                <div className="relative mb-5 flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-hover shadow-sm">
                  <cap.icon
                    aria-hidden="true"
                    className="absolute size-10 -translate-y-1 text-brand-fg/25"
                  />
                  <cap.icon className="relative size-6 text-brand-fg" />
                </div>
                <div className="mb-1.5 text-lg font-bold tracking-tight text-primary">
                  {cap.title}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-secondary">
                  {cap.desc}
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={CAPABILITIES.length * 60}>
            <a
              href="/community-development-ai"
              className="light flex h-full flex-col items-start justify-center rounded-2xl bg-brand-subtle p-5 transition-transform hover:-translate-y-1"
            >
              <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-brand text-brand-fg">
                <LayoutDashboard className="size-6" />
              </span>
              <span className="mb-1.5 text-lg font-bold tracking-tight text-primary">
                Explore the platform
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent">
                See every capability <ArrowRight className="size-4" />
              </span>
            </a>
          </Reveal>
        </div>
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
    href: "https://www.madisonai.com/client-stories/washoe-county",
  },
  {
    name: "City of Reno",
    kind: "roi",
    line: "75% less time on staff reports",
    photo: PHOTOS.meetingPens,
    tall: true,
    href: "https://www.madisonai.com/client-stories",
  },
  {
    name: "Carson City, NV",
    kind: "quote",
    line: "Exactly what I need, faster.",
    photo: PHOTOS.govBuildingWhite,
    href: "https://www.madisonai.com/client-stories/carson-city-client-story",
  },
  {
    name: "City of Corona, CA",
    kind: "quote",
    line: "Every decision at our fingertips.",
    photo: PHOTOS.laptopsTable,
    href: "/client-stories/city-of-corona",
  },
  {
    name: "Aspen, CO",
    kind: "roi",
    line: "140 hrs reclaimed / month",
    photo: PHOTOS.govBuildingColumns,
    href: "https://www.madisonai.com/client-stories",
  },
  {
    name: "Pasadena, CA",
    kind: "quote",
    line: "One source of truth for legal.",
    photo: PHOTOS.groupDiscussion,
    href: "https://www.madisonai.com/client-stories",
  },
];

/**
 * A photo tile is an always-dark region (photo under a navy scrim), so its
 * caption block is wrapped in the `dark` token scope: text-primary resolves
 * to warm white and bg-app to Dark Navy in BOTH themes — no raw colors.
 */
function StoryTileCard({ tile }: { tile: StoryTile }) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl transition-transform hover:-translate-y-1",
        tile.tall ? "h-115" : "h-55",
      )}
    >
      <img
        src={tile.photo.url}
        alt={tile.photo.alt}
        width={tile.photo.width}
        height={tile.photo.height}
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="dark absolute inset-0">
        {/* Two pre-rendered gradients cross-fade on hover (opacity, not the
            gradient stops themselves — browsers can't tween gradient-stop
            positions smoothly, but a plain opacity transition is silky).
            Both ramp to full opacity (not a faded /90) so the text stays
            legible even at rest. The small tiles are short enough that the
            text sits much higher up proportionally, so their rest gradient
            spans the full card instead of just the bottom portion. */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-app transition-opacity group-hover:opacity-0",
            tile.tall ? "from-25%" : "from-10%",
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-5% to-app opacity-0 transition-opacity group-hover:opacity-100" />
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
            {tile.kind === "quote" ? (
              <div
                className={cn(
                  "font-serif font-medium italic tracking-tight text-primary",
                  tile.tall ? "text-2xl" : "text-lg",
                )}
              >
                &ldquo;{tile.line}&rdquo;
              </div>
            ) : (
              <div
                className={cn(
                  "font-bold tracking-tight text-primary",
                  tile.tall ? "text-2xl" : "text-lg",
                )}
              >
                {tile.line}
              </div>
            )}
          </div>
          <a
            href={tile.href}
            {...(tile.href.startsWith("/") ? {} : { target: "_blank", rel: "noopener" })}
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
          </a>
        </div>
      </div>
    </article>
  );
}

export function ClientStories() {
  return (
    <section className="border-t border-default bg-surface px-gutter py-27">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-balance text-4xl font-medium tracking-tight text-primary">
              Every customer is a community we serve.
            </h2>
            <a
              href="/client-stories"
              className="whitespace-nowrap font-semibold text-brand-accent"
            >
              See all 60+ customers →
            </a>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="grid gap-3 lg:grid-cols-4">
            <StoryTileCard tile={STORY_TILES[0]} />
            <StoryTileCard tile={STORY_TILES[1]} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2">
              {STORY_TILES.slice(2).map((tile) => (
                <StoryTileCard key={tile.name} tile={tile} />
              ))}
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
          <h3 className="mb-10 text-balance text-3xl font-medium tracking-tight text-primary">
            One platform, three audiences — and the people they&rsquo;re for.
          </h3>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {ROLES.map((role, i) => (
            <Reveal key={role.tag} delay={i * 80}>
              <div className="h-full overflow-hidden rounded-2xl border border-default bg-surface transition-transform hover:-translate-y-1">
                <div className="relative h-52">
                  <img
                    src={role.photo.url}
                    alt={role.photo.alt}
                    width={role.photo.width}
                    height={role.photo.height}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover"
                  />
                  {/* Caption pill is an always-dark region — `dark` scope keeps it on-token */}
                  <div className="dark pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-lg bg-app/75 px-3 py-2 text-xs text-primary backdrop-blur-sm">
                    <span>{role.cap}</span>
                    <ArrowUpRight className="size-3.5" />
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
                href="/security"
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
            <a href="/demo">
              Book a demo <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="bg-surface" asChild>
            <a href="/contact">Talk to sales</a>
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
    title: "platform",
    links: [
      { label: "Citywide model", href: "#top" },
      { label: "FOIA / Public Records", href: "#top" },
      { label: "Planning & Community Dev", href: "/community-development-ai" },
      { label: "Procurement & Contracts", href: "#top" },
    ],
  },
  {
    title: "company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Newsroom", href: "/updates" },
      { label: "Contact", href: "/contact" },
      { label: "Client Stories", href: "/client-stories" },
    ],
  },
  {
    title: "resources",
    links: [
      { label: "Security", href: "/security" },
      { label: "Trust Center", href: "/security" },
      { label: "Docs", href: "/resources" },
      { label: "Privacy", href: "#top" },
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
            <div className="mb-3.5 font-sans text-sm lowercase tracking-wide text-secondary">
              {col.title}
            </div>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
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
