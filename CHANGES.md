## CHANGES

### Data fetching & state management

- **Centralized data fetching with React Query**
  - `usePersistedTodos` now uses `react-query` queries `["todos"]` and `["users"]` instead of manual `useEffect + useState + axios`.
  - Todos are hydrated from **IndexedDB** first (`getTodosFromDb`), then fetched from the remote API and persisted via `saveTodosToDb`.
  - Users are fetched once and exposed as a `Record<number, User>` map for fast lookup.

- **Optimistic updates with persistence**
  - `toggleTodo` and `deleteTodo` update the `["todos"]` cache via `queryClient.setQueryData` and keep IndexedDB in sync (`upsertTodoInDb`, `deleteTodoFromDb`).
  - This removes extra refetches while preserving local persistence.

- **User detail reuses global todos**
  - `useUserWithTodos` now reuses the global `["todos"]` query (from the main list) via `queryClient.getQueryData(["todos"])` before touching IndexedDB or calling the `/todos?userId=...` API.
  - Fallback order for user todos: **React Query cache → IndexedDB (`getTodosByUserFromDb`) → remote API + `saveTodosToDb`**.

### Derived state & performance

- **Todo statistics as derived state**
  - `useTodoStats` was simplified to use `useMemo` over the `todos` array instead of an extra `react-query` layer.
  - This makes stats purely derived client state (`completed`, `userCount`, `total`) with minimal overhead and clearer intent.

### Theming & UI refinements

- **Global ThemeProvider & hook**
  - Centralized dark/light mode handling in a `ThemeProvider` context attached at the app root, so the header theme toggle affects all routes consistently.
  - Exposed `useTheme` as a thin alias of `useThemeContext` to make theme consumption more ergonomic across components.

- **General cleanup & best practices**
  - Eliminated minor anti-patterns (e.g., overusing `react-query` for purely derived state).
  - Kept `todoUtils` as the dedicated IndexedDB access layer so hooks do not talk directly to `window.indexedDB`.

### Routing structure

- **Explicit route definitions**
  - Defined routes in `routes.ts` for:
    - `/` → welcome page (`routes/welcome.tsx`)
    - `/todos` → main todo experience (`routes/todo.tsx` / `TodoPage`)
    - `/users/:id` → user detail with per-user todos (`routes/user.$id.tsx`)
    - catch-all `*` → not-found page (`routes/not-found.tsx`)
  - This keeps navigation and URL structure clear, and makes it easy to add more routes in the future.
