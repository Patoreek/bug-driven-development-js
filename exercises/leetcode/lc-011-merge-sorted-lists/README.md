# Merge Two Sorted Lists

**ID:** `lc-011-merge-sorted-lists`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 15 minutes
**Tags:** `linked-list`, `merge`, `two-pointer`
**Prerequisites:** None

---

## The Problem

You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list by splicing together the nodes of the first two lists. Return the head of the merged linked list.

### Examples

```
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

Input: list1 = [], list2 = [0]
Output: [0]

Input: list1 = [], list2 = []
Output: []
```

### Constraints

- The number of nodes in each list is in the range [0, 50]
- -100 <= Node.val <= 100
- Both lists are sorted in non-decreasing order

## What's Wrong

The current solution converts both linked lists to arrays, merges the arrays, then creates a brand new linked list from the merged array. While this produces the correct result, it uses **O(n+m) extra space** for the intermediate arrays and creates entirely new nodes instead of reusing existing ones.

## Your Task

1. Optimize `src/solution.ts` to merge the lists **in-place**
2. Reuse the existing `ListNode` objects instead of creating new ones
3. Target: **O(1) extra space** (beyond the input nodes)
4. All tests must pass, including the in-place node reuse test
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Array-based merge to optimize |

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
| Current | O(n+m) | O(n+m) |
| **Target** | **O(n+m)** | **O(1)** |
