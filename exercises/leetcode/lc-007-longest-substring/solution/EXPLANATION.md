# Explanation — Longest Substring Without Repeating Characters

## The Brute Force Approach (What's Given)

```typescript
for (let i = 0; i < s.length; i++) {
  const seen = new Set<string>();
  let j = i;
  while (j < s.length && !seen.has(s[j])) {
    seen.add(s[j]);
    j++;
  }
  maxLength = Math.max(maxLength, j - i);
}
```

For each starting position `i`, we scan forward until a duplicate is found. In the worst case (all unique characters), every starting position scans to the end, giving **O(n^2)** time.

The key inefficiency: when we find a duplicate, we throw away everything and start fresh from `i+1`. But we already know the substring from `i+1` to `j` is unique.

## The Optimal Approach

### Key Insight

Instead of restarting, maintain a **sliding window** `[left, right]` where all characters are unique. When you encounter a duplicate, **jump** `left` past the previous occurrence of that character. This way, `left` only moves forward, and each pointer traverses the string at most once.

### Algorithm Walkthrough

Given `s = "abcabcbb"`:

| right | char | lastSeen has it? | Action | Window | maxLength |
|-------|------|-----------------|--------|--------|-----------|
| 0 | a | No | Store a:0 | [0,0] "a" | 1 |
| 1 | b | No | Store b:1 | [0,1] "ab" | 2 |
| 2 | c | No | Store c:2 | [0,2] "abc" | 3 |
| 3 | a | Yes, at 0 (>=left 0) | left=1, store a:3 | [1,3] "bca" | 3 |
| 4 | b | Yes, at 1 (>=left 1) | left=2, store b:4 | [2,4] "cab" | 3 |
| 5 | c | Yes, at 2 (>=left 2) | left=3, store c:5 | [3,5] "abc" | 3 |
| 6 | b | Yes, at 4 (>=left 3) | left=5, store b:6 | [5,6] "cb" | 3 |
| 7 | b | Yes, at 6 (>=left 5) | left=7, store b:7 | [7,7] "b" | 3 |

Result: 3

### The Tricky Case: "dvdf"

| right | char | lastSeen | Action | Window | maxLength |
|-------|------|----------|--------|--------|-----------|
| 0 | d | No | Store d:0 | [0,0] | 1 |
| 1 | v | No | Store v:1 | [0,1] | 2 |
| 2 | d | Yes, at 0 (>=left 0) | left=1, store d:2 | [1,2] | 2 |
| 3 | f | No | Store f:3 | [1,3] "vdf" | **3** |

The `>= left` check is essential here. Without it, if `d` appeared before `left`, we'd incorrectly shrink the window.

### The Fix

```typescript
export function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (lastSeen.has(char) && lastSeen.get(char)! >= left) {
      left = lastSeen.get(char)! + 1;
    }

    lastSeen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

## Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Brute force | O(n^2) | O(min(n, k)) |
| **Sliding window** | **O(n)** | **O(min(n, k))** |

Each pointer (`left` and `right`) moves at most `n` times across the string. The Map stores at most `k` entries where `k` is the character set size.

## Why `>= left`?

The Map stores indices of **all** previously seen characters, not just those in the current window. When we encounter `s[right]` in the map, we must check whether its stored index is within the current window (`>= left`). If it's before `left`, it's outside the window and shouldn't trigger a shrink.

## Common Interview Follow-ups

- **"Longest substring with at most K distinct characters?"** Same sliding window, but use a Map to count distinct characters. Shrink window when distinct count exceeds K.
- **"Longest repeating character replacement?"** Sliding window with frequency tracking and a "max frequency" optimization.
- **"Minimum window substring?"** See lc-008. Two-pointer sliding window with frequency matching.

## References

- [LeetCode 3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
- [Sliding Window Technique](https://en.wikipedia.org/wiki/Sliding_window_protocol)
