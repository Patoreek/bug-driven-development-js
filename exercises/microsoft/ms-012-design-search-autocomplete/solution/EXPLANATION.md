# Solution Explanation: Design Search Autocomplete System

## Why the Bug Happens

The buggy implementation has two problems:

### Bug 1: Frequency Reset

When a sentence is completed with `'#'`, the code does:

```typescript
this.sentences.set(this.currentInput, 1); // WRONG: always sets to 1
```

Instead of:

```typescript
const count = this.sentences.get(this.currentInput) || 0;
this.sentences.set(this.currentInput, count + 1); // CORRECT: increments
```

This means if "hello" already has frequency 5, entering it again resets it to 1 instead of making it 6. The ranking becomes completely wrong for repeated searches.

### Bug 2: Brute-Force Performance

On every keystroke, the code scans ALL sentences and sorts ALL matches:
- **O(n * m)** to scan and check prefix match
- **O(k log k)** to sort matches
- Done on **every single keystroke**

For large datasets, this becomes unacceptably slow.

## Before/After

**Before (buggy):**
```typescript
if (c === "#") {
  this.sentences.set(this.currentInput, 1); // BUG: resets frequency
  this.currentInput = "";
  return [];
}
// ... linear scan of ALL sentences ...
```

**After (Trie-based with correct frequency):**
```typescript
if (c === "#") {
  this.addSentence(this.currentInput, 1); // Increments in Trie
  this.currentInput = "";
  this.currentNode = this.root;
  return [];
}
// Advance ONE step in the Trie
this.currentNode = this.currentNode?.children.get(c) ?? null;
if (!this.currentNode) return [];
return this.getTop3(this.currentNode);
```

## Visual Walkthrough

```
Trie after inserting ["island" (3), "iroman" (2), "i love you" (5)]:

root
 └─ 'i' → node { sentences: {"island":3, "iroman":2, "i love you":5} }
     ├─ 's' → node { sentences: {"island":3} }
     │   └─ 'l' → ...
     ├─ 'r' → node { sentences: {"iroman":2} }
     │   └─ 'o' → ...
     └─ ' ' → node { sentences: {"i love you":5} }
         └─ 'l' → ...

input("i"):
  currentNode moves to 'i' node
  candidates: {"island":3, "iroman":2, "i love you":5}
  top 3 sorted: ["i love you", "island", "iroman"]

input(" "):
  currentNode moves to ' ' node under 'i'
  candidates: {"i love you":5}
  top 3: ["i love you"]
```

## Complexity Comparison

| | Brute Force | Trie |
|---|---|---|
| Constructor | O(n * m) | O(n * m * avg_len) |
| input() per call | O(n * m + k log k) | O(1 + k log k) |
| Space | O(n * m) | O(n * m * avg_len) |

Where n = total sentences, m = avg sentence length, k = candidates at current node.

The Trie trades more space (storing sentence references at every node) for much faster per-keystroke lookup. The `k` at a deep Trie node is typically much smaller than `n`.

## Common Variations

1. **Min-heap instead of full sort**: Since we only need top 3, use a min-heap of size 3 for O(k log 3) = O(k) instead of O(k log k).
2. **Pre-sorted lists**: Store the top-3 directly at each node, updating on insert. This gives O(1) per query but O(depth) per insert.
3. **Hot sentences decay**: In real systems, sentence frequencies decay over time. This requires periodic pruning of the Trie.

## Interview Follow-ups

- **How would you handle deletions?** Remove the sentence from every node along its path. If a node's sentence map becomes empty and it has no children, prune it.
- **How would you persist this to disk?** Serialize the Trie level by level (BFS) or use a sorted file with binary search on prefixes.
- **What about memory constraints?** Instead of storing full sentences at every node, store sentence IDs and keep a separate sentence lookup table.
- **How does Google actually implement this?** They use a combination of Tries, inverted indexes, and machine learning models to rank suggestions by relevance, personalization, and recency.
