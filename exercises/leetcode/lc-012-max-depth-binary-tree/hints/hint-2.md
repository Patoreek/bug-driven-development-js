# Hint 2 — Technique

Use **DFS recursion**. The maximum depth of a tree rooted at `node` is:
- 0 if `node` is null
- Otherwise: 1 + the maximum depth among its children

What's the relationship between a node's depth and the depths of its left and right subtrees?
