import { describe, it, expect } from "vitest";
import { groupAnagrams } from "../solution";

/**
 * Helper: normalize groups for comparison.
 * Sort each group internally, then sort groups by their first element.
 */
function normalize(groups: string[][]): string[][] {
  return groups
    .map((group) => [...group].sort())
    .sort((a, b) => {
      const aKey = a.join(",");
      const bKey = b.join(",");
      return aKey.localeCompare(bKey);
    });
}

describe("groupAnagrams", () => {
  it("should group anagrams together", () => {
    const result = groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]);
    expect(normalize(result)).toEqual(
      normalize([["eat", "tea", "ate"], ["tan", "nat"], ["bat"]])
    );
  });

  it("should handle empty string", () => {
    const result = groupAnagrams([""]);
    expect(normalize(result)).toEqual([[""]]);
  });

  it("should handle single character strings", () => {
    const result = groupAnagrams(["a"]);
    expect(normalize(result)).toEqual([["a"]]);
  });

  it("should group multiple empty strings together", () => {
    const result = groupAnagrams(["", ""]);
    expect(normalize(result)).toEqual([["", ""]]);
  });

  it("should handle all strings being the same anagram", () => {
    const result = groupAnagrams(["abc", "bca", "cab", "acb"]);
    expect(normalize(result)).toEqual([["abc", "acb", "bca", "cab"]]);
  });

  it("should handle no anagrams (all unique)", () => {
    const result = groupAnagrams(["abc", "def", "ghi"]);
    expect(normalize(result)).toEqual(
      normalize([["abc"], ["def"], ["ghi"]])
    );
  });

  it("should handle strings with repeated characters", () => {
    const result = groupAnagrams(["aab", "aba", "baa", "abb", "bab"]);
    expect(normalize(result)).toEqual(
      normalize([["aab", "aba", "baa"], ["abb", "bab"]])
    );
  });

  it("should handle large input efficiently (performance test)", () => {
    const size = 20_000;
    const strs: string[] = [];
    const chars = "abcdefghijklmnopqrstuvwxyz";

    // Generate 20k words of length 20, forming many distinct anagram groups
    // With n^2 comparisons, the brute force does 200M+ sort+compare ops
    for (let i = 0; i < size; i++) {
      // Create diverse words by using different char sets
      const base = [];
      for (let j = 0; j < 20; j++) {
        base.push(chars[(i + j * 7) % chars.length]);
      }
      // Shuffle
      for (let j = base.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [base[j], base[k]] = [base[k], base[j]];
      }
      strs.push(base.join(""));
    }

    const start = performance.now();
    const result = groupAnagrams(strs);
    const elapsed = performance.now() - start;

    // All strings should be grouped
    const totalStrings = result.reduce((sum, group) => sum + group.length, 0);
    expect(totalStrings).toBe(size);

    // O(n * k log k) with n=20k, k=20 should complete in <200ms
    // O(n^2 * k log k) will be very slow (400M comparisons)
    expect(elapsed).toBeLessThan(200);
  });
});
