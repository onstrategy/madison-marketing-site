---
name: react
description: Load proactively before editing any .jsx or .tsx file — components, pages, hooks, containers. (No hard skill-gate enforces this in the kit; the design-system gate covers packages/ui/ paths.) Covers component architecture (dumb vs smart), state management, data fetching with React Query, prop design, and composition patterns.
---

# React Architecture

This skill contains the architectural rules for React code. Read this file first, then consult the relevant reference based on what you're building:

- **UI components** (buttons, cards, forms, layouts — no data fetching): read `references/dumb-components.md`
- **Data containers** (pages, features that fetch from an API, business-logic orchestration): read `references/smart-components.md`

If you're unsure, ask: "Does this component call `useQuery`, `useMutation`, or an API client?" If yes → smart. If no → dumb.

You should also load the `design-system` skill when working with styles.

## 1. State Design: No Boolean Soup

Never use parallel boolean flags for mutually exclusive states. Use TypeScript discriminated unions.

```tsx
// ❌ BAD: Impossible states (isLoading && isError)
interface FormProps {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

// ✅ GOOD: Mutually Exclusive State Unions
type FormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: unknown };

interface FormProps {
  state: FormState;
}
```

## 2. Context & Custom Hooks: Strict Throw on Null

Contexts must never provide safe/silent default values. Initialize as `null` or `undefined` and pair with a custom hook that throws if used outside its Provider — this "fail-fast" pattern catches bugs immediately. (The kit's `ThemeProvider`/`useTheme` follow this.)

```tsx
// ❌ BAD: Silent default
const ThemeContext = createContext({ theme: 'light' });

// ✅ GOOD: Fails fast
const TabsContext = createContext<TabsState | null>(null);

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a <Tabs.Root>");
  }
  return context;
}
```

## 3. Effects Policy

`useEffect` is for synchronizing with external systems — DOM, subscriptions, network, third-party libraries. Not for computing values from props or state.

- **No prop-mirroring.** Never `useEffect(() => setState(prop), [prop])`. Compute during render or with `useMemo`.
- **Always cleanup** subscriptions, timers, and listeners by returning a teardown function.
- **Idempotent.** Effects may run more than once. The component must not break if they do.
- **Exhaustive deps.** Every value used inside the effect belongs in the array. The lint rule is non-negotiable.

```tsx
// ❌ BAD: mirroring a prop into state
useEffect(() => setFiltered(items.filter(predicate)), [items]);

// ✅ GOOD: compute during render
const filtered = items.filter(predicate);
```

Data fetching belongs in a smart component using React Query (see `references/smart-components.md`), not raw `useEffect`.

## 4. Props for State, Refs for Actions

When a parent needs to *trigger* a behavior in a child (reset, focus, scroll, play), use `useImperativeHandle` rather than a "fire-by-prop" effect.

```tsx
// ❌ BAD: prop change triggers an effect
useEffect(() => { if (resetKey) reset(); }, [resetKey]);

// ✅ GOOD: imperative handle
const SearchInput = forwardRef<{ reset: () => void; focus: () => void }, Props>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({ reset, focus }), []);
    // ...
  }
);
```

Props describe *what to be*; refs invoke *what to do*. Reaching for `useEffect` to react to a prop change is usually a code smell — the parent should call a method on a ref instead.

## 5. Error Boundaries with Retry

Wrap async UI with error boundaries that expose a retry affordance. Smart components throw on unrecoverable error; the boundary catches and renders a fallback with a recovery action.

```tsx
function DashboardPage() {
  return (
    <ErrorBoundary fallback={(err, retry) => <ErrorFallback error={err} onRetry={retry} />}>
      <ProjectList />
    </ErrorBoundary>
  );
}
```

- Always provide retry — never a dead-end error screen.
- Place boundaries close to the failure (per-feature or per-page), not at the app root.
- Translate technical errors to user-friendly messages; log the original for debugging.
- Form/input validation uses inline error states with explicit `isError`, not boundaries — boundaries are for unexpected throws and async fetch failures.

## 6. Testing Strategy

- **Smart components:** Don't unit-test via React component tests. Test backend/domain logic separately (see the `testing` skill).
- **Dumb / Reusable components:** Storybook is the default for isolation and visual verification. Unit-test only complex generic hooks or pure helpers.

## 7. The Translation Layer

Smart components must translate raw backend/domain models into UI-specific shapes before passing to dumb components. Never pass a domain type or a full API response directly to a UI component.

```tsx
// ❌ BAD: passing a domain type straight to a dumb component
import type { Project } from "@your-org/domain";

const { data: projects } = useQuery({
  queryKey: ["projects"],
  queryFn: () => apiClient.project.list.query(),
});
return <ProjectList projects={projects} />;

// ✅ GOOD: translate to a UI-specific shape
const items = projects?.map((p) => ({
  id: p.id,
  title: p.name,
  subtitle: p.owner.displayName,
}));
return <ProjectList items={items} />;
```

This rule is enforced on both sides: smart components must translate outbound data, and dumb components must not accept domain types as props (see `references/dumb-components.md` §4). (`@your-org/domain` is a placeholder for the client repo's own domain package.)

## 8. Code Integrity Verification (React Doctor)

Before concluding a substantial React task, run the linter for design-system/React hygiene:

```bash
npx -y react-doctor@latest . --verbose
```

Review diagnostics, fix errors/warnings, re-run to verify. Aim for a "Great" score (75+). This is also the recommended CI check for `className`/token discipline that the file-path gate can't see.

## Red Flags — STOP and Revise

- About to create a new global store (Zustand etc.) without asking the user
- A global store is fetching data via an API client (move to React Query)
- Passing a domain type or full API response directly into a UI component
- Writing complex `className` styling inside a Smart Component (extract to a Dumb Component)
- A dumb component imports `UserContext`, `SessionContext`, or `QueryClientContext`
- A reusable UI primitive imports a dumb app component
- About to extract a "shared" component or hook on the first or second occurrence — wait for the third (Rule of Three). Premature abstractions are more expensive to undo than to delay.
- Adding props "just in case" a future use case appears (YAGNI). Build for the requirements you have.
