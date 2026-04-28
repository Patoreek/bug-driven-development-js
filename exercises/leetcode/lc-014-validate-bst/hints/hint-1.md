# Hint 1 — Approach

The BST property isn't just about a node and its immediate children. Every node in the LEFT subtree of node X must be less than X, and every node in the RIGHT subtree must be greater than X.

Think about what constraints a node inherits from all its ancestors, not just its parent. Each node has an **allowed range** of values.
