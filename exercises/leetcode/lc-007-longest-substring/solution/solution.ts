/**
 * Longest Substring Without Repeating Characters — Optimal Solution
 *
 * Sliding window with a Map tracking the last seen index of each character.
 * O(n) time, O(min(n, k)) space where k is the character set size.
 *
 * When a duplicate is found, jump the left pointer past the previous
 * occurrence of that character, avoiding redundant checks.
 */
export function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (lastSeen.has(char) && lastSeen.get(char)! >= left) {
      // Move left pointer past the previous occurrence
      left = lastSeen.get(char)! + 1;
    }

    lastSeen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
