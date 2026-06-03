# Advanced TypeScript Patterns

## Discriminated Unions for State

When states are mutually exclusive, model them as a single discriminated union — not separate
boolean flags. This makes impossible states unrepresentable.

```typescript
// Good: impossible to have data and error simultaneously
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function UserProfile({ state }: { state: AsyncState<User> }) {
  switch (state.status) {
    case "idle":
      return null;
    case "loading":
      return <Spinner />;
    case "success":
      return <Profile user={state.data} />;
    case "error":
      return <ErrorBanner message={state.error} />;
  }
}

// Bad: boolean soup — can isLoading and hasError both be true?
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);
const [data, setData] = useState<User | null>(null);
```

Use independent booleans only for non-overlapping concerns (e.g., `isModalOpen` and `isSaving`
are unrelated — a union would be overkill).

For complex transitions, use `useReducer` to make state updates predictable.

## Result Type for Operations

Represent operation outcomes as a discriminated union instead of throwing or returning
null/undefined. This forces callers to handle both success and failure.

```typescript
type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parseNumber(input: string): Result<number> {
  const num = Number(input);
  return Number.isNaN(num)
    ? { ok: false, error: `"${input}" is not a number` }
    : { ok: true, value: num };
}

const result = parseNumber(input);
if (result.ok) {
  console.log(result.value); // TypeScript knows value exists
} else {
  console.error(result.error); // TypeScript knows error exists
}
```

Use this for domain operations where failure is expected (parsing, validation, lookups).
Use exceptions only for truly unexpected errors (programmer mistakes, system failures).

## Exhaustive Switch with assertNever

When branching on a discriminant, handle every variant and add a compile-time exhaustiveness
check. This means adding a new variant to the union immediately surfaces every switch that
needs updating.

Define `assertNever` once in a shared util module and import it — do not redefine it inline.

```typescript
import { assertNever } from "@your-org/core"; // your shared util package

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rect":
      return shape.width * shape.height;
    default:
      return assertNever(shape); // compile error if a variant is missing
  }
}

// The helper itself (define once, in a shared module):
// export function assertNever(value: never): never {
//   throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
// }
```

Prefer `switch` over chained `if/else` when branching on a finite union — it's easier to
verify exhaustiveness at a glance.

## Type Guards

Write small, focused type guard functions to narrow `unknown` types at system boundaries:

```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as User).id === "string" &&
    "name" in value &&
    typeof (value as User).name === "string"
  );
}
```

For complex objects, prefer zod schemas over hand-written guards — they're less error-prone
and give you the type for free via `z.infer<typeof Schema>`.
