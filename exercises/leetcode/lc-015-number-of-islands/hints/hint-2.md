# Hint 2 — Technique

Use **DFS** (or BFS) to traverse all connected land cells starting from the cell you found. The key step most people miss:

**Mark each visited land cell as water (`'0'`)** so it won't be counted again. This is the "visited" mechanism — you modify the grid in-place instead of maintaining a separate visited set.
