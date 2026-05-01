# Explanation: Reverse Words in a String (In-Place)

## Why the Bug Happens

The buggy solution only performs the first half of the two-step reversal algorithm:

```typescript
// BUGGY
export function reverseWords(s: string[]): void {
  reverse(s, 0, s.length - 1);
  // Missing: reverse each individual word!
}
```

After reversing the entire array, every character is in reverse order. For `"hello world"`:
- Full reverse: `"dlrow olleh"` -- both the word order AND letter order are reversed
- But we only want word order reversed, not letter order

The missing second pass would reverse each word individually, restoring the letters within each word.

## The Fix

Add a second pass that iterates through the array and reverses each word between spaces:

```diff
  export function reverseWords(s: string[]): void {
    // Step 1: Reverse entire array
    reverse(s, 0, s.length - 1);
-   // BUG: Missing step 2
+
+   // Step 2: Reverse each word
+   let start = 0;
+   for (let i = 0; i <= s.length; i++) {
+     if (i === s.length || s[i] === " ") {
+       reverse(s, start, i - 1);
+       start = i + 1;
+     }
+   }
  }
```

## Visual Walkthrough

For `['h','e','l','l','o',' ','w','o','r','l','d']`:

```
Original:     h e l l o   w o r l d
              "hello world"

Step 1 - Reverse entire array:
              d l r o w   o l l e h
              "dlrow olleh"

Step 2 - Reverse each word:
  Word 1 (indices 0-4): "dlrow" -> "world"
  Word 2 (indices 6-10): "olleh" -> "hello"

Result:       w o r l d   h e l l o
              "world hello"
```

## Why This Works

The key insight is that reversing the entire array puts the words in the right order but with reversed letters. Reversing each word individually fixes the letter order without changing the word order.

Mathematically, if you think of each word as a unit:
- Original: `[W1][W2][W3]`
- Full reverse: `[W3_rev][W2_rev][W1_rev]`
- Reverse each word: `[W3][W2][W1]` -- words are in reversed order with correct letters

## Complexity Comparison

| | Time | Space |
|---|---|---|
| Buggy (incomplete) | O(n) | O(1) |
| **Fixed (two-pass)** | **O(n)** | **O(1)** |

Both passes together are still O(n) -- each character is visited at most twice (once in the full reversal, once in the word reversal).

## Common Variations

- **Reverse Words in a String I** (LeetCode 151) -- input is a string (not char array), and may have leading/trailing/multiple spaces
- **Reverse Words in a String III** (LeetCode 557) -- reverse each word but keep word order the same (only Step 2, no Step 1)
- **Rotate Array** (LeetCode 189) -- uses the same "reverse segments" technique

## Interview Follow-ups

- "Can you prove correctness?" -- Show that `reverse(reverse(W1) + reverse(W2)) = W2 + W1`
- "What about multiple spaces between words?" -- Need to handle space sequences as delimiters, not individual spaces
- "How would you do this with a string instead of an array?" -- In JavaScript strings are immutable, so you'd need to split, reverse, and join (O(n) space)
- "Can you do this in one pass?" -- Not with the in-place constraint; the two-pass approach is optimal for O(1) space
