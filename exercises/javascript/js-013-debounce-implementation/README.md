# Broken Debounce and Throttle

**ID:** `js-013-debounce-implementation`
**Difficulty:** ★★★☆☆
**Estimated Time:** 20 minutes
**Tags:** `javascript`, `debounce`, `throttle`, `timers`, `closures`
**Prerequisites:** None

---

## The Scenario

Your team implemented custom `debounce` and `throttle` utility functions to avoid adding Lodash as a dependency. The search input should debounce API calls so users can type freely without hammering the server. The scroll handler should throttle events to fire at most once per interval. But the search fires on every keystroke and the scroll handler fires way too often.

## The Bug

The `debounce` function sets a new timer on every call but never clears the previous one. This means the function fires multiple times -- once for each call -- instead of only once after the user stops calling. The `throttle` function has a similar issue: it doesn't properly gate execution to the specified time limit.

## Your Task

1. Fix `debounce` to properly clear the previous timer before setting a new one
2. Fix `throttle` to properly limit execution to once per time interval
3. Ensure arguments are correctly forwarded to the wrapped function
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy debounce and throttle implementations |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) -- scheduling delayed execution
- [MDN: clearTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) -- canceling scheduled execution
