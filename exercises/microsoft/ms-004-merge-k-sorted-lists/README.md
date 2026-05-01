# Merge K Sorted Lists

**ID:** `ms-004-merge-k-sorted-lists`
**Difficulty:** ★★★☆☆
**Estimated Time:** 25 minutes
**Tags:** `linked-list`, `divide-and-conquer`, `heap`
**Prerequisites:** None

---

## The Problem

You are given an array of `k` linked lists, each sorted in ascending order. Merge all the linked lists into one sorted linked list and return it.

### Examples

```
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]

Input: lists = []
Output: []

Input: lists = [[]]
Output: []
```

### Constraints

- `k == lists.length`
- `0 <= k <= 10^4`
- `0 <= lists[i].length <= 500`
- `-10^4 <= lists[i][j] <= 10^4`
- `lists[i]` is sorted in ascending order
- The sum of `lists[i].length` will not exceed `10^4`

## What's Wrong

The current solution merges lists **sequentially** -- it merges list[0] with list[1], then the result with list[2], and so on. While this produces correct output, it is O(kN) where N is the total number of nodes. The first elements get traversed repeatedly in every merge pass, making it much slower than necessary for large inputs.

The optimal approach uses **divide and conquer**: pair up lists and merge pairs simultaneously, halving the number of lists each round. This gives O(N log k) time complexity.

## Your Task

1. Refactor `mergeKLists` in `src/solution.ts` to use a divide-and-conquer approach
2. Pair up adjacent lists and merge each pair
3. Repeat until only one list remains
4. Keep the `mergeTwoLists` helper -- it works correctly
5. All tests must pass, including the performance test

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Sequential merge to optimize with divide-and-conquer |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Pattern)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Technique)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(kN) | O(1) |
| **Target** | **O(N log k)** | **O(1)** |
