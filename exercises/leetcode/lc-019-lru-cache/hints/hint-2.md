# Hint 2 — Data Structure

Use a **doubly linked list** for access-order tracking:
- Removing a node is O(1) if you have a reference to it
- Inserting at the tail is O(1)
- Removing from the head is O(1)

Combine with a **Hash Map** that maps keys to list nodes (not just values). This gives you O(1) lookup AND O(1) order manipulation.

Use **dummy sentinel nodes** for head and tail to avoid null-check edge cases.
