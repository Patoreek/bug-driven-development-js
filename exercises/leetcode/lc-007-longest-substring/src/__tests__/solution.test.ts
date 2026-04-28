import { describe, it, expect } from "vitest";
import { lengthOfLongestSubstring } from "../solution";

describe("lengthOfLongestSubstring", () => {
  it('should return 3 for "abcabcbb"', () => {
    expect(lengthOfLongestSubstring("abcabcbb")).toBe(3);
  });

  it('should return 1 for "bbbbb"', () => {
    expect(lengthOfLongestSubstring("bbbbb")).toBe(1);
  });

  it('should return 3 for "pwwkew"', () => {
    expect(lengthOfLongestSubstring("pwwkew")).toBe(3);
  });

  it("should return 0 for empty string", () => {
    expect(lengthOfLongestSubstring("")).toBe(0);
  });

  it("should return 1 for single character", () => {
    expect(lengthOfLongestSubstring("a")).toBe(1);
  });

  it("should return full length for all unique characters", () => {
    expect(lengthOfLongestSubstring("abcdef")).toBe(6);
  });

  it("should handle spaces and special characters", () => {
    expect(lengthOfLongestSubstring("a b c")).toBe(3);
  });

  it("should handle string with space character repeating", () => {
    expect(lengthOfLongestSubstring(" a b ")).toBe(3);
  });

  it('should return 2 for "au"', () => {
    expect(lengthOfLongestSubstring("au")).toBe(2);
  });

  it("should handle repeating pattern", () => {
    expect(lengthOfLongestSubstring("abcabc")).toBe(3);
  });

  it('should handle "dvdf" correctly', () => {
    // This catches a common bug where the window doesn't shrink correctly
    expect(lengthOfLongestSubstring("dvdf")).toBe(3);
  });

  it("should handle large input efficiently (performance test)", () => {
    // Use a large character set (500 unique chars) to create long unique substrings
    // This forces O(n^2) brute force to do real work per starting position
    const size = 50_000;
    const uniqueChars: string[] = [];
    for (let i = 0; i < 500; i++) {
      uniqueChars.push(String.fromCharCode(0x4e00 + i)); // CJK characters
    }

    const arr: string[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(uniqueChars[i % uniqueChars.length]);
    }
    const s = arr.join("");

    const start = performance.now();
    const result = lengthOfLongestSubstring(s);
    const elapsed = performance.now() - start;

    expect(result).toBe(500);
    // O(n) should complete well under 100ms
    // O(n^2) with 500-char unique windows does ~25M iterations
    expect(elapsed).toBeLessThan(100);
  });
});
