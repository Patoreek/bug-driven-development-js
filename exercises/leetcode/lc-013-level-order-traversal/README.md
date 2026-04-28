# Binary Tree Level Order Traversal

**ID:** `lc-013-level-order-traversal`
**Difficulty:** ★★★☆☆
**Estimated Time:** 20 minutes
**Tags:** `trees`, `bfs`, `queue`, `level-order`
**Prerequisites:** None

---

## The Problem

Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).

### Examples

```
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]

    3
   / \
  9  20
    /  \
   15   7

Input: root = [1]
Output: [[1]]

Input: root = []
Output: []
```

### Constraints

- The number of nodes is in the range [0, 2000]
- -1000 <= Node.val <= 1000

## What's Wrong

The current solution uses DFS (pre-order traversal) and collects all values into a single flat array. It then wraps the entire array as one "level," losing all level structure. For the tree `[3,9,20,null,null,15,7]`, it returns `[[3,9,20,15,7]]` instead of `[[3],[9,20],[15,7]]`.

## Your Task

1. Rewrite the `levelOrder` function in `src/solution.ts`
2. Group nodes correctly by their level in the tree
3. Maintain left-to-right order within each level
4. All tests must pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | DFS that flattens all levels into one |

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
| **Target** | **O(n)** | **O(n)** |
