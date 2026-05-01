# Hint 1: Data structure choice

The current code scans **every** sentence on every keystroke to check if it starts with the current prefix. This is O(n * m) where n is the number of sentences and m is the average length.

Think about a data structure that is specifically designed for **prefix lookups**. It should let you navigate directly to the node representing the current prefix in O(prefix_length) time, without scanning irrelevant sentences.

What tree-like structure stores strings by sharing common prefixes?
