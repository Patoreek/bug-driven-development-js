# Hint 1 — Approach

The brute force starts fresh from each position, which is wasteful. When you find a duplicate at position `j` while scanning from `i`, you don't need to restart from `i+1` — you can skip directly.

Think about maintaining a **window** of unique characters that you expand and shrink as you move through the string. This is called the **sliding window** technique.
