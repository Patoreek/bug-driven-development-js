# Cache Stampede

**ID:** `be-012-cache-stampede`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `caching`, `concurrency`, `performance`, `mutex`, `thundering-herd`  
**Prerequisites:** None

---

## The Scenario

Your team runs a product catalog API that caches expensive database queries. During normal operation it works great -- but every time a cache entry expires, your database monitoring shows a huge spike: dozens of identical queries hit the database simultaneously. The DBA is complaining that these "thundering herd" spikes are causing timeouts. You need to fix the caching layer so that only one request fetches the data on a cache miss while others wait for the result.

## The Bug

The `cachedFetch` function checks the cache, and on a miss, fetches from the data source and stores the result. The problem is that when multiple concurrent requests all find the cache empty (before anyone has populated it), they ALL hit the data source simultaneously. This is called a "cache stampede" or "thundering herd" problem.

## Your Task

1. Examine `src/cache.ts` and identify why concurrent cache misses cause multiple fetches
2. Implement a promise coalescing pattern so only one fetch happens per key during a cache miss
3. All concurrent callers for the same key should receive the same result
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/cache.ts` | Cache layer with stampede vulnerability |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Cache Stampede](https://en.wikipedia.org/wiki/Cache_stampede) -- the thundering herd problem
- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) -- how promises can be shared between callers
- [Mutex Pattern](https://en.wikipedia.org/wiki/Mutual_exclusion) -- preventing concurrent access to shared resources
