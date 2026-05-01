import { describe, it, expect } from "vitest";
import { canMeasureWater } from "../solution";

describe("canMeasureWater", () => {
  it("should return true for (3, 5, 4)", () => {
    expect(canMeasureWater(3, 5, 4)).toBe(true);
  });

  it("should return false for (2, 6, 5)", () => {
    expect(canMeasureWater(2, 6, 5)).toBe(false);
  });

  it("should return true when z is 0", () => {
    expect(canMeasureWater(1, 1, 0)).toBe(true);
  });

  it("should return false when z > x + y", () => {
    expect(canMeasureWater(3, 5, 9)).toBe(false);
  });

  it("should handle one jug being 0", () => {
    expect(canMeasureWater(0, 5, 5)).toBe(true);
    expect(canMeasureWater(0, 5, 3)).toBe(false);
    expect(canMeasureWater(4, 0, 4)).toBe(true);
    expect(canMeasureWater(4, 0, 3)).toBe(false);
  });

  it("should handle both jugs same size", () => {
    expect(canMeasureWater(5, 5, 5)).toBe(true);
    expect(canMeasureWater(5, 5, 10)).toBe(true);
    expect(canMeasureWater(5, 5, 3)).toBe(false);
  });

  it("should return true when x equals z", () => {
    expect(canMeasureWater(3, 5, 3)).toBe(true);
  });

  it("should return true when y equals z", () => {
    expect(canMeasureWater(3, 5, 5)).toBe(true);
  });

  it("should return true when x + y equals z", () => {
    expect(canMeasureWater(3, 5, 8)).toBe(true);
  });

  it("should return true when x is 1 (any z <= x + y works)", () => {
    expect(canMeasureWater(1, 6, 1)).toBe(true);
    expect(canMeasureWater(1, 6, 3)).toBe(true);
    expect(canMeasureWater(1, 6, 7)).toBe(true);
  });

  it("should handle x equals y equals z", () => {
    expect(canMeasureWater(4, 4, 4)).toBe(true);
  });

  it("should handle large inputs that BFS cannot (performance test)", { timeout: 5000 }, () => {
    const start = performance.now();

    // These inputs create a massive state space for BFS: O(10000003 * 10000007)
    // GCD(10000003, 10000007) = 1 (both are prime), so any z is achievable
    const result = canMeasureWater(10000003, 10000007, 1);
    const elapsed = performance.now() - start;

    expect(result).toBe(true);
    // GCD solution: O(log n), essentially instant
    // BFS solution: would need billions of states — impossibly slow
    expect(elapsed).toBeLessThan(100);
  });

  it("should handle another large input case", () => {
    const start = performance.now();

    // GCD(1000000, 700000) = 100000
    // 300000 % 100000 = 0, so true
    const result = canMeasureWater(1000000, 700000, 300000);
    const elapsed = performance.now() - start;

    expect(result).toBe(true);
    expect(elapsed).toBeLessThan(100);
  });

  it("should return false for large inputs where z is not divisible by gcd", () => {
    const start = performance.now();

    // GCD(1000000, 700000) = 100000
    // 300001 % 100000 = 1, not 0, so false
    const result = canMeasureWater(1000000, 700000, 300001);
    const elapsed = performance.now() - start;

    expect(result).toBe(false);
    expect(elapsed).toBeLessThan(100);
  });
});
