/**
 * LeetCode 651 - Four Keys Keyboard
 *
 * Given n key presses on a special keyboard with 4 keys:
 *   Key 1: Print 'A'
 *   Key 2: Select All (Ctrl-A)
 *   Key 3: Copy (Ctrl-C)
 *   Key 4: Paste (Ctrl-V)
 *
 * Find the maximum number of 'A's you can produce.
 *
 * BUG: Only considers doubling (one paste after copy) instead of
 * multiple consecutive pastes after a Ctrl-A + Ctrl-C sequence.
 */
export function maxA(n: number): number {
  if (n <= 6) return n;

  const dp = new Array(n + 1).fill(0);
  for (let i = 0; i <= Math.min(n, 6); i++) {
    dp[i] = i;
  }

  for (let i = 7; i <= n; i++) {
    dp[i] = dp[i - 1] + 1; // just press A

    // BUG: only considers doubling (one paste)
    // Should consider j from i-3 down to 1
    // where we do Ctrl-A, Ctrl-C at step j, then paste (i-j-1) times
    dp[i] = Math.max(dp[i], dp[i - 3] * 2);
  }

  return dp[n];
}
