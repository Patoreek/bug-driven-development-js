# Hint 2 — Data Structure

Use **bucket sort** by frequency. Create an array of size `n + 1` where the index represents the frequency count.

`buckets[i]` = list of all numbers that appear exactly `i` times.

Since max frequency is `n`, this array is bounded in size. Filling it is O(n) — one pass over the frequency map.
