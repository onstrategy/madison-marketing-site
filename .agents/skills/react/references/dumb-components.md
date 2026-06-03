# Dumb Components

A dumb component's job is rendering UI based on props and communicating user intent via callbacks. It must remain ignorant of the application's domain, data fetching, and global state.

## 1. The Litmus Test (Storybook Isolation)

Before completing a dumb component, ask: **Can I render this in Storybook with zero mocking of global providers?**

If it requires `<Provider store={...}>`, `<ApiProvider>`, or `<RouterProvider>` to function, it's not a dumb component. The only acceptable wrappers are structural/UI providers: `<ThemeProvider>`, `<IntlProvider>`, `<TooltipProvider>`.

## 2. Component Tiers & Placement

| Tier | Definition | Examples | Placement | Rule |
| --- | --- | --- | --- | --- |
| **Reusable UI Primitive** | Passes the "Open Source Test" — copy-pasteable into any app. | `Button`, `Card`, `Badge` | `packages/ui/src/` | MUST merge `className` (via `cn`/`clsx`) and use `forwardRef`. |
| **Dumb App Component** | Pure rendering, shaped by application domain vocabulary. | `ProjectCard`, `InvoiceRow` | App-specific `components/` folders | `forwardRef` and `className` merging are optional. |

A Reusable UI Primitive may only depend on other generic UI primitives. It cannot import a Dumb App Component.

## 3. Strict Context Rules

**MAY** consume UI-specific Context:
- `ThemeContext`, `LocaleContext`, `TabsContext`, `DialogContext`, `TooltipContext`

**MUST NOT** consume Domain/Business Context:
- `UserContext`, `SessionContext`, `TenantContext`, `FeatureFlagContext`, `RouterContext`, `QueryClientContext`

## 4. Prop Design: No "Fat Model" Trap

Do not pass backend domain models as props. Props should be primitive types or UI-specific shapes.

```tsx
// ❌ BAD: Coupled to domain model
import type { Project } from "@your-org/domain";

function ProjectCard({ project }: { project: Project }) {
  return <div>{project.name} — {project.owner.displayName}</div>;
}

// ✅ GOOD: Decoupled UI interface
interface ProjectCardProps {
  title: string;
  owner: string;
}
function ProjectCard({ title, owner }: ProjectCardProps) {
  return <div>{title} — {owner}</div>;
}
```

## 5. Internal State vs Syncing

- **Uncontrolled vs Controlled:** Support both via a `useControllableState`-style hook.
- **No `useEffect` Syncing:** Never use `useEffect` to sync a prop to internal state. Compute derived state during render.
- **Imperative Handles:** Expose via `forwardRef` + `useImperativeHandle` (e.g., `ref.current.reset()`). Do not rely on toggling a `key`.

## 6. Polymorphism & Links

Never import framework-specific routing (`next/link`, `react-router-dom`) into a dumb component. Inject routing via a `LinkComponent` prop:

```tsx
interface NavItemProps {
  label: string;
  href: string;
  LinkComponent?: ElementType<{ href: string; className?: string; children: React.ReactNode }>;
}

export function NavItem({ label, href, LinkComponent = "a" }: NavItemProps) {
  return (
    <LinkComponent href={href} className="text-brand hover:underline">
      {label}
    </LinkComponent>
  );
}
```

## 7. Composition: Slots & Render Props

- **Slots (`ReactNode`)** for structural layouts (`sidebarSlot`, `headerSlot`).
- **Render props** when the component manages internal UI state but doesn't know what it renders:
  ```tsx
  interface ListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
  }
  ```
