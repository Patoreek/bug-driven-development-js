# Explanation — Minimum Window Substring

## The Brute Force Approach (What's Given)

```typescript
for (let i = 0; i < s.length; i++) {
  for (let j = i + t.length; j <= s.length; j++) {
    const substring = s.slice(i, j);
    if (containsAll(substring, tFreq)) {
      if (result === "" || substring.length < result.length) {
        result = substring;
      }
      break;
    }
  }
}
```

For each starting position `i`, check expanding substrings until one contains all of `t`. The `containsAll` function rebuilds a frequency map for each substring. This is roughly **O(n^2 * m)** — catastrophically slow for large inputs.

## The Optimal Approach

### Key Insight

Use a **sliding window** with a `have/need` counter to track how many character requirements are met. Instead of rebuilding frequency counts from scratch, incrementally update them as the window expands and contracts.

### Two-Phase Process

1. **Expand (right pointer)**: add characters until the window is valid (contains all of `t`)
2. **Contract (left pointer)**: shrink the window to find the minimum valid window, then break validity to search for a smaller window further right

### Algorithm Walkthrough

Given `s = "ADOBECODEBANC"`, `t = "ABC"`:

`tFreq = {A:1, B:1, C:1}`, `need = 3`

| right | char | windowFreq | have | left | Action |
|-------|------|-----------|------|------|--------|
| 0 | A | {A:1} | 1 | 0 | Expand |
| 1 | D | {A:1,D:1} | 1 | 0 | Expand |
| 2 | O | {A:1,D:1,O:1} | 1 | 0 | Expand |
| 3 | B | {A:1,D:1,O:1,B:1} | 2 | 0 | Expand |
| 4 | E | {...E:1} | 2 | 0 | Expand |
| 5 | C | {...C:1} | **3** | 0 | Valid! Window="ADOBEC" len=6. Contract. |
| | | Remove A | 2 | 1 | Lost A. Stop contracting. Min="ADOBEC"(6) |
| 6 | O | {...O:2} | 2 | 1 | Expand |
| 7 | D | {...D:2} | 2 | 1 | Expand |
| 8 | E | {...E:2} | 2 | 1 | Expand |
| 9 | B | {...B:2} | 2 | 1 | Expand |
| 10 | A | {...A:1} | **3** | 1 | Valid! Window="DOBECODEBA" len=10. Contract. |
| | | Remove D | 3 | 2 | Still valid. Window len=9. Contract. |
| | | Remove O | 3 | 3 | Still valid. Window len=8. Contract. |
| | | Remove B | 2 | 4 | Lost B. Stop. |
| 11 | N | {...N:1} | 2 | 4 | Expand |
| 12 | C | {...C:2} | 2 | 4 | Expand (still need B) |

Wait - let me retrace: at right=10, after contracting we had ECODEBA (len=7), then removed B giving have=2. Continue...

| 12 | C | {...} | 2→ eventually 3 | | At right=12, window BANC. Contract to "BANC" len=4. Min! |

Final result: `"BANC"` (length 4).

### The Fix

```typescript
export function minWindow(s: string, t: string): string {
  if (t.length > s.length) return "";

  const tFreq = new Map<string, number>();
  for (const char of t) {
    tFreq.set(char, (tFreq.get(char) ?? 0) + 1);
  }

  const windowFreq = new Map<string, number>();
  let have = 0;
  const need = tFreq.size;

  let minLen = Infinity;
  let minStart = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    windowFreq.set(char, (windowFreq.get(char) ?? 0) + 1);

    if (tFreq.has(char) && windowFreq.get(char) === tFreq.get(char)) {
      have++;
    }

    while (have === need) {
      const windowLen = right - left + 1;
      if (windowLen < minLen) {
        minLen = windowLen;
        minStart = left;
      }

      const leftChar = s[left];
      windowFreq.set(leftChar, windowFreq.get(leftChar)! - 1);
      if (tFreq.has(leftChar) && windowFreq.get(leftChar)! < tFreq.get(leftChar)!) {
        have--;
      }
      left++;
    }
  }

  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}
```

## Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Brute force | O(n^2 * m) | O(n + m) |
| **Sliding window** | **O(n + m)** | **O(m)** |

Each pointer (`left` and `right`) traverses `s` at most once = O(n). Building `tFreq` is O(m). Map operations are O(1).

## The `have/need` Optimization

Without this counter, you'd need to compare `windowFreq` against `tFreq` on every step (O(m) per step, O(n*m) total). The `have/need` counter reduces this to O(1) per step:

- `need` = number of **unique** characters in `t`
- `have` = how many of those are currently satisfied in the window
- Only update `have` when a character count crosses the exact threshold

## Common Interview Follow-ups

- **"What if we want all substrings, not just the minimum?"** Collect all valid windows. Still O(n) with the sliding window.
- **"What about case insensitivity?"** Normalize both strings to lowercase before processing.
- **"Substring with concatenation of all words?"** Sliding window variant with word-level frequency matching.
- **"Find all anagrams in a string?"** Fixed-size sliding window (window size = t.length).

## References

- [LeetCode 76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)
- [Sliding Window Pattern](https://www.educative.io/courses/grokking-the-coding-interview/xl0ElGxR6Bq)
