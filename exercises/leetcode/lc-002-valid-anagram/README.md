# Valid Anagram

**ID:** `lc-002-valid-anagram`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 10 minutes
**Tags:** `strings`, `hash-map`, `sorting`, `frequency-counting`
**Prerequisites:** None

---

## The Problem

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

An anagram is a word formed by rearranging all the letters of another word, using every original letter exactly once.

### Examples

```
Input: s = "anagram", t = "nagaram"
Output: true

Input: s = "rat", t = "car"
Output: false

Input: s = "", t = ""
Output: true
```

### Constraints

- 0 <= s.length, t.length <= 500,000
- `s` and `t` consist of any characters

## What's Wrong

The current solution sorts both strings and compares them. While correct, sorting is **O(n log n)**. There's a linear-time approach that uses character counting.

## Your Task

1. Optimize the solution in `src/solution.ts`
2. Achieve the target time complexity: **O(n)**
3. Ensure all tests pass, including the performance test
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | The sort-based O(n log n) solution to optimize |

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
| Current | O(n log n) | O(n) |
| **Target** | **O(n)** | **O(k)** |

Where `k` is the size of the character set.
