# Hint 3: Implementation

Define an interface for the return value:

```typescript
interface SubtreeInfo {
  min: number;
  max: number;
  size: number;
  isBST: boolean;
}
```

Base case (null node): `{ min: Infinity, max: -Infinity, size: 0, isBST: true }`

For each node:
1. Get `left` and `right` info from recursive calls
2. If `left.isBST && right.isBST && node.val > left.max && node.val < right.min`:
   - This subtree is a valid BST with size `left.size + right.size + 1`
   - Update global `maxSize`
   - Return `{ min: Math.min(node.val, left.min), max: Math.max(node.val, right.max), size, isBST: true }`
3. Otherwise return `{ ..., isBST: false }`

Track `maxSize` as a closure variable and return it at the end.
