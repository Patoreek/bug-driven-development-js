# Inorder Successor in BST

**ID:** `ms-006-inorder-successor-bst`
**Difficulty:** ★★★☆☆
**Estimated Time:** 20 minutes
**Tags:** `binary-search-tree`, `inorder-traversal`
**Prerequisites:** None

---

## The Problem

Given the root of a binary search tree and a node `p` in it, return the in-order successor of that node. The in-order successor is the node with the smallest key greater than `p.val`. If no such node exists, return `null`.

### Examples

```
Input: root = [5,3,6,2,4,null,null,1], p = node with val 4
Output: node with val 5

Input: root = [2,1], p = node with val 1
Output: node with val 2

Input: root = [5,3,6,2,4], p = node with val 6
Output: null (6 is the largest element)
```

### Constraints

- The number of nodes in the tree is in the range `[1, 10^4]`
- `-10^5 <= Node.val <= 10^5`
- All values in the BST are unique

## What's Wrong

The current solution performs a **full inorder traversal**, building a sorted array of all nodes, then linearly searches for the target node to find the next element. This is O(n) time and O(n) space.

The optimal solution uses the BST property: walk from the root, and whenever you go left (meaning `p.val < node.val`), the current node is a potential successor. When you go right (`p.val >= node.val`), the successor must be further right. This gives O(h) time and O(1) space.

## Your Task

1. Refactor `inorderSuccessor` in `src/solution.ts` to use the BST property
2. Walk from root to leaf, tracking the most recent "left turn" as the potential successor
3. Eliminate the sorted array entirely
4. Use iterative traversal with O(1) space
5. All tests must pass, including the performance test

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Full inorder traversal to optimize with BST-guided search |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Observation)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Technique)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(n) | O(n) |
| **Target** | **O(h)** | **O(1)** |
