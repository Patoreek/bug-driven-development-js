# The Missing Reduce Initial Value

**ID:** `js-003-reduce-initial-value`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 10 minutes
**Tags:** `javascript`, `arrays`, `reduce`, `initial-value`, `accumulator`
**Prerequisites:** None

---

## The Scenario

Your team's shopping cart module has three utility functions built with `.reduce()`. They work fine in manual testing — but in production, customers with empty carts see a crash instead of a $0 total. The data analytics team reports that their array-flattening helper also throws when given an empty dataset. And the grouping function produces bizarre results with a single item.

All three bugs share the same root cause.

## The Bug

The `reduce` calls are missing their initial value argument. Without it:

- On an empty array, `reduce` throws a `TypeError` (there's no first element to use as the initial accumulator)
- On an array of objects, the accumulator starts as the first element (an object), not a number or empty array — leading to wrong types and unexpected behavior

## Your Task

1. Fix `calculateTotal` so it returns `0` for an empty cart and a correct numeric total otherwise
2. Fix `flattenArrays` so it returns `[]` for an empty input
3. Fix `groupBy` so it returns `{}` for an empty input and works correctly for any number of items
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy reduce-based utility functions |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) — the initialValue parameter
- [MDN: TypeError: reduce of empty array with no initial value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Reduce_of_empty_array_with_no_initial_value)
