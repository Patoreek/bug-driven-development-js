# Explanation — Climbing Stairs

## Why the Brute Force is Slow

The naive recursion creates an exponential call tree:

```
                    climbStairs(5)
                   /              \
          climbStairs(4)      climbStairs(3)
          /          \          /          \
    climbStairs(3)  climbStairs(2)  climbStairs(2)  climbStairs(1)
    /       \
climbStairs(2) climbStairs(1)
```

`climbStairs(3)` is calculated twice, `climbStairs(2)` is calculated three times, and it gets exponentially worse as n grows. Total calls: O(2^n).

For n=45, that's ~35 billion recursive calls. Not feasible.

## The Optimal Solution

```typescript
// Before (naive recursion):
function climbStairs(n: number): number {
  if (n <= 0) return 1;
  if (n === 1) return 1;
  return climbStairs(n - 1) + climbStairs(n - 2);
}

// After (bottom-up DP):
function climbStairs(n: number): number {
  if (n <= 0) return 1;
  if (n === 1) return 1;

  let prev2 = 1; // ways(0)
  let prev1 = 1; // ways(1)

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
```

## Visual Walkthrough

```
n=5:
  i=2: current = 1+1 = 2   (prev2=1, prev1=2)
  i=3: current = 2+1 = 3   (prev2=2, prev1=3)
  i=4: current = 3+2 = 5   (prev2=3, prev1=5)
  i=5: current = 5+3 = 8   (prev2=5, prev1=8)

  Return 8 ✓

n:       0  1  2  3  4  5
ways:    1  1  2  3  5  8   ← Fibonacci sequence
```

## Three Levels of Optimization

| Level | Approach | Time | Space |
|-------|----------|------|-------|
| 1 | Naive recursion | O(2^n) | O(n) stack |
| 2 | Memoized recursion | O(n) | O(n) memo + stack |
| 3 | **Bottom-up with 2 vars** | **O(n)** | **O(1)** |

Level 2 (memoization) is also acceptable in interviews:

```typescript
const memo = new Map<number, number>();
function climbStairs(n: number): number {
  if (n <= 1) return 1;
  if (memo.has(n)) return memo.get(n)!;
  const result = climbStairs(n - 1) + climbStairs(n - 2);
  memo.set(n, result);
  return result;
}
```

## Why This is Fibonacci

The recurrence `f(n) = f(n-1) + f(n-2)` with `f(0) = 1, f(1) = 1` is exactly the Fibonacci sequence (shifted by one index). This insight helps you recognize similar problems instantly.

## Common Variations

- **Min cost climbing stairs** — add cost to each step, minimize total (LeetCode 746)
- **Climbing stairs with k steps** — generalize to 1..k steps per move
- **Decode ways** — similar recurrence but with conditional branching (LeetCode 91)
- **House robber** — same DP structure: `dp[i] = max(dp[i-1], dp[i-2] + val[i])` (LeetCode 198)

## Interview Follow-ups

- "Can you solve this in O(log n)?" — Yes, using matrix exponentiation: [[1,1],[1,0]]^n
- "What if you can take 1, 2, or 3 steps?" — Extend to three variables: `f(n) = f(n-1) + f(n-2) + f(n-3)`
- "Why is this the Fibonacci sequence?" — Each way to reach step n either came from step n-1 (took 1 step) or step n-2 (took 2 steps)
