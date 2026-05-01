/**
 * LeetCode 186 - Reverse Words in a String II
 *
 * Given a character array representing a sentence, reverse the order
 * of words in-place. Words are separated by single spaces.
 *
 * Example: ['h','e','l','l','o',' ','w','o','r','l','d']
 *       -> ['w','o','r','l','d',' ','h','e','l','l','o']
 *
 * BUG: This solution reverses the entire array (Step 1) but does NOT
 * reverse each individual word back (missing Step 2). So "hello world"
 * becomes "dlrow olleh" instead of "world hello".
 */
export function reverseWords(s: string[]): void {
  // Step 1: Reverse entire array
  reverse(s, 0, s.length - 1);
  // BUG: Missing step 2 — reverse each individual word
}

function reverse(s: string[], left: number, right: number): void {
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}
