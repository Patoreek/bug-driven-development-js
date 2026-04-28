# Hint 2 — Data Structure

Use a **Map** (hash map) to store each number you've seen so far, along with its index.

As you iterate through the array, for each number, compute its **complement** (`target - nums[i]`). Then check if the complement is already in the map.

This turns the O(n) inner loop lookup into an O(1) map lookup.
