import { describe, it, expect } from "vitest";
import { minWindow } from "../solution";

describe("minWindow", () => {
  it('should find minimum window "BANC" for s="ADOBECODEBANC", t="ABC"', () => {
    expect(minWindow("ADOBECODEBANC", "ABC")).toBe("BANC");
  });

  it('should return "a" when s="a", t="a"', () => {
    expect(minWindow("a", "a")).toBe("a");
  });

  it('should return "" when t is longer than s', () => {
    expect(minWindow("a", "aa")).toBe("");
  });

  it('should return "" when no valid window exists', () => {
    expect(minWindow("abc", "xyz")).toBe("");
  });

  it("should return the whole string when it exactly matches t", () => {
    expect(minWindow("abc", "abc")).toBe("abc");
  });

  it("should handle duplicate characters in t", () => {
    expect(minWindow("aab", "aab")).toBe("aab");
  });

  it("should find window with duplicate chars in t", () => {
    const result = minWindow("aaabbbccc", "abc");
    // Minimum window containing a, b, c is "abbbc" (length 5)
    expect(result.length).toBe(5);
    expect(result.includes("a")).toBe(true);
    expect(result.includes("b")).toBe(true);
    expect(result.includes("c")).toBe(true);
  });

  it("should handle t with more of one character than the other", () => {
    expect(minWindow("adobecodebanc", "aa")).toBe("adobecodeba");
  });

  it("should handle single character t", () => {
    expect(minWindow("abcdef", "d")).toBe("d");
  });

  it("should handle when s equals t", () => {
    expect(minWindow("xyz", "xyz")).toBe("xyz");
  });

  it("should handle large input efficiently (performance test)", () => {
    // Build a string where 'z' only appears once near the end
    // This forces the brute force to scan most of the string for each starting position
    const size = 1_000;
    const arr: string[] = [];
    for (let i = 0; i < size; i++) {
      arr.push("abcdy"[i % 5]); // only a,b,c,d,y repeating
    }
    // Place 'z' near the end
    arr[size - 50] = "z";
    const s = arr.join("");
    const t = "abz"; // needs a, b, and z — z is far from most starting positions

    const start = performance.now();
    const result = minWindow(s, t);
    const elapsed = performance.now() - start;

    // The minimum window must contain a, b, and z
    expect(result.includes("a")).toBe(true);
    expect(result.includes("b")).toBe(true);
    expect(result.includes("z")).toBe(true);
    // O(n) sliding window should be fast
    // O(n^2) brute force creates many substrings scanning to find z
    expect(elapsed).toBeLessThan(50);
  });
});
