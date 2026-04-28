# Group Anagrams

**ID:** `lc-004-group-anagrams`
**Difficulty:** ★★★☆☆
**Estimated Time:** 20 minutes
**Tags:** `strings`, `hash-map`, `sorting`, `anagrams`
**Prerequisites:** None

---

## The Problem

Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.

An anagram is a word formed by rearranging the letters of a different word, using all the original letters exactly once.

### Examples

```
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["eat","tea","ate"],["tan","nat"],["bat"]]

Input: strs = [""]
Output: [[""]]

Input: strs = ["a"]
Output: [["a"]]
```

### Constraints

- 1 <= strs.length <= 10,000
- 0 <= strs[i].length <= 100
- strs[i] consists of lowercase English letters

## What's Wrong

The current solution uses a **brute force** approach: for each word, it compares against all remaining words to find anagrams, sorting each word repeatedly during comparisons. This results in **O(n^2 * k log k)** time complexity, where `n` is the number of strings and `k` is the maximum string length.

## Your Task

1. Optimize the solution in `src/solution.ts`
2. Achieve the target time complexity: **O(n * k log k)**
3. Ensure all tests pass, including the performance test
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | The brute-force O(n^2 * k log k) solution to optimize |

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
| Current | O(n^2 * k log k) | O(n * k) |
| **Target** | **O(n * k log k)** | **O(n * k)** |
