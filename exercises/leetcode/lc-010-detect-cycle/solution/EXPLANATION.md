# Explanation — Linked List Cycle Detection

## The Set-Based Approach (What's Given)

```typescript
const visited = new Set<ListNode>();
let current = head;
while (current !== null) {
  if (visited.has(current)) return true;
  visited.add(current);
  current = current.next;
}
return false;
```

This is correct and O(n) time, but uses **O(n) space** because it stores a reference to every node in the Set. For a list with 100,000 nodes, that's 100,000 Set entries.

## The Optimal Approach: Floyd's Tortoise and Hare

### Key Insight

If two pointers move at different speeds through a cycle, the faster one will eventually catch up to the slower one. This is like two runners on a circular track — the faster runner laps the slower one.

### Why It Works

Consider a cycle of length `C`. Once both pointers are inside the cycle:
- The gap between fast and slow changes by 1 each iteration (fast gains 1 step)
- After at most `C` iterations, the gap becomes a multiple of `C` — they meet

If there's no cycle, the fast pointer reaches `null` and we exit.

### Algorithm Walkthrough

Given: `1 -> 2 -> 3 -> 4 -> 2` (cycle back to node 2)

| Step | Slow | Fast | Met? |
|------|------|------|------|
| Start | 1 | 1 | No |
| 1 | 2 | 3 | No |
| 2 | 3 | 2 (wrapped) | No |
| 3 | 4 | 4 | Yes! |

### Visual

```
1 → 2 → 3 → 4
    ↑         |
    └─────────┘

Step 0: S=1, F=1
Step 1: S=2, F=3
Step 2: S=3, F=2 (fast went 3→4→2)
Step 3: S=4, F=4 (fast went 2→3→4) — MEET!
```

### The Fix

```typescript
export function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
}
```

## Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Set-based | O(n) | O(n) |
| **Floyd's algorithm** | **O(n)** | **O(1)** |

Time is still O(n) because the slow pointer traverses at most n nodes, and the fast pointer traverses at most 2n nodes. Space is O(1) — just two pointer variables.

## Why Check `fast.next` Too?

The fast pointer moves 2 steps at a time: `fast = fast.next.next`. If `fast.next` is `null`, accessing `fast.next.next` would throw an error. The condition `fast !== null && fast.next !== null` ensures we can safely take 2 steps.

## Common Interview Follow-ups

- **"Find the start of the cycle?"** After detection, reset one pointer to head. Move both at speed 1. They meet at the cycle start. (Mathematical proof involves the distance to the cycle entry.)
- **"Find the length of the cycle?"** After they meet, keep one pointer still and advance the other until they meet again. Count the steps.
- **"Detect and remove the cycle?"** Find the node just before the cycle start and set its `next` to `null`.
- **"Can you prove correctness mathematically?"** Let `L` = distance to cycle entry, `C` = cycle length. When slow enters the cycle, fast is `L % C` steps ahead. The gap closes by 1 per step, so they meet after `C - (L % C)` more steps.

## References

- [LeetCode 141. Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)
- [Floyd's Cycle Detection Algorithm](https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare)
