# Simplify Path

**ID:** `ms-002-simplify-path`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 15 minutes
**Tags:** `stack`, `string`
**Prerequisites:** None

---

## The Problem

Given an absolute Unix-style file path, simplify it by converting it to the **canonical path**.

The canonical path should:
- Start with a single slash `/`
- Not end with a trailing slash `/` (unless it is the root)
- Not contain `.` (current directory) or `..` (parent directory) tokens
- Not contain multiple consecutive slashes

### Examples

```
Input: path = "/home/"
Output: "/home"

Input: path = "/a/./b/../../c/"
Output: "/c"

Input: path = "/../"
Output: "/"

Input: path = "/home//foo/"
Output: "/home/foo"

Input: path = "/a/b/../c"
Output: "/a/c"
```

### Constraints

- 1 <= path.length <= 3000
- `path` consists of English letters, digits, period `.`, slash `/`, or underscore `_`
- `path` is a valid absolute Unix path

## What's Wrong

The current solution correctly handles empty strings (from consecutive slashes) and single dots (current directory). However, when it encounters `..` (parent directory), it **skips the token without popping the previous directory** from the result stack. This means parent navigation is completely ignored -- `/a/b/../c` returns `/a/b/c` instead of the correct `/a/c`.

## Your Task

1. Fix the `simplifyPath` function in `src/solution.ts`
2. Properly handle `..` by navigating to the parent directory
3. Ensure `..` at root level does nothing (can't go above root)
4. Ensure all tests pass

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | The buggy path simplifier that ignores parent directory navigation |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Data Structure)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (The Missing Operation)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(n) | O(n) |
| **Target** | **O(n)** | **O(n)** |
