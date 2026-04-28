# Explanation — Maximum Depth of Binary Tree

## Why the Buggy Solution is Wrong

The BFS implementation has `depth++` inside the inner for-loop that processes individual nodes:

```typescript
for (let i = 0; i < levelSize; i++) {
  const node = queue.shift()!;
  depth++;  // BUG: increments per NODE, not per LEVEL
  // ...
}
```

For a tree like `[3, 9, 20, null, null, 15, 7]` with 5 nodes at 3 levels, this returns 5 instead of 3.

To fix the BFS, move `depth++` outside the inner loop (increment once per level). But there's an even cleaner approach.

## The Optimal Solution

```typescript
// Before (buggy BFS):
const queue: TreeNode[] = [root];
let depth = 0;
while (queue.length > 0) {
  const levelSize = queue.length;
  for (let i = 0; i < levelSize; i++) {
    const node = queue.shift()!;
    depth++;  // wrong — counts nodes
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}
return depth;

// After (DFS recursion):
function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

## Visual Walkthrough

```
        3          maxDepth(3)
       / \         = 1 + max(maxDepth(9), maxDepth(20))
      9  20        = 1 + max(1, 2)
        /  \       = 3
       15   7

maxDepth(9)  = 1 + max(0, 0) = 1
maxDepth(20) = 1 + max(maxDepth(15), maxDepth(7))
             = 1 + max(1, 1)
             = 2
maxDepth(15) = 1 + max(0, 0) = 1
maxDepth(7)  = 1 + max(0, 0) = 1
```

## Complexity Comparison

| Approach | Time | Space |
|----------|------|-------|
| Buggy BFS | O(n) (wrong result) | O(n) queue |
| Fixed BFS | O(n) | O(n) queue |
| **DFS recursion** | **O(n)** | **O(h)** call stack |

Where `h` is the height of the tree. In the worst case (skewed tree), h = n. In the best case (balanced tree), h = log(n).

## Common Variations

- **Minimum depth of binary tree** — similar recursion but must handle the case where one subtree is null (LeetCode 111)
- **Balanced binary tree check** — compare left/right depths at every node (LeetCode 110)
- **Diameter of binary tree** — track max path through each node as left_depth + right_depth (LeetCode 543)

## Interview Follow-ups

- "Can you do this iteratively?" — Yes, BFS with level-by-level processing (increment depth once per level, not per node)
- "What's the space complexity of the recursive approach?" — O(h) for the call stack, where h is the tree height
- "What if the tree is very deep?" — Iterative BFS avoids stack overflow risks
