# Testing standard

## Stack

- **[Vitest](https://vitest.dev)** as the test runner and coverage tool.
- **[React Testing Library](https://testing-library.com/react)** for rendering components and querying them the way a user or a crawler would (by role, label, and text).
- **[`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom)** for readable DOM assertions (`toBeInTheDocument`, `toHaveAttribute`, `toHaveClass`, …).
- **jsdom** as the DOM environment.

### Why Vitest over Jest

This is a Vite project. Vitest reuses the exact same Vite config, transform pipeline, and plugins (`@vitejs/plugin-react`, TypeScript, CSS handling) that `vite build` and `vite dev` already use, so there is nothing to keep in sync between a build config and a separate test config. Jest would need its own transform setup (`ts-jest` or `babel-jest`, a manual CSS/asset mock) that duplicates what Vite already does, for no benefit on a project this size. Vitest's API is Jest-compatible, so this is not an unfamiliar tool.

## Where tests live

Test files are co-located with the code they test, as `<Name>.test.ts` / `<Name>.test.tsx` next to `<Name>.ts` / `<Name>.tsx`. Shared test setup (not itself a test) lives in `src/test/`.

```
src/components/Faq.tsx
src/components/Faq.test.tsx
```

Co-location keeps a component and its test moving together in the file tree, in diffs, and in an editor's file list — there's no parallel `__tests__` or `test/` tree to keep in sync as components are renamed, split, or removed.

## How to run tests

```sh
npm test          # runs the full suite once with coverage, enforced at 100%
npm run test:watch  # interactive watch mode for local development
```

`npm test` is what CI and pre-merge checks should run. It fails the build if coverage drops below 100% on any of statements, branches, functions, or lines (configured in `vite.config.ts` under `test.coverage.thresholds`), so a coverage regression is a build failure, not something that has to be caught in review.

## Coverage policy: 100%

Every file under `src/**/*.{ts,tsx}` (excluding test files themselves and `src/test/`) is expected to be at 100% coverage. This is deliberately strict rather than aspirational, because the codebase this rule was introduced for is small and almost entirely free of conditional logic — nearly every component is a pure function mapping a static data array to markup. There is no meaningful subset of "the important 80%" to carve out; if a line exists, it is expected to run under test.

If a future change introduces something that's genuinely impractical to cover (e.g. an unreachable defensive branch), don't lower the global threshold — use a scoped `/* v8 ignore next */` comment on that line and say why in the same comment.

## Writing a test

- Prefer Testing Library's role/label/text queries (`getByRole`, `getByText`) over `container.querySelector` or snapshot tests. A query by accessible role fails when the accessible behavior breaks, not just when the markup shape changes — that's the same lens a screen reader or a non-JS crawler uses.
- Reach for `document.querySelector` only for things queries can't express well, like counting sibling nodes (`document.querySelectorAll('.faq-item')`) or asserting an id exists as an anchor target.
- Assert real content (the actual copy, hrefs, row counts), not just "it rendered." A test that only proves a component didn't throw doesn't catch a regression where the wrong headline ships.
- No snapshot tests. They pass on any change, including wrong ones, and don't document intent.
- Every `describe` block matches one source file. `it` names describe user-observable behavior, not implementation ("links the CTA to the shared demo anchor", not "renders an `<a>`").

## Special cases

- **`src/main.tsx`** mounts the app as a side effect of being imported, and picks `hydrateRoot` vs `createRoot` based on whether `#root` already has server-rendered markup in it. Its test (`src/main.test.tsx`) sets up the DOM first, then dynamically re-imports the module (via `vi.resetModules()`) once per branch, wrapped in React's `act()` so the async initial render is flushed before assertions run.
- **`src/entry-server.tsx`** is the SSR entry point used by `scripts/prerender.mjs` at build time (see the root `README.md` / build script for how prerendering works). Its test just asserts `render()` returns a markup string containing the expected landmarks — the component behavior itself is already covered by the per-component tests.
