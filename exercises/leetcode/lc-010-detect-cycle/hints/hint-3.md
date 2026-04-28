# Hint 3 — Implementation

```
slow = head
fast = head

while fast is not null AND fast.next is not null:
    slow = slow.next        // 1 step
    fast = fast.next.next   // 2 steps
    
    if slow === fast:
        return true         // they met — cycle exists

return false                // fast reached the end — no cycle
```

Important: check `fast !== null && fast.next !== null` to avoid null pointer errors. The comparison `slow === fast` checks **node identity** (reference equality), not value equality.
