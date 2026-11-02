# Working Isn't Done: What Production-Ready React Means in 2026

Nov 2, 2026 · @olena zhukova

Production-ready React is code that keeps behaving correctly when reality stops cooperating: the API returns garbage, the network drops, the user double-clicks, and a teammate refactors the component six months later.

After more than ten years of shipping React, I've stopped judging code by whether the demo works. Every demo works. What separates a pull request I'd approve for production from one I wouldn't is almost always the same question: what happens on the unhappy path?

This is the first post in a five-part series on what "production-ready" means for React in 2026. This one covers correctness: states, types, runtime validation, error boundaries, and tests. The rest of the series covers effects and data, performance, security, and how senior interviews grade all of it.

## Design every state, not just the happy one

Every data-driven view has at least six states, and production code designs all of them:

- **Loading** – a skeleton sized like the real content, so nothing jumps when data arrives (that jump is your CLS score).
- **Empty** – "No results" plus a next action. A blank region is a bug report waiting to happen.
- **Error** – retryable, with a correlation ID the user can give support.
- **Stale or partial** – data is shown while a background refetch runs, with a subtle indicator.
- **Unauthorized** – the user can see the page but not this widget.
- **Success** – the one everyone builds first.

If a screen only handles success, it isn't finished. It's a prototype that happens to be deployed.

## Make impossible states unrepresentable

The most common source of UI bugs I see in code review is boolean soup: `isLoading`, `isError`, `data` and `error` as four independent pieces of state. Nothing stops `isLoading && error` from both being true, so sooner or later they are.

A discriminated union fixes this at the type level:

```ts
type UsersState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: AppError }
  | { status: 'success'; data: User[] };
```

Now add an exhaustiveness check, so that adding a new variant breaks the build instead of silently rendering nothing:

```ts
function assertNever(x: never): never {
  throw new Error(`Unhandled state: ${JSON.stringify(x)}`);
}
```

A few more habits that separate senior TypeScript in React codebases:

- `strict: true` plus `noUncheckedIndexedAccess`, so `items[0]` is honestly typed as possibly undefined.
- No `any`. Use `unknown` and narrow it.
- **Branded types** for IDs and validated values (`UserId`, `Cents`), so you can't pass an order ID where a user ID belongs.
- `satisfies` for config objects, so you get checking without losing literal types.
- In React 19, `ref` is a regular prop, so new components don't need `forwardRef`.

## Types vanish at runtime: validate at every trust boundary

`response.json() as User[]` is a promise you're making to the compiler, and the backend never signed it. TypeScript types disappear at runtime, so anything that crosses a trust boundary is untyped input until you parse it:

- API responses
- URL and search params
- `localStorage` and `sessionStorage`
- `postMessage` and micro-frontend contracts
- Feature-flag payloads

Parse at the edge with Zod (or Valibot or ArkType) and derive your types from the schema:

```ts
const User = z.object({ id: z.string(), email: z.email(), role: z.enum(['admin', 'member']) });
type User = z.infer<typeof User>;

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users');
  return z.array(User).parse(await res.json());
}
```

Zod 4 has a much smaller core bundle than Zod 3, and `zod/mini` is there if you have a tight budget. Two practical notes:

- **Parse once per fetch, not once per render.** Do it in the query function. Parsing large payloads on the main thread can hurt INP.
- **Fail loudly in dev, gracefully in prod.** Consider `safeParse` with telemetry in production, so backend schema drift gets reported instead of white-screening your users.

## Fail in pieces, not all at once

One error boundary at the root means one broken widget blanks the whole app. Production apps layer them:

1. **Route-level** – the framework's `error.tsx` or route `ErrorBoundary`.
2. **Feature-level** – around widgets that can fail independently. In a micro-frontend architecture this is not optional: one remote must never take down the shell.
3. **Recoverable** – with reset keys tied to the route or query, so users can retry without a full reload.

React 19 also added root-level error hooks on `createRoot` and `hydrateRoot`: `onCaughtError`, `onUncaughtError` and `onRecoverableError`. Wire them to your monitoring (Sentry ships a `reactErrorHandler()` for exactly this). One gotcha: React 19 no longer re-throws errors caught by boundaries, so error reporting that relied on those re-throws silently stops working after an upgrade.

And remember what boundaries don't catch: event handlers, async code outside render, and SSR-only paths. Those still need explicit `try/catch`, mutation `onError` handlers and server-side logging.

## Test behavior, not implementation

Kent C. Dodds' principle still holds: the closer your tests are to how people use the software, the more you can trust them. In practice, a production-grade test suite looks like this:

- **Static checks** – strict TypeScript and lint catch the most bugs per minute spent.
- **Integration tests (the bulk)** – React Testing Library, querying by role and accessible name (`getByRole('button', { name: /save/i })`), with `userEvent` rather than `fireEvent`. Never assert on internal state or hook internals.
- **Network mocks at the HTTP layer** – MSW, not a mocked API module. That way your tests exercise serialization, Zod parsing and the error paths you just designed.
- **A few E2E journeys** – Playwright for login, checkout and core CRUD, run against preview deployments.

Skip the global coverage target. Instead, require a regression test for every bug fix, a test for every state of critical components, and a test for every permission branch. A 90% coverage number on snapshot tests tells you nothing; four RTL tests that cover loading, empty, error and success tell you a lot.

## A correctness checklist for your next PR

- [ ] Every async view handles loading, empty, error, stale and unauthorized, not just success
- [ ] Async state is a discriminated union with an exhaustiveness check
- [ ] `strict` + `noUncheckedIndexedAccess`; no `any`
- [ ] Every trust boundary is parsed with a schema, not cast
- [ ] Route- and feature-level error boundaries with a way to recover
- [ ] React 19 root error hooks report to monitoring
- [ ] Tests query by role, mock the network with MSW, and cover each state

Next in the series: why fetching in `useEffect` is the most common sign that React code isn't production-ready, and where server state, client state and URL state actually belong.

## Sources

- [Introducing Zod 4](https://zod.dev/v4) and [Zod Mini](https://zod.dev/packages/mini) – zod.dev
- [@sentry/react](https://www.npmjs.com/package/@sentry/react?activeTab=readme) – React 19 error handler setup
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) – Kent C. Dodds
- [Avoid the Test User](https://kentcdodds.com/blog/avoid-the-test-user) – Kent C. Dodds
