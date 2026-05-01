# Hint 1: Direction

When a player places a piece at `(row, col)`, the only lines that could become a winning line are:
- Row `row`
- Column `col`
- The main diagonal (if `row === col`)
- The anti-diagonal (if `row + col === n - 1`)

You don't need to check any other rows or columns. Can you track just enough information about these four lines to detect a win instantly?
