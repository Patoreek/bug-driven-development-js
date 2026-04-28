# Hint 3 — Implementation

```
sort intervals by start time

merged = [intervals[0]]

for each interval from index 1:
    last = merged[merged.length - 1]
    
    if current[0] <= last[1]:  // overlapping
        last[1] = max(last[1], current[1])
    else:
        merged.push(current)

return merged
```

Two intervals overlap when the start of the second is less than or equal to the end of the first. When merging, take the **maximum** of the two ends (for the case where one interval contains the other).
