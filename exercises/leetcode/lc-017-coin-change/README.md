# Coin Change

**ID:** `lc-017-coin-change`
**Difficulty:** ★★★☆☆
**Estimated Time:** 25 minutes
**Tags:** `dynamic-programming`, `greedy`, `bottom-up-dp`
**Prerequisites:** None

---

## The Problem

You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.

Return the **fewest number of coins** needed to make up that amount. If the amount cannot be made up by any combination of the coins, return `-1`.

You may assume you have an infinite number of each kind of coin.

### Examples

```
Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 5 + 5 + 1 = 11 → 3 coins

Input: coins = [2], amount = 3
Output: -1

Input: coins = [1], amount = 0
Output: 0
```

### Constraints

- 1 <= coins.length <= 12
- 1 <= coins[i] <= 2^31 - 1
- 0 <= amount <= 10,000

## What's Wrong

The current solution uses a **greedy approach**: sort coins descending, always pick the largest coin that fits. While this works for standard US/EU coin systems, it **fails for arbitrary coin sets**.

For example, with `coins = [1, 3, 4]` and `amount = 6`:
- Greedy picks: 4 + 1 + 1 = **3 coins**
- Optimal: 3 + 3 = **2 coins**

The greedy approach doesn't consider that skipping the largest coin could lead to a better overall solution.

## Your Task

1. Replace the greedy approach in `src/solution.ts` with dynamic programming
2. Handle the case where the amount is impossible (return -1)
3. All tests must pass, including greedy-breaking test cases
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Greedy approach that fails on certain inputs |

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
| Current (greedy) | O(n log n) | O(1) — but WRONG |
| **Target (DP)** | **O(amount * n)** | **O(amount)** |

where n = number of coin denominations
