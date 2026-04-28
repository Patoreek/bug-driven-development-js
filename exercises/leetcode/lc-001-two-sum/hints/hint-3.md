# Hint 3 — Implementation

Here's the algorithm in pseudocode:

```
create an empty Map

for each index i in nums:
    complement = target - nums[i]
    
    if map has complement:
        return [map.get(complement), i]
    
    map.set(nums[i], i)

throw error (no solution)
```

Key insight: you only need **one pass**. By checking before inserting, you naturally avoid using the same element twice.
