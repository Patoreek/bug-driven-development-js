import { describe, it, expect } from "vitest";
import { productExceptSelf } from "../solution";

describe("productExceptSelf", () => {
  it("should return product of all other elements", () => {
    expect(productExceptSelf([1, 2, 3, 4])).toEqual([24, 12, 8, 6]);
  });

  it("should handle array with a zero", () => {
    expect(productExceptSelf([0, 1, 2, 3])).toEqual([6, 0, 0, 0]);
  });

  it("should handle array with multiple zeros", () => {
    expect(productExceptSelf([0, 0, 2, 3])).toEqual([0, 0, 0, 0]);
  });

  it("should handle array of all ones", () => {
    expect(productExceptSelf([1, 1, 1, 1])).toEqual([1, 1, 1, 1]);
  });

  it("should handle two elements", () => {
    expect(productExceptSelf([3, 5])).toEqual([5, 3]);
  });

  it("should handle negative numbers", () => {
    expect(productExceptSelf([-1, 2, -3, 4])).toEqual([-24, 12, -8, 6]);
  });

  it("should handle mixed positive and negative with zero", () => {
    const result = productExceptSelf([-1, 0, 3]);
    // Note: -1 * 0 produces -0 in JS, so we compare with tolerance for sign of zero
    expect(result.map((v) => (v === 0 ? 0 : v))).toEqual([0, -3, 0]);
  });

  it("should handle array with one", () => {
    expect(productExceptSelf([2, 3, 4, 5])).toEqual([60, 40, 30, 24]);
  });

  it("should handle large array efficiently (performance test)", () => {
    const size = 50_000;
    const nums: number[] = [];
    for (let i = 0; i < size; i++) {
      // Use small numbers to avoid overflow issues in test
      nums.push((i % 3) + 1); // values: 1, 2, 3, 1, 2, 3, ...
    }

    const start = performance.now();
    const result = productExceptSelf(nums);
    const elapsed = performance.now() - start;

    expect(result.length).toBe(size);
    // O(n) should complete well under 100ms
    // O(n^2) will be noticeably slow on 50k elements
    expect(elapsed).toBeLessThan(100);
  });

  it("should not use division (verify with zero)", () => {
    // If division is used, dividing by zero would produce Infinity/NaN
    const result = productExceptSelf([1, 0, 3, 4]);
    expect(result).toEqual([0, 12, 0, 0]);
    expect(result.every((v) => Number.isFinite(v))).toBe(true);
  });
});
