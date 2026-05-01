# Reverse Words in a String (In-Place)

**ID:** `ms-003-reverse-words-string`
**Difficulty:** ★★☆☆☆
**Estimated Time:** 15 minutes
**Tags:** `string`, `array`, `in-place`
**Prerequisites:** None

---

## The Problem

Given a character array representing a sentence, reverse the order of words **in-place**. Words are separated by single spaces. You must modify the input array directly -- do not allocate extra space for another array.

### Examples

```
Input:  ['h','e','l','l','o',' ','w','o','r','l','d']
Output: ['w','o','r','l','d',' ','h','e','l','l','o']

Input:  ['t','h','e',' ','s','k','y',' ','i','s',' ','b','l','u','e']
Output: ['b','l','u','e',' ','i','s',' ','s','k','y',' ','t','h','e']
```

### Constraints

- 1 <= s.length <= 100,000
- `s[i]` is an English letter or a space `' '`
- There is at least one word in `s`
- Words are separated by exactly one space
- No leading or trailing spaces

## What's Wrong

The current solution performs Step 1 of the classic two-step algorithm: it reverses the entire character array. However, it **skips Step 2** -- reversing each individual word back to its correct letter order.

After only Step 1, `"hello world"` becomes `"dlrow olleh"` (every character is reversed). The missing Step 2 would reverse each word individually, turning `"dlrow"` back into `"world"` and `"olleh"` back into `"hello"`, producing the correct `"world hello"`.

## Your Task

1. Fix the `reverseWords` function in `src/solution.ts`
2. Add the missing second pass that reverses each individual word
3. The solution must work in-place with O(1) extra space
4. Ensure all tests pass

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | The buggy solution missing the word-reversal step |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (The Pattern)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (The Missing Step)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Implementation)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time | Space |
|---|---|---|
| Current | O(n) | O(1) |
| **Target** | **O(n)** | **O(1)** |
