# Validate Binary Search Tree

**ID:** `lc-014-validate-bst`
**Difficulty:** ★★★☆☆
**Estimated Time:** 25 minutes
**Tags:** `trees`, `bst`, `dfs`, `recursion`
**Prerequisites:** None

---

## The Problem

Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as:
- The left subtree of a node contains **only** nodes with keys **less than** the node's key
- The right subtree of a node contains **only** nodes with keys **greater than** the node's key
- Both the left and right subtrees must also be BSTs

### Examples

```
Input: root = [2,1,3]
Output: true

Input: root = [5,1,4,null,null,3,6]
Output: false
Explanation: The root's right child is 4, which has left child 3.
But 3 < 5 (the root), so it violates the BST property.

        5
       / \
      1   4
         / \
        3   6    ← 3 is in 5's right subtree but 3 < 5
```

### Constraints

- The number of nodes is in the range [0, 10,000]
- Node values can be any integer (including very large/small values)
- Equal values are NOT allowed (strict BST)

## What's Wrong

The current solution only checks **immediate children** against their parent: `node.left.val < node.val` and `node.right.val > node.val`. This misses cases where a deeper node violates the BST property relative to an **ancestor**.

For example, in `[5,1,4,null,null,3,6]`, the node `3` passes the immediate check (`3 < 4`, its parent), but fails the ancestor check (`3 < 5`, the root — it should be `> 5` since it's in the right subtree of 5).

## Your Task

1. Fix the `isValidBST` function in `src/solution.ts`
2. Ensure the BST property is checked against ALL ancestors, not just the parent
3. All tests must pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Only checks immediate parent — misses deep violations |

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
| Current | O(n) (but wrong result) | O(h) |
| **Target** | **O(n)** | **O(h)** where h = height |
