---
name: testing
description: REQUIRED before editing any *.test.ts, *.test.tsx, or file under __tests__/. A PreToolUse skill-gate blocks the Edit/Write tool if this skill is not loaded — load it BEFORE your first edit to avoid a blocked-and-retry cycle that wastes the queued edits. Covers Vitest conventions, the real-implementations-over-mocks philosophy, factory/builder patterns, and assertion style.
---

# Testing Skill

This codebase uses **Vitest** exclusively. Every package has its own `vitest.config.ts`.

The guiding principle: **test real behavior, not mocked approximations.** When a dependency sits
behind a port/interface, prefer a lightweight real implementation (an in-memory adapter) over
`vi.mock()` — it exercises the actual contract, so the test catches a class of bugs that mocks
silently pass.

## File Conventions

### Location

Tests live in `src/__tests__/` directories, mirroring the source structure. Co-located tests
(e.g. `src/utils/retry.test.ts`) are acceptable for isolated utility functions, but `__tests__/`
is the default.

```
packages/ui/
  src/
    __tests__/
      tokens.test.ts        # token-math + dictionary-shape tests
    ui/
      utils.ts
      tokens.tsx
```

### Naming

- Always `.test.ts` — the codebase standardizes on this extension. Using `.spec.ts` would split the
  convention and make glob patterns / CI config more fragile.
- Avoid `.test.tsx` — React components are verified visually in **Storybook**, not unit-tested. Unit
  tests are for pure logic (token math, helpers, hooks).
- Name the test file after the module it tests: `utils.test.ts` tests `utils.ts`.

### Imports

Explicitly import from `"vitest"` even when `globals: true` is set in config:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
```

Explicit imports make dependencies visible — a reader (or agent) can see at a glance that `vi` is
Vitest's mock utility, not a project-local helper. They also keep tests working regardless of the
`globals` setting, and avoid needing `vitest/globals` in the package's `tsconfig` types.

## Test Structure

Use nested `describe` blocks grouping by feature/method, with `it(...)` for individual cases:

```typescript
describe("FeatureName", () => {
  describe("methodOrScenario", () => {
    it("specific behavior under test", async () => {
      // arrange → act → assert
    });
  });
});
```

- Top-level `describe` names the module or feature
- Nested `describe` groups by method, scenario, or sub-feature
- `it` describes the behavior, not the implementation

## Mock Strategy

### Default: real implementations

If a dependency is behind a port interface, use a real in-memory implementation of that port rather
than a stub. A `{ method: vi.fn() }` stand-in doesn't verify the contract — it silently passes when
the interface evolves. A real in-memory adapter validates, stores, and retrieves like production.

### Call verification: `vi.spyOn`

When you need to assert a specific collaborator call happened, spy on the real object rather than
replacing it — the real logic still runs; the spy just observes:

```typescript
const spy = vi.spyOn(service, "send");
await feature.run();
expect(spy).toHaveBeenCalledWith("expected-arg");
```

### When `vi.mock()` is acceptable

Only for third-party SDK modules that cannot be injected via a port — this is rare. If you're
reaching for `vi.mock()`, first ask: should this dependency be behind an interface? Usually yes.

## Builder Patterns

Use `make<Entity>()` factory functions with `Partial` overrides. This keeps tests readable by
showing only the fields that matter for each case, while giving all required fields sensible defaults:

```typescript
function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    ...overrides,
  };
}
```

## Async and Assertion Patterns

Use `async/await` consistently. For expected errors, use `rejects.toBeInstanceOf` — it verifies both
that an error is thrown and that it's the right class:

```typescript
await expect(adapter.send(badInput)).rejects.toBeInstanceOf(ValidationError);
```

When asserting on discriminated unions, narrow the type first so subsequent assertions are type-safe:

```typescript
const result = await run();
expect(result.status).toBe("success");
if (result.status === "success") {
  expect(result.data).toBeDefined();
}
```

## Red Flags

| Temptation | Why it's a problem | What to do instead |
| --- | --- | --- |
| `vi.mock("../module")` | Hides the real dependency; breaks when the module's API changes without test failures | Inject via a port; use a real in-memory implementation |
| `{ method: vi.fn() }` as a port stand-in | Doesn't verify the contract; silently passes when the interface evolves | Use the real in-memory adapter |
| `any` in test code | Test code is production code that happens to run in a harness — same TypeScript rules apply | Use proper types (see the typescript skill) |
| Shared mutable state across tests | Tests become order-dependent and flaky | Fresh state per test via `beforeEach` or per-test factory calls |
| Testing private methods / internal state | Couples tests to implementation; refactors break passing tests | Test behavior through the public API |
| `.skip` without a comment | Readers can't tell if it's intentional or forgotten | Add a comment: why skipped, when to unskip |

## Package Configuration

Each package that needs tests gets a `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",        // use "happy-dom" for packages that touch browser APIs
    passWithNoTests: true,      // a package may legitimately have no tests yet
  },
});
```

Add `LOG_LEVEL: "silent"` to `env` for packages with loggers — test output should show test results,
not log noise.
