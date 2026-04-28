import { describe, it, expect } from "vitest";
import { isAnagram } from "../solution";

describe("isAnagram", () => {
  it("should return true for valid anagrams", () => {
    expect(isAnagram("anagram", "nagaram")).toBe(true);
  });

  it("should return false for non-anagrams", () => {
    expect(isAnagram("rat", "car")).toBe(false);
  });

  it("should return true for empty strings", () => {
    expect(isAnagram("", "")).toBe(true);
  });

  it("should return false for different lengths", () => {
    expect(isAnagram("ab", "a")).toBe(false);
  });

  it("should return true for single character match", () => {
    expect(isAnagram("a", "a")).toBe(true);
  });

  it("should return false for single character mismatch", () => {
    expect(isAnagram("a", "b")).toBe(false);
  });

  it("should handle strings with repeated characters", () => {
    expect(isAnagram("aabb", "abab")).toBe(true);
    expect(isAnagram("aabb", "abba")).toBe(true);
  });

  it("should return false when same chars but different frequencies", () => {
    expect(isAnagram("aaab", "aabb")).toBe(false);
  });

  it("should handle unicode characters", () => {
    expect(isAnagram("cafe\u0301", "e\u0301fac")).toBe(true);
  });

  it("should handle strings with spaces", () => {
    expect(isAnagram("a b", "b a")).toBe(true);
    expect(isAnagram("a b", "ab")).toBe(false);
  });

  it("should complete efficiently for large strings (performance test)", () => {
    const size = 2_000_000;
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const arr: string[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(chars[i % chars.length]);
    }
    const s = arr.join("");
    // Shuffle to create t (a valid anagram)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const t = arr.join("");

    const start = performance.now();
    const result = isAnagram(s, t);
    const elapsed = performance.now() - start;

    expect(result).toBe(true);
    // O(n) frequency counting should be well under 200ms
    // O(n log n) sort on 2M chars creates large intermediate arrays and is slower
    expect(elapsed).toBeLessThan(200);
  });
});
