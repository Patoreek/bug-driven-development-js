# Hint 1 — Approach

Greedy fails because choosing the locally optimal coin at each step doesn't guarantee a globally optimal result. You need to consider **all possible choices** at each step.

Think about it this way: to make amount `i`, you could have arrived there by adding any coin `c` to a solution for amount `i - c`. You want the minimum across all such options.
