# Explanation — Two Sum

## The Brute Force Approach (What's Given)

The provided solution uses nested loops to check every possible pair:

```typescript
for (let i = 0; i < nums.length; i++) {
  for (let j = i + 1; j < nums.length; j++) {
    if (nums[i] + nums[j] === target) {
      return [i, j];
    }
  }
}
```

This checks n*(n-1)/2 pairs, giving **O(n^2) time** and **O(1) space**.

For an array of 50,000 elements, that's ~1.25 billion comparisons.

## The Optimal Approach

### Key Insight

For each number `nums[i]`, we need to know: "Does `target - nums[i]` exist in the array, and at what index?" This is a **lookup** problem, and hash maps give us O(1) lookups.

### Algorithm Walkthrough

Given `nums = [2, 7, 11, 15]`, `target = 9`:

| Step | nums[i] | complement | Map contents | Found? |
|------|---------|-----------|--------------|--------|
| i=0 | 2 | 7 | {} | No. Store {2: 0} |
| i=1 | 7 | 2 | {2: 0} | Yes! Map has 2 at index 0. Return [0, 1] |

Only 2 iterations instead of checking all 6 pairs.

### The Fix

```typescript
export function twoSum(nums: number[], target: number): [number, number] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }

    map.set(nums[i], i);
  }

  throw new Error("No two sum solution found");
}
```

## Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Brute force | O(n^2) | O(1) |
| **Hash map** | **O(n)** | **O(n)** |

The hash map approach trades space for time. Each element is visited at most once, and each map operation (has, get, set) is O(1) amortized.

## Why Check Before Inserting?

By checking `map.has(complement)` **before** calling `map.set(nums[i], i)`, we ensure we never match an element with itself. For example, with `nums = [3, 3]` and `target = 6`:

- i=0: complement is 3. Map is empty, so no match. Store {3: 0}.
- i=1: complement is 3. Map has 3 at index 0. Return [0, 1].

If we inserted first, we'd need extra logic to avoid self-matching.

## Common Interview Follow-ups

- **"What if the array is sorted?"** Use two pointers from both ends. O(n) time, O(1) space.
- **"What if there are multiple valid pairs?"** Return all pairs. Use the same map approach but collect results instead of returning early.
- **"What if you need to return the values instead of indices?"** Simpler variant. A Set suffices instead of a Map since you don't need to track indices.
- **"Three Sum?"** Sort the array, then for each element, run two-pointer on the remainder. O(n^2) time.

## References

- [LeetCode 1. Two Sum](https://leetcode.com/problems/two-sum/)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
