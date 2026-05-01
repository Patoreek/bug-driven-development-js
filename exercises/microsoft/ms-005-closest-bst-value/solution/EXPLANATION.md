# Explanation: Closest BST Value

## Why the Bug Happens

The buggy code treats the BST as a generic tree -- it does a full DFS traversal, collects every value into an array, then linearly scans for the closest. This completely ignores the **BST ordering property**.

In a BST, for any node:
- Left subtree values < node value
- Right subtree values > node value

If the target is less than the current node, the closest value cannot be in the right subtree (everything there is even further away). The DFS approach wastes time visiting nodes that can never be the answer.

## The Fix

### Before (Full DFS - O(n) time, O(n) space):

```typescript
export function closestValue(root: TreeNode | null, target: number): number {
  const values: number[] = [];

  function dfs(node: TreeNode | null): void {
    if (!node) return;
    values.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }

  dfs(root);

  let closest = values[0];
  for (const val of values) {
    if (Math.abs(val - target) < Math.abs(closest - target)) {
      closest = val;
    }
  }
  return closest;
}
```

### After (BST-guided search - O(h) time, O(1) space):

```typescript
export function closestValue(root: TreeNode | null, target: number): number {
  let closest = root!.val;
  let node = root;

  while (node) {
    if (Math.abs(node.val - target) < Math.abs(closest - target)) {
      closest = node.val;
    }
    node = target < node.val ? node.left : node.right;
  }

  return closest;
}
```

## Visual Walkthrough

```
Tree:       4
           / \
          2   5
         / \
        1   3

Target: 3.7

Step 1: node=4, |4-3.7|=0.3, closest=4
        3.7 < 4 → go left

Step 2: node=2, |2-3.7|=1.7 > 0.3, closest stays 4
        3.7 > 2 → go right

Step 3: node=3, |3-3.7|=0.7 > 0.3, closest stays 4
        3.7 > 3 → go right

Step 4: node=null → done

Result: 4 ✓
```

Only 3 nodes visited instead of all 5. On a balanced tree with millions of nodes, this visits ~20 nodes instead of millions.

## Complexity Comparison

| Approach | Time | Space |
|----------|------|-------|
| Full DFS | O(n) | O(n) for array + O(h) recursion stack |
| **BST Search** | **O(h)** | **O(1)** |

Where h = O(log n) for a balanced tree, or O(n) for a skewed tree.

## Common Variations

1. **Closest K values** (LeetCode 272): Find the k values closest to the target. Requires inorder traversal + sliding window.
2. **Search in BST** (LeetCode 700): Simpler version -- find exact match instead of closest.
3. **Insert into BST** (LeetCode 701): Similar traversal pattern, but you insert instead of searching.

## Interview Follow-ups

- "What if the tree is not balanced?" -- The time complexity becomes O(n) in the worst case (skewed tree), same as DFS. But on average for random BSTs, it's O(log n).
- "What if there are ties?" -- Both approaches handle ties correctly. The iterative approach returns whichever tied value it encounters first on its path.
- "Could you solve this recursively?" -- Yes, same logic but with recursion instead of a while loop. Uses O(h) stack space instead of O(1).
- This is a common Microsoft/Amazon interview question testing BST property understanding.

## References

- [LeetCode 270 - Closest Binary Search Tree Value](https://leetcode.com/problems/closest-binary-search-tree-value/)
- [BST Property - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search-tree-data-structure/)
