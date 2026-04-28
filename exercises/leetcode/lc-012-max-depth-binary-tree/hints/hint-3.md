# Hint 3 — Implementation

The entire solution is just two lines:

```
function maxDepth(root):
  if root is null: return 0
  return 1 + max(maxDepth(root.left), maxDepth(root.right))
```

Base case: `null` has depth 0. Recursive case: this node adds 1 to whichever subtree is deeper.
