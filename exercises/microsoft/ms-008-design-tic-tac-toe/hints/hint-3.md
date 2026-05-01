# Hint 3: Implementation

In the `move` method:

```typescript
const add = player === 1 ? 1 : -1;

this.rows[row] += add;
this.cols[col] += add;
if (row === col) this.diag += add;
if (row + col === this.n - 1) this.antiDiag += add;
```

Then check if the current player won:

```typescript
if (
  Math.abs(this.rows[row]) === this.n ||
  Math.abs(this.cols[col]) === this.n ||
  Math.abs(this.diag) === this.n ||
  Math.abs(this.antiDiag) === this.n
) {
  return player;
}
```

You only need to check the lines affected by the current move — not all lines.
