/**
 * Minimum Window Substring — Optimal Solution
 *
 * Sliding window with two pointers and frequency tracking.
 * O(n + m) time, O(m) space where n = |s|, m = |t|.
 *
 * Expand the right pointer to include characters.
 * When the window contains all characters of t, contract from the left
 * to find the minimum window.
 */
export function minWindow(s: string, t: string): string {
  if (t.length > s.length) return "";

  // Build frequency map for t
  const tFreq = new Map<string, number>();
  for (const char of t) {
    tFreq.set(char, (tFreq.get(char) ?? 0) + 1);
  }

  // Track how many unique characters in t have been fully satisfied
  const windowFreq = new Map<string, number>();
  let have = 0;
  const need = tFreq.size; // number of unique characters to satisfy

  let minLen = Infinity;
  let minStart = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // Add right character to window
    windowFreq.set(char, (windowFreq.get(char) ?? 0) + 1);

    // Check if this character's frequency requirement is now met
    if (tFreq.has(char) && windowFreq.get(char) === tFreq.get(char)) {
      have++;
    }

    // Contract window from the left while we still have all characters
    while (have === need) {
      // Update minimum
      const windowLen = right - left + 1;
      if (windowLen < minLen) {
        minLen = windowLen;
        minStart = left;
      }

      // Remove left character from window
      const leftChar = s[left];
      windowFreq.set(leftChar, windowFreq.get(leftChar)! - 1);

      if (
        tFreq.has(leftChar) &&
        windowFreq.get(leftChar)! < tFreq.get(leftChar)!
      ) {
        have--;
      }

      left++;
    }
  }

  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}
