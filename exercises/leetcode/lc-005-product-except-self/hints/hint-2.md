# Hint 2 — Technique

Use a **two-pass** approach with prefix and suffix products:

1. **Left pass** (left to right): build an array where `result[i]` = product of all elements before index `i`
2. **Right pass** (right to left): multiply each `result[i]` by the product of all elements after index `i`

You can track the running suffix product in a single variable instead of a separate array, achieving O(1) extra space.
