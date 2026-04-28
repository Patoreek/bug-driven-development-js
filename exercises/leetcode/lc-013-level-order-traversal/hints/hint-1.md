# Hint 1 — Approach

DFS naturally processes nodes depth-first, which makes it tricky to group by level. There's a traversal strategy designed specifically for level-by-level processing.

Think about what **BFS (Breadth-First Search)** gives you: it visits nodes level by level, left to right. That's exactly the order you need.
