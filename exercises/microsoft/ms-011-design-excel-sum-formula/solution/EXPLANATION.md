# Solution Explanation: Design Excel Sum Formula

## Why the Bug Happens

The buggy implementation treats `sum()` as a one-time computation. It evaluates the sum of the referenced cells and stores the **numeric result** in the grid, discarding the formula (the range references). This is equivalent to a spreadsheet that computes `=SUM(A1:A3)` once and then replaces it with the number `6`.

Real spreadsheets work differently: they store the formula and re-evaluate it whenever a dependency changes. The bug manifests when:

1. You call `sum(2, "A", ["A1"])` -- A2 is set to `sum(A1)` = some value
2. You call `set(1, "A", newValue)` -- A1 changes
3. You call `get(2, "A")` -- this should return the **new** sum, but the buggy version returns the stale cached value

## Before/After

**Before (buggy):**
```typescript
sum(row: number, column: string, numbers: string[]): number {
  const col = column.charCodeAt(0) - 64;
  let total = 0;
  // ... compute total from ranges ...
  this.grid[row][col] = total; // Only stores the number!
  return total;
}

get(row: number, column: string): number {
  const col = column.charCodeAt(0) - 64;
  return this.grid[row][col]; // Returns stale cached value
}
```

**After (fixed):**
```typescript
private formulas: Map<string, string[]>; // NEW: formula storage

sum(row: number, column: string, numbers: string[]): number {
  const col = column.charCodeAt(0) - 64;
  const key = `${row},${col}`;
  this.formulas.set(key, numbers); // Store the formula!
  const total = this.evaluate(numbers);
  this.grid[row][col] = total;
  return total;
}

get(row: number, column: string): number {
  const col = column.charCodeAt(0) - 64;
  const key = `${row},${col}`;
  if (this.formulas.has(key)) {
    return this.evaluate(this.formulas.get(key)!); // Re-evaluate!
  }
  return this.grid[row][col];
}

set(row: number, column: string, val: number): void {
  const col = column.charCodeAt(0) - 64;
  this.formulas.delete(`${row},${col}`); // Clear formula!
  this.grid[row][col] = val;
}
```

## Visual Walkthrough

```
Step 1: set(1, "A", 5)
  Grid: A1=5
  Formulas: (empty)

Step 2: sum(2, "A", ["A1"])
  Grid: A1=5, A2=5
  Formulas: { "2,1" -> ["A1"] }

Step 3: get(2, "A")
  Cell "2,1" has formula -> evaluate(["A1"]) -> A1=5 -> return 5 ✓

Step 4: set(1, "A", 100)
  Grid: A1=100, A2=5 (stale but doesn't matter)
  Formulas: { "2,1" -> ["A1"] }

Step 5: get(2, "A")
  BUGGY: returns grid[2][1] = 5 ✗ (stale!)
  FIXED: evaluate(["A1"]) -> A1=100 -> return 100 ✓
```

## Complexity Comparison

| Operation | Buggy | Fixed |
|-----------|-------|-------|
| `set()` | O(1) | O(1) |
| `get()` | O(1) | O(cells in formula chain) |
| `sum()` | O(cells in ranges) | O(cells in ranges) |

The tradeoff: `get()` becomes more expensive because it re-evaluates formulas, but it returns **correct** results. For a more optimized approach, you could use dirty flags or topological sort to only re-evaluate when dependencies change.

## Common Variations

1. **Circular reference detection**: What if A1 = sum(A2) and A2 = sum(A1)? The solution should detect and handle cycles.
2. **Push-based updates**: Instead of lazy re-evaluation, maintain a dependency graph and propagate changes eagerly when `set()` is called.
3. **Topological sort**: For complex dependency chains, use topological ordering to determine the correct evaluation order.

## Interview Follow-ups

- **How would you handle circular references?** Track visited cells during evaluation and throw an error if you revisit one.
- **What about performance with many chained formulas?** Use memoization with dirty flags -- mark cells dirty when dependencies change, re-evaluate only when needed.
- **How does a real spreadsheet like Excel handle this?** It builds a dependency graph and uses topological sort to determine evaluation order, with incremental updates when cells change.
