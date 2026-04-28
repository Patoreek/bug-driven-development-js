# Reverse Linked List

**ID:** `lc-009-reverse-linked-list`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 15 minutes
**Tags:** `linked-list`, `pointers`, `in-place`
**Prerequisites:** None

---

## The Problem

Given the `head` of a singly linked list, reverse the list and return the reversed list.

### Examples

```
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

Input: head = [1,2]
Output: [2,1]

Input: head = []
Output: []
```

### Constraints

- The number of nodes is in the range [0, 5000]
- -5000 <= Node.val <= 5000

## What's Wrong

The current solution **creates a new linked list** by collecting all values into an array, then building new nodes in reverse order. While it produces the correct values, it:

1. Uses **O(n) extra space** for the values array and new nodes
2. Does **not** reverse in place — the original nodes are abandoned
3. Fails the identity test: the returned nodes are different objects from the originals

## Your Task

1. Fix the solution in `src/solution.ts` to reverse **in place**
2. Reuse the existing nodes — only change their `next` pointers
3. Achieve O(1) extra space (only pointer variables, no arrays)
4. Ensure all tests pass, including the in-place identity test
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | The copy-based solution — rewrite to reverse in place |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Approach)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Pointers)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(n) | O(n) extra |
| **Target** | **O(n)** | **O(1) extra** |
