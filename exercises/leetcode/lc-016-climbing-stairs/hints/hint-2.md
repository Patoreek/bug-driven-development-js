# Hint 2 — Technique

Notice the recurrence: `ways(n) = ways(n-1) + ways(n-2)`. This is the **Fibonacci sequence**.

You can solve it bottom-up: start from `ways(0) = 1, ways(1) = 1` and build up to `ways(n)`. Since each step only depends on the previous two values, you don't need an array — just two variables.
