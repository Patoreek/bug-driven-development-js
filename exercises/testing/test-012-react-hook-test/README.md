# Fix the React Hook Tests

**ID:** `test-012-react-hook-test`
**Difficulty:** ★★★★☆
**Estimated Time:** 25 minutes
**Tags:** `testing`, `vitest`, `react-testing-library`, `hooks`, `renderHook`
**Prerequisites:** None

---

## The Scenario

Your team has a `useLocalStorage` custom hook that manages state synchronized with `localStorage`. It supports reading, writing, updater functions, removal, and cross-tab synchronization. A developer wrote tests by creating full wrapper components (`TestComponent`, `NumberTestComponent`) that render the hook's values into the DOM, then asserts on DOM text content. The tests work but are brittle, verbose, and test the wrapper's behavior rather than the hook itself. Adding new test cases requires writing more JSX and event handling code.

## The Problem

The tests have several issues:

1. **Wrapper components obscure intent**: Two custom React components exist solely to expose hook values in the DOM
2. **DOM assertions instead of value assertions**: Tests check `element.textContent` instead of `result.current` from the hook
3. **Testing the wrapper, not the hook**: To set a value, tests type into an input and click a button -- this tests the wrapper's event handling
4. **Type inflexibility**: Testing different value types (strings, numbers, objects) requires separate wrapper components
5. **Incomplete coverage**: Complex objects can't be easily tested through DOM text, so those tests are skipped or incomplete
6. **Async timing issues**: The `useEffect` that syncs to `localStorage` may not have fired when the assertion runs

## Your Task

1. Fix the test file at `src/__tests__/useLocalStorage.test.tsx`
2. Do NOT modify the hook code in `src/useLocalStorage.ts`
3. Replace all wrapper components with `renderHook` from `@testing-library/react`
4. Assert directly on `result.current` values instead of DOM text
5. Use `act()` to wrap state updates
6. Add missing test coverage: complex objects, corrupt JSON, cross-tab storage events

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/useLocalStorage.test.tsx` | Tests using wrapper components instead of renderHook |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/useLocalStorage.ts` | The correct useLocalStorage custom hook |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Testing Library: renderHook](https://testing-library.com/docs/react-testing-library/api#renderhook) -- the right way to test hooks
- [Testing Library: act](https://testing-library.com/docs/react-testing-library/api#act) -- wrapping state updates in tests
- [React Hooks Testing](https://react.dev/reference/react/hooks) -- understanding hook lifecycle
