# Water and Jug Problem

**ID:** `ms-009-water-jug-problem`
**Difficulty:** ★★★☆☆
**Estimated Time:** 20 minutes
**Tags:** `math`, `gcd`, `bfs`
**Prerequisites:** None

---

## The Problem

You are given two jugs with capacities `x` liters and `y` liters. There is an infinite amount of water supply available. Determine whether it is possible to measure exactly `z` liters using these two jugs.

The allowed operations are:
- Fill any of the jugs with water.
- Empty any of the jugs.
- Pour water from one jug into another until the other jug is completely full, or the first jug is empty.

### Examples

**Example 1:**
```
Input: x = 3, y = 5, z = 4
Output: true
Explanation: Fill the 5-liter jug, pour into 3-liter jug (leaves 2 in the 5L jug),
empty the 3L jug, pour the 2L into the 3L jug, fill the 5L jug, pour into 3L jug
(only 1L fits), leaving 4L in the 5L jug.
```

**Example 2:**
```
Input: x = 2, y = 6, z = 5
Output: false
Explanation: Both jugs have even capacity, so you can only measure even amounts.
```

**Example 3:**
```
Input: x = 1, y = 0, z = 0
Output: true
```

### Constraints

- `0 <= x, y, z <= 10^7`

## What's Wrong

The current implementation uses **BFS** to explore all possible states `(a, b)` where `a` is the amount of water in jug 1 and `b` is the amount in jug 2. For each state, it generates 6 possible next states (fill/empty/pour operations).

While this approach is **correct**, the state space is **O(x * y)** which makes it impossibly slow for large inputs like `x = 10,000,003` and `y = 10,000,007`. The BFS would need to explore billions of states and store them all in memory.

There is a mathematical solution based on **Bezout's identity** that runs in O(log(min(x,y))) time.

## Your Task

1. Replace the BFS approach with a **mathematical solution**
2. Use the fact that `z` is measurable if and only if:
   - `z <= x + y`, AND
   - `z` is divisible by `gcd(x, y)`
3. Handle edge cases where `x` or `y` is 0
4. Implement the **Euclidean algorithm** for computing GCD

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Replace the BFS approach with a GCD-based mathematical solution |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Direction)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Technique)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(x * y) | O(x * y) |
| **Target** | **O(log(min(x,y)))** | **O(1)** |
