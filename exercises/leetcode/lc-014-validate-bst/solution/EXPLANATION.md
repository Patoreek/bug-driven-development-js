# Explanation — Validate Binary Search Tree

## Why the Buggy Solution is Wrong

The buggy code only checks immediate children:

```typescript
if (root.left !== null && root.left.val >= root.val) return false;
if (root.right !== null && root.right.val <= root.val) return false;
return isValidBST(root.left) && isValidBST(root.right);
```

This misses the **global BST invariant**. Consider:

```
        5
       / \
      3   8
     / \
    1   6     ← 6 passes local check (6 > 3), but fails global (6 > 5)
```

Node 6 is in the LEFT subtree of 5, so it must be `< 5`. The local check only verifies `6 > 3` (its parent), which passes. The global constraint from ancestor 5 is lost.

## The Optimal Solution

```typescript
// Before (only checks parent):
if (root.left !== null && root.left.val >= root.val) return false;
if (root.right !== null && root.right.val <= root.val) return false;
return isValidBST(root.left) && isValidBST(root.right);

// After (passes min/max bounds):
function validate(node: TreeNode | null, min: number, max: number): boolean {
  if (node === null) return true;
  if (node.val <= min || node.val >= max) return false;
  return validate(node.left, min, node.val)
      && validate(node.right, node.val, max);
}
return validate(root, -Infinity, Infinity);
```

## Visual Walkthrough

```
Tree:     5
         / \
        3   8
       / \
      1   6

validate(5, -Inf, Inf)     → 5 is in (-Inf, Inf) ✓
  validate(3, -Inf, 5)     → 3 is in (-Inf, 5) ✓
    validate(1, -Inf, 3)   → 1 is in (-Inf, 3) ✓
    validate(6, 3, 5)      → 6 is NOT in (3, 5) ✗ → return false
```

The bound `max=5` propagated down from the root catches the violation.

## Complexity

| Approach | Time | Space | Correctness |
|----------|------|-------|-------------|
| Local check only | O(n) | O(h) | WRONG |
| **Min/max bounds** | **O(n)** | **O(h)** | **Correct** |

## Alternative: In-Order Traversal

A BST's in-order traversal produces a strictly increasing sequence. You can validate by checking that each visited node is greater than the previous:

```typescript
let prev = -Infinity;
function inorder(node: TreeNode | null): boolean {
  if (!node) return true;
  if (!inorder(node.left)) return false;
  if (node.val <= prev) return false;
  prev = node.val;
  return inorder(node.right);
}
```

## Common Variations

- **Convert sorted array to BST** — the reverse problem (LeetCode 108)
- **Recover BST** — find and swap two nodes that violate the property (LeetCode 99)
- **Kth smallest in BST** — uses in-order traversal (LeetCode 230)

## Interview Follow-ups

- "What about equal values?" — Depends on the BST definition. Strict BSTs don't allow equals; some allow duplicates on one side.
- "Can you do this iteratively?" — Yes, use an explicit stack for in-order traversal
- "What if node values can be Number.MIN_SAFE_INTEGER or MAX_SAFE_INTEGER?" — Use `-Infinity`/`Infinity` for bounds, or use `null` to represent unbounded
