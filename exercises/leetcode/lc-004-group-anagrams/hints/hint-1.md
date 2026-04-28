# Hint 1 — Approach

Instead of comparing every word against every other word, think about what property all anagrams share.

If you sort the characters of "eat", "tea", and "ate", they all become the same string. This sorted form is a **canonical representation** of the anagram group.

How can you use this to avoid O(n^2) comparisons?
