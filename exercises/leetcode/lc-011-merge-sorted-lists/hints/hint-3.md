# Hint 3 — Implementation

```
1. Create dummy = new ListNode(-1), tail = dummy
2. While both list1 and list2 are non-null:
   - If list1.val <= list2.val: tail.next = list1, advance list1
   - Else: tail.next = list2, advance list2
   - Advance tail
3. When one list runs out, attach the other: tail.next = list1 ?? list2
4. Return dummy.next
```

The key insight: you're just reassigning `.next` pointers on existing nodes, never allocating new ones.
