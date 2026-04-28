# Explanation — Reverse Linked List

## The Buggy Approach (What's Given)

```typescript
// Collect values
const values: number[] = [];
let current = head;
while (current !== null) {
  values.push(current.val);
  current = current.next;
}

// Build new reversed list
let newHead: ListNode | null = null;
for (const val of values) {
  const node = new ListNode(val);
  node.next = newHead;
  newHead = node;
}
return newHead;
```

This creates entirely **new** ListNode objects. While the values are correct, the original nodes are abandoned. This uses **O(n) extra space** and fails any test that checks whether the same node objects are reused.

## The Optimal Approach

### Key Insight

A linked list is just a chain of nodes where each node points to the next. To reverse it, we reverse every `next` pointer so each node points to the **previous** node instead.

### Algorithm Walkthrough

Given: `1 -> 2 -> 3 -> null`

| Step | prev | current | next (saved) | After pointer reversal |
|------|------|---------|-------------|----------------------|
| 1 | null | 1 | 2 | null <- 1   2 -> 3 -> null |
| 2 | 1 | 2 | 3 | null <- 1 <- 2   3 -> null |
| 3 | 2 | 3 | null | null <- 1 <- 2 <- 3 |
| end | 3 | null | — | Return prev (3) |

Result: `3 -> 2 -> 1 -> null`

### Visual

```
Before:  1 → 2 → 3 → null
         ↑
        head

After:   null ← 1 ← 2 ← 3
                          ↑
                        new head (prev)
```

### The Fix

```typescript
export function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;

  while (current !== null) {
    const next = current.next;  // Save next
    current.next = prev;        // Reverse pointer
    prev = current;             // Advance prev
    current = next;             // Advance current
  }

  return prev;
}
```

## Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Copy values | O(n) | O(n) — new array + new nodes |
| **In-place reversal** | **O(n)** | **O(1)** — only 3 pointer variables |

## Why Order Matters

The four operations inside the loop MUST happen in this order:

1. **Save next** — before we overwrite `current.next`
2. **Reverse pointer** — `current.next = prev`
3. **Advance prev** — `prev = current`
4. **Advance current** — `current = next` (using the saved reference)

If step 2 happens before step 1, we lose access to the rest of the list.

## Recursive Alternative

```typescript
function reverseList(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
```

This is elegant but uses O(n) stack space due to recursion, so the iterative version is preferred for O(1) space.

## Common Interview Follow-ups

- **"Reverse in groups of K?"** Reverse K nodes at a time, connect groups. Much harder.
- **"Reverse between positions m and n?"** Partial reversal — need to track connection points.
- **"Is the list a palindrome?"** Reverse the second half and compare with the first half.
- **"Recursive solution?"** See above. Trade stack space for elegance.

## References

- [LeetCode 206. Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
- [MDN: Linked List Concepts](https://developer.mozilla.org/en-US/docs/Glossary/Linked_list)
