# Hint 1 — Approach

The product of all elements except `nums[i]` is the same as:

`(product of everything LEFT of i) * (product of everything RIGHT of i)`

Can you precompute these left and right products efficiently?
