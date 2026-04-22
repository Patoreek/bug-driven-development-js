# Fix the Integration Test Boundary

**ID:** `test-010-integration-boundary`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 30 minutes  
**Tags:** `testing`, `vitest`, `integration-testing`, `react-testing-library`, `dependency-injection`  
**Prerequisites:** None

---

## The Scenario

Your team has a `UserProfile` component that fetches user data from an API, displays it, and supports an edit flow. A previous developer wrote tests by mocking React's `useState` and `useEffect` hooks directly, manually controlling each piece of state. The tests pass, but they're so tightly coupled to the component's internal implementation that any refactor (like consolidating state into `useReducer` or renaming a state variable) breaks every test -- even though the component's behavior is unchanged. Your team decides to rewrite the tests to mock at the proper boundary: the API client.

## The Problem

The tests mock React's `useState` directly, providing fake state values and setter functions. This means:
- The tests never actually render the component's real logic
- The API client is never called (the data is spoofed via state mocks)
- Any internal refactor breaks the tests even if behavior is identical
- User interactions (clicking Edit, typing, saving) aren't actually tested end-to-end
- The tests verify implementation wiring, not user-facing behavior

## Your Task

1. Fix the test file at `src/__tests__/UserProfile.test.tsx`
2. Do NOT modify the application code in `src/`
3. Remove the `vi.mock("react", ...)` block entirely
4. Instead, provide a mock `apiClient` (the natural dependency injection boundary)
5. Test real user flows: loading, viewing, editing, saving, canceling, error handling
6. All tests should pass AND test behavior from the user's perspective

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/UserProfile.test.tsx` | The test file mocking at the wrong boundary |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/UserProfile.tsx` | The correct UserProfile component with API integration |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Testing implementation details](https://kentcdodds.com/blog/testing-implementation-details) -- why mocking internals is harmful
- [RTL async utilities](https://testing-library.com/docs/dom-testing-library/api-async) -- findBy, waitFor
- [Dependency injection in React](https://react.dev/learn/passing-props-to-a-component) -- passing dependencies as props
