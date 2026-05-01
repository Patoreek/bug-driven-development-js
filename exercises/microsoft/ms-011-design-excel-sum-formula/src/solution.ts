/**
 * LeetCode 631 - Design Excel Sum Formula
 *
 * Design a simplified Excel that supports set, get, and sum operations.
 * Sum cells should automatically update when referenced cells change.
 *
 * BUG: Computes sum once at assignment time but doesn't store the formula.
 * When referenced cells change, the sum cell returns a stale value.
 */
export class Excel {
  private grid: number[][];
  private height: number;
  private width: number;

  constructor(height: number, width: string) {
    this.height = height;
    this.width = width.charCodeAt(0) - 64; // 'A'=1, 'B'=2, etc.
    this.grid = Array.from({ length: height + 1 }, () =>
      new Array(this.width + 1).fill(0)
    );
  }

  set(row: number, column: string, val: number): void {
    const col = column.charCodeAt(0) - 64;
    this.grid[row][col] = val;
  }

  get(row: number, column: string): number {
    const col = column.charCodeAt(0) - 64;
    return this.grid[row][col];
  }

  // BUG: Computes sum once but doesn't store the formula
  // When referenced cells change, this cell won't update
  sum(row: number, column: string, numbers: string[]): number {
    const col = column.charCodeAt(0) - 64;
    let total = 0;

    for (const range of numbers) {
      if (range.includes(":")) {
        const [start, end] = range.split(":");
        const startCol = start.charCodeAt(0) - 64;
        const startRow = parseInt(start.slice(1));
        const endCol = end.charCodeAt(0) - 64;
        const endRow = parseInt(end.slice(1));

        for (let r = startRow; r <= endRow; r++) {
          for (let c = startCol; c <= endCol; c++) {
            total += this.grid[r][c];
          }
        }
      } else {
        const c = range.charCodeAt(0) - 64;
        const r = parseInt(range.slice(1));
        total += this.grid[r][c];
      }
    }

    this.grid[row][col] = total; // BUG: stores computed value, not formula
    return total;
  }
}
