# Closest BST Value

**ID:** `ms-005-closest-bst-value`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 15 minutes
**Tags:** `binary-search-tree`, `binary-search`
**Prerequisites:** None

---

## The Problem

Given the root of a binary search tree and a target value, return the value in the BST that is closest to the target. If there are multiple answers, return any of them.

### Examples

```
Input: root = [4,2,5,1,3], target = 3.7
Output: 4

Input: root = [4,2,5,1,3], target = 3.0
Output: 3

Input: root = [1], target = 4.5
Output: 1
```

### Constraints

- The number of nodes in the tree is in the range `[1, 10^4]`
- `0 <= Node.val <= 10^9`
- `-10^9 <= target <= 10^9`

## What's Wrong

The current solution does a **full DFS traversal** of the entire tree, collecting all values into an array, then linearly scans the array for the closest value. This is O(n) time and O(n) space, completely ignoring the BST property.

The optimal solution leverages the BST ordering: at each node, compare to the target and go left or right accordingly, tracking the closest value seen. This gives O(h) time and O(1) space, where h is the tree height.

## Your Task

1. Refactor `closestValue` in `src/solution.ts` to use the BST property
2. Walk down the tree iteratively -- no need to visit every node
3. At each step, decide whether to go left or right based on the target
4. Track the closest value seen so far
5. Eliminate the array allocation entirely
6. All tests must pass, including the performance test

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Full-tree DFS to optimize with BST-guided search |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Property)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Technique)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(n) | O(n) |
| **Target** | **O(h)** | **O(1)** |
