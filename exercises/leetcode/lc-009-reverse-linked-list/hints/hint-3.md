# Hint 3 — Implementation

```
prev = null
current = head

while current is not null:
    next = current.next    // 1. Save the next node
    current.next = prev    // 2. Reverse the pointer
    prev = current         // 3. Advance prev
    current = next         // 4. Advance current

return prev  // prev is now the new head (the old tail)
```

The order of operations matters. If you reverse the pointer before saving `next`, you lose the rest of the list. Always save `next` first.
