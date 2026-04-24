# Reduce groupBy Gone Wrong

**ID:** `js-009-reduce-group-by`
**Difficulty:** ★★★☆☆
**Estimated Time:** 15 minutes
**Tags:** `javascript`, `reduce`, `groupBy`, `accumulator`, `objects`
**Prerequisites:** None

---

## The Scenario

Your team is building an order management dashboard. You wrote a `groupBy` utility function to group orders by their status (pending, shipped, delivered). QA reports that the dashboard only shows one order per status even though there are dozens. After some digging, you find a utility called `groupByProperty` that groups by a specific object key. Both functions have the same fundamental issue.

## The Bug

The `groupBy` function uses `Array.reduce()` to build an object of grouped items, but each time it encounters a key that already exists in the accumulator, it **overwrites** the array instead of appending to it. Only the last item for each key survives. The `groupByProperty` function has the same problem.

## Your Task

1. Fix the `groupBy` function so it correctly accumulates all items for each key
2. Fix the `groupByProperty` function similarly
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy groupBy utility functions |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) -- accumulator patterns
- [MDN: Object.groupBy()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy) -- native groupBy alternative
