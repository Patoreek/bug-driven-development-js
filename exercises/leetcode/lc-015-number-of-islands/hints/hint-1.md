# Hint 1 — Approach

When you find a land cell, you need to "claim" the entire connected island before moving on. This prevents counting the same island multiple times.

Think of it like filling a shape with paint: once you start at one land cell, you spread to all connected land cells. This is called **flood fill**.
