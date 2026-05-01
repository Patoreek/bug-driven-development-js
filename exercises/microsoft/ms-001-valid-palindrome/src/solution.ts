/**
 * LeetCode 125 - Valid Palindrome
 *
 * Given a string s, return true if it is a palindrome,
 * considering only alphanumeric characters and ignoring cases.
 *
 * BUG: This solution does NOT filter out non-alphanumeric characters.
 * It naively reverses the full string and compares, so it fails
 * on inputs containing spaces, punctuation, or mixed case.
 */
export function isPalindrome(s: string): boolean {
  const reversed = s.split("").reverse().join("");
  return s === reversed;
}
