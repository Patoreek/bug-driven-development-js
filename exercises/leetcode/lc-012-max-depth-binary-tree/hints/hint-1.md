# Hint 1 — Approach

The bug is about *what* gets counted. Look at where `depth++` is called in the BFS loop. Is it counting levels or nodes?

There's a much simpler approach than BFS for this problem. Think recursively: the depth of a tree is related to the depth of its subtrees.
