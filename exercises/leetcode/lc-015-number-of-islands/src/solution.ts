/**
 * Number of Islands — Optimal Solution
 *
 * DFS flood fill: O(m*n) time, O(m*n) space worst case (call stack).
 *
 * For each unvisited land cell, increment count and flood-fill to mark
 * all connected land cells as visited (by setting them to '0').
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
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;
  if (grid[r][c] !== "1") return;

  grid[r][c] = "0"; // mark as visited

  dfs(grid, r + 1, c, rows, cols);
  dfs(grid, r - 1, c, rows, cols);
  dfs(grid, r, c + 1, rows, cols);
  dfs(grid, r, c - 1, rows, cols);
}
