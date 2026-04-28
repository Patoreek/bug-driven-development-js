# Hint 1 — Approach

The recursive solution recalculates the same values over and over. For `climbStairs(5)`, it calculates `climbStairs(3)` multiple times.

This is a classic case of **overlapping subproblems** — the hallmark of a problem solvable with dynamic programming. Can you store results you've already computed?
