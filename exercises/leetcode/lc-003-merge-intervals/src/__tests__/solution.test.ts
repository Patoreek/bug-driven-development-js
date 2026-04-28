import { describe, it, expect } from "vitest";
import { mergeIntervals } from "../solution";

/**
 * Helper to sort the result for comparison, since interval order
 * in the output should be by start time.
 */
function sortIntervals(intervals: number[][]): number[][] {
  return [...intervals].sort((a, b) => a[0] - b[0]);
}

describe("mergeIntervals", () => {
  it("should merge overlapping intervals", () => {
    const result = mergeIntervals([
      [1, 3],
      [2, 6],
      [8, 10],
      [15, 18],
    ]);
    expect(sortIntervals(result)).toEqual([
      [1, 6],
      [8, 10],
      [15, 18],
    ]);
  });

  it("should merge fully contained intervals", () => {
    const result = mergeIntervals([
      [1, 4],
      [2, 3],
    ]);
    expect(sortIntervals(result)).toEqual([[1, 4]]);
  });

  it("should handle a single interval", () => {
    expect(mergeIntervals([[1, 5]])).toEqual([[1, 5]]);
  });

  it("should return all intervals when none overlap", () => {
    const result = mergeIntervals([
      [1, 2],
      [4, 5],
      [7, 8],
    ]);
    expect(sortIntervals(result)).toEqual([
      [1, 2],
      [4, 5],
      [7, 8],
    ]);
  });

  it("should merge all into one when everything overlaps", () => {
    const result = mergeIntervals([
      [1, 10],
      [2, 3],
      [4, 8],
      [5, 7],
    ]);
    expect(sortIntervals(result)).toEqual([[1, 10]]);
  });

  it("should handle unsorted input correctly", () => {
    const result = mergeIntervals([
      [8, 10],
      [1, 3],
      [2, 6],
      [15, 18],
    ]);
    expect(sortIntervals(result)).toEqual([
      [1, 6],
      [8, 10],
      [15, 18],
    ]);
  });

  it("should handle touching intervals (end equals start)", () => {
    const result = mergeIntervals([
      [1, 3],
      [3, 5],
      [5, 7],
    ]);
    expect(sortIntervals(result)).toEqual([[1, 7]]);
  });

  it("should handle chain of overlapping unsorted intervals", () => {
    // This is the key test that exposes the bug:
    // [6,8] overlaps with [7,12], and [1,5] overlaps with [3,7]
    // But they're not adjacent in the input
    const result = mergeIntervals([
      [6, 8],
      [1, 5],
      [7, 12],
      [3, 7],
    ]);
    expect(sortIntervals(result)).toEqual([[1, 12]]);
  });

  it("should handle intervals with same start time", () => {
    const result = mergeIntervals([
      [1, 5],
      [1, 3],
      [1, 8],
    ]);
    expect(sortIntervals(result)).toEqual([[1, 8]]);
  });

  it("should handle empty input", () => {
    expect(mergeIntervals([])).toEqual([]);
  });
});
