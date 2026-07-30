import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown } from "lucide-react";
import {
  Navbar,
  NavbarBrand,
  NavbarLinks,
  NavbarLink,
  NavbarActions,
} from "@madison/ui/navbar";
import { NavDropdown } from "@madison/ui/nav-dropdown";
import { Button } from "@madison/ui/button";
import { Logo } from "@madison/ui/logo";

const meta = {
  title: "Primitives/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "A composable top-navigation shell. It owns layout and the scroll-aware chrome (transparent at the top of the page, solid once scrolled) and leaves all content to the caller. Composed of `Navbar`, `NavbarBrand`, `NavbarLinks`, `NavbarLink`, `NavbarActions`.",
          "",
          "**Token bindings:**",
          "- `Navbar` (scrolled) → `bg-app/80`, `border-default`, `z-sticky`, `backdrop-blur`",
          "- `NavbarLink` → `text-secondary`, `hover:text-primary`",
          "",
          "Pass `overDarkHero` when the page opens on a `dark`-scoped hero sitting behind the bar — see the `OverDarkHero` story.",
          "",
          "For a link that opens a submenu, use `NavDropdown` (from `@madison/ui/nav-dropdown`) instead of a plain `NavbarLink` — see the `WithDropdowns` story.",
          "",
          "Fixed to the top and full-width by default; pass `contentClassName` (e.g. `mx-auto max-w-6xl`) to center or re-gutter the inner row. It is `position: fixed`, so give the page below it top padding.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-64 bg-app">
      <Navbar>
        <NavbarBrand href="#">
          <Logo />
        </NavbarBrand>
        <NavbarLinks>
          <NavbarLink href="#">
            Product <ChevronDown className="size-4" />
          </NavbarLink>
          <NavbarLink href="#">Pricing</NavbarLink>
          <NavbarLink href="#">Docs</NavbarLink>
        </NavbarLinks>
        <NavbarActions>
          <a
            href="#"
            className="hidden text-sm font-medium text-primary transition-colors hover:text-brand-accent sm:block"
          >
            Sign in
          </a>
          <Button size="sm">Get started</Button>
        </NavbarActions>
      </Navbar>
    </div>
  ),
};

/** `contentClassName` centers the inner row inside a max width. */
export const Centered: Story = {
  render: () => (
    <div className="min-h-64 bg-app">
      <Navbar contentClassName="mx-auto max-w-6xl">
        <NavbarBrand href="#">
          <Logo />
        </NavbarBrand>
        <NavbarLinks>
          <NavbarLink href="#">Product</NavbarLink>
          <NavbarLink href="#">Pricing</NavbarLink>
          <NavbarLink href="#">Docs</NavbarLink>
        </NavbarLinks>
        <NavbarActions>
          <Button size="sm">Get started</Button>
        </NavbarActions>
      </Navbar>
    </div>
  ),
};

/**
 * `overDarkHero` is for pages that open on a `dark`-scoped hero. While the bar is
 * still transparent it scopes itself to `dark`, so the wordmark and links read
 * against the hero; on scroll it goes solid and drops back to the page's own
 * theme. Scroll this story's frame to see the handoff.
 */
export const OverDarkHero: Story = {
  render: () => (
    <div className="bg-app">
      <Navbar overDarkHero contentClassName="mx-auto max-w-6xl">
        <NavbarBrand href="#">
          <Logo />
        </NavbarBrand>
        <NavbarLinks>
          <NavbarLink href="#">Client Stories</NavbarLink>
          <NavbarLink href="#">Security</NavbarLink>
          <NavbarLink href="#">Resources</NavbarLink>
        </NavbarLinks>
        <NavbarActions>
          <Button size="sm">Book a demo</Button>
        </NavbarActions>
      </Navbar>
      <section className="dark flex h-96 items-end bg-app px-gutter pb-12">
        <p className="mx-auto w-full max-w-6xl text-lg text-secondary">
          Dark hero — the bar above is transparent and scoped `dark`.
        </p>
      </section>
      <section className="flex h-screen items-start bg-app px-gutter pt-12">
        <p className="mx-auto w-full max-w-6xl text-lg text-secondary">
          Scroll up into this band — the bar goes solid and returns to the
          page&rsquo;s own theme.
        </p>
      </section>
    </div>
  ),
};

/** `NavDropdown` swaps in for a `NavbarLink` wherever a link needs a submenu. */
export const WithDropdowns: Story = {
  render: () => (
    <div className="min-h-96 bg-app">
      <Navbar contentClassName="mx-auto max-w-6xl">
        <NavbarBrand href="#">
          <Logo />
        </NavbarBrand>
        <NavbarLinks>
          <NavDropdown
            label="Platform"
            items={[
              { label: "Overview", href: "#" },
              { label: "Chat", href: "#" },
              { label: "Reports", href: "#" },
              { label: "Workflows", href: "#" },
              { label: "Briefings", href: "#" },
              { label: "Analysis", href: "#" },
            ]}
          />
          <NavbarLink href="#">Client Stories</NavbarLink>
          <NavbarLink href="#">Security</NavbarLink>
          <NavDropdown
            label="Company"
            items={[
              { label: "About us", href: "#" },
              { label: "Newsroom", href: "#" },
              { label: "Contact", href: "#" },
            ]}
          />
          <NavbarLink href="#">Resources</NavbarLink>
        </NavbarLinks>
        <NavbarActions>
          <Button size="sm">Book a demo</Button>
        </NavbarActions>
      </Navbar>
    </div>
  ),
};
