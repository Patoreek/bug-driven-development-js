# Hint 1 — Approach

Think about comparing characters one at a time. If `text1[i] === text2[j]`, that character is part of the LCS, and you can move to the next character in both strings.

If they don't match, you have two choices: skip a character from `text1` or skip a character from `text2`. The LCS is the longer result of these two choices.

This has **overlapping subproblems** — the same (i, j) pair is computed many times in naive recursion.
