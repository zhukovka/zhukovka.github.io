# Working Isn't Done: What Production-Ready React Means in 2026

Nov 2, 2026 · @olena zhukova

Production-ready React keeps behaving correctly when reality stops cooperating:

* The API returns garbage.

* The network drops.

* The user double-clicks.

* A teammate refactors the component six months later.

Just one question: what happens on the unhappy path?

This is part one of a five-part series on what "production-ready" means for React in 2026. This part covers correctness: states, types, runtime validation, error boundaries and tests. The rest covers effects and data, performance, security, and how senior interviews grade all of it.

## Design every state, not just the happy one

Every data-driven view has at least six states. Production code designs all of them:

* **Loading** – a skeleton sized like the real content, so nothing jumps when data arrives. That jump is your CLS score.

* **Empty** – "No results" plus a next action. A blank region is a bug report waiting to happen.

* **Error** – retryable, with a correlation ID the user can give support.

* **Stale or partial** – data is shown while a background refetch runs, with a subtle indicator.

* **Unauthorized** – the user can see the page but not this widget.

* **Success** – the one everyone builds first.

A screen that only handles success is a prototype that happens to be deployed.

## Make impossible states unrepresentable

The most common UI bug in code review is boolean soup: `isLoading`, `isError`, `data` and `error` as four independent pieces of state.

Nothing stops `isLoading && error` from both being true. Sooner or later they are.

A discriminated union fixes this at the type level:

```typescript
type UsersState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: AppError }
  | { status: 'success'; data: User[] };
```

Add an exhaustiveness check. A new variant then breaks the build instead of silently rendering nothing:

```typescript
function assertNever(x: never): never {
  throw new Error(`Unhandled state: ${JSON.stringify(x)}`);
}
```

More habits of senior TypeScript in React codebases:

* `strict: true` plus `noUncheckedIndexedAccess`, so `items[0]` is typed as possibly undefined.

* No `any`. Use `unknown` and narrow it.

* **Branded types** for IDs and validated values (`UserId`, `Cents`). You can't pass an order ID where a user ID belongs.

* `satisfies` for config objects: type checking without losing literal types.

* In React 19, `ref` is a regular prop. New components don't need `forwardRef`.

## Types vanish at runtime: validate at every trust boundary

`response.json() as User[]` is a promise to the compiler. The backend never signed it.

TypeScript types disappear at runtime. Anything that crosses a trust boundary is untyped input until you parse it:

* API responses

* URL and search params

* `localStorage` and `sessionStorage`

* `postMessage` and micro-frontend contracts

* Feature-flag payloads

Parse at the edge with Zod (or Valibot or ArkType). Derive your types from the schema:

```typescript
const User = z.object({ id: z.string(), email: z.email(), role: z.enum(['admin', 'member']) });
type User = z.infer<typeof User>;

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users');
  return z.array(User).parse(await res.json());
}
```

Zod 4 has a much smaller core bundle than Zod 3. `zod/mini` is available for tight budgets. Two practical rules:

* **Parse once per fetch, not once per render.** Do it in the query function. Parsing large payloads on the main thread can hurt INP.

* **Fail loudly in dev, gracefully in prod.** Use `safeParse` with telemetry in production. Backend schema drift gets reported instead of white-screening your users.

## Fail in pieces, not all at once

One error boundary at the root means one broken widget blanks the whole app. Production apps layer boundaries:

1. **Route-level** – the framework's `error.tsx` or route `ErrorBoundary`.

2. **Feature-level** – around widgets that can fail independently. In a micro-frontend architecture this is mandatory: one remote must never take down the shell.

3. **Recoverable** – reset keys tied to the route or query, so users can retry without a full reload.

React 19 added root-level error hooks on `createRoot` and `hydrateRoot`: `onCaughtError`, `onUncaughtError` and `onRecoverableError`. Wire them to your monitoring. Sentry ships a `reactErrorHandler()` for exactly this.

One gotcha: React 19 no longer re-throws errors caught by boundaries. Error reporting that relied on those re-throws silently stops working after an upgrade.

Boundaries also don't catch:

* Event handlers

* Async code outside render

* SSR-only paths

Those need explicit `try/catch`, mutation `onError` handlers and server-side logging.

## Test behavior, not implementation

Kent C. Dodds' principle still holds: the closer your tests are to how people use the software, the more you can trust them. A production-grade suite looks like this:

* **Static checks** – strict TypeScript and lint catch the most bugs per minute spent.

* **Integration tests (the bulk)** – React Testing Library, querying by role and accessible name (`getByRole('button', { name: /save/i })`). Use `userEvent`, not `fireEvent`. Never assert on internal state or hook internals.

* **Network mocks at the HTTP layer** – MSW, not a mocked API module. Your tests then exercise serialization, Zod parsing and the error paths you just designed.

* **A few E2E journeys** – Playwright for login, checkout and core CRUD, run against preview deployments.

Skip the global coverage target. Enforce these instead:

* A regression test for every bug fix.

* A test for every state of critical components.

* A test for every permission branch.

A 90% coverage number on snapshot tests tells you nothing. Four RTL tests covering loading, empty, error and success tell you a lot.

## A correctness checklist for your next PR

* [ ] Every async view handles loading, empty, error, stale and unauthorized, not just success
* [ ] Async state is a discriminated union with an exhaustiveness check
* [ ] `strict` + `noUncheckedIndexedAccess`; no `any`
* [ ] Every trust boundary is parsed with a schema, not cast
* [ ] Route- and feature-level error boundaries with a way to recover
* [ ] React 19 root error hooks report to monitoring
* [ ] Tests query by role, mock the network with MSW, and cover each state

If it only works on the happy path, it isn't done.

Next in the series: why fetching in `useEffect` is the most common sign that React code isn't production-ready, and where server state, client state and URL state belong.

## Sources

* [Introducing Zod 4](https://zod.dev/v4) and [Zod Mini](https://zod.dev/packages/mini) – zod.dev

* [@sentry/react](https://www.npmjs.com/package/@sentry/react?activeTab=readme) – React 19 error handler setup

* [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) – Kent C. Dodds

* [Avoid the Test User](https://kentcdodds.com/blog/avoid-the-test-user) – Kent C. Dodds
