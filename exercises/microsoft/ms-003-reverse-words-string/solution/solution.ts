/**
 * LeetCode 186 - Reverse Words in a String II
 *
 * Given a character array representing a sentence, reverse the order
 * of words in-place. Words are separated by single spaces.
 *
 * Approach: Two-step reversal
 * 1. Reverse the entire array
 * 2. Reverse each individual word
 *
 * Time: O(n) | Space: O(1)
 */
export function reverseWords(s: string[]): void {
  // Step 1: Reverse entire array
  reverse(s, 0, s.length - 1);

  // Step 2: Reverse each word
  let start = 0;
  for (let i = 0; i <= s.length; i++) {
    if (i === s.length || s[i] === " ") {
      reverse(s, start, i - 1);
      start = i + 1;
    }
  }
}

function reverse(s: string[], left: number, right: number): void {
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}
