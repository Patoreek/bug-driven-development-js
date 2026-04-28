# Explanation — Valid Anagram

## The Sort-Based Approach (What's Given)

```typescript
const sortedS = s.split("").sort().join("");
const sortedT = t.split("").sort().join("");
return sortedS === sortedT;
```

This works correctly but has **O(n log n)** time complexity due to sorting. It also creates multiple intermediate arrays and strings, using **O(n)** extra space.

## The Optimal Approach

### Key Insight

Two strings are anagrams if and only if they contain the exact same characters with the exact same frequencies. Instead of sorting to normalize the order, just **count the characters**.

### Algorithm Walkthrough

Given `s = "anagram"`, `t = "nagaram"`:

**Step 1: Count characters in `s`**

| Char | Count |
|------|-------|
| a | 3 |
| n | 1 |
| g | 1 |
| r | 1 |
| m | 1 |

**Step 2: Decrement for each character in `t`**

| t char | Action | Result |
|--------|--------|--------|
| n | 1 -> 0 | OK |
| a | 3 -> 2 | OK |
| g | 1 -> 0 | OK |
| a | 2 -> 1 | OK |
| r | 1 -> 0 | OK |
| a | 1 -> 0 | OK |
| m | 1 -> 0 | OK |

All decrements were valid, so it's an anagram.

### The Fix

```typescript
export function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) {
    return false;
  }

  const charCount = new Map<string, number>();

  for (const char of s) {
    charCount.set(char, (charCount.get(char) ?? 0) + 1);
  }

  for (const char of t) {
    const count = charCount.get(char);
    if (count === undefined || count === 0) {
      return false;
    }
    charCount.set(char, count - 1);
  }

  return true;
}
```

## Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Sort-based | O(n log n) | O(n) |
| **Frequency counting** | **O(n)** | **O(k)** |

Where `k` is the number of distinct characters. For lowercase English letters, k <= 26, making space effectively O(1).

## Why No Final Check?

Since we verify `s.length === t.length` upfront, and we know `s` contributes exactly `n` increments while `t` consumes exactly `n` decrements, the counts must all return to zero if no decrement failed. This is why we don't need to check that all counts are zero at the end.

## Common Interview Follow-ups

- **"What if the inputs contain unicode?"** The Map-based approach handles unicode naturally. The sort-based approach may have issues with combining characters and locale-specific sort orders.
- **"Can you do it with O(1) space?"** If restricted to lowercase English letters, you can use a 26-element array instead of a Map. That's technically O(1) space.
- **"What about case insensitivity?"** Normalize both strings to lowercase before counting.
- **"Group Anagrams?"** See lc-004. Sort each word to create a key, then group words with the same sorted key.

## References

- [LeetCode 242. Valid Anagram](https://leetcode.com/problems/valid-anagram/)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: String.prototype[@@iterator]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/@@iterator)
