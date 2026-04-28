# Hint 3 — Implementation

```
function validate(node, min, max):
  if node is null: return true
  if node.val <= min or node.val >= max: return false
  return validate(node.left, min, node.val)
     AND validate(node.right, node.val, max)

isValidBST(root) = validate(root, -Infinity, Infinity)
```

Key: using `<=` and `>=` ensures equal values are rejected (strict BST).
