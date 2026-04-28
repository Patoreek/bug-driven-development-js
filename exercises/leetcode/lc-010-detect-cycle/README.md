# Linked List Cycle Detection

**ID:** `lc-010-detect-cycle`
**Difficulty:** ★★★☆☆
**Estimated Time:** 20 minutes
**Tags:** `linked-list`, `two-pointers`, `floyd-algorithm`
**Prerequisites:** `lc-009-reverse-linked-list`

---

## The Problem

Given `head`, the head of a linked list, determine if the linked list has a cycle in it.

A cycle exists if there is some node in the list that can be reached again by continuously following the `next` pointer.

### Examples

```
Input: head = [3,2,0,-4], cycle connects tail to index 1
Output: true
Explanation: The tail node (-4) connects back to node at index 1 (value 2)

Input: head = [1,2], no cycle
Output: false

Input: head = [1], self-loop
Output: true
```

### Constraints

- The number of nodes is in the range [0, 100,000]
- -100,000 <= Node.val <= 100,000

## What's Wrong

The current solution stores every visited node in a **Set** to detect if a node is visited twice. While correct, this uses **O(n) extra space** to store all the node references.

There exists a famous algorithm that detects cycles using only **O(1) extra space**.

## Your Task

1. Optimize the solution in `src/solution.ts`
2. Achieve **O(1) space** complexity (no Set, no array, no external storage)
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | The Set-based O(n) space solution to optimize |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Approach)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Algorithm)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(n) | O(n) |
| **Target** | **O(n)** | **O(1)** |
