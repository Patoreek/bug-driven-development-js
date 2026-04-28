# Longest Common Subsequence

**ID:** `lc-018-longest-common-subseq`
**Difficulty:** ★★★★☆
**Estimated Time:** 30 minutes
**Tags:** `dynamic-programming`, `string`, `2d-dp`
**Prerequisites:** None

---

## The Problem

Given two strings `text1` and `text2`, return the length of their **longest common subsequence**. If there is no common subsequence, return `0`.

A **subsequence** is a sequence derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

### Examples

```
Input: text1 = "abcde", text2 = "ace"
Output: 3
Explanation: The LCS is "ace"

Input: text1 = "abc", text2 = "abc"
Output: 3
Explanation: The LCS is "abc" (the entire string)

Input: text1 = "abc", text2 = "def"
Output: 0
Explanation: No common subsequence
```

### Constraints

- 1 <= text1.length, text2.length <= 1000
- text1 and text2 consist of only lowercase English characters

## What's Wrong

The current solution generates **all subsequences** of `text1` (there are 2^n of them) and checks each one against `text2`. This is **O(2^n * m)** time, which is impossibly slow for strings of length 20+.

## Your Task

1. Replace the brute force approach in `src/solution.ts` with a 2D DP solution
2. Target: **O(n * m)** time
3. All tests must pass, including the performance test
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Brute force O(2^n * m) subsequence generation |

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
| Current | O(2^n * m) | O(n) recursion stack |
| **Target** | **O(n * m)** | **O(n * m)** |
