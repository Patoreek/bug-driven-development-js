# Hint 1 — Approach

You don't need to create new nodes or collect values into an array. You can reverse a linked list by changing the `next` pointer of each node to point **backward** instead of forward.

Think about what happens if you just set `current.next = previous` for each node as you walk through the list.
