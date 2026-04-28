# Climbing Stairs

**ID:** `lc-016-climbing-stairs`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 15 minutes
**Tags:** `dynamic-programming`, `recursion`, `memoization`, `fibonacci`
**Prerequisites:** None

---

## The Problem

You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

### Examples

```
Input: n = 2
Output: 2
Explanation: (1+1) or (2)

Input: n = 3
Output: 3
Explanation: (1+1+1), (1+2), (2+1)

Input: n = 5
Output: 8
```

### Constraints

- 0 <= n <= 45

## What's Wrong

The current solution uses **naive recursion** that branches into two calls at each step: `climbStairs(n-1) + climbStairs(n-2)`. This creates an exponential call tree of **O(2^n)** where the same subproblems are recalculated millions of times. For `n=45`, this would take an impractically long time.

## Your Task

1. Optimize `src/solution.ts` to handle `n=45` instantly
2. Target: **O(n) time**, **O(1) space**
3. All tests must pass, including the performance test
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Naive O(2^n) recursive solution |

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
| Current | O(2^n) | O(n) call stack |
| **Target** | **O(n)** | **O(1)** |
