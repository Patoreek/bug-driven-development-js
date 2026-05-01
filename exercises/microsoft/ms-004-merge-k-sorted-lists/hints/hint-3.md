# Hint 3: Implementation

Use an `interval` variable that starts at 1 and doubles each round. In each round, merge `lists[i]` with `lists[i + interval]` for every `i` that steps by `interval * 2`:

```typescript
let interval = 1;
while (interval < lists.length) {
  for (let i = 0; i + interval < lists.length; i += interval * 2) {
    lists[i] = mergeTwoLists(lists[i], lists[i + interval]);
  }
  interval *= 2;
}
return lists[0];
```

Round 1 (interval=1): merge pairs (0,1), (2,3), (4,5)...
Round 2 (interval=2): merge pairs (0,2), (4,6)...
Round 3 (interval=4): merge pairs (0,4)...

The `mergeTwoLists` helper is already correct -- you only need to change `mergeKLists`.
