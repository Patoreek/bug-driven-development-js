# Hint 3: Re-evaluation approach

Create a private `evaluate(ranges: string[]): number` method that iterates through ranges and sums values. The critical detail: when evaluating a cell, check if **that cell** also has a formula. If it does, recursively evaluate it instead of reading the grid.

```typescript
private evaluate(ranges: string[]): number {
  let total = 0;
  for (const range of ranges) {
    // ... parse range ...
    for (each cell (r, c) in range) {
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
```

Then in `get()`: if the cell has a formula, call `this.evaluate(formula)` instead of returning `this.grid[row][col]`.
