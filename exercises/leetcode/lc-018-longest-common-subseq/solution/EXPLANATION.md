# Explanation — Longest Common Subsequence

## Why the Brute Force is Slow

The brute force generates all 2^n subsequences of `text1`:

```typescript
function generateSubsequences(index, current) {
  if (index === text1.length) {
    if (isSubsequence(current, text2)) maxLen = Math.max(maxLen, current.length);
    return;
  }
  generateSubsequences(index + 1, current + text1[index]); // include
  generateSubsequences(index + 1, current);                  // exclude
}
```

For `text1 = "abcdefghijklmnopqrst"` (20 chars), this generates 2^20 = 1,048,576 subsequences, each checked against text2 in O(m) time. For 1000 characters, 2^1000 is astronomically impossible.

## The Optimal Solution

```typescript
// Before (brute force):
// Generate all 2^n subsequences, check each → O(2^n * m)

// After (2D DP):
const dp: number[][] = Array.from({ length: n + 1 }, () =>
  new Array(m + 1).fill(0)
);

for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= m; j++) {
    if (text1[i - 1] === text2[j - 1]) {
      dp[i][j] = dp[i - 1][j - 1] + 1;
    } else {
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
}
return dp[n][m];
```

## Visual Walkthrough

```
text1 = "abcde", text2 = "ace"

     ""  a  c  e
""  [ 0, 0, 0, 0 ]
 a  [ 0, 1, 1, 1 ]    a==a → dp[0][0]+1=1
 b  [ 0, 1, 1, 1 ]    b!=a,c,e → carry forward
 c  [ 0, 1, 2, 2 ]    c==c → dp[1][1]+1=2
 d  [ 0, 1, 2, 2 ]    d!=a,c,e → carry forward
 e  [ 0, 1, 2, 3 ]    e==e → dp[3][2]+1=3

Answer: dp[5][3] = 3  ("ace")
```

## The Two Cases Explained

1. **Characters match** (`text1[i-1] === text2[j-1]`):
   This character extends the LCS found so far. Take the LCS without these two characters (`dp[i-1][j-1]`) and add 1.

2. **Characters don't match**:
   The LCS doesn't include at least one of these characters. Take the better of:
   - Skip the character from text1: `dp[i-1][j]`
   - Skip the character from text2: `dp[i][j-1]`

## Complexity Comparison

| Approach | Time | Space |
|----------|------|-------|
| Brute force | O(2^n * m) | O(n) |
| **2D DP** | **O(n * m)** | **O(n * m)** |
| Space-optimized DP | O(n * m) | O(min(n, m)) |

## Space Optimization

Since each row only depends on the previous row, you can use two 1D arrays instead of a full 2D table, reducing space to O(min(n, m)).

## Common Variations

- **Longest common substring** — must be contiguous, not just subsequence (reset to 0 on mismatch)
- **Edit distance** — minimum operations to transform one string to another (LeetCode 72)
- **Shortest common supersequence** — build the supersequence using LCS (LeetCode 1092)
- **Print the actual LCS** — backtrack through the DP table

## Interview Follow-ups

- "Can you print the actual LCS, not just the length?" — Backtrack from `dp[n][m]`: if chars match go diagonal, else go in direction of larger value
- "Can you optimize space?" — Use two 1D arrays or even one array with a temp variable
- "What about three strings?" — Extend to 3D DP table: `dp[i][j][k]`
