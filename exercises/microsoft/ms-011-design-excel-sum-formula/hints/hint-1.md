# Hint 1: What's missing

The current implementation computes the sum and stores the numeric result in the grid. But it throws away the information about **which cells** were summed.

Think about what happens when you call `set()` on a cell that was referenced in a `sum()` call. The sum cell has no way to know it needs to update because it only stored the final number, not the formula.

What additional data structure would you need to "remember" the formula?
