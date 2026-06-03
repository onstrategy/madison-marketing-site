# Smart Components

Smart components are the glue between the backend domain and dumb UI components. They fetch data, translate it, handle loading/error states, and compose dumb components together.

> The kit itself ships no backend — these patterns apply when the kit/overlay is adopted in a client repo that has an API. They define how data containers should be structured.

## 1. Data vs. UI State

- **Server State = React Query + your API client:** `useQuery` and `useMutation` over a vanilla typed client (tRPC, a generated SDK, or `fetch` wrappers). This is the only acceptable data-fetching method.
- **Client State = Component State or Context:** Only for ephemeral UI state (active tabs, open modals, drag state).
- **Global State (Zustand etc.):** Optional and strictly regulated. Do not create new stores without explicit user approval. Default to `useState` or URL search params first.

## 2. Explicit Query States

Handle `isLoading` and `isError` explicitly rather than relying entirely on `<Suspense>` and `<ErrorBoundary>`.

```tsx
const { data: projects, isLoading, isError } = useQuery({
  queryKey: ["projects"],
  queryFn: () => apiClient.project.list.query(),
});

if (isLoading) return <ProjectListSkeleton />;
if (isError) return <ErrorMessage text="Failed to load projects" />;
// Render success state
```

## 3. Component Responsibilities

1. **Fetch & Manage:** Call `useQuery` / `useMutation`.
2. **Translate & Format:** Map backend response to UI-friendly props (see the translation layer in the main skill).
3. **Handle States:** Evaluate `isLoading` and `isError`, render appropriate fallbacks.
4. **Minimal Layout:** Very little raw DOM. Primarily compositions of Dumb Components.

## 4. Query Colocation

Write `useQuery` directly inside the component if the data is only used there. Do not preemptively extract to a custom hook (e.g., `useProjects()`) unless the exact query is shared across multiple unrelated Smart Components.

## 5. React Query + API client syntax

Prefer vanilla React Query with a vanilla typed client over framework-specific wrappers — it keeps the query keys explicit and the client swappable.

```tsx
// ✅ Vanilla React Query + typed client
const { data, isLoading } = useQuery({
  queryKey: ["projects"],
  queryFn: () => apiClient.project.list.query(),
});

// ✅ Mutations
const createProject = useMutation({
  mutationFn: (input: ProjectInput) => apiClient.project.create.mutate(input),
  onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["projects"] }),
});
```
