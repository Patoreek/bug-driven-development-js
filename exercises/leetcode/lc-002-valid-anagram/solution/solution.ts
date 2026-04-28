/**
 * Valid Anagram — Optimal Solution
 *
 * Character frequency counting approach: O(n) time, O(k) space
 * where k is the size of the character set.
 *
 * Count character frequencies in `s`, then decrement for each character
 * in `t`. If any count goes negative, `t` has a character not in `s`
 * (or more of it), so it's not an anagram.
 */
export function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) {
    return false;
  }

  const charCount = new Map<string, number>();

  for (const char of s) {
    charCount.set(char, (charCount.get(char) ?? 0) + 1);
  }

  for (const char of t) {
    const count = charCount.get(char);
    if (count === undefined || count === 0) {
      return false;
    }
    charCount.set(char, count - 1);
  }

  return true;
}
