# Hint 1: Direction

The BFS approach explores every possible state `(a, b)`. For large jug capacities, this state space is enormous. Is there a mathematical shortcut that can answer "is z achievable?" without simulating every possible operation?

Think about what values the jug operations actually let you produce. The operations are essentially adding and subtracting multiples of `x` and `y`.
