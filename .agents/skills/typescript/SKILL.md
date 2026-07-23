---
name: typescript
description: Load proactively before editing any .ts or .tsx file. (No hard skill-gate enforces this in the kit — but these rules are enforced by typecheck + ESLint + review, so following them avoids rework.) Covers the any/unknown ban, safe boundary validation, type colocation, and code organization patterns.
---

# TypeScript Skill

This kit enforces strict TypeScript. The compiler is your ally — if you find yourself fighting
it with casts or `any`, you're solving the wrong problem.

## The `any` and Double-Cast Ban

This is the single most important rule. Agents routinely reach for `any` or `as unknown as X` when
they can't figure out a type quickly. This is never acceptable.

### What agents do wrong and what to do instead

| Temptation | What to do instead |
|---|---|
| `param: any` | Use the actual type. Read the function signature, hover, check the import. |
| `response.data as any` | Validate at the boundary with a type guard or zod schema. |
| `value as unknown as MyType` | This is a double cast — the compiler is telling you the types don't match. Fix the type mismatch, don't paper over it. |
| `(e: any)` in event handlers | Use the specific event type: `React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent<HTMLButtonElement>`, etc. |
| `as any` to silence a generic | Provide the generic parameter explicitly: `useState<User[]>([])` not `useState([] as any)`. |
| `// @ts-ignore` or `// @ts-expect-error` | Fix the actual type error. These comments hide real bugs. |

### Boundary validation: the one place where `unknown` belongs

External data (API responses, localStorage, user input, URL params) enters as `unknown`. Validate
it immediately, then the rest of your code works with safe types.

**Preferred: zod schemas**

```typescript
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});
type User = z.infer<typeof UserSchema>;

// At the boundary
const user = UserSchema.parse(response.data); // throws if invalid
```

**Alternative: type guards** for simple shapes

```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as User).id === "string"
  );
}
```

After validation, the rest of the code trusts the types. No further casting needed.

## Type Organization

### Colocate types with their consumer

Define types in the same file that uses them. Do not create `types.ts` files unless the type is
genuinely shared across unrelated modules.

- A component owns its props type
- A function owns its parameter types
- A class owns its interface
- Promote to a shared location only when 2+ unrelated consumers need the same type

```typescript
// UserCard.tsx — props type lives here, not in types.ts
export type UserCardProps = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export function UserCard({ id, name, avatarUrl }: UserCardProps) { /* ... */ }
```

### Barrel files: only at package boundaries

Import directly from the source file within a package. Use barrels only at cross-package
boundaries to define intentional public APIs — e.g. a package's `src/index.ts`, or the per-entry
`exports` map in its `package.json` (as `@madison/ui` does). Never use wildcard re-exports
(`export * from`) — export each member explicitly by name.

### Import types as types

```typescript
import type { User } from "./user";
import { createUser, type Config } from "./utils";
```

## Const Object Pattern

When you need both runtime values and a type derived from them, use a const object:

```typescript
const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];
// Status = "active" | "inactive" | "pending"
```

This gives you autocomplete, runtime access to the values, and a single source of truth. Use this
when the values need to exist at runtime. For types that only exist at compile time, a plain union
type is fine.

## Flat Interfaces

Don't inline nested object shapes. Extract them into dedicated interfaces:

```typescript
// Good: flat, composable
interface UserAddress {
  street: string;
  city: string;
}

interface User {
  id: string;
  name: string;
  address: UserAddress;
}

// Bad: inline nesting
interface User {
  address: { street: string; city: string };
}
```

## Derive, Don't Duplicate

Don't store state that can be computed:

- `isEmpty` → derive from `items.length === 0`
- `hasData` → derive from `data !== undefined`
- `fullName` → derive from `${first} ${last}`

Prefer selector/helper functions. Memoize only if profiling shows a need.

## Utility Types Cheat Sheet

Use these instead of manual type construction:

```typescript
Pick<User, "id" | "name">        // Select fields
Omit<User, "id">                 // Exclude fields
Partial<User>                    // All optional
Required<User>                   // All required
Readonly<User>                   // All readonly
Record<string, User>             // Object type
ReturnType<typeof fn>            // Function return type
Parameters<typeof fn>            // Function params tuple
NonNullable<T | null>            // Remove null/undefined
Extract<Union, "a" | "b">        // Extract from union
Exclude<Union, "a">              // Exclude from union
```

## Red Flags

If you're about to write any of these, stop and rethink:

- `any` anywhere — find the real type
- `as unknown as X` — fix the type mismatch at its source
- `// @ts-ignore` — fix the type error
- `value!` (non-null assertion) — narrow with a check instead
- `as Type` without prior validation — validate first, then the type flows naturally
- A `types.ts` file for types used in one place — colocate instead
- A re-defined `assertNever` — define it once in a shared util module and import it
- Boolean flags for mutually exclusive states — use discriminated unions (see references/patterns.md)
- Thrown exceptions for expected failures — use Result types (see references/patterns.md)

## Advanced Patterns

For discriminated unions, Result types, exhaustive switch, and other advanced type patterns,
read `references/patterns.md`. Use these when modeling complex state or operation outcomes.
Define `assertNever` once in a shared util and import it — never redefine it inline.
