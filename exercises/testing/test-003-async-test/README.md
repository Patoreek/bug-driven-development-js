# Async Test Timing

**ID:** `test-003-async-test`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `testing`, `vitest`, `async`, `react-testing-library`, `waitFor`  
**Prerequisites:** None

---

## The Scenario

Your team built a search results component that fetches data from an API when the user clicks a search button. The component works perfectly in the browser -- you can see it loading, then displaying results. But the tests are failing intermittently. Sometimes they pass, sometimes they don't. The developer who wrote them complains about "flaky tests" and has been re-running CI until it goes green.

## The Problem

The tests trigger an async action (clicking a button that fetches data) but then immediately assert on the DOM without waiting for the async operation to complete. The assertions run before the data arrives and the component re-renders. The test is checking for results that haven't appeared yet.

## Your Task

1. Fix the test file at `src/__tests__/SearchResults.test.tsx`
2. Do NOT modify the application code in `src/`
3. Use proper async testing utilities (`waitFor`, `findBy*` queries) to wait for async updates
4. All tests should pass reliably AND meaningfully verify behavior

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/SearchResults.test.tsx` | The flawed test file with async timing issues |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/SearchResults.tsx` | The correct SearchResults component |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [RTL Async Utilities](https://testing-library.com/docs/dom-testing-library/api-async/) -- waitFor, findBy queries
- [Testing Async Components](https://testing-library.com/docs/guide-disappearance/) -- waiting for elements to appear/disappear
- [Common Mistakes with RTL](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) -- async testing pitfalls
