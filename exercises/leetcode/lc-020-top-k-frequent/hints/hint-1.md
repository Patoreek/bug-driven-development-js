# Hint 1 — Approach

The O(n log n) bottleneck comes from comparison-based sorting. Can you avoid sorting entirely?

Think about the range of possible frequencies. In an array of size `n`, an element's frequency is between 1 and `n`. That's a bounded range, which means you can use a non-comparison sort.
