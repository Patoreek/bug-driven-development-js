# Race Condition: When Slow Responses Win

**ID:** `fe-017-race-condition-fetch`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 30 minutes  
**Tags:** `react`, `async`, `race-condition`, `AbortController`, `fetch`  
**Prerequisites:** None

---

## The Scenario

You built a search component that fetches results as the user types. During testing, you noticed something strange: if you quickly type "react", the results briefly show matches for "r", then "re", then flicker back to "rea" before finally showing "react" results. Sometimes the final results shown are for "rea" instead of "react" because the "rea" request happened to respond last.

This is a classic race condition — older, slower requests completing after newer, faster ones.

## The Bug

The component fires a fetch request on every keystroke without canceling previous in-flight requests. When multiple requests are in flight simultaneously, there's no guarantee they'll resolve in order. A slow response to an earlier query can overwrite results from a later, faster query. The component also doesn't clean up pending requests when it unmounts.

## Your Task

1. Fix the `useSearch` hook to cancel stale requests using `AbortController`
2. Ensure only the most recent request's results are displayed
3. Clean up pending requests on unmount
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/SearchResults.tsx` | Search component with fetch race condition |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) — Canceling fetch requests
- [Fixing Race Conditions in React](https://react.dev/learn/you-might-not-need-an-effect#fetching-data) — React docs on data fetching
