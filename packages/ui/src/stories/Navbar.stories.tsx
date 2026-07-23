import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown } from "lucide-react";
import {
  Navbar,
  NavbarBrand,
  NavbarLinks,
  NavbarLink,
  NavbarActions,
} from "@madison/ui/navbar";
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
            className="hidden text-sm font-medium text-primary transition-colors hover:text-brand sm:block"
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
