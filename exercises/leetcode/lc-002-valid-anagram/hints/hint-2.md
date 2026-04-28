# Hint 2 — Data Structure

Use a **Map** to count character frequencies.

One approach: build a frequency map from `s`, then for each character in `t`, decrement the count. If any count goes below zero (or the character doesn't exist), return `false`.

Don't forget the **early exit** when lengths differ — no need to count at all.
