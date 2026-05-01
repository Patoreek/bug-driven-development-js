# Explanation: Inorder Successor in BST

## Why the Bug Happens

The buggy code performs a **full inorder traversal**, collecting every node into a sorted array, then linearly searches for the target to find the next element. This is O(n) time and O(n) space.

The key insight it misses: finding the inorder successor in a BST is equivalent to finding the **smallest value greater than p.val**. The BST property lets you do this by walking from the root, making left/right decisions, without visiting every node.

## The Fix

### Before (Full inorder traversal - O(n) time, O(n) space):

```typescript
export function inorderSuccessor(root: TreeNode | null, p: TreeNode): TreeNode | null {
  const sorted: TreeNode[] = [];

  function inorder(node: TreeNode | null): void {
    if (!node) return;
    inorder(node.left);
    sorted.push(node);
    inorder(node.right);
  }

  inorder(root);

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].val === p.val && i + 1 < sorted.length) {
      return sorted[i + 1];
    }
  }
  return null;
}
```

### After (BST property search - O(h) time, O(1) space):

```typescript
export function inorderSuccessor(root: TreeNode | null, p: TreeNode): TreeNode | null {
  let successor: TreeNode | null = null;
  let node = root;

  while (node) {
    if (p.val < node.val) {
      successor = node;
      node = node.left;
    } else {
      node = node.right;
    }
  }

  return successor;
}
```

## Visual Walkthrough

```
Tree:       20
           /  \
          9    25
         / \
        5   12
           / \
          11  14

Find successor of p=9 (answer should be 11)

Step 1: node=20, p.val(9) < 20 → successor=20, go left
Step 2: node=9,  p.val(9) >= 9 → go right
Step 3: node=12, p.val(9) < 12 → successor=12, go left
Step 4: node=11, p.val(9) < 11 → successor=11, go left
Step 5: node=null → done

Result: 11 ✓ (the smallest value > 9)
```

The algorithm narrows down candidates:
- First candidate: 20 (too large, but valid)
- Better candidate: 12 (closer to 9)
- Best candidate: 11 (the actual successor)

## Why This Works

The inorder successor is the smallest value greater than p.val. Walking the BST:

1. **When p.val < node.val**: This node's value is greater than p, so it's a successor candidate. But there might be a smaller valid value in the left subtree, so record this node and go left.

2. **When p.val >= node.val**: This node is too small (or equal), so the successor must be in the right subtree. Go right without updating the successor.

This is analogous to binary search for "first element greater than X" in a sorted array.

## Complexity Comparison

| Approach | Time | Space |
|----------|------|-------|
| Full inorder | O(n) | O(n) array + O(h) stack |
| **BST search** | **O(h)** | **O(1)** |

Where h = O(log n) for balanced trees.

## Common Variations

1. **Inorder predecessor**: Same logic but mirrored -- track the last node where you went right (p.val > node.val means this node is a predecessor candidate, go right; otherwise go left).
2. **With parent pointers**: If nodes have parent pointers, you can find the successor by going up from p until you find an ancestor that is a left child.
3. **Delete node in BST** (LeetCode 450): Uses inorder successor to replace the deleted node.

## Interview Follow-ups

- "What if the node has a right subtree?" -- The successor is the leftmost node in the right subtree. The BST search approach handles this implicitly.
- "What if there are duplicate values?" -- The problem guarantees unique values, but if duplicates existed, you'd need to handle `p.val == node.val` differently.
- "Can you find both predecessor and successor in one pass?" -- Yes, maintain two variables and update them based on the comparison.
- This is a classic Microsoft/Facebook interview question that tests deep BST understanding beyond simple traversal.

## References

- [LeetCode 285 - Inorder Successor in BST](https://leetcode.com/problems/inorder-successor-in-bst/)
- [BST Inorder Traversal - Wikipedia](https://en.wikipedia.org/wiki/Tree_traversal#In-order)
