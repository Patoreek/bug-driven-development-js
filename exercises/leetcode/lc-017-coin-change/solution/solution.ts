/**
 * Coin Change — Optimal Solution
 *
 * Bottom-up DP: O(amount * coins.length) time, O(amount) space.
 *
 * dp[i] = minimum number of coins to make amount i.
 * For each amount from 1 to target, try every coin denomination.
 * If coin <= i, then dp[i] = min(dp[i], dp[i - coin] + 1).
 */

export function coinChange(coins: number[], amount: number): number {
  // dp[i] = min coins to make amount i
  // Initialize with amount + 1 (impossible value, acts as infinity)
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
}
