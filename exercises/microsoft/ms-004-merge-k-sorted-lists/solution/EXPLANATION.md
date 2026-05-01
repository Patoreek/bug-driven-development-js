# Explanation: Merge K Sorted Lists

## Why the Bug Happens

The buggy code merges lists **sequentially**:

```
merged = merge(list[0], list[1])        // touches list[0] + list[1] nodes
merged = merge(merged,  list[2])        // touches all previous + list[2] nodes
merged = merge(merged,  list[3])        // touches all previous + list[3] nodes
...
```

Each merge pass re-traverses all the nodes accumulated so far. If you have k lists with a total of N nodes, the sequential approach makes roughly `N * k / 2` comparisons on average, giving **O(kN)** time complexity.

For the test case with 500 lists of 500 nodes each (250,000 total nodes), this means ~62.5 million comparisons.

## The Fix

### Before (Sequential - O(kN)):

```typescript
export function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  if (lists.length === 0) return null;

  let merged = lists[0];
  for (let i = 1; i < lists.length; i++) {
    merged = mergeTwoLists(merged, lists[i]);
  }
  return merged;
}
```

### After (Divide and Conquer - O(N log k)):

```typescript
export function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  if (lists.length === 0) return null;

  let interval = 1;
  while (interval < lists.length) {
    for (let i = 0; i + interval < lists.length; i += interval * 2) {
      lists[i] = mergeTwoLists(lists[i], lists[i + interval]);
    }
    interval *= 2;
  }
  return lists[0];
}
```

## Visual Walkthrough

Given 8 lists: [L0, L1, L2, L3, L4, L5, L6, L7]

```
Round 1 (interval=1): merge pairs
  L0+L1 -> L0'    L2+L3 -> L2'    L4+L5 -> L4'    L6+L7 -> L6'

Round 2 (interval=2): merge merged pairs
  L0'+L2' -> L0''    L4'+L6' -> L4''

Round 3 (interval=4): merge final pair
  L0''+L4'' -> RESULT
```

Each round touches every node exactly once (N total comparisons per round), and there are log2(k) rounds. Total: **O(N log k)**.

## Complexity Comparison

| Approach | Time | Space | 500x500 test |
|----------|------|-------|--------------|
| Sequential | O(kN) | O(1) | ~62.5M comparisons |
| **Divide & Conquer** | **O(N log k)** | **O(1)** | **~2.25M comparisons** |

The divide-and-conquer approach is ~28x faster for this test case.

## Common Variations

1. **Min-Heap approach**: Use a min-heap of size k to always pick the smallest head. O(N log k) time, O(k) space. Equally optimal in time but uses more space.
2. **Recursive divide and conquer**: Split the list array in half recursively instead of using the interval approach. Same complexity, but uses O(log k) stack space.

## Interview Follow-ups

- "Can you do this with a priority queue/heap?" -- Yes, maintain a min-heap of list heads. Same time complexity.
- "What if lists are extremely unbalanced in size?" -- Divide and conquer still works because it merges by position, not size. The total work per round is still N.
- "What's the space complexity of each approach?" -- Sequential and D&C are both O(1) extra space (modifying lists in-place). Heap approach uses O(k) for the heap.
- This problem is a classic Microsoft/Google interview question that tests understanding of divide-and-conquer optimization.

## References

- [LeetCode 23 - Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)
- [Divide and Conquer - Wikipedia](https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm)
