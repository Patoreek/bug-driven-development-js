# Longest Substring Without Repeating Characters

**ID:** `lc-007-longest-substring`
**Difficulty:** ★★★☆☆
**Estimated Time:** 25 minutes
**Tags:** `strings`, `sliding-window`, `hash-map`, `two-pointers`
**Prerequisites:** None

---

## The Problem

Given a string `s`, find the length of the **longest substring** without repeating characters.

### Examples

```
Input: s = "abcabcbb"
Output: 3
Explanation: "abc" is the longest substring without repeating characters

Input: s = "bbbbb"
Output: 1
Explanation: "b" is the longest — every character repeats

Input: s = "pwwkew"
Output: 3
Explanation: "wke" is the longest (note: "pwke" is a subsequence, not a substring)
```

### Constraints

- 0 <= s.length <= 100,000
- `s` consists of English letters, digits, symbols and spaces

## What's Wrong

The current solution checks every possible substring starting from each index, using a Set to detect duplicates. This is **O(n^2)** because for each starting position, it scans forward until a duplicate is found.

## Your Task

1. Optimize the solution in `src/solution.ts`
2. Achieve the target time complexity: **O(n)** using a sliding window
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
<details><summary>Hint 2 (Data Structure)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(n^2) | O(min(n, k)) |
| **Target** | **O(n)** | **O(min(n, k))** |

Where `k` is the size of the character set.
