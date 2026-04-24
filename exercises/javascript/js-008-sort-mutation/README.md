# The Sort Mutation Surprise

**ID:** `js-008-sort-mutation`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 10 minutes
**Tags:** `javascript`, `arrays`, `sort`, `mutation`, `immutability`, `toSorted`
**Prerequisites:** None

---

## The Scenario

Your application has a leaderboard that shows the top 3 scores and a product page that displays items in both "featured" (original) and "by price" order. Users report that after viewing the leaderboard, the scores list appears reordered everywhere in the app. The product page shows the same sorted-by-price order in both the "featured" and "sorted" sections. A statistical function that computes the median is also scrambling its input data.

## The Bug

JavaScript's `.sort()` method **mutates the original array** in place and returns a reference to the same array. The functions sort the input array directly, which modifies the caller's data. Assigning `const sorted = arr.sort()` does NOT create a copy — `sorted` and `arr` are the same array.

This causes:
- `getTopScores` to permanently reorder the caller's scores array
- `getSortedByName` to modify the original items array
- `getMedian` to scramble the input numbers
- `getProductViews` to sort the products array, so `featured` and `byPrice` both show sorted order

## Your Task

1. Fix all four functions so they do NOT mutate their input arrays
2. Ensure the sorted results are still correct
3. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Functions that accidentally mutate their input arrays via .sort() |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) — mutates in place
- [MDN: Array.prototype.toSorted()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted) — non-mutating alternative (ES2023)
- [MDN: Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) — creating shallow copies
