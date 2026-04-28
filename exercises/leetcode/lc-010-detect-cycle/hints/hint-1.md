# Hint 1 — Approach

Imagine two people walking on a circular track at different speeds. The faster person will eventually lap the slower person — they'll meet.

Now imagine walking through a linked list. If there's a cycle, a faster walker will eventually "catch up" to a slower walker inside the cycle. If there's no cycle, the faster walker will reach the end.

This is called **Floyd's Cycle Detection** (or the "tortoise and hare" algorithm).
