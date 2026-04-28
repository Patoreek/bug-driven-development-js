/**
 * Group Anagrams
 *
 * Given an array of strings, group the anagrams together.
 * An anagram is a word formed by rearranging the letters of another word.
 *
 * Current approach: Brute force O(n^2 * k) — for each word, compare against
 * all others to check if they're anagrams using sorting.
 *
 * Target: O(n * k log k) time using sorted word as a hash key.
 */
export function groupAnagrams(strs: string[]): string[][] {
  const used = new Array(strs.length).fill(false);
  const groups: string[][] = [];

  for (let i = 0; i < strs.length; i++) {
    if (used[i]) continue;

    const group: string[] = [strs[i]];
    const sortedI = strs[i].split("").sort().join("");

    for (let j = i + 1; j < strs.length; j++) {
      if (used[j]) continue;

      const sortedJ = strs[j].split("").sort().join("");
      if (sortedI === sortedJ) {
        group.push(strs[j]);
        used[j] = true;
      }
    }

    groups.push(group);
  }

  return groups;
}
