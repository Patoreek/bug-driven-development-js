# Two Sum

**ID:** `lc-001-two-sum`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 15 minutes
**Tags:** `arrays`, `hash-map`, `two-sum`
**Prerequisites:** None

---

## The Problem

Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

### Examples

```
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9

Input: nums = [3, 2, 4], target = 6
Output: [1, 2]

Input: nums = [3, 3], target = 6
Output: [0, 1]
```

### Constraints

- 2 <= nums.length <= 100,000
- -1,000,000,000 <= nums[i] <= 1,000,000,000
- Exactly one valid answer exists

## What's Wrong

The current solution uses **nested loops** to check every pair of numbers. This brute force approach is **O(n^2)** and will time out on large inputs.

## Your Task

1. Optimize the solution in `src/solution.ts`
2. Achieve the target time complexity: **O(n)**
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
<details><summary>Hint 2 (Data Structure)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(n^2) | O(1) |
| **Target** | **O(n)** | **O(n)** |
