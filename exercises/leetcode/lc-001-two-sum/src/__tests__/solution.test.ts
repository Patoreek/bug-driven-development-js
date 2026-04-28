import { describe, it, expect } from "vitest";
import { twoSum } from "../solution";

describe("twoSum", () => {
  it("should find two numbers that add up to target", () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
  });

  it("should work when the pair is not at the beginning", () => {
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
  });

  it("should handle duplicate values", () => {
    expect(twoSum([3, 3], 6)).toEqual([0, 1]);
  });

  it("should handle negative numbers", () => {
    expect(twoSum([-1, -2, -3, -4, -5], -8)).toEqual([2, 4]);
  });

  it("should handle mixed positive and negative numbers", () => {
    expect(twoSum([1, -3, 4, 2], -1)).toEqual([1, 3]);
  });

  it("should handle target of zero", () => {
    expect(twoSum([-5, 3, 5, 1], 0)).toEqual([0, 2]);
  });

  it("should throw when no solution exists", () => {
    expect(() => twoSum([1, 2, 3], 100)).toThrow("No two sum solution found");
  });

  it("should handle large arrays efficiently (performance test)", () => {
    const size = 50_000;
    const nums: number[] = [];
    for (let i = 0; i < size; i++) {
      nums.push(i);
    }
    // The answer is the last two elements
    const target = nums[size - 2] + nums[size - 1];

    const start = performance.now();
    const result = twoSum(nums, target);
    const elapsed = performance.now() - start;

    expect(result).toEqual([size - 2, size - 1]);
    // O(n) solution should complete well under 100ms
    // O(n^2) brute force will be noticeably slow on 50k elements
    expect(elapsed).toBeLessThan(100);
  });
});
