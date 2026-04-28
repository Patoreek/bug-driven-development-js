# Hint 3 — Implementation

```
if s.length !== t.length, return false

create a Map<string, number>

for each char in s:
    increment map[char] (default 0)

for each char in t:
    count = map.get(char)
    if count is undefined or 0:
        return false
    map.set(char, count - 1)

return true
```

Since lengths are equal and all decrements are valid, you don't need a final check — if `t` uses every character count from `s` exactly, it's an anagram.
