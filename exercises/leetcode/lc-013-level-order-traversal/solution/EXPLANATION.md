# Explanation — Binary Tree Level Order Traversal

## Why the Buggy Solution is Wrong

The DFS approach visits nodes in pre-order (root, left, right) and puts everything into a single flat array:

```typescript
function dfs(node: TreeNode | null): void {
  if (node === null) return;
  flat.push(node.val);   // all nodes in one bucket
  dfs(node.left);
  dfs(node.right);
}
dfs(root);
result.push(flat);  // one giant "level"
```

For tree `[3,9,20,null,null,15,7]`, this produces `[[3,9,20,15,7]]` instead of `[[3],[9,20],[15,7]]`.

## The Optimal Solution

```typescript
// Before (buggy DFS):
const flat: number[] = [];
function dfs(node) {
  if (!node) return;
  flat.push(node.val);
  dfs(node.left);
  dfs(node.right);
}
dfs(root);
result.push(flat);

// After (BFS with level separation):
const queue: TreeNode[] = [root];
while (queue.length > 0) {
  const levelSize = queue.length;     // key: snapshot size
  const currentLevel: number[] = [];
  for (let i = 0; i < levelSize; i++) {
    const node = queue.shift()!;
    currentLevel.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  result.push(currentLevel);          // one array per level
}
```

## Visual Walkthrough

```
Tree:     3
         / \
        9  20
          /  \
         15   7

Queue states:
Start:    [3]              → Level 0: [3]
After L0: [9, 20]         → Level 1: [9, 20]
After L1: [15, 7]         → Level 2: [15, 7]
After L2: []              → Done

Result: [[3], [9, 20], [15, 7]]
```

## Why levelSize Matters

Without capturing `levelSize`, new children get mixed into the current level's processing:

```
// WRONG — no size snapshot:
while (queue.length > 0) {
  const node = queue.shift()!;
  // Children added to queue affect the loop condition
  // No way to know when one level ends and the next begins
}
```

## Complexity

| Approach | Time | Space |
|----------|------|-------|
| Buggy DFS | O(n) | O(n) — but wrong result |
| **BFS with level tracking** | **O(n)** | **O(n)** — queue holds at most one level |

The widest level in a complete binary tree has ~n/2 nodes, so worst-case space is O(n).

## Alternative: DFS with Depth Tracking

You can fix the DFS approach by passing `depth` and indexing into the result array:

```typescript
function dfs(node: TreeNode | null, depth: number): void {
  if (!node) return;
  if (result.length === depth) result.push([]);
  result[depth].push(node.val);
  dfs(node.left, depth + 1);
  dfs(node.right, depth + 1);
}
```

This also works and uses O(h) stack space instead of O(n) queue space.

## Common Variations

- **Zigzag level order** — alternate left-to-right and right-to-left per level (LeetCode 103)
- **Bottom-up level order** — reverse the result array (LeetCode 107)
- **Right side view** — take the last element of each level (LeetCode 199)
- **Average of levels** — compute mean instead of collecting values (LeetCode 637)

## Interview Follow-ups

- "Can you do this with DFS?" — Yes, pass depth parameter and index into result[depth]
- "What's the max queue size?" — At most the width of the widest level, which is n/2 for a complete tree
- "How would you do zigzag traversal?" — Alternate pushing to front vs back of each level's array
