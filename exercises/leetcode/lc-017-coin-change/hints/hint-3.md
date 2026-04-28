# Hint 3 — Implementation

```
dp = array of size (amount + 1), filled with (amount + 1)
dp[0] = 0

for i from 1 to amount:
  for each coin in coins:
    if coin <= i:
      dp[i] = min(dp[i], dp[i - coin] + 1)

return dp[amount] > amount ? -1 : dp[amount]
```

If `dp[amount]` is still greater than `amount` at the end, it means no combination of coins can make that amount.
