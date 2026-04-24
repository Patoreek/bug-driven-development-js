# flatMap vs map().flat()

**ID:** `js-006-flat-map-transform`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 15 minutes
**Tags:** `javascript`, `arrays`, `flatMap`, `map`, `flat`, `data-transformation`
**Prerequisites:** None

---

## The Scenario

Your content management system has three data transformation functions. The tag aggregator collects all unique tags from blog posts. The order processing system expands multi-item orders into individual line items. And the search indexer splits sentences into individual words. All three functions produce nested arrays instead of the flat results the rest of the application expects, causing type errors and broken UI components downstream.

## The Bug

All three functions use `.map()` where `.flatMap()` is needed. When the mapping callback returns an array (like `post.tags`, `order.items.map(...)`, or `sentence.split(" ")`), `.map()` wraps each result in another layer of nesting. The result is an array of arrays instead of a flat array.

The `getUniqueTags` function also has a subtle issue: passing nested arrays to `Set` treats each sub-array as a unique item (by reference), so deduplication doesn't work on the individual tag strings.

## Your Task

1. Fix `getUniqueTags` to return a flat, deduplicated, sorted array of tag strings
2. Fix `expandOrders` to return a flat array of order line objects
3. Fix `getAllWords` to return a flat array of word strings, filtering out empty strings
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy data transformation functions producing nested arrays |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Array.prototype.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap) — map and flatten in one step
- [MDN: Array.prototype.flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) — flattening nested arrays
- [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) — deduplication
