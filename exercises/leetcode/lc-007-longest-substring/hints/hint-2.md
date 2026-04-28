# Hint 2 — Data Structure

Use a **Map** that stores each character's **most recent index** (not just whether it exists).

Maintain two pointers: `left` and `right` defining the current window.

When `s[right]` is a duplicate (its last seen index is >= `left`), jump `left` directly to one position past the previous occurrence. This avoids incrementing `left` one step at a time.
