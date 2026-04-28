# Explanation — Group Anagrams

## The Brute Force Approach (What's Given)

```typescript
for (let i = 0; i < strs.length; i++) {
  if (used[i]) continue;
  const group = [strs[i]];
  const sortedI = strs[i].split("").sort().join("");
  
  for (let j = i + 1; j < strs.length; j++) {
    if (used[j]) continue;
    const sortedJ = strs[j].split("").sort().join("");
    if (sortedI === sortedJ) {
      group.push(strs[j]);
      used[j] = true;
    }
  }
  groups.push(group);
}
```

For each word, it sorts and compares against all remaining words. This is **O(n^2 * k log k)** where `n` is the number of strings and `k` is the maximum string length. For 10,000 strings, that's ~50 million sort operations.

The redundancy is clear: `strs[j]` gets sorted many times across different iterations of `i`.

## The Optimal Approach

### Key Insight

All anagrams share the same **sorted character sequence**. "eat", "tea", "ate" all sort to "aet". We can use this sorted string as a hash map key to group anagrams in a single pass.

### Algorithm Walkthrough

Given `["eat", "tea", "tan", "ate", "nat", "bat"]`:

| Word | Sorted Key | Map After |
|------|-----------|-----------|
| "eat" | "aet" | {"aet": ["eat"]} |
| "tea" | "aet" | {"aet": ["eat", "tea"]} |
| "tan" | "ant" | {"aet": ["eat", "tea"], "ant": ["tan"]} |
| "ate" | "aet" | {"aet": ["eat", "tea", "ate"], "ant": ["tan"]} |
| "nat" | "ant" | {"aet": ["eat", "tea", "ate"], "ant": ["tan", "nat"]} |
| "bat" | "abt" | {"aet": [...], "ant": [...], "abt": ["bat"]} |

Result: `[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]`

### The Fix

```typescript
export function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const str of strs) {
    const key = str.split("").sort().join("");

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(str);
  }

  return Array.from(map.values());
}
```

## Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Brute force | O(n^2 * k log k) | O(n * k) |
| **Sorted key + Map** | **O(n * k log k)** | **O(n * k)** |

Each word is sorted exactly once (O(k log k)), and we do this for n words. Map operations are O(1) amortized (with O(k) for hashing the key string).

## Alternative: Character Count Key

Instead of sorting each word (O(k log k)), you can create a frequency-count key (O(k)):

```typescript
function getKey(s: string): string {
  const count = new Array(26).fill(0);
  for (const c of s) {
    count[c.charCodeAt(0) - 97]++;
  }
  return count.join("#");
}
```

This gives **O(n * k)** time — even better. However, the sorted-key approach is simpler and sufficient for most interview settings.

## Common Interview Follow-ups

- **"What if strings can contain unicode?"** The character-count approach needs a Map instead of a fixed array. The sort-based approach works naturally.
- **"What's the most efficient key?"** For lowercase English only, the 26-element frequency array converted to a string is O(k) per word instead of O(k log k).
- **"Valid Anagram (two strings)?"** Simpler version — see lc-002. Just compare frequency counts directly.
- **"Find all anagram pairs?"** Same grouping, then count pairs within each group: C(n, 2) = n*(n-1)/2.

## References

- [LeetCode 49. Group Anagrams](https://leetcode.com/problems/group-anagrams/)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
