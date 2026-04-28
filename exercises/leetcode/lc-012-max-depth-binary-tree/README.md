# Maximum Depth of Binary Tree

**ID:** `lc-012-max-depth-binary-tree`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 10 minutes
**Tags:** `trees`, `dfs`, `recursion`, `bfs`
**Prerequisites:** None

---

## The Problem

Given the `root` of a binary tree, return its maximum depth.

A binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.

### Examples

```
Input: root = [3,9,20,null,null,15,7]
Output: 3

    3
   / \
  9  20
    /  \
   15   7

Input: root = [1,null,2]
Output: 2

Input: root = []
Output: 0

Input: root = [1]
Output: 1
```

### Constraints

- The number of nodes is in the range [0, 10,000]
- -100 <= Node.val <= 100

## What's Wrong

The current solution uses a BFS approach but has a critical bug: it **increments the depth counter for every node** processed, not for every level. This means a tree with 7 nodes at 3 levels reports a depth of 7 instead of 3.

## Your Task

1. Fix or rewrite the `maxDepth` function in `src/solution.ts`
2. The correct result is the number of **levels**, not nodes
3. All tests must pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | BFS with incorrect depth counting |

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
| Current | O(n) (but wrong result) | O(n) |
| **Target** | **O(n)** | **O(h)** where h = height |
