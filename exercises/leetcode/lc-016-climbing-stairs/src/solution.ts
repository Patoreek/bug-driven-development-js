/**
 * Climbing Stairs
 *
 * You are climbing a staircase. It takes n steps to reach the top.
 * Each time you can either climb 1 or 2 steps.
 * In how many distinct ways can you climb to the top?
 *
 * Current approach: Naive recursion O(2^n) — recalculates subproblems
 * exponentially. Times out on n >= 40.
 *
 * Target: O(n) time, O(1) space using bottom-up DP with two variables.
 */

export function climbStairs(n: number): number {
  // Naive recursive approach — O(2^n) time
  // Each call branches into two recursive calls,
  // recalculating the same subproblems many times
  if (n <= 0) return 1;
  if (n === 1) return 1;

  return climbStairs(n - 1) + climbStairs(n - 2);
}
