/**
 * LeetCode 125 - Valid Palindrome
 *
 * Given a string s, return true if it is a palindrome,
 * considering only alphanumeric characters and ignoring cases.
 *
 * Approach: Two pointers from each end, skip non-alphanumeric,
 * compare lowercase characters.
 *
 * Time: O(n) | Space: O(1)
 */
export function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    while (left < right && !isAlphanumeric(s[left])) left++;
    while (left < right && !isAlphanumeric(s[right])) right--;

    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

function isAlphanumeric(c: string): boolean {
  return /[a-zA-Z0-9]/.test(c);
}
