# Hint 2 — Pointers

You need **three** pointer variables:

1. `prev` — the node behind current (starts as `null`)
2. `current` — the node you're processing (starts as `head`)
3. `next` — saved reference to `current.next` (computed each iteration)

The problem: when you set `current.next = prev`, you lose the reference to the rest of the list. That's why you need to save `current.next` in a temporary variable **before** reversing the pointer.
