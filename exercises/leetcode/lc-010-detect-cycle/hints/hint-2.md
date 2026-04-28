# Hint 2 — Algorithm

Use **two pointers** starting at the head:

- **Slow pointer** (tortoise): moves **1 step** at a time
- **Fast pointer** (hare): moves **2 steps** at a time

In each iteration:
- If `fast` reaches `null` or `fast.next` is `null`, there is no cycle
- If `slow === fast`, a cycle exists (they've met inside the cycle)

The fast pointer closes the gap by 1 node each iteration, so if there's a cycle of length `C`, they'll meet within at most `C` iterations after the slow pointer enters the cycle.
