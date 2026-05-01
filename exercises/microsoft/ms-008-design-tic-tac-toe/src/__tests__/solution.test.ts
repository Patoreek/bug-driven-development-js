import { describe, it, expect } from "vitest";
import { TicTacToe } from "../solution";

describe("TicTacToe", () => {
  it("should detect a row win for player 1 on 3x3 board", () => {
    const game = new TicTacToe(3);
    expect(game.move(0, 0, 1)).toBe(0); // Player 1 at (0,0)
    expect(game.move(1, 0, 2)).toBe(0); // Player 2 at (1,0)
    expect(game.move(0, 1, 1)).toBe(0); // Player 1 at (0,1)
    expect(game.move(1, 1, 2)).toBe(0); // Player 2 at (1,1)
    expect(game.move(0, 2, 1)).toBe(1); // Player 1 completes row 0
  });

  it("should detect a column win for player 2", () => {
    const game = new TicTacToe(3);
    expect(game.move(0, 0, 1)).toBe(0);
    expect(game.move(0, 1, 2)).toBe(0);
    expect(game.move(1, 0, 1)).toBe(0);
    expect(game.move(1, 1, 2)).toBe(0);
    expect(game.move(2, 2, 1)).toBe(0);
    expect(game.move(2, 1, 2)).toBe(2); // Player 2 completes column 1
  });

  it("should detect a diagonal win", () => {
    const game = new TicTacToe(3);
    expect(game.move(0, 0, 1)).toBe(0);
    expect(game.move(0, 1, 2)).toBe(0);
    expect(game.move(1, 1, 1)).toBe(0);
    expect(game.move(0, 2, 2)).toBe(0);
    expect(game.move(2, 2, 1)).toBe(1); // Player 1 completes main diagonal
  });

  it("should detect an anti-diagonal win", () => {
    const game = new TicTacToe(3);
    expect(game.move(0, 2, 1)).toBe(0);
    expect(game.move(0, 0, 2)).toBe(0);
    expect(game.move(1, 1, 1)).toBe(0);
    expect(game.move(1, 0, 2)).toBe(0);
    expect(game.move(2, 0, 1)).toBe(1); // Player 1 completes anti-diagonal
  });

  it("should return 0 when no winner yet", () => {
    const game = new TicTacToe(3);
    expect(game.move(0, 0, 1)).toBe(0);
    expect(game.move(0, 1, 2)).toBe(0);
    expect(game.move(1, 0, 2)).toBe(0);
    expect(game.move(1, 1, 1)).toBe(0);
  });

  it("should handle player 2 winning", () => {
    const game = new TicTacToe(3);
    expect(game.move(0, 0, 1)).toBe(0);
    expect(game.move(1, 0, 2)).toBe(0);
    expect(game.move(0, 1, 1)).toBe(0);
    expect(game.move(1, 1, 2)).toBe(0);
    expect(game.move(2, 2, 1)).toBe(0);
    expect(game.move(1, 2, 2)).toBe(2); // Player 2 completes row 1
  });

  it("should work with a larger 5x5 board", () => {
    const game = new TicTacToe(5);
    // Player 1 fills column 0
    expect(game.move(0, 0, 1)).toBe(0);
    expect(game.move(0, 1, 2)).toBe(0);
    expect(game.move(1, 0, 1)).toBe(0);
    expect(game.move(1, 1, 2)).toBe(0);
    expect(game.move(2, 0, 1)).toBe(0);
    expect(game.move(2, 1, 2)).toBe(0);
    expect(game.move(3, 0, 1)).toBe(0);
    expect(game.move(3, 1, 2)).toBe(0);
    expect(game.move(4, 0, 1)).toBe(1); // Player 1 completes column 0
  });

  it("should detect win on last possible move", () => {
    // 3x3 board, fill almost everything, win on the last move
    const game = new TicTacToe(3);
    // Fill board so player 1 wins with the last cell of row 2
    expect(game.move(0, 0, 1)).toBe(0);
    expect(game.move(1, 0, 2)).toBe(0);
    expect(game.move(0, 1, 1)).toBe(0);
    expect(game.move(1, 1, 2)).toBe(0);
    expect(game.move(2, 1, 1)).toBe(0);
    expect(game.move(2, 2, 2)).toBe(0);
    expect(game.move(0, 2, 1)).toBe(1); // Player 1 completes row 0
  });

  it("should detect early win", () => {
    const game = new TicTacToe(3);
    expect(game.move(0, 0, 1)).toBe(0);
    expect(game.move(1, 2, 2)).toBe(0);
    expect(game.move(1, 1, 1)).toBe(0);
    expect(game.move(2, 1, 2)).toBe(0);
    expect(game.move(2, 2, 1)).toBe(1); // Player 1 completes main diagonal
  });

  it("should handle performance on a large board (performance test)", () => {
    // Use a moderately large board where the O(n^2) scan per move is measurable.
    // Make many moves on a single game to accumulate the overhead.
    // Strategy: n=300, fill most of the board. Player 1 fills all cells in each row
    // except the last one (which player 2 takes). This means:
    // - No row win (each row has 299 player-1 and 1 player-2)
    // - No column win (last column is all player-2 but col 0..298 are mixed)
    //   Actually col 0..298 are all player 1 across all rows — that would be a win!
    //   We need to prevent column wins too. Alternate the player-2 cell position.
    //
    // Better: player 2 takes cell (r, r % n) in each row. This spreads player-2
    // cells across different columns, preventing both row and column wins.
    // Each row has n-1 player-1 cells, so scanning a row for player-1 win
    // takes O(n) before hitting the mismatch.
    const n = 300;
    const game = new TicTacToe(n);
    let moveCount = 0;

    const start = performance.now();

    for (let r = 0; r < n; r++) {
      // Player 2 takes position (r, r % n) — the diagonal cell
      const p2col = r % n;
      game.move(r, p2col, 2);
      moveCount++;

      // Player 1 takes all other positions in this row
      for (let c = 0; c < n; c++) {
        if (c === p2col) continue;
        const result = game.move(r, c, 1);
        moveCount++;
        // No win should happen since each row has one player-2 cell
        // and each column gets at most n-1 player-1 cells
        // (the diagonal column gets 0 player-1 cells for that row)
      }
    }

    const elapsed = performance.now() - start;

    // Total moves: n * n = 90,000
    // Buggy: each move scans all n rows (each ~n cells) + all n columns + diagonals
    //        = O(n^2) per move * n^2 moves = O(n^4) total
    // Optimal: O(1) per move * n^2 moves = O(n^2) total
    //
    // But with early-break, many rows break early. The real bottleneck is that
    // every move checks ALL n rows and ALL n columns, even if breaks happen fast.
    // For n=300, that's 300 rows + 300 columns = 600 checks per move,
    // each scanning at least a few cells. With 90k moves, that's ~54M+ checks.
    expect(elapsed).toBeLessThan(500);
  });
});
