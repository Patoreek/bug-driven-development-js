# Explanation: Valid Palindrome

## Why the Bug Happens

The buggy solution treats the entire string as-is:

```typescript
// BUGGY
const reversed = s.split("").reverse().join("");
return s === reversed;
```

This fails because:
1. **Non-alphanumeric characters are included** -- spaces, commas, colons, etc. are part of the comparison, so `"A man, a plan..."` reversed is `"...nalp a ,nam A"`, which is completely different.
2. **Case is not normalized** -- even `"Aa"` would fail because `"Aa"` reversed is `"aA"`, and `"Aa" !== "aA"`.

## The Fix

Use two pointers that skip non-alphanumeric characters and compare in lowercase:

```diff
- export function isPalindrome(s: string): boolean {
-   const reversed = s.split("").reverse().join("");
-   return s === reversed;
- }
+ export function isPalindrome(s: string): boolean {
+   let left = 0;
+   let right = s.length - 1;
+
+   while (left < right) {
+     while (left < right && !isAlphanumeric(s[left])) left++;
+     while (left < right && !isAlphanumeric(s[right])) right--;
+
+     if (s[left].toLowerCase() !== s[right].toLowerCase()) {
+       return false;
+     }
+     left++;
+     right--;
+   }
+   return true;
+ }
+
+ function isAlphanumeric(c: string): boolean {
+   return /[a-zA-Z0-9]/.test(c);
+ }
```

## Visual Walkthrough

For `"A man, a plan, a canal: Panama"`:

```
Step 1: left='A', right='a' -> 'a'=='a' -> match
Step 2: left='m', right='m' -> match
Step 3: left='a', right='a' -> match
Step 4: left='n', right='n' -> match
...all characters match -> true
```

The pointers skip over spaces, commas, and the colon automatically.

## Complexity Comparison

| | Time | Space |
|---|---|---|
| Buggy (string reverse) | O(n) | O(n) -- creates reversed string |
| **Fixed (two pointers)** | **O(n)** | **O(1)** -- in-place comparison |

## Common Variations

- **Palindrome with only letters** (ignore digits too)
- **Valid Palindrome II** (LeetCode 680) -- can remove at most one character
- **Palindrome Linked List** -- same concept but with linked list traversal

## Interview Follow-ups

- "Can you do it without regex?" -- Yes, use character code comparisons: `(c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')`
- "What if Unicode characters are involved?" -- Need to handle Unicode normalization
- "How would you handle Palindrome II?" -- Same two-pointer approach, but when a mismatch is found, try skipping either the left or right character
