# Minimum Window Substring

**ID:** `lc-008-min-window-substring`
**Difficulty:** ★★★★☆
**Estimated Time:** 30 minutes
**Tags:** `strings`, `sliding-window`, `hash-map`, `two-pointers`
**Prerequisites:** `lc-007-longest-substring`

---

## The Problem

Given two strings `s` and `t`, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `""`.

### Examples

```
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: "BANC" is the smallest window in s that contains A, B, and C

Input: s = "a", t = "a"
Output: "a"

Input: s = "a", t = "aa"
Output: ""
Explanation: s doesn't have two 'a's
```

### Constraints

- 1 <= s.length, t.length <= 100,000
- `s` and `t` consist of uppercase and lowercase English letters

## What's Wrong

The current solution checks every possible substring of `s` using nested loops, and for each substring, counts character frequencies to check if it contains all characters of `t`. This is **O(n^2 * m)** or worse, and is far too slow for large inputs.

## Your Task

1. Optimize the solution in `src/solution.ts`
2. Achieve the target time complexity: **O(n + m)** using a sliding window
3. Ensure all tests pass, including the performance test
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | The brute-force O(n^2) solution to optimize |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Approach)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Technique)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(n^2 * m) | O(n + m) |
| **Target** | **O(n + m)** | **O(m)** |

Where `n = |s|` and `m = |t|`.
