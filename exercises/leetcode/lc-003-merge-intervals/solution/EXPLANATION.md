# Explanation — Merge Intervals

## The Buggy Approach (What's Given)

The provided solution has two critical bugs:

### Bug 1: No Sorting

```typescript
// Processes intervals in their original order
// [8,10], [1,3], [2,6] — misses that [1,3] and [2,6] overlap
```

Without sorting, overlapping intervals that aren't adjacent in the input get missed entirely.

### Bug 2: Only Checks Adjacent Pairs

```typescript
if (i + 1 < intervals.length && current[1] >= intervals[i + 1][0]) {
  current[1] = Math.max(current[1], intervals[i + 1][1]);
  i += 2;  // Skips ahead by 2, missing potential chains
}
```

This only merges pairs of two. Given `[1,3], [2,5], [4,8]`, it would merge `[1,3]` and `[2,5]` into `[1,5]`, then add `[4,8]` separately — missing that `[4,8]` overlaps with `[1,5]`.

## The Optimal Approach

### Key Insight

After sorting by start time, overlapping intervals are always consecutive. We maintain a result array and compare each new interval against the **last merged interval**, not just the next input interval.

### Algorithm Walkthrough

Given `[[6,8], [1,5], [7,12], [3,7]]`:

**Step 1: Sort by start** -> `[[1,5], [3,7], [6,8], [7,12]]`

**Step 2: Merge**

| Interval | Last in merged | Overlap? | Action | Merged |
|----------|---------------|----------|--------|--------|
| [1,5] | — | — | Initialize | [[1,5]] |
| [3,7] | [1,5] | 3 <= 5 Yes | Extend to [1,7] | [[1,7]] |
| [6,8] | [1,7] | 6 <= 7 Yes | Extend to [1,8] | [[1,8]] |
| [7,12] | [1,8] | 7 <= 8 Yes | Extend to [1,12] | [[1,12]] |

Result: `[[1,12]]` — all four intervals merged into one chain.

### The Fix

```typescript
export function mergeIntervals(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;

  intervals.sort((a, b) => a[0] - b[0]);

  const merged: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}
```

## Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Buggy (no sort) | O(n) but incorrect | O(n) |
| **Sort + merge** | **O(n log n)** | **O(n)** |

The sort is O(n log n) and the merge pass is O(n), so overall it's O(n log n). You can't do better because sorting is necessary for correctness.

## Edge Cases to Consider

- **Empty array**: return `[]`
- **Single interval**: return as-is
- **All overlapping**: everything merges to one interval
- **No overlapping**: output equals sorted input
- **Same start times**: `[1,5], [1,3]` — sort is stable, merge handles it via `Math.max`
- **Touching intervals**: `[1,3], [3,5]` — these should merge (3 <= 3)

## Common Interview Follow-ups

- **"Insert a new interval into a sorted non-overlapping list?"** Binary search for position, then merge affected intervals. O(n) worst case.
- **"What if intervals are given as a stream?"** Use a balanced BST or sorted container for O(log n) insertion and merge.
- **"Meeting Rooms II — minimum rooms needed?"** Sort start/end times separately, use a sweep line or min-heap.

## References

- [LeetCode 56. Merge Intervals](https://leetcode.com/problems/merge-intervals/)
- [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
