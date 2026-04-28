# Explanation — Product of Array Except Self

## The Brute Force Approach (What's Given)

```typescript
for (let i = 0; i < n; i++) {
  let product = 1;
  for (let j = 0; j < n; j++) {
    if (i !== j) {
      product *= nums[j];
    }
  }
  result[i] = product;
}
```

For each of the n elements, we multiply all n-1 other elements. That's **O(n^2)** multiplications.

### Why Not Division?

You might think: compute the total product, then divide by each element. But:
1. The problem explicitly forbids division
2. Division fails when any element is zero (division by zero)
3. Multiple zeros make it even trickier

## The Optimal Approach

### Key Insight

For any index `i`, the product of all other elements equals:

```
(product of nums[0..i-1]) * (product of nums[i+1..n-1])
     left prefix               right suffix
```

We can compute all prefix products in one left-to-right pass, and all suffix products in one right-to-left pass.

### Algorithm Walkthrough

Given `nums = [1, 2, 3, 4]`:

**Pass 1 — Left (prefix products):**

| i | result[i] = product of elements to the left |
|---|----------------------------------------------|
| 0 | 1 (nothing to the left) |
| 1 | 1 |
| 2 | 1 * 2 = 2 |
| 3 | 1 * 2 * 3 = 6 |

After pass 1: `result = [1, 1, 2, 6]`

**Pass 2 — Right (multiply by suffix products):**

| i | rightProduct | result[i] = result[i] * rightProduct |
|---|-------------|--------------------------------------|
| 3 | 1 (nothing to the right) | 6 * 1 = 6 |
| 2 | 4 | 2 * 4 = 8 |
| 1 | 4 * 3 = 12 | 1 * 12 = 12 |
| 0 | 12 * 2 = 24 | 1 * 24 = 24 |

Final: `result = [24, 12, 8, 6]`

### The Fix

```typescript
export function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n);

  // Pass 1: left prefix products
  result[0] = 1;
  for (let i = 1; i < n; i++) {
    result[i] = result[i - 1] * nums[i - 1];
  }

  // Pass 2: multiply by right suffix products
  let rightProduct = 1;
  for (let i = n - 2; i >= 0; i--) {
    rightProduct *= nums[i + 1];
    result[i] *= rightProduct;
  }

  return result;
}
```

## Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Brute force | O(n^2) | O(n) |
| **Prefix/suffix** | **O(n)** | **O(1) extra** |

Two passes through the array, each O(n). The `rightProduct` variable is O(1) extra space. The output array doesn't count as extra space per the problem statement.

## Handling Zeros

This approach handles zeros naturally:
- **One zero**: only the position with zero gets a non-zero result (the product of all non-zero elements). All other positions get 0 because their product includes the zero.
- **Multiple zeros**: every position gets 0 because every product includes at least one zero.

No special cases needed.

## Common Interview Follow-ups

- **"Can you do it with division?"** Yes, if allowed: compute total product, divide by each element. But you need special handling for zeros.
- **"What about integer overflow?"** In JavaScript, numbers are 64-bit floats, so overflow becomes precision loss. In languages like Java/C++, you'd need to consider this.
- **"Prefix sum variation?"** Same concept applies to prefix sums for range-sum queries (see prefix sum arrays and Fenwick trees).
- **"What if we need modular arithmetic?"** Multiply using `(a * b) % MOD` at each step.

## References

- [LeetCode 238. Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)
- [Prefix Sum Pattern](https://en.wikipedia.org/wiki/Prefix_sum)
