/**
 * Longest Common Subsequence
 *
 * Given two strings text1 and text2, return the length of their
 * longest common subsequence. A subsequence is a sequence that can
 * be derived from another sequence by deleting some or no elements
 * without changing the order of the remaining elements.
 *
 * Current approach: Brute force — generates all subsequences of text1
 * and checks if each is a subsequence of text2. O(2^n * m) time.
 *
 * Target: 2D DP table in O(n * m) time.
 */

export function longestCommonSubsequence(
  text1: string,
  text2: string
): number {
  // Brute force: generate all subsequences of text1,
  // check each against text2
  let maxLen = 0;

  function generateSubsequences(index: number, current: string): void {
    if (index === text1.length) {
      if (isSubsequence(current, text2)) {
        maxLen = Math.max(maxLen, current.length);
      }
      return;
    }

    // Include current character
    generateSubsequences(index + 1, current + text1[index]);
    // Exclude current character
    generateSubsequences(index + 1, current);
  }

  generateSubsequences(0, "");
  return maxLen;
}

function isSubsequence(sub: string, str: string): boolean {
  let si = 0;
  for (let i = 0; i < str.length && si < sub.length; i++) {
    if (sub[si] === str[i]) {
      si++;
    }
  }
  return si === sub.length;
}
