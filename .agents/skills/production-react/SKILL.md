---
name: production-react
description: Write and review React and TypeScript code to a production-ready correctness standard. Use whenever the user asks to build, modify or review React components, hooks, data fetching, error handling or React tests, or asks whether React code is "production-ready", even if they don't name the skill.
---

# Production-ready React

Production-ready React keeps behaving correctly when reality stops cooperating: the API returns garbage, the network drops, the user double-clicks, a teammate refactors the component six months later. Judge every change by one question: what happens on the unhappy path?

This skill covers correctness: states, types, runtime validation, error boundaries and tests.

## Rules

### 1. Design every state

Every data-driven view handles all six states:

- **Loading**: a skeleton sized like the real content, so nothing jumps when data arrives (CLS).
- **Empty**: "No results" plus a next action. Never a blank region.
- **Error**: retryable, with a correlation ID the user can give support.
- **Stale or partial**: data shown while a background refetch runs, with a subtle indicator.
- **Unauthorized**: the user can see the page but not this widget.
- **Success**.

A screen that only handles success is a prototype.

### 2. Make impossible states unrepresentable

No boolean soup (`isLoading`, `isError`, `data`, `error` as independent state). Model async state as a discriminated union and add an exhaustiveness check:

```ts
type UsersState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: AppError }
  | { status: 'success'; data: User[] };

function assertNever(x: never): never {
  throw new Error(`Unhandled state: ${JSON.stringify(x)}`);
}
```

TypeScript habits:

- `strict: true` plus `noUncheckedIndexedAccess`.
- No `any`. Use `unknown` and narrow it.
- Branded types for IDs and validated values (`UserId`, `Cents`).
- `satisfies` for config objects.
- React 19: `ref` is a regular prop. Do not add `forwardRef` to new components.

### 3. Validate at every trust boundary

Never cast external data (`response.json() as User[]`). Types vanish at runtime. Parse these inputs with a schema (Zod, Valibot or ArkType) and derive types from it:

- API responses
- URL and search params
- `localStorage` and `sessionStorage`
- `postMessage` and micro-frontend contracts
- Feature-flag payloads

```ts
const User = z.object({ id: z.string(), email: z.email(), role: z.enum(['admin', 'member']) });
type User = z.infer<typeof User>;

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users');
  return z.array(User).parse(await res.json());
}
```

- Parse once per fetch, in the query function, not once per render. Large payloads parsed on the main thread can hurt INP.
- Fail loudly in dev. In production, use `safeParse` with telemetry so schema drift is reported instead of white-screening users.

### 4. Layer error boundaries

One root boundary means one broken widget blanks the app. Use all three layers:

1. **Route-level**: the framework's `error.tsx` or route `ErrorBoundary`.
2. **Feature-level**: around widgets that can fail independently. Mandatory in micro-frontends: a remote must never take down the shell.
3. **Recoverable**: reset keys tied to the route or query, so users can retry without a full reload.

React 19 root hooks: wire `onCaughtError`, `onUncaughtError` and `onRecoverableError` on `createRoot` and `hydrateRoot` to monitoring (Sentry provides `reactErrorHandler()`). React 19 no longer re-throws errors caught by boundaries, so reporting that relied on re-throws stops working after an upgrade.

Boundaries do not catch event handlers, async code outside render, or SSR-only paths. Handle those with explicit `try/catch`, mutation `onError` handlers and server-side logging.

### 5. Test behavior, not implementation

- **Static checks**: strict TypeScript and lint.
- **Integration tests (the bulk)**: React Testing Library. Query by role and accessible name (`getByRole('button', { name: /save/i })`). Use `userEvent`, not `fireEvent`. Never assert on internal state or hook internals.
- **Network mocks at the HTTP layer**: MSW, not a mocked API module, so tests exercise serialization, schema parsing and error paths.
- **A few E2E journeys**: Playwright for login, checkout and core CRUD, against preview deployments.

Do not chase a global coverage target. Require:

- A regression test for every bug fix.
- A test for every state of critical components.
- A test for every permission branch.

Four tests covering loading, empty, error and success beat a 90% coverage number built on snapshots.

## Checklist

Check every item before calling React work done:

- [ ] Every async view handles loading, empty, error, stale and unauthorized, not just success
- [ ] Async state is a discriminated union with an exhaustiveness check
- [ ] `strict` + `noUncheckedIndexedAccess`; no `any`
- [ ] Every trust boundary is parsed with a schema, not cast
- [ ] Route- and feature-level error boundaries with a way to recover
- [ ] React 19 root error hooks report to monitoring
- [ ] Tests query by role, mock the network with MSW, and cover each state

## Enforce with tooling

Prose rules get skipped, so back them with the pipeline. If the project lacks these, suggest adding them:

- `tsconfig.json`: `strict: true`, `noUncheckedIndexedAccess`.
- ESLint: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/switch-exhaustiveness-check`, `@typescript-eslint/consistent-type-assertions` (forbid `as` on data), `eslint-plugin-testing-library`.
- Run typecheck, lint and tests before work is accepted: pre-commit hook, CI job or the agent's completion hook.

Checklist items that need judgment (all six states handled, boundaries in the right places) cannot be linted. Cover them in review.
