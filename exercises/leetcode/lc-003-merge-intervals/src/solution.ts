/**
 * Merge Intervals
 *
 * Given an array of intervals where intervals[i] = [start_i, end_i],
 * merge all overlapping intervals and return an array of the
 * non-overlapping intervals that cover all the intervals in the input.
 *
 * Bug: This implementation does NOT sort the intervals first, and only
 * checks adjacent intervals. This misses overlapping intervals that
 * aren't adjacent in the original array.
 *
 * Target: Sort by start time, then merge in a single pass O(n log n).
 */
export function mergeIntervals(intervals: number[][]): number[][] {
  if (intervals.length <= 1) {
    return intervals;
  }

  // Bug: Not sorting first — assumes intervals arrive in order
  // Bug: Only merges adjacent pairs, doesn't handle chains
  const result: number[][] = [];
  let i = 0;

  while (i < intervals.length) {
    let current = [...intervals[i]];

    // Only checks the very next interval
    if (i + 1 < intervals.length && current[1] >= intervals[i + 1][0]) {
      current[1] = Math.max(current[1], intervals[i + 1][1]);
      i += 2;
    } else {
      i++;
    }

    result.push(current);
  }

  return result;
}
