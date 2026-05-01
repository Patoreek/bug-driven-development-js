/**
 * Number of Islands
 *
 * Given an m x n 2D binary grid which represents a map of '1's (land)
 * and '0's (water), return the number of islands.
 *
 * An island is surrounded by water and is formed by connecting adjacent
 * lands horizontally or vertically. You may assume all four edges of
 * the grid are surrounded by water.
 *
 * Current approach: Counts every land cell as a separate island.
 * It attempts DFS but doesn't mark visited cells, so connected land
 * cells are counted multiple times.
 *
 * Target: DFS flood fill from each unvisited land cell, mark visited in-place.
 */

export function numIslands(grid: string[][]): number {
  if (grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        // Bug: DFS doesn't mark cells as visited
        // This means connected land cells each get counted as separate islands
        dfs(grid, r, c, rows, cols);
      }
    }
  }

  return count;
}

function dfs(
  grid: string[][],
  r: number,
  c: number,
  rows: number,
  cols: number
): void {
  // Bounds check and water check
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;
  if (grid[r][c] !== "1") return;

  // Bug: Missing the crucial line:
  //   grid[r][c] = "0";  // mark as visited
  // Without this, the same cell is visited infinitely (stack overflow)
  // or counted multiple times

  // The recursion is also commented out to prevent infinite recursion
  // since cells are never marked visited
  // dfs(grid, r + 1, c, rows, cols);
  // dfs(grid, r - 1, c, rows, cols);
  // dfs(grid, r, c + 1, rows, cols);
  // dfs(grid, r, c - 1, rows, cols);
}
