# Hint 3 — Implementation

```
lastSeen = new Map<string, number>()
maxLength = 0
left = 0

for right from 0 to s.length - 1:
    char = s[right]
    
    if lastSeen has char AND lastSeen.get(char) >= left:
        left = lastSeen.get(char) + 1
    
    lastSeen.set(char, right)
    maxLength = max(maxLength, right - left + 1)

return maxLength
```

The condition `lastSeen.get(char) >= left` is critical: we only care about duplicates **within the current window**. Characters before `left` are outside the window and should be ignored.
