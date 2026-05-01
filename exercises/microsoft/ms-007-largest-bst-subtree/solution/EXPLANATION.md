# Explanation: Largest BST Subtree

## Why the Bug Happens

The buggy implementation uses a **top-down** strategy: for each node, it asks "is the subtree rooted here a valid BST?" and if so, counts the nodes. Both `isValidBST()` and `countNodes()` traverse the entire subtree, each taking O(n) time. Since this check is performed for every node in the tree, the total time is O(n^2).

The fundamental problem is **redundant work**: when checking if a subtree is a valid BST, the function traverses all descendants. Then when it recurses into child nodes, it re-traverses many of the same nodes again.

## The Fix

Use a **bottom-up (post-order) traversal** where each node returns aggregated information about its subtree in a single pass:

```diff
- // Top-down: O(n^2)
- export function largestBSTSubtree(root: TreeNode | null): number {
-   if (!root) return 0;
-   if (isValidBST(root, -Infinity, Infinity)) {
-     return countNodes(root);
-   }
-   return Math.max(
-     largestBSTSubtree(root.left),
-     largestBSTSubtree(root.right)
-   );
- }

+ interface SubtreeInfo {
+   min: number;   // Minimum value in subtree
+   max: number;   // Maximum value in subtree
+   size: number;  // Number of nodes in BST subtree
+   isBST: boolean; // Whether this subtree is a valid BST
+ }
+
+ export function largestBSTSubtree(root: TreeNode | null): number {
+   let maxSize = 0;
+
+   function postorder(node: TreeNode | null): SubtreeInfo {
+     if (!node) {
+       return { min: Infinity, max: -Infinity, size: 0, isBST: true };
+     }
+
+     const left = postorder(node.left);
+     const right = postorder(node.right);
+
+     if (left.isBST && right.isBST &&
+         node.val > left.max && node.val < right.min) {
+       const size = left.size + right.size + 1;
+       maxSize = Math.max(maxSize, size);
+       return {
+         min: Math.min(node.val, left.min),
+         max: Math.max(node.val, right.max),
+         size,
+         isBST: true,
+       };
+     }
+
+     return { min: 0, max: 0, size: 0, isBST: false };
+   }
+
+   postorder(root);
+   return maxSize;
+ }
```

## Visual Walkthrough

Consider this tree:
```
       10
      /  \
     5   15
    / \    \
   1   8    7
```

**Bottom-up post-order traversal:**

1. Visit node 1 (leaf): `{ min: 1, max: 1, size: 1, isBST: true }`
2. Visit node 8 (leaf): `{ min: 8, max: 8, size: 1, isBST: true }`
3. Visit node 5: left.max=1 < 5 < right.min=8 => valid BST! `{ min: 1, max: 8, size: 3, isBST: true }`, maxSize = 3
4. Visit node 7 (leaf): `{ min: 7, max: 7, size: 1, isBST: true }`
5. Visit node 15: right.min=7 < 15? NO (7 < 15, but we need 15 < right.min). Actually node.val=15 > right.min=7 fails => NOT a BST. `{ isBST: false }`
6. Visit node 10: right.isBST is false => NOT a BST. `{ isBST: false }`

Result: maxSize = 3 (the subtree rooted at node 5).

**Key insight:** The null node returns `{ min: Infinity, max: -Infinity }`. This means:
- For a leaf node, `node.val > left.max` becomes `val > -Infinity` (always true)
- And `node.val < right.min` becomes `val < Infinity` (always true)
- So every leaf is automatically a valid BST

## Complexity Comparison

| Approach | Time | Space |
|----------|------|-------|
| Top-down (buggy) | O(n^2) | O(n) stack |
| **Bottom-up (optimal)** | **O(n)** | **O(n) stack** |

## Common Variations

1. **Return the root of the largest BST subtree** instead of just the count
2. **Validate BST** (LeetCode 98) — a simpler version where you only check the full tree
3. **Largest BST in a Binary Tree** where you also need to return the subtree itself
4. **Count of BST subtrees** — count how many subtrees are valid BSTs

## Interview Follow-ups

- "Can you do this iteratively?" — Yes, with an explicit stack for post-order traversal, though it's more complex.
- "What if the tree has duplicate values?" — Adjust the BST condition to allow `<=` or `>=` as specified.
- "What is the space complexity?" — O(h) where h is the height of the tree, due to recursion stack. O(n) in the worst case (skewed tree), O(log n) for balanced trees.
- "How would you handle a very deep tree that causes stack overflow?" — Use iterative post-order traversal with an explicit stack.

## References

- [LeetCode 333 - Largest BST Subtree](https://leetcode.com/problems/largest-bst-subtree/)
- [Post-order Traversal](https://en.wikipedia.org/wiki/Tree_traversal#Post-order)
