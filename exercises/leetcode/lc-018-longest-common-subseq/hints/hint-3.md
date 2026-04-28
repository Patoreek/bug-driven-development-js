# Hint 3 — Implementation

```
dp = (n+1) x (m+1) table, all zeros

for i from 1 to n:
  for j from 1 to m:
    if text1[i-1] === text2[j-1]:
      dp[i][j] = dp[i-1][j-1] + 1
    else:
      dp[i][j] = max(dp[i-1][j], dp[i][j-1])

return dp[n][m]
```

Note the 1-based indexing: `dp[i][j]` corresponds to `text1[i-1]` and `text2[j-1]`. Row 0 and column 0 represent empty strings (all zeros).
