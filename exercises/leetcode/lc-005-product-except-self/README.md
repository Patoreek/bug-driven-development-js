# Product of Array Except Self

**ID:** `lc-005-product-except-self`
**Difficulty:** ★★★☆☆
**Estimated Time:** 25 minutes
**Tags:** `arrays`, `prefix-sum`, `math`
**Prerequisites:** None

---

## The Problem

Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.

You must write an algorithm that runs in O(n) time and **without using the division operator**.

### Examples

```
Input: nums = [1, 2, 3, 4]
Output: [24, 12, 8, 6]
Explanation: answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, etc.

Input: nums = [-1, 1, 0, -3, 3]
Output: [0, 0, 9, 0, 0]
```

### Constraints

- 2 <= nums.length <= 100,000
- -30 <= nums[i] <= 30
- The product of any prefix or suffix of nums fits in a 32-bit integer
- You must NOT use division

## What's Wrong

The current solution uses **nested loops**: for each element, it multiplies all other elements. This is **O(n^2)** time complexity.

## Your Task

1. Optimize the solution in `src/solution.ts`
2. Achieve the target time complexity: **O(n)** without using division
3. Ensure all tests pass, including the performance test
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | The brute-force O(n^2) solution to optimize |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Approach)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Technique)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(n^2) | O(n) |
| **Target** | **O(n)** | **O(1) extra** |

Note: The output array does not count as extra space.
