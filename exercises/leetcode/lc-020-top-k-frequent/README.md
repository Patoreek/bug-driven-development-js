# Top K Frequent Elements

**ID:** `lc-020-top-k-frequent`
**Difficulty:** ★★★☆☆
**Estimated Time:** 25 minutes
**Tags:** `hash-map`, `sorting`, `bucket-sort`, `heap`
**Prerequisites:** None

---

## The Problem

Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in **any order**.

It is guaranteed that the answer is unique (no ties at the k-th boundary).

### Examples

```
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]

Input: nums = [1], k = 1
Output: [1]

Input: nums = [4,4,4,3,3,2,1], k = 2
Output: [4,3]
```

### Constraints

- 1 <= nums.length <= 100,000
- -10,000 <= nums[i] <= 10,000
- k is in the range [1, number of unique elements]
- The answer is unique

## What's Wrong

The current solution counts frequencies correctly using a Map, but then **sorts all unique elements by frequency** using `Array.sort()`. This makes the overall time complexity **O(n log n)** due to comparison-based sorting.

## Your Task

1. Optimize `src/solution.ts` to avoid the O(n log n) sort
2. Target: **O(n)** time complexity
3. All tests must pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Sort-based O(n log n) approach |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Approach)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Data Structure)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(n log n) | O(n) |
| **Target** | **O(n)** | **O(n)** |
