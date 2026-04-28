# Explanation — Merge Two Sorted Lists

## Why the Brute Force is Wasteful

The buggy solution:
1. Traverses `list1` to build `arr1` — O(n) time, O(n) space
2. Traverses `list2` to build `arr2` — O(m) time, O(m) space
3. Merges the two arrays — O(n+m) time, O(n+m) space
4. Converts back to a linked list with **new** ListNode objects — O(n+m)

Total: O(n+m) time, O(n+m) space. The time is fine, but the space is entirely unnecessary since we already have nodes we can reuse.

## The Optimal Solution

Use a dummy head pointer and walk both lists simultaneously:

```typescript
// Before (array-based):
const arr1: number[] = [];
let current = list1;
while (current) { arr1.push(current.val); current = current.next; }
// ... same for arr2, merge arrays, arrayToList(merged)

// After (in-place):
const dummy = new ListNode(-1);
let tail = dummy;
while (list1 !== null && list2 !== null) {
  if (list1.val <= list2.val) {
    tail.next = list1;
    list1 = list1.next;
  } else {
    tail.next = list2;
    list2 = list2.next;
  }
  tail = tail.next;
}
tail.next = list1 ?? list2;
return dummy.next;
```

## Visual Walkthrough

```
list1: 1 -> 3 -> 5
list2: 2 -> 4 -> 6

Step 1: dummy -> 1       (list1 smaller, advance list1)
Step 2: dummy -> 1 -> 2  (list2 smaller, advance list2)
Step 3: dummy -> 1 -> 2 -> 3  (list1 smaller)
Step 4: dummy -> 1 -> 2 -> 3 -> 4  (list2 smaller)
Step 5: dummy -> 1 -> 2 -> 3 -> 4 -> 5  (list1 smaller, list1 exhausted)
Step 6: Attach remaining: -> 5 -> 6

Result: 1 -> 2 -> 3 -> 4 -> 5 -> 6
```

## Complexity Comparison

| Approach | Time | Space |
|----------|------|-------|
| Array conversion | O(n+m) | O(n+m) |
| **Dummy head merge** | **O(n+m)** | **O(1)** |

## The Dummy Head Pattern

The dummy head technique is one of the most important linked list patterns:
- Eliminates special-case code for "which node should be the head"
- The real result is always `dummy.next`
- Used in: merge sort on lists, partition lists, add two numbers as lists

## Common Variations

- **Merge K sorted lists** — use a min-heap to generalize this to K lists (LeetCode 23)
- **Sort a linked list** — use merge sort, splitting with slow/fast pointers (LeetCode 148)
- **Merge sorted arrays in-place** — similar two-pointer logic (LeetCode 88)

## Interview Follow-ups

- "What if you need to merge K lists?" — Priority queue / divide-and-conquer
- "Can you do this recursively?" — Yes, but uses O(n+m) stack space
- "What about stability?" — This merge is stable (equal elements keep their relative order)
