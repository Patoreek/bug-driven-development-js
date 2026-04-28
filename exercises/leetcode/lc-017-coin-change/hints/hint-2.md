# Hint 2 — Data Structure

Create a DP array where `dp[i]` = minimum coins to make amount `i`.

- Base case: `dp[0] = 0` (zero coins for zero amount)
- For each amount from 1 to target, try each coin denomination
- Initialize `dp[i]` to a large value (e.g., `amount + 1`) to represent "impossible"
