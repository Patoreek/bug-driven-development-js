/**
 * Longest Common Subsequence — Optimal Solution
 *
 * 2D DP: O(n * m) time, O(n * m) space.
 *
 * dp[i][j] = length of LCS of text1[0..i-1] and text2[0..j-1].
 *
 * If text1[i-1] === text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
 * Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 */

export function longestCommonSubsequence(
  text1: string,
  text2: string
): number {
  const n = text1.length;
  const m = text2.length;

  // Create (n+1) x (m+1) table initialized to 0
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[n][m];
}
