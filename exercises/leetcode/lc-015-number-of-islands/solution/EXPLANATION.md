# Explanation — Number of Islands

## Why the Buggy Solution is Wrong

The buggy code has two problems:

1. **No visited marking**: `grid[r][c] = "0"` is missing, so cells are never marked as visited
2. **Recursive calls commented out**: To prevent infinite recursion (which would happen without marking), the DFS doesn't actually explore neighbors

The result: every single `'1'` cell is counted as a separate island.

```typescript
// Bug: Missing this crucial line
// grid[r][c] = "0";  // mark as visited

// Bug: These calls are commented out
// dfs(grid, r + 1, c, rows, cols);
// dfs(grid, r - 1, c, rows, cols);
// dfs(grid, r, c + 1, rows, cols);
// dfs(grid, r, c - 1, rows, cols);
```

## The Optimal Solution

```typescript
// Before (broken DFS):
function dfs(grid, r, c, rows, cols) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;
  if (grid[r][c] !== "1") return;
  // nothing happens — cell not marked, neighbors not explored
}

// After (working flood fill):
function dfs(grid, r, c, rows, cols) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;
  if (grid[r][c] !== "1") return;

  grid[r][c] = "0";  // mark as visited (sink the land)

  dfs(grid, r + 1, c, rows, cols);  // down
  dfs(grid, r - 1, c, rows, cols);  // up
  dfs(grid, r, c + 1, rows, cols);  // right
  dfs(grid, r, c - 1, rows, cols);  // left
}
```

## Visual Walkthrough

```
Grid:
1 1 0
1 0 0
0 0 1

Step 1: Find (0,0)='1', count=1, flood fill:
  Mark (0,0)='0', explore neighbors
  Mark (0,1)='0', explore neighbors
  Mark (1,0)='0', explore neighbors
  All other neighbors are '0' or out of bounds

Grid after flood fill:
0 0 0
0 0 0
0 0 1

Step 2: Continue scan... (0,1), (0,2), (1,0), (1,1), (1,2), (2,0), (2,1) all '0'

Step 3: Find (2,2)='1', count=2, flood fill:
  Mark (2,2)='0'

Result: 2 islands
```

## Complexity

| Approach | Time | Space | Correctness |
|----------|------|-------|-------------|
| Count all '1' cells | O(m*n) | O(1) | WRONG |
| **DFS flood fill** | **O(m*n)** | **O(m*n)** stack | **Correct** |

Each cell is visited at most twice (once in the scan, once in DFS), so time is O(m*n). Space is O(m*n) in the worst case for the call stack (a grid that's all land in a snake pattern).

## Common Variations

- **Max area of island** — track size during flood fill (LeetCode 695)
- **Surrounded regions** — flood fill from borders (LeetCode 130)
- **Number of distinct islands** — hash the shape of each island (LeetCode 694)
- **Pacific Atlantic water flow** — flood fill from both ocean borders (LeetCode 417)

## Interview Follow-ups

- "Can you do this without modifying the grid?" — Use a separate `visited` set, or restore cells after processing
- "Can you do this with BFS instead?" — Yes, use a queue instead of recursion
- "What if the grid is very large?" — BFS uses O(min(m,n)) queue space vs O(m*n) stack for DFS; also consider Union-Find
