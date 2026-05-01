# Valid Palindrome

**ID:** `ms-001-valid-palindrome`
**Difficulty:** ★☆☆☆☆
**Estimated Time:** 10 minutes
**Tags:** `string`, `two-pointer`
**Prerequisites:** None

---

## The Problem

Given a string `s`, return `true` if it is a palindrome, considering only alphanumeric characters and ignoring cases.

A palindrome reads the same forward and backward after converting all uppercase letters to lowercase and removing all non-alphanumeric characters.

### Examples

```
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: After filtering: "amanaplanacanalpanama" is a palindrome.

Input: s = "race a car"
Output: false
Explanation: After filtering: "raceacar" is not a palindrome.

Input: s = " "
Output: true
Explanation: After filtering: "" is an empty string, which is a palindrome.
```

### Constraints

- 1 <= s.length <= 200,000
- `s` consists only of printable ASCII characters

## What's Wrong

The current solution naively reverses the **entire** string (including spaces, punctuation, and mixed case) and compares it to the original. It does not filter out non-alphanumeric characters or normalize case before comparison. This means inputs like `"A man, a plan, a canal: Panama"` will incorrectly return `false`.

## Your Task

1. Fix the `isPalindrome` function in `src/solution.ts`
2. Ensure only alphanumeric characters are considered
3. Ensure the comparison is case-insensitive
4. Achieve O(1) space complexity (no extra string allocation)
5. Ensure all tests pass

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | The buggy palindrome checker that doesn't filter characters |

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
| Current | O(n) | O(n) |
| **Target** | **O(n)** | **O(1)** |
