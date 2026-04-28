# Valid Parentheses

**ID:** `lc-006-valid-parentheses`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 15 minutes
**Tags:** `strings`, `stack`, `brackets`
**Prerequisites:** None

---

## The Problem

Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.

A string is valid if:
1. Open brackets are closed by the same type of bracket
2. Open brackets are closed in the correct order
3. Every close bracket has a corresponding open bracket of the same type

### Examples

```
Input: s = "()"
Output: true

Input: s = "([{}])"
Output: true

Input: s = "([)]"
Output: false
Explanation: The brackets are interleaved, not properly nested

Input: s = "(]"
Output: false
```

### Constraints

- 0 <= s.length <= 10,000
- `s` consists of parentheses only: `()[]{}` 

## What's Wrong

The current solution only **counts** opening and closing brackets. It returns `true` when the counts are equal. This is incorrect because:

- `"([)]"` has equal counts (2 open, 2 close) but is **not valid** (brackets are interleaved)
- `")("` has equal counts but is **not valid** (closing before opening)

The solution needs to verify both **type matching** and **correct nesting order**.

## Your Task

1. Fix the solution in `src/solution.ts`
2. Properly validate bracket matching and nesting order
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | The buggy counting-based solution to fix |

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
| Current | O(n) but incorrect | O(1) |
| **Target** | **O(n) and correct** | **O(n)** |
