# Hint 3 — Implementation

```
result = new Array(n)

// Left pass: prefix products
result[0] = 1
for i from 1 to n-1:
    result[i] = result[i-1] * nums[i-1]

// Right pass: multiply by suffix products
rightProduct = 1
for i from n-2 down to 0:
    rightProduct *= nums[i+1]
    result[i] *= rightProduct

return result
```

After the left pass, `result[i]` holds the product of all elements to the left. The right pass multiplies in the product of all elements to the right, completing the answer.
