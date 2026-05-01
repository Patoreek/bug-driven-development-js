# Design Tic-Tac-Toe

**ID:** `ms-008-design-tic-tac-toe`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 20 minutes
**Tags:** `design`, `array`, `matrix`
**Prerequisites:** None

---

## The Problem

Design a Tic-Tac-Toe game that is played between two players on an `n x n` board.

You may assume the following rules:
1. A move is guaranteed to be valid and is placed on an empty cell.
2. Once a winning condition is reached, no more moves are allowed.
3. A player who succeeds in placing `n` of their marks in a horizontal, vertical, or diagonal row wins the game.

Implement the `TicTacToe` class:
- `constructor(n: number)` — Initializes the object with the size of the board `n`.
- `move(row: number, col: number, player: number): number` — Indicates that the player with ID `player` (1 or 2) plays at cell `(row, col)`. Returns `0` if no winner, `1` if player 1 wins, `2` if player 2 wins.

### Examples

**Example 1:**
```
Input:
  TicTacToe(3)
  move(0, 0, 1) -> 0
  move(0, 2, 2) -> 0
  move(2, 2, 1) -> 0
  move(1, 1, 2) -> 0
  move(2, 0, 1) -> 0
  move(1, 0, 2) -> 0
  move(2, 1, 1) -> 1  (Player 1 wins: row 2 is all 1s)
```

### Constraints

- `2 <= n <= 1000`
- `1 <= player <= 2`
- `0 <= row, col < n`
- All moves are valid (on empty cells)

## What's Wrong

The current implementation stores the full `n x n` board and on each `move()` call, scans the **entire board** to check for a winner: it checks all `n` rows, all `n` columns, and both diagonals. Each check iterates over `n` cells, so each `move()` call takes **O(n^2)** time.

For a 1000x1000 board with many moves, this becomes extremely slow.

## Your Task

1. Remove the full board storage — you don't need to store the actual cell values
2. Track **running sums** for each row, each column, and both diagonals
3. Use +1 for player 1 and -1 for player 2 (or vice versa)
4. A player wins when any sum reaches `+n` or `-n`
5. Achieve **O(1)** per move

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Replace the O(n^2) board-scanning approach with O(1) sum-tracking |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Direction)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Technique)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current (per move) | O(n^2) | O(n^2) |
| **Target (per move)** | **O(1)** | **O(n)** |
