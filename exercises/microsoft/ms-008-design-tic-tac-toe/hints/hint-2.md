# Hint 2: Technique

Instead of storing the full board, maintain **running sums**:
- An array `rows[n]` tracking the sum for each row
- An array `cols[n]` tracking the sum for each column
- A single number `diag` for the main diagonal
- A single number `antiDiag` for the anti-diagonal

Use **+1** for player 1 and **-1** for player 2. Since moves never overlap, a line is completely filled by one player when its sum reaches `+n` or `-n`.
