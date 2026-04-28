# Hint 2 — Data Structure

Use a **Map** where:
- **Key**: the sorted version of each word (e.g., "aet" for both "eat" and "tea")
- **Value**: an array of all words that share that sorted key

This way, you only need to sort each word once and perform a single O(1) map lookup per word, eliminating the inner loop entirely.
