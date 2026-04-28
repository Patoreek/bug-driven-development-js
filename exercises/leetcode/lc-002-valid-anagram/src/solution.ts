/**
 * Valid Anagram
 *
 * Given two strings `s` and `t`, return true if `t` is an anagram of `s`,
 * and false otherwise.
 *
 * An anagram uses all the original letters exactly once, rearranged.
 *
 * Current approach: Sort both strings and compare O(n log n).
 * Target: O(n) time using character frequency counting.
 */
export function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) {
    return false;
  }

  const sortedS = s.split("").sort().join("");
  const sortedT = t.split("").sort().join("");

  return sortedS === sortedT;
}
