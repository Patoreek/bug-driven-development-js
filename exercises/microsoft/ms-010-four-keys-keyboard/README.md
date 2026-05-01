# Four Keys Keyboard

**ID:** `ms-010-four-keys-keyboard`
**Difficulty:** ★★★☆☆
**Estimated Time:** 25 minutes
**Tags:** `dynamic-programming`, `math`
**Prerequisites:** None

---

## The Problem

You have a special keyboard with 4 keys:

1. **Key 1** - Print one 'A' on screen
2. **Key 2** - Select All (Ctrl-A)
3. **Key 3** - Copy (Ctrl-C)
4. **Key 4** - Paste (Ctrl-V)

Given `n` key presses, find the maximum number of 'A's you can produce on the screen.

### Examples

**Example 1:**
```
Input: n = 3
Output: 3
Explanation: Press A, A, A
```

**Example 2:**
```
Input: n = 7
Output: 9
Explanation: A, A, A, Ctrl-A, Ctrl-C, Ctrl-V, Ctrl-V
(3 A's, then select all, copy, paste twice = 3 * 3 = 9)
```

### Constraints

- `1 <= n <= 50`

## What's Wrong

The buggy implementation uses dynamic programming but has an incorrect recurrence relation. It only considers using Ctrl-A + Ctrl-C followed by a **single** Ctrl-V (doubling the buffer). It misses the critical insight that after Ctrl-A + Ctrl-C, you can press Ctrl-V **multiple times** to multiply the buffer by 3x, 4x, 5x, etc.

For example, with 7 keystrokes the optimal is: A, A, A, Ctrl-A, Ctrl-C, Ctrl-V, Ctrl-V = 9. But the buggy code only considers doubling, getting 8 instead.

## Your Task

1. Fix the DP recurrence to consider all possible break points `j` where you perform Ctrl-A + Ctrl-C
2. For each break point, calculate how many Ctrl-V presses follow (which determines the multiplier)
3. The multiplier for pasting is `(i - j - 1)` because keys `j+1` = Ctrl-A, `j+2` = Ctrl-C, and `j+3` through `i` are all Ctrl-V presses

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Fix the DP recurrence to consider multiple consecutive pastes |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Thinking about the multiplier)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (The recurrence structure)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Complete recurrence)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current (buggy) | O(n) | O(n) |
| **Target** | **O(n^2)** | **O(n)** |
