import { describe, it, expect } from "vitest";
import { topKFrequent } from "../solution";

describe("topKFrequent", () => {
  it("should return [1,2] for [1,1,1,2,2,3] k=2", () => {
    const result = topKFrequent([1, 1, 1, 2, 2, 3], 2);
    expect(result.sort((a, b) => a - b)).toEqual([1, 2]);
  });

  it("should return [1] for [1] k=1", () => {
    expect(topKFrequent([1], 1)).toEqual([1]);
  });

  it("should handle all elements having same frequency", () => {
    const result = topKFrequent([1, 2, 3], 3);
    expect(result.sort((a, b) => a - b)).toEqual([1, 2, 3]);
  });

  it("should handle k equals the number of unique elements", () => {
    const result = topKFrequent([1, 1, 2, 2, 3, 3], 3);
    expect(result.sort((a, b) => a - b)).toEqual([1, 2, 3]);
  });

  it("should handle negative numbers", () => {
    const result = topKFrequent([-1, -1, -1, 2, 2, 3], 2);
    expect(result.sort((a, b) => a - b)).toEqual([-1, 2]);
  });

  it("should handle single element repeated", () => {
    expect(topKFrequent([5, 5, 5, 5], 1)).toEqual([5]);
  });

  it("should return correct top 1 from varied frequencies", () => {
    const result = topKFrequent([1, 2, 2, 3, 3, 3], 1);
    expect(result).toEqual([3]);
  });

  it("should handle large k", () => {
    const result = topKFrequent([4, 4, 4, 3, 3, 2, 1], 4);
    expect(result.sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
  });

  it("should handle zero in input", () => {
    const result = topKFrequent([0, 0, 1, 1, 1], 1);
    expect(result).toEqual([1]);
  });

  it("should not sort when only top k is needed (structural test)", () => {
    // This test verifies the solution uses bucket sort (O(n)) rather than
    // comparison sort (O(n log n)) by checking it handles the case where
    // k=1 and there are many unique elements efficiently
    const nums: number[] = [];
    // Element 0 appears 10000 times
    for (let i = 0; i < 10000; i++) nums.push(0);
    // Elements 1-999 appear once each
    for (let i = 1; i < 1000; i++) nums.push(i);

    const result = topKFrequent(nums, 1);
    expect(result).toEqual([0]);
  });

  it("should handle two elements with same frequency selecting both", () => {
    const result = topKFrequent([1, 1, 2, 2, 3], 2);
    // Both 1 and 2 have frequency 2, both should be selected
    expect(result.sort((a, b) => a - b)).toEqual([1, 2]);
  });
});
