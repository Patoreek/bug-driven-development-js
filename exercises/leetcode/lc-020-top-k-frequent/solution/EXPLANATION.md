# Explanation — Top K Frequent Elements

## Why the Sort Approach is O(n log n)

The buggy solution counts frequencies in O(n), then sorts:

```typescript
const sorted = [...freqMap.entries()].sort((a, b) => b[1] - a[1]);
return sorted.slice(0, k).map(([num]) => num);
```

`Array.sort()` is a comparison-based sort with O(n log n) time. Since we only need the top k elements (not the full sorted order), sorting everything is overkill.

## The Optimal Solution: Bucket Sort

```typescript
// Before (sort-based):
const sorted = [...freqMap.entries()].sort((a, b) => b[1] - a[1]);
return sorted.slice(0, k).map(([num]) => num);

// After (bucket sort):
const buckets: number[][] = new Array(nums.length + 1);
for (let i = 0; i <= nums.length; i++) buckets[i] = [];

for (const [num, freq] of freqMap) {
  buckets[freq].push(num);
}

const result: number[] = [];
for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
  for (const num of buckets[i]) {
    result.push(num);
    if (result.length === k) break;
  }
}
return result;
```

## Visual Walkthrough

```
nums = [1, 1, 1, 2, 2, 3], k = 2

Step 1: Frequency map
  1 → 3, 2 → 2, 3 → 1

Step 2: Bucket sort
  buckets[0] = []
  buckets[1] = [3]     (appears 1 time)
  buckets[2] = [2]     (appears 2 times)
  buckets[3] = [1]     (appears 3 times)
  buckets[4] = []
  buckets[5] = []
  buckets[6] = []

Step 3: Walk from highest bucket
  i=6: empty
  i=5: empty
  i=4: empty
  i=3: push 1 → result = [1]
  i=2: push 2 → result = [1, 2] → done!

Result: [1, 2] ✓
```

## Why This is O(n)

- Frequency counting: O(n)
- Building buckets: O(unique elements) <= O(n)
- Walking buckets: O(n) total across all buckets (each element appears in exactly one bucket)

Total: O(n)

## Complexity Comparison

| Approach | Time | Space |
|----------|------|-------|
| Sort all | O(n log n) | O(n) |
| Min-heap of size k | O(n log k) | O(n) |
| **Bucket sort** | **O(n)** | **O(n)** |

## Why Bucket Sort Works Here

Bucket sort is O(n) when the range of values is bounded by O(n). Since frequencies range from 1 to n (the array size), the bucket array is at most size n+1.

This is the same principle behind counting sort and radix sort — when you know the value range, you can beat O(n log n).

## Common Variations

- **Sort characters by frequency** — same bucket sort technique on characters (LeetCode 451)
- **Top K frequent words** — need to handle alphabetical tiebreaking (LeetCode 692)
- **Kth largest element** — related problem using quickselect (LeetCode 215)
- **Sort array by increasing frequency** — combine frequency count with custom sort (LeetCode 1636)

## Interview Follow-ups

- "What if k is very small?" — A min-heap of size k gives O(n log k) which may be better for small k
- "What if you also need the frequencies?" — Return the bucket index alongside the elements
- "Can you do this with a stream of data?" — Use a min-heap; bucket sort requires knowing n upfront
- "Why not use quickselect?" — Quickselect gives average O(n) but worst case O(n^2); bucket sort is always O(n)
