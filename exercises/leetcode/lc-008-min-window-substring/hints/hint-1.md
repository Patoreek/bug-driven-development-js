# Hint 1 — Approach

Use a **sliding window** with two pointers (`left` and `right`). The idea is:

1. **Expand**: move `right` to include more characters until the window contains all characters of `t`
2. **Contract**: move `left` to shrink the window while it still contains all characters of `t`
3. Track the minimum valid window seen

This avoids recounting characters from scratch for every substring.
