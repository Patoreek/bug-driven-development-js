/**
 * Minimum Window Substring
 *
 * Given two strings `s` and `t`, return the minimum window substring
 * of `s` such that every character in `t` (including duplicates)
 * is included in the window. If no such window exists, return "".
 *
 * Current approach: Brute force O(n^2) — check every substring of `s`
 * to see if it contains all characters of `t`.
 *
 * Target: O(n + m) time using sliding window with two pointers.
 */
export function minWindow(s: string, t: string): string {
  if (t.length > s.length) return "";

  // Build frequency map for t
  const tFreq = new Map<string, number>();
  for (const char of t) {
    tFreq.set(char, (tFreq.get(char) ?? 0) + 1);
  }

  let result = "";

  // Brute force: check every substring
  for (let i = 0; i < s.length; i++) {
    for (let j = i + t.length; j <= s.length; j++) {
      const substring = s.slice(i, j);

      if (containsAll(substring, tFreq)) {
        if (result === "" || substring.length < result.length) {
          result = substring;
        }
        break; // Found smallest starting at i, try next i
      }
    }
  }

  return result;
}

function containsAll(
  substring: string,
  tFreq: Map<string, number>
): boolean {
  const freq = new Map<string, number>();
  for (const char of substring) {
    freq.set(char, (freq.get(char) ?? 0) + 1);
  }

  for (const [char, count] of tFreq) {
    if ((freq.get(char) ?? 0) < count) {
      return false;
    }
  }

  return true;
}
