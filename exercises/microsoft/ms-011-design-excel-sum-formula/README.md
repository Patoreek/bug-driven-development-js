# Design Excel Sum Formula

**ID:** `ms-011-design-excel-sum-formula`
**Difficulty:** ★★★★★
**Estimated Time:** 40 minutes
**Tags:** `design`, `graph`, `topological-sort`, `spreadsheet`
**Prerequisites:** None

---

## The Problem

Design a simplified Excel that supports three operations:

1. **`set(row, column, val)`** -- Set the value of a cell to `val`.
2. **`get(row, column)`** -- Get the current value of a cell.
3. **`sum(row, column, ranges)`** -- Set a cell to be the sum of cells in the given ranges. Returns the computed sum. This cell should automatically update when any referenced cell changes.

Ranges are strings like `"A1"` (single cell) or `"A1:B2"` (rectangle of cells).

The constructor takes `height` (number of rows) and `width` (a character like `'C'` meaning columns A through C).

### Examples

```
Excel excel = new Excel(3, "C");
excel.set(1, "A", 2);        // A1 = 2
excel.sum(3, "C", ["A1", "A1:B2"]);  // C3 = sum of A1 + rectangle A1:B2
excel.get(3, "C");            // returns some value
excel.set(2, "A", 5);        // change A2 to 5
excel.get(3, "C");            // C3 should reflect the change to A2!
```

### Constraints

- `1 <= height <= 26`
- `'A' <= width <= 'Z'`
- `1 <= row <= height`
- `'A' <= column <= width`
- Ranges are valid cell references

## What's Wrong

The buggy version computes the sum at the time `sum()` is called and stores only the **numeric result**. It does not store the formula (the range references). When a referenced cell is later changed via `set()`, the sum cell still holds the stale cached value and does not update.

This is a classic "eager evaluation without dependency tracking" bug -- the kind of thing that causes real spreadsheet implementations to break.

## Your Task

1. Add a data structure to store formulas (the range references) for cells that are defined by `sum()`
2. When `get()` is called on a cell with a formula, re-evaluate the formula instead of returning the cached value
3. When `set()` is called on a cell, clear any formula that cell might have had
4. Handle chained formulas (a formula cell that references another formula cell)

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Add formula storage and re-evaluation logic |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (What's missing)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Storage strategy)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Re-evaluation approach)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current (buggy) | O(r*c) per sum, O(1) per get | O(r*c) |
| **Target** | **O(r*c) per get (with formulas)** | **O(r*c + f)** where f = formulas |
