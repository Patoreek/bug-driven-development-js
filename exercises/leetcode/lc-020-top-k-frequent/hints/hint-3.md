# Hint 3 — Implementation

```
1. Count frequencies with a Map — O(n)

2. Create buckets array of size n+1, each bucket is an empty array
   For each (num, freq) in freqMap:
     buckets[freq].push(num)

3. Walk from highest bucket (index n) down to 0:
   Collect elements until you have k total

   result = []
   for i from n down to 0:
     for each num in buckets[i]:
       result.push(num)
       if result.length === k: return result
```

Every element is placed in exactly one bucket, so total work is O(n).
