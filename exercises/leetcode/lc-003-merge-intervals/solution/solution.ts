/**
 * Merge Intervals — Optimal Solution
 *
 * Sort by start time, then merge overlapping intervals in one pass.
 * O(n log n) time (dominated by sort), O(n) space for output.
 */
export function mergeIntervals(intervals: number[][]): number[][] {
  if (intervals.length <= 1) {
    return intervals;
  }

  // Sort intervals by start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];

    if (current[0] <= last[1]) {
      // Overlapping — extend the end of the last merged interval
      last[1] = Math.max(last[1], current[1]);
    } else {
      // Non-overlapping — add as a new interval
      merged.push(current);
    }
  }

  return merged;
}
