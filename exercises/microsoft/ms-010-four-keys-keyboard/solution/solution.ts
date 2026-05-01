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
 */
export function maxA(n: number): number {
  const dp = new Array(n + 1).fill(0);
  for (let i = 0; i <= n; i++) {
    dp[i] = i; // base: just press A i times
  }

  for (let i = 1; i <= n; i++) {
    // Try all break points j where we do Ctrl-A, Ctrl-C at step j
    // then paste (i - j - 1) times (using keys j+1=Ctrl-A, j+2=Ctrl-C, j+3..i=Ctrl-V)
    for (let j = i - 3; j >= 1; j--) {
      // (i - j - 1) pastes multiply buffer by (i - j - 1)
      dp[i] = Math.max(dp[i], dp[j] * (i - j - 1));
    }
  }

  return dp[n];
}
