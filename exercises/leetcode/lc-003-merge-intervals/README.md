# Merge Intervals

**ID:** `lc-003-merge-intervals`
**Difficulty:** ★★★☆☆
**Estimated Time:** 20 minutes
**Tags:** `arrays`, `sorting`, `intervals`, `greedy`
**Prerequisites:** None

---

## The Problem

Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.

### Examples

```
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: [1,3] and [2,6] overlap, merge into [1,6]

Input: intervals = [[1,4],[2,3]]
Output: [[1,4]]
Explanation: [2,3] is fully contained within [1,4]

Input: intervals = [[8,10],[1,3],[2,6],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Same result even though input is unsorted
```

### Constraints

- 0 <= intervals.length <= 10,000
- intervals[i].length == 2
- 0 <= start_i <= end_i <= 10,000

## What's Wrong

The current solution has **two bugs**:

1. It does **not sort** the intervals by start time, so it assumes the input is already ordered
2. It only checks **adjacent pairs** in the array, missing overlapping chains (e.g., three intervals that should merge into one)

## Your Task

1. Fix the solution in `src/solution.ts`
2. Handle unsorted input correctly
3. Properly merge chains of overlapping intervals
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | The buggy interval merge implementation |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Approach)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Key Step)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | Broken | O(n) |
| **Target** | **O(n log n)** | **O(n)** |
