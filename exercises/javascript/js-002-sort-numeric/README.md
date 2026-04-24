# Lexicographic Sort Surprise

**ID:** `js-002-sort-numeric`
**Difficulty:** ★☆☆☆☆
**Estimated Time:** 10 minutes
**Tags:** `javascript`, `arrays`, `sort`, `lexicographic`, `comparison-function`
**Prerequisites:** None

---

## The Scenario

Your e-commerce team just launched a product listing page with a "sort by price" feature. QA files a bug: when products are sorted by price, a $100 item appears before a $20 item. The calendar team reports a similar issue — events are not appearing in chronological order. Both problems trace back to how the sort functions were implemented.

## The Bug

The sort functions either rely on JavaScript's default `.sort()` behavior (which converts elements to strings and sorts lexicographically) or explicitly convert numbers to strings before comparing. This means `10` comes before `2` because the string `"10"` comes before `"2"` alphabetically. The calendar sort calls `.sort()` on an array of objects, which compares their string representations (`[object Object]`), producing unpredictable results.

## Your Task

1. Fix `sortNumbers` so numbers are sorted numerically
2. Fix `sortProducts` so products are sorted by price numerically
3. Fix `sortByDate` so events are sorted chronologically by their date string
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy sort utility functions |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) — default sort behavior and comparison functions
- [MDN: String.prototype.localeCompare()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) — comparing strings properly
