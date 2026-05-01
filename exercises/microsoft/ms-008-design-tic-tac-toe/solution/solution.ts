// OPTIMAL: Track row/col/diagonal sums — O(1) per move
export class TicTacToe {
  private rows: number[];
  private cols: number[];
  private diag: number;
  private antiDiag: number;
  private n: number;

  constructor(n: number) {
    this.n = n;
    this.rows = new Array(n).fill(0);
    this.cols = new Array(n).fill(0);
    this.diag = 0;
    this.antiDiag = 0;
  }

  move(row: number, col: number, player: number): number {
    const add = player === 1 ? 1 : -1;

    this.rows[row] += add;
    this.cols[col] += add;
    if (row === col) this.diag += add;
    if (row + col === this.n - 1) this.antiDiag += add;

    if (
      Math.abs(this.rows[row]) === this.n ||
      Math.abs(this.cols[col]) === this.n ||
      Math.abs(this.diag) === this.n ||
      Math.abs(this.antiDiag) === this.n
    ) {
      return player;
    }

    return 0;
  }
}
