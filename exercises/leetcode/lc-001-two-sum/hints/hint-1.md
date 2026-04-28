# Hint 1 — Approach

Think about what you're really searching for in the inner loop. For each number `nums[i]`, you need to find if `target - nums[i]` exists elsewhere in the array.

What data structure lets you look up whether a value exists in **O(1)** time?
