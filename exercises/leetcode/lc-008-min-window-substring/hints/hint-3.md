# Hint 3 — Implementation

```
tFreq = frequency map of t
windowFreq = empty map
have = 0, need = tFreq.size
minLen = Infinity, minStart = 0
left = 0

for right from 0 to s.length - 1:
    char = s[right]
    windowFreq[char]++
    
    if tFreq has char AND windowFreq[char] === tFreq[char]:
        have++
    
    while have === need:
        // Update minimum window
        if (right - left + 1) < minLen:
            minLen = right - left + 1
            minStart = left
        
        // Shrink from left
        leftChar = s[left]
        windowFreq[leftChar]--
        if tFreq has leftChar AND windowFreq[leftChar] < tFreq[leftChar]:
            have--
        left++

return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen)
```

The `have/need` counter is the key optimization. Instead of checking all character frequencies each step (O(m)), you update a single counter (O(1)).
