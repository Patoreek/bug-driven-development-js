# Promise.all Loses Everything on One Failure

**ID:** `js-010-promise-all-error`
**Difficulty:** ★★★☆☆
**Estimated Time:** 15 minutes
**Tags:** `javascript`, `promises`, `async`, `error-handling`, `Promise.allSettled`
**Prerequisites:** None

---

## The Scenario

Your team built a user analytics dashboard that fetches data for multiple users in parallel. It worked great in dev, but in production, one flaky API endpoint occasionally fails. When it does, the entire dashboard goes blank -- data for all 99 successful users is thrown away because of 1 failure. The PM is furious.

## The Bug

The `fetchAllUsers` function uses `Promise.all()` to fetch user data in parallel. `Promise.all` rejects as soon as **any** promise rejects, discarding all successful results. The `batchProcess` function has the same problem -- one failure loses all results.

## Your Task

1. Fix `fetchAllUsers` to return partial results when some requests fail
2. Fix `batchProcess` to collect both successes and failures separately
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy async utility functions |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) -- all-or-nothing semantics
- [MDN: Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) -- always returns all results
