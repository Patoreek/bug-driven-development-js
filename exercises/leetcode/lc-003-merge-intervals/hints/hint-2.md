# Hint 2 — Key Step

**Sort the intervals by their start time** first: `intervals.sort((a, b) => a[0] - b[0])`.

After sorting, you can process intervals left to right. For each interval, compare it with the **last interval in your result array** (not just the next input interval). If they overlap, extend the end of the last result interval. If they don't, push a new interval.

This handles chains naturally: the result interval keeps growing as long as new intervals overlap with it.
