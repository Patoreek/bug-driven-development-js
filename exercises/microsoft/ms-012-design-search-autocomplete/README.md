# Design Search Autocomplete System

**ID:** `ms-012-design-search-autocomplete`
**Difficulty:** ★★★★☆
**Estimated Time:** 35 minutes
**Tags:** `design`, `trie`, `sorting`, `hash-map`
**Prerequisites:** None

---

## The Problem

Design a search autocomplete system. Users type characters one at a time. For each character typed, return the **top 3** historical sentences that have the same prefix as the current input, ranked by:

1. **Frequency** (descending) -- most searched sentences first
2. **Alphabetical order** (ascending) -- for ties in frequency

When the user types `'#'`, the current sentence is complete and should be recorded in the history.

The constructor takes an array of initial sentences and their corresponding frequencies.

### Examples

```
AutocompleteSystem(["i love you", "island", "iroman", "i love leetcode"], [5, 3, 2, 2])

input("i") -> ["i love you", "island", "i love leetcode"]
input(" ") -> ["i love you", "i love leetcode"]
input("a") -> []
input("#") -> []  (records "i a" with frequency 1)
```

### Constraints

- `1 <= sentences.length <= 1000`
- `1 <= sentences[i].length <= 100`
- All input characters are lowercase English letters, spaces, or `'#'`

## What's Wrong

The buggy version has two problems:

1. **Frequency bug**: When a sentence is completed with `'#'`, it **sets** the frequency to 1 instead of **incrementing** the existing frequency. This means entering a sentence that already exists in the history resets its count to 1 instead of adding 1 to it.

2. **Performance**: It stores all sentences in a `Map` and on every keystroke, scans the **entire** collection for matching prefixes, then sorts **all** matches. This has O(n*m) time complexity per keystroke. The optimal approach uses a **Trie** for O(prefix_length) lookups.

## Your Task

1. Fix the frequency tracking bug in the `'#'` handler -- increment, don't replace
2. Replace the `Map<string, number>` with a **Trie** data structure
3. Each Trie node should store a `Map<string, number>` of sentences and their frequencies that pass through that node
4. Maintain a `currentNode` pointer that advances through the Trie with each keystroke
5. On `'#'`, add the completed sentence to the Trie and reset the current node

## Files to Modify

| File | Description |
|------|-------------|
| `src/solution.ts` | Replace brute-force scan with Trie-based lookup |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Data structure choice)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Trie node design)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Incremental traversal)</summary>See hints/hint-3.md</details>

## Complexity Target

| | Time per input() | Space |
|---|---|---|
| Current (brute-force) | O(n * m + n log n) | O(n * m) |
| **Target (Trie)** | **O(prefix_len + k log k)** | **O(n * m * avg_len)** |

Where n = total sentences, m = avg sentence length, k = candidates at current node.
