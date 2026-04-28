# Explanation — Coin Change

## Why the Greedy Approach Fails

Greedy always picks the largest coin first:

```typescript
const sorted = [...coins].sort((a, b) => b - a);
for (const coin of sorted) {
  const numCoins = Math.floor(remaining / coin);
  count += numCoins;
  remaining -= numCoins * coin;
}
```

This works for "canonical" coin systems (like US coins: 1, 5, 10, 25) where greedy is provably optimal. But it fails for arbitrary coin sets:

```
coins = [1, 3, 4], amount = 6
Greedy: 4 → remaining=2, then 1+1 → 3 coins total
DP:     3+3 → 2 coins (skipping the "4" entirely)
```

The greedy algorithm can't "look ahead" to see that not using the largest coin leads to a better solution.

## The Optimal Solution

```typescript
// Before (greedy):
const sorted = [...coins].sort((a, b) => b - a);
let remaining = amount, count = 0;
for (const coin of sorted) {
  count += Math.floor(remaining / coin);
  remaining %= coin;
}

// After (DP):
const dp = new Array(amount + 1).fill(amount + 1);
dp[0] = 0;
for (let i = 1; i <= amount; i++) {
  for (const coin of coins) {
    if (coin <= i) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
}
return dp[amount] > amount ? -1 : dp[amount];
```

## Visual Walkthrough

```
coins = [1, 3, 4], amount = 6

dp[0] = 0
dp[1] = min(dp[0]+1) = 1                      (use coin 1)
dp[2] = min(dp[1]+1) = 2                      (use coin 1)
dp[3] = min(dp[2]+1, dp[0]+1) = 1             (use coin 3)
dp[4] = min(dp[3]+1, dp[1]+1, dp[0]+1) = 1    (use coin 4)
dp[5] = min(dp[4]+1, dp[2]+1) = 2             (use coin 1 or 3)
dp[6] = min(dp[5]+1, dp[3]+1, dp[2]+1) = 2    (use coin 3: dp[3]+1=2)

Result: dp[6] = 2 ✓  (3 + 3)
```

## Complexity Comparison

| Approach | Time | Space | Correctness |
|----------|------|-------|-------------|
| Greedy | O(n log n) | O(n) | WRONG for arbitrary coins |
| **Bottom-up DP** | **O(amount * n)** | **O(amount)** | **Always correct** |

## When Greedy Works

Greedy is optimal for coin systems where each denomination is a multiple of the next smaller one (e.g., 1, 5, 10, 25, 100). These are called **canonical coin systems**. For interview problems, always use DP unless told the coin system is canonical.

## Common Variations

- **Coin Change II** — count the number of combinations (not minimum), order doesn't matter (LeetCode 518)
- **Perfect squares** — coins are {1, 4, 9, 16, ...} (LeetCode 279)
- **Minimum cost for tickets** — variant with travel days (LeetCode 983)

## Interview Follow-ups

- "What if you want to return the actual coins, not just the count?" — Track a `parent` array alongside `dp` to reconstruct the path
- "What if each coin can only be used once?" — Use the 0/1 knapsack variant (iterate coins in outer loop, amounts in reverse)
- "When does greedy work?" — When the coin system is canonical (each coin is a multiple of the smaller ones)
