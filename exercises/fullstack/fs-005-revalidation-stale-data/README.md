# Revalidation: Stale Data After Mutation

**ID:** `fs-005-revalidation-stale-data`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `nextjs`, `revalidation`, `cache`, `server-actions`, `mutations`  
**Prerequisites:** None

---

## The Scenario

You are building a bookmark manager. Users can add and delete bookmarks, and the list is cached for performance. After launching, users report that newly added bookmarks do not appear in the list -- they have to refresh the page manually. Deleting a bookmark has the same problem: the deleted item still shows up until a hard refresh.

## The Bug

The `getBookmarks` function caches results to avoid redundant reads, but the `addBookmark` and `deleteBookmark` mutations never invalidate this cache. After any mutation, `getBookmarks` continues to return stale cached data instead of reflecting the current state of the database.

## Your Task

1. Identify where the cache should be invalidated
2. Add cache invalidation after each mutation (add and delete)
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/bookmarks.ts` | Bookmark CRUD operations with stale cache |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Revalidating Data](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#revalidating-data) -- cache invalidation strategies
- [Server Actions and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) -- mutating data in Next.js
- [Cache Invalidation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching#invalidation) -- general caching concepts
