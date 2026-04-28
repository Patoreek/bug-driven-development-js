# Generator Pagination

**ID:** `js-018-generator-pagination`
**Difficulty:** ★★★★☆
**Estimated Time:** 25 minutes
**Tags:** `javascript`, `async-generators`, `pagination`, `yield`, `lazy-evaluation`
**Prerequisites:** None

---

## The Scenario

Your team is building a data pipeline that consumes a paginated REST API. The API returns results in pages (with a cursor for the next page), and you want to abstract this away so consumers can simply `for await...of` over all items without thinking about pagination. You also need utilities to take the first N items and to transform items with an async mapping function. The initial implementation has several bugs: items come out as arrays instead of individual values, the fetcher loops forever, and the mapper yields unresolved promises.

## The Bug

Four issues across three functions:

1. **`paginatedFetch`**: Uses `yield` on an array instead of `yield*`, producing the whole array as a single value rather than individual items
2. **`paginatedFetch`**: The loop condition is `while (true)` with no exit, causing infinite fetching even after the last page
3. **`takeAsync`**: Has an off-by-one error (`<=` instead of `<`) and does not call `iterator.return()` to clean up the generator
4. **`mapAsync`**: Yields the raw result of `mapFn()` without `await`, so when the function is async, Promise objects are yielded instead of resolved values

## Your Task

1. Fix `paginatedFetch` to yield individual items using `yield*`
2. Fix the loop condition to stop when `nextCursor` is `null`
3. Fix `takeAsync` to take exactly N items and call `iterator.return()` for cleanup
4. Fix `mapAsync` to `await` the mapping function before yielding
5. Ensure all tests pass
6. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy async generator pagination utilities |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Async generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function*) -- async function*
- [MDN: yield*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*) -- delegating to another iterable
- [MDN: for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) -- consuming async iterables
