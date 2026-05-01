# Explanation: Design Tic-Tac-Toe

## Why the Bug Happens

The buggy implementation stores the full `n x n` board and on every `move()` call, scans the **entire board** to check for a winner. It checks:
- All `n` rows (each takes O(n) to scan) = O(n^2)
- All `n` columns (each takes O(n) to scan) = O(n^2)
- Both diagonals = O(n)

Total per move: **O(n^2)**. For a 1000x1000 board, each move examines up to 2 million cells, which is far too slow.

The key insight is that placing a piece at `(row, col)` can only affect:
- Row `row`
- Column `col`
- The main diagonal (if `row === col`)
- The anti-diagonal (if `row + col === n - 1`)

There's no need to check any other rows or columns.

## The Fix

Track running sums instead of the full board. Player 1 adds +1, Player 2 adds -1. A win is detected when any sum reaches `+n` (player 1) or `-n` (player 2).

```diff
  export class TicTacToe {
-   private board: number[][];
-   private n: number;
+   private rows: number[];
+   private cols: number[];
+   private diag: number;
+   private antiDiag: number;
+   private n: number;

    constructor(n: number) {
      this.n = n;
-     this.board = Array.from({ length: n }, () => new Array(n).fill(0));
+     this.rows = new Array(n).fill(0);
+     this.cols = new Array(n).fill(0);
+     this.diag = 0;
+     this.antiDiag = 0;
    }

    move(row: number, col: number, player: number): number {
-     this.board[row][col] = player;
-     // ... scan all rows, columns, diagonals ...
+     const add = player === 1 ? 1 : -1;
+
+     this.rows[row] += add;
+     this.cols[col] += add;
+     if (row === col) this.diag += add;
+     if (row + col === this.n - 1) this.antiDiag += add;
+
+     if (
+       Math.abs(this.rows[row]) === this.n ||
+       Math.abs(this.cols[col]) === this.n ||
+       Math.abs(this.diag) === this.n ||
+       Math.abs(this.antiDiag) === this.n
+     ) {
+       return player;
+     }
+
+     return 0;
    }
  }
```

## Visual Walkthrough

3x3 board, player 1 fills row 0:

```
Move 1: player 1 at (0,0)     Move 2: player 2 at (1,0)
rows: [1, 0, 0]               rows: [1, -1, 0]
cols: [1, 0, 0]               cols: [0, 0, 0]
diag: 1, antiDiag: 0          diag: 1, antiDiag: 0

Move 3: player 1 at (0,1)     Move 4: player 2 at (1,1)
rows: [2, -1, 0]              rows: [2, -2, 0]
cols: [0, 1, 0]               cols: [0, 0, 0]
diag: 1, antiDiag: 0          diag: 0, antiDiag: 0

Move 5: player 1 at (0,2)
rows: [3, -2, 0]  <-- rows[0] == 3 == n --> Player 1 wins!
```

**Why +1/-1 works:** Since moves are guaranteed valid (no overwriting), the sum for any line can only increase toward +n (all player 1) or -n (all player 2). Mixed placement cancels out, keeping the absolute value below n.

## Complexity Comparison

| Approach | Time (per move) | Space |
|----------|----------------|-------|
| Full board scan (buggy) | O(n^2) | O(n^2) |
| **Sum tracking (optimal)** | **O(1)** | **O(n)** |

## Common Variations

1. **Support undo:** Track moves in a list. On undo, subtract the corresponding +1/-1.
2. **Detect draw:** Track total moves. If moves == n*n and no winner, it's a draw.
3. **Generalize to k-in-a-row:** Much harder — requires sliding window or different approach.
4. **N-dimensional Tic-Tac-Toe:** Same principle extends with more diagonal tracking.

## Interview Follow-ups

- "How would you support more than 2 players?" — Use separate sum arrays per player instead of +1/-1. Check if any player's sum reaches n.
- "How would you detect a draw?" — Keep a move counter. If it reaches n^2 with no winner, return draw.
- "What if moves are not guaranteed valid?" — Add the board back for validation, but still use sums for O(1) win detection.
- "Can you make space O(1)?" — Not really, since you need to track n rows and n columns at minimum.

## References

- [LeetCode 348 - Design Tic-Tac-Toe](https://leetcode.com/problems/design-tic-tac-toe/)
