# Explanation: Water and Jug Problem

## Why the Bug Happens

The buggy implementation uses **BFS** to explore all reachable states `(a, b)` where `a` is the water in jug 1 and `b` is the water in jug 2. For each state, it generates 6 possible next states (fill/empty/pour operations).

While this approach is **correct**, the state space is **O(x * y)** — every combination of water levels in both jugs. For inputs like `x = 10,000,003` and `y = 10,000,007`, the BFS would need to explore up to ~10^14 states, requiring impossibly large memory and time.

The mathematical insight is **Bezout's identity**: for any integers `x` and `y`, the set of values achievable by `ax + by` (for integer a, b) is exactly the multiples of `gcd(x, y)`. Since the jug operations correspond to adding and subtracting multiples of x and y, the achievable water amounts are exactly the multiples of `gcd(x, y)`.

## The Fix

Replace BFS with a GCD check:

```diff
- // BFS approach — O(x*y) time and space
- export function canMeasureWater(x: number, y: number, z: number): boolean {
-   if (z === 0) return true;
-   if (x + y < z) return false;
-   const visited = new Set<string>();
-   const queue: [number, number][] = [[0, 0]];
-   visited.add("0,0");
-   while (queue.length > 0) {
-     const [a, b] = queue.shift()!;
-     if (a === z || b === z || a + b === z) return true;
-     // ... generate and enqueue 6 next states ...
-   }
-   return false;
- }

+ // GCD approach — O(log(min(x,y))) time, O(1) space
+ export function canMeasureWater(x: number, y: number, z: number): boolean {
+   if (z === 0) return true;
+   if (x + y < z) return false;
+   if (x === 0) return z === y;
+   if (y === 0) return z === x;
+   return z % gcd(x, y) === 0;
+ }
+
+ function gcd(a: number, b: number): number {
+   while (b !== 0) {
+     [a, b] = [b, a % b];
+   }
+   return a;
+ }
```

## Visual Walkthrough

**Example: x=3, y=5, z=4**

```
gcd(3, 5):
  gcd(3, 5) -> gcd(5, 3) -> gcd(3, 2) -> gcd(2, 1) -> gcd(1, 0) = 1

z % gcd(x, y) = 4 % 1 = 0  =>  true!
```

Since gcd(3, 5) = 1, any integer value from 0 to 8 (= 3 + 5) is achievable.

**Example: x=2, y=6, z=5**

```
gcd(2, 6):
  gcd(2, 6) -> gcd(6, 2) -> gcd(2, 0) = 2

z % gcd(x, y) = 5 % 2 = 1  =>  false!
```

Since gcd(2, 6) = 2, only even values are achievable: 0, 2, 4, 6, 8.

**Why Bezout's identity applies here:**

The jug operations effectively let you add or subtract `x` and `y` from a running total. By Bezout's identity, the set of all integer linear combinations `ax + by` consists of exactly the multiples of `gcd(x, y)`. Since we can also combine water in both jugs (total = a + b), the achievable amounts up to `x + y` are precisely the multiples of `gcd(x, y)` in the range `[0, x + y]`.

## Complexity Comparison

| Approach | Time | Space |
|----------|------|-------|
| BFS (buggy) | O(x * y) | O(x * y) |
| **GCD (optimal)** | **O(log(min(x,y)))** | **O(1)** |

For x = y = 10^7, BFS requires ~10^14 operations. GCD requires ~23 iterations.

## Common Variations

1. **Return the sequence of operations** — BFS is actually needed here since GCD only answers yes/no. But you can optimize BFS with the Extended Euclidean Algorithm to find the actual coefficients.
2. **Three jugs** — The GCD approach extends: `z` must be a multiple of `gcd(x, gcd(y, w))`.
3. **Minimum operations to measure z** — Requires BFS or dynamic programming.

## Interview Follow-ups

- "Prove why the GCD approach works." — Bezout's identity states that `gcd(x, y)` is the smallest positive value of `ax + by` for integers a, b. All multiples of `gcd(x, y)` are achievable.
- "What if z > x + y?" — Impossible, since the total capacity is x + y.
- "What if one jug has capacity 0?" — Then you can only use the other jug. You can measure 0 or the other jug's capacity.
- "When would you prefer BFS over GCD?" — When you need to output the actual sequence of operations, not just whether it's possible.

## References

- [LeetCode 365 - Water and Jug Problem](https://leetcode.com/problems/water-and-jug-problem/)
- [Bezout's Identity](https://en.wikipedia.org/wiki/B%C3%A9zout%27s_identity)
- [Euclidean Algorithm](https://en.wikipedia.org/wiki/Euclidean_algorithm)
