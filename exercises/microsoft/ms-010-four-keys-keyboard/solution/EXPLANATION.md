# Solution Explanation: Four Keys Keyboard

## Why the Bug Happens

The buggy code only considers **one specific pattern**: Ctrl-A, Ctrl-C, Ctrl-V (which uses 3 keystrokes to double the buffer). This is encoded as:

```typescript
dp[i] = Math.max(dp[i], dp[i - 3] * 2);
```

This misses the fact that after Ctrl-A + Ctrl-C, you can press Ctrl-V **multiple times**. Each additional Ctrl-V adds another copy of the buffer to the screen. So using 4 keystrokes (Ctrl-A, Ctrl-C, Ctrl-V, Ctrl-V) gives you 3x the buffer, 5 keystrokes gives 4x, and so on.

## Before/After

**Before (buggy):**
```typescript
for (let i = 7; i <= n; i++) {
  dp[i] = dp[i - 1] + 1;
  dp[i] = Math.max(dp[i], dp[i - 3] * 2); // Only doubling
}
```

**After (fixed):**
```typescript
for (let i = 1; i <= n; i++) {
  for (let j = i - 3; j >= 1; j--) {
    dp[i] = Math.max(dp[i], dp[j] * (i - j - 1));
  }
}
```

## Visual Walkthrough

For `n = 7`:

```
Keystrokes: [A] [A] [A] [Ctrl-A] [Ctrl-C] [Ctrl-V] [Ctrl-V]
             1    2    3     4        5         6        7

After key 3: screen = "AAA" (3 characters)
Key 4 (Ctrl-A): select all 3 characters
Key 5 (Ctrl-C): copy 3 characters to buffer
Key 6 (Ctrl-V): paste -> screen = "AAAAAA" (6 characters)
Key 7 (Ctrl-V): paste -> screen = "AAAAAAAAA" (9 characters)

Multiplier = (7 - 3 - 1) = 3, so dp[3] * 3 = 3 * 3 = 9
```

Buggy code: `dp[4] * 2 = 4 * 2 = 8` (wrong!)

## Complexity Comparison

| | Time | Space |
|---|---|---|
| Buggy (single paste) | O(n) | O(n) |
| **Correct (all break points)** | **O(n^2)** | **O(n)** |

The O(n^2) solution is fine given the constraint `n <= 50`.

## Common Variations

1. **What if Ctrl-V pastes at the cursor position instead of appending?** Same problem -- the key insight about multiple pastes remains.
2. **What if you could Ctrl-Z (undo)?** Adds another dimension to the DP state.
3. **Can you prove the optimal multiplier is always 3, 4, or 5?** Yes! For large n, the optimal strategy cycles through multiply-by-3 and multiply-by-4 segments. This is because `e` (Euler's number) is the optimal base, and 3 is the closest integer.

## Interview Follow-ups

- **Why not just always multiply by the largest possible number?** Because larger multipliers use more keystrokes, leaving fewer for building the base. The DP finds the optimal tradeoff.
- **What's the growth rate?** Roughly O(3^(n/4)) or equivalently O(n^(1/4) * 3^(n/4)), which is exponential.
- **Can you solve this in O(n) time?** With mathematical analysis, you can show the optimal break point is always within a constant distance, making it effectively O(n), but the O(n^2) DP is the standard interview answer.
