# Hint 3: Implementation

Replace the entire function body with:

```typescript
export function inorderSuccessor(root: TreeNode | null, p: TreeNode): TreeNode | null {
  let successor: TreeNode | null = null;
  let node = root;

  while (node) {
    if (p.val < node.val) {
      successor = node;  // candidate: node.val > p.val
      node = node.left;  // look for smaller candidate
    } else {
      node = node.right; // need something bigger
    }
  }

  return successor;
}
```

- Start with `successor = null`
- Every time you go left, the current node becomes the new successor candidate
- Every time you go right, you're looking for something bigger than p
- When the loop ends, `successor` holds the smallest value greater than p.val
