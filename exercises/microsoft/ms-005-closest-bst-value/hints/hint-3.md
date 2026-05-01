# Hint 3: Implementation

Replace the entire function body with a simple while loop:

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

- Initialize `closest` to the root's value
- Walk down the tree, updating `closest` whenever you find a nearer value
- Choose left or right based on comparing target to current node
- When you hit null, return the best you found
