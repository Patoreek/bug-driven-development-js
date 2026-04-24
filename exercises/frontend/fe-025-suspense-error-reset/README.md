# Suspense + Error Boundary: The Stuck Error

**ID:** `fe-025-suspense-error-reset`  
**Difficulty:** ★★★★★  
**Estimated Time:** 35 minutes  
**Tags:** `react`, `suspense`, `error-boundary`, `data-fetching`, `retry`  
**Prerequisites:** None

---

## The Scenario

Your app uses Suspense for data fetching with a promise cache and an error boundary for error handling. When a network request fails, the error boundary catches it and shows a "Retry" button. But clicking "Retry" does nothing -- the error message stays forever. Users are forced to refresh the entire page. The bug is a combination of two missing pieces in the error recovery flow.

## The Bug

Two problems prevent retry from working:

1. **Error boundary never resets:** The `handleRetry` method calls `onRetry` but **never clears** `hasError` / `error` from state. Since `hasError` is still `true`, the boundary renders the error UI on the next render regardless of what the children would do.

2. **Promise cache not invalidated:** Even if the boundary did reset, the failed promise is still in the cache. When `DataDisplay` re-renders, `fetchData()` finds the cached rejected entry and immediately throws the same error again. The cache must be cleared before retrying.

## Your Task

1. Fix the `ErrorBoundary` to reset its error state when "Retry" is clicked
2. Fix the `App` to clear the cached failed entry on retry
3. Ensure the Suspense boundary re-triggers a fresh fetch after retry
4. All tests must pass

## Files to Modify

| File | Description |
|------|-------------|
| `src/DataLoader.tsx` | Error boundary, fetch cache, and app component |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) -- class component error handling
- [Suspense for Data Fetching](https://react.dev/reference/react/Suspense) -- Suspense with async data
- [Key prop for resetting components](https://react.dev/learn/preserving-and-resetting-state#resetting-state-with-a-key) -- forcing remounts
