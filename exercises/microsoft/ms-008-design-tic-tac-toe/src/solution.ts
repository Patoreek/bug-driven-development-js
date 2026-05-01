// BUGGY: Stores full board, checks entire board each move — O(n^2) per move
export class TicTacToe {
  private board: number[][];
  private n: number;

  constructor(n: number) {
    this.n = n;
    this.board = Array.from({ length: n }, () => new Array(n).fill(0));
  }

  move(row: number, col: number, player: number): number {
    this.board[row][col] = player;

    // Check all rows
    for (let r = 0; r < this.n; r++) {
      let win = true;
      for (let c = 0; c < this.n; c++) {
        if (this.board[r][c] !== player) {
          win = false;
          break;
        }
      }
      if (win) return player;
    }

    // Check all columns
    for (let c = 0; c < this.n; c++) {
      let win = true;
      for (let r = 0; r < this.n; r++) {
        if (this.board[r][c] !== player) {
          win = false;
          break;
        }
      }
      if (win) return player;
    }

    // Check diagonal
    let win = true;
    for (let i = 0; i < this.n; i++) {
      if (this.board[i][i] !== player) {
        win = false;
        break;
      }
    }
    if (win) return player;

    // Check anti-diagonal
    win = true;
    for (let i = 0; i < this.n; i++) {
      if (this.board[i][this.n - 1 - i] !== player) {
        win = false;
        break;
      }
    }
    if (win) return player;

    return 0;
  }
}
