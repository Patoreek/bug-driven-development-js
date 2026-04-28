# Hint 1 — Approach

The bugs stem from a missing precondition. If the intervals were **sorted by start time**, then overlapping intervals would always be adjacent in the sorted order. That eliminates both bugs at once.

What's the first thing you should do before trying to merge?
