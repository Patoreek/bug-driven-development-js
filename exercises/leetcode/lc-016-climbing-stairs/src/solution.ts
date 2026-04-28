/**
 * Climbing Stairs — Optimal Solution
 *
 * Bottom-up DP with O(n) time, O(1) space.
 *
 * This is essentially the Fibonacci sequence:
 *   ways(n) = ways(n-1) + ways(n-2)
 *
 * We only need the last two values, so we use two variables
 * instead of an array.
 */

export function climbStairs(n: number): number {
  if (n <= 0) return 1;
  if (n === 1) return 1;

  let prev2 = 1; // ways(0)
  let prev1 = 1; // ways(1)

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
