/**
 * Longest Substring Without Repeating Characters
 *
 * Given a string `s`, find the length of the longest substring
 * without repeating characters.
 *
 * Current approach: Brute force O(n^2) — check every substring starting
 * from each position, using a Set to detect duplicates.
 *
 * Target: O(n) time using sliding window with a Map.
 */
export function lengthOfLongestSubstring(s: string): number {
  let maxLength = 0;

  for (let i = 0; i < s.length; i++) {
    const seen = new Set<string>();
    let j = i;

    while (j < s.length && !seen.has(s[j])) {
      seen.add(s[j]);
      j++;
    }

    maxLength = Math.max(maxLength, j - i);
  }

  return maxLength;
}
