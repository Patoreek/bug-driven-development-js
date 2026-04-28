import { describe, it, expect } from "vitest";
import { climbStairs } from "../solution";

describe("climbStairs", () => {
  it("should return 1 for n=1", () => {
    expect(climbStairs(1)).toBe(1);
  });

  it("should return 2 for n=2", () => {
    expect(climbStairs(2)).toBe(2);
  });

  it("should return 3 for n=3", () => {
    expect(climbStairs(3)).toBe(3);
  });

  it("should return 5 for n=4", () => {
    expect(climbStairs(4)).toBe(5);
  });

  it("should return 8 for n=5", () => {
    expect(climbStairs(5)).toBe(8);
  });

  it("should return 1 for n=0 (edge case: already at the top)", () => {
    expect(climbStairs(0)).toBe(1);
  });

  it("should return 89 for n=10", () => {
    expect(climbStairs(10)).toBe(89);
  });

  it("should handle n=20 correctly", () => {
    expect(climbStairs(20)).toBe(10946);
  });

  it("should handle n=45 efficiently (performance test)", () => {
    const start = performance.now();
    const result = climbStairs(45);
    const elapsed = performance.now() - start;

    expect(result).toBe(1836311903);
    // O(n) solution should complete in under 10ms
    // O(2^n) naive recursion would take hours for n=45
    expect(elapsed).toBeLessThan(50);
  });

  it("should handle n=30", () => {
    expect(climbStairs(30)).toBe(1346269);
  });
});
