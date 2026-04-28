# Hint 2 — Technique

Pass **min and max bounds** as parameters when recursing:
- When going left from node X, the new max bound becomes X.val
- When going right from node X, the new min bound becomes X.val
- A node is valid only if its value is strictly within (min, max)

Start with `min = -Infinity, max = Infinity` for the root.
