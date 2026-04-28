# Hint 3 — Implementation

```
function climbStairs(n):
  if n <= 1: return 1

  prev2 = 1    // ways(0)
  prev1 = 1    // ways(1)

  for i from 2 to n:
    current = prev1 + prev2
    prev2 = prev1
    prev1 = current

  return prev1
```

This is O(n) time, O(1) space. No recursion, no array — just slide two variables forward.
