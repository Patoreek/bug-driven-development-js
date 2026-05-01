/**
 * Coin Change
 *
 * You are given an integer array `coins` representing coins of different
 * denominations and an integer `amount` representing a total amount of money.
 * Return the fewest number of coins needed to make up that amount.
 * If that amount cannot be made up, return -1.
 *
 * You may assume that you have an infinite number of each kind of coin.
 *
 * Current approach: Greedy — always picks the largest coin first.
 * This fails for certain coin sets (e.g., coins=[1,3,4], amount=6:
 * greedy picks 4+1+1=3 coins, but optimal is 3+3=2 coins).
 *
 * Target: DP bottom-up — dp[i] = min coins to make amount i.
 */

export function coinChange(coins: number[], amount: number): number {
  if (amount === 0) return 0;

  // Greedy approach: sort coins descending, always use largest possible
  const sorted = [...coins].sort((a, b) => b - a);

  let remaining = amount;
  let count = 0;

  for (const coin of sorted) {
    if (remaining <= 0) break;
    const numCoins = Math.floor(remaining / coin);
    count += numCoins;
    remaining -= numCoins * coin;
  }

  if (remaining !== 0) return -1;
  return count;
}
