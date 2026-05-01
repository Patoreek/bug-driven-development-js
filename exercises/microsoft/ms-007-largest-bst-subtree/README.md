# Largest BST Subtree

**ID:** `ms-007-largest-bst-subtree`
**Difficulty:** ★★★☆☆
**Estimated Time:** 25 minutes
**Tags:** `binary-tree`, `binary-search-tree`, `recursion`, `post-order`
**Prerequisites:** None

---

## The Problem

Given a binary tree, find the largest subtree which is a valid Binary Search Tree (BST). Return the number of nodes in the largest BST subtree.

A BST is defined as:
- The left subtree of a node contains only nodes with keys **less than** the node's key.
- The right subtree of a node contains only nodes with keys **greater than** the node's key.
- Both the left and right subtrees must also be BSTs.

### Examples

**Example 1:**
```
Input:
       10
      /  \
     5   15
    / \    \
   1   8    7

Output: 3
Explanation: The largest BST subtree is [5, 1, 8], which has 3 nodes.
```

**Example 2:**
```
Input:
    4
   / \
  2   6
 / \ / \
1  3 5  7

Output: 7
Explanation: The entire tree is a valid BST.
```

**Example 3:**
```
Input: null
Output: 0
```

### Constraints

- The number of nodes in the tree is in the range `[0, 10^5]`.
- `-10^4 <= Node.val <= 10^4`

## What's Wrong

The current implementation uses a **top-down approach**: for each node, it checks whether the entire subtree rooted at that node is a valid BST, then counts the nodes in that subtree. Both operations traverse the subtree, taking O(n) each. Since this is done for every node in the tree, the overall time complexity is **O(n^2)**.

This causes Time Limit Exceeded on large trees (50,000+ nodes).

## Your Task

1. Replace the top-down approach with a **bottom-up (post-order) traversal**
2. Each recursive call should return enough information to determine if the current subtree is a valid BST without re-traversing it
3. Track the global maximum BST size as you traverse
4. Achieve **O(n)** time complexity

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Replace the O(n^2) top-down BST check with an O(n) bottom-up post-order approach |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Direction)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Technique)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(n^2) | O(n) stack |
| **Target** | **O(n)** | **O(n) stack** |
