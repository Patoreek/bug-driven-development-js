# Hint 3: Complete recurrence

Replace the inner loop with:

```typescript
for (let i = 1; i <= n; i++) {
  for (let j = i - 3; j >= 1; j--) {
    dp[i] = Math.max(dp[i], dp[j] * (i - j - 1));
  }
}
```

The key insight: `j` ranges from `1` to `i - 3` (you need at least 3 keys for Ctrl-A, Ctrl-C, and one Ctrl-V). The multiplier `(i - j - 1)` accounts for the fact that the original buffer content remains on screen plus `(i - j - 2)` paste operations.

For `n = 7`: best is `j = 3` giving `dp[3] * (7-3-1) = 3 * 3 = 9`.
