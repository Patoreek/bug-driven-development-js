# Hint 2 — Data Structure

Use a **2D DP table** where `dp[i][j]` represents the LCS length for `text1[0..i-1]` and `text2[0..j-1]`.

Create a table of size `(n+1) x (m+1)`, initialized to 0. The extra row and column handle the base case (empty prefix) automatically.

The recurrence:
- If characters match: `dp[i][j] = dp[i-1][j-1] + 1`
- If they don't: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`
