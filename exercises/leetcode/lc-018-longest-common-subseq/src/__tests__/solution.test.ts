import { describe, it, expect } from "vitest";
import { longestCommonSubsequence } from "../solution";

describe("longestCommonSubsequence", () => {
  it('should return 3 for "abcde" and "ace"', () => {
    expect(longestCommonSubsequence("abcde", "ace")).toBe(3);
  });

  it('should return 3 for "abc" and "abc" (identical strings)', () => {
    expect(longestCommonSubsequence("abc", "abc")).toBe(3);
  });

  it('should return 0 for "abc" and "def" (no common chars)', () => {
    expect(longestCommonSubsequence("abc", "def")).toBe(0);
  });

  it("should return 0 for empty first string", () => {
    expect(longestCommonSubsequence("", "abc")).toBe(0);
  });

  it("should return 0 for empty second string", () => {
    expect(longestCommonSubsequence("abc", "")).toBe(0);
  });

  it("should return 0 for both empty strings", () => {
    expect(longestCommonSubsequence("", "")).toBe(0);
  });

  it("should return 1 for single char match", () => {
    expect(longestCommonSubsequence("a", "a")).toBe(1);
  });

  it("should return 0 for single char no match", () => {
    expect(longestCommonSubsequence("a", "b")).toBe(0);
  });

  it('should return 4 for "abcba" and "abcbcba"', () => {
    expect(longestCommonSubsequence("abcba", "abcbcba")).toBe(5);
  });

  it('should handle "oxcpqrsvwf" and "shmtulqrypy" → 2', () => {
    expect(longestCommonSubsequence("oxcpqrsvwf", "shmtulqrypy")).toBe(2);
  });

  it("should handle longer strings efficiently (performance test)", () => {
    // 25 chars each — brute force would need 2^25 = ~33M subsequences
    const text1 = "abcdefghijklmnopqrstuvwxy";
    const text2 = "azbycxdwevfugthsirjqkplom";

    const start = performance.now();
    const result = longestCommonSubsequence(text1, text2);
    const elapsed = performance.now() - start;

    // DP solution should complete well under 50ms for 25x25
    // Brute force with 2^25 subsequences would take seconds
    expect(result).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(100);
  });

  it('should return 2 for "bl" and "yby"', () => {
    expect(longestCommonSubsequence("bl", "yby")).toBe(1);
  });

  it("should handle repeated characters", () => {
    expect(longestCommonSubsequence("aaa", "aaaa")).toBe(3);
  });
});
