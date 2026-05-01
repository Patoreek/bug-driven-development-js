/**
 * LeetCode 631 - Design Excel Sum Formula
 *
 * Design a simplified Excel that supports set, get, and sum operations.
 * Sum cells should automatically update when referenced cells change.
 *
 * SOLUTION: Store formulas separately and re-evaluate on get().
 */
export class Excel {
  private grid: number[][];
  private formulas: Map<string, string[]>; // "row,col" -> range strings
  private height: number;
  private width: number;

  constructor(height: number, width: string) {
    this.height = height;
    this.width = width.charCodeAt(0) - 64;
    this.grid = Array.from({ length: height + 1 }, () =>
      new Array(this.width + 1).fill(0)
    );
    this.formulas = new Map();
  }

  set(row: number, column: string, val: number): void {
    const col = column.charCodeAt(0) - 64;
    this.formulas.delete(`${row},${col}`); // Clear any formula
    this.grid[row][col] = val;
  }

  get(row: number, column: string): number {
    const col = column.charCodeAt(0) - 64;
    const key = `${row},${col}`;
    if (this.formulas.has(key)) {
      return this.evaluate(this.formulas.get(key)!);
    }
    return this.grid[row][col];
  }

  sum(row: number, column: string, numbers: string[]): number {
    const col = column.charCodeAt(0) - 64;
    const key = `${row},${col}`;
    this.formulas.set(key, numbers);
    const total = this.evaluate(numbers);
    this.grid[row][col] = total;
    return total;
  }

  private evaluate(ranges: string[]): number {
    let total = 0;
    for (const range of ranges) {
      if (range.includes(":")) {
        const [start, end] = range.split(":");
        const startCol = start.charCodeAt(0) - 64;
        const startRow = parseInt(start.slice(1));
        const endCol = end.charCodeAt(0) - 64;
        const endRow = parseInt(end.slice(1));

        for (let r = startRow; r <= endRow; r++) {
          for (let c = startCol; c <= endCol; c++) {
            const cellKey = `${r},${c}`;
            if (this.formulas.has(cellKey)) {
              total += this.evaluate(this.formulas.get(cellKey)!);
            } else {
              total += this.grid[r][c];
            }
          }
        }
      } else {
        const c = range.charCodeAt(0) - 64;
        const r = parseInt(range.slice(1));
        const cellKey = `${r},${c}`;
        if (this.formulas.has(cellKey)) {
          total += this.evaluate(this.formulas.get(cellKey)!);
        } else {
          total += this.grid[r][c];
        }
      }
    }
    return total;
  }
}
