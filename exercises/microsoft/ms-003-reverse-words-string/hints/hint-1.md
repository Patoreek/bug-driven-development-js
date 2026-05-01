# Hint 1 - The Pattern

The classic algorithm to reverse word order in-place has **two steps**:

1. Reverse the **entire** array
2. Reverse each **individual word**

The current code only does Step 1. After reversing `"hello world"`, every character is backwards: `"dlrow olleh"`. The individual letters within each word need to be flipped back.

Think about what you'd need to do after the full reversal to fix each word.
