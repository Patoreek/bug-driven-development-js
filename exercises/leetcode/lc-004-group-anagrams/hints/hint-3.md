# Hint 3 — Implementation

```
create a Map<string, string[]>

for each str in strs:
    key = str.split("").sort().join("")
    
    if map doesn't have key:
        map.set(key, [])
    
    map.get(key).push(str)

return Array.from(map.values())
```

Each word is sorted once (O(k log k)), and we iterate through n words, giving O(n * k log k) total. The map lookup is O(1) amortized.
