# Hint 3 — Implementation

Fix the `dfs` function:

```
function dfs(grid, r, c, rows, cols):
  if r < 0 or r >= rows or c < 0 or c >= cols: return
  if grid[r][c] !== '1': return

  grid[r][c] = '0'          // ← THIS LINE IS MISSING — mark as visited

  dfs(grid, r + 1, c, ...)  // down
  dfs(grid, r - 1, c, ...)  // up
  dfs(grid, r, c + 1, ...)  // right
  dfs(grid, r, c - 1, ...)  // left
```

Without the marking line, the DFS either recurses infinitely or doesn't explore at all. The recursive calls must also be uncommented.
