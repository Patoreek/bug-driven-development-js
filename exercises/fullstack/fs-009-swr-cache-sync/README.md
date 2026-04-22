# SWR Cache Sync: Stale Data After Mutation

**ID:** `fs-009-swr-cache-sync`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `swr`, `cache`, `mutation`, `data-fetching`, `react`  
**Prerequisites:** None

---

## The Scenario

Your team uses an SWR-like cache layer for fetching and displaying comments on a blog post. Users can post new comments via an API. The problem: after posting a comment, the comment list doesn't update. The new comment only appears after a full page refresh. Users think their comment wasn't saved.

## The Bug

The `addComment` function calls the API to create a new comment, and the API succeeds. But the SWR-like cache still holds the old comment list. The code never calls `mutate()` to update or revalidate the cache key, so the next read returns stale data.

## Your Task

1. Examine `src/commentStore.ts` and identify why the cache doesn't update after a mutation
2. After a successful POST, update the cache so the new data is reflected immediately
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/commentStore.ts` | SWR-like cache with missing mutation sync |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [SWR Mutation](https://swr.vercel.app/docs/mutation) -- updating cached data
- [Stale-While-Revalidate](https://web.dev/stale-while-revalidate/) -- caching strategy
- [Cache Invalidation Patterns](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations) -- keeping cache fresh
