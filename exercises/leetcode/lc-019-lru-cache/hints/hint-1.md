# Hint 1 — Approach

The bottleneck is the array used to track access order. Arrays are O(n) for removal from the middle and O(n) for shift from the front.

You need a data structure that supports:
1. O(1) removal of a node from anywhere
2. O(1) insertion at the end
3. O(1) removal from the front

What data structure supports all three?
