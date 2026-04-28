/**
 * Group Anagrams — Optimal Solution
 *
 * Sort each word to create a canonical key, group by key using a Map.
 * O(n * k log k) time where n = number of strings, k = max string length.
 * O(n * k) space for the map and output.
 */
export function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const str of strs) {
    const key = str.split("").sort().join("");

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(str);
  }

  return Array.from(map.values());
}
