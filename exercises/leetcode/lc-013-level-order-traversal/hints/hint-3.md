# Hint 3 — Implementation

```
1. If root is null, return []
2. Initialize queue = [root], result = []
3. While queue is not empty:
   a. levelSize = queue.length  (snapshot before processing)
   b. currentLevel = []
   c. For i = 0 to levelSize - 1:
      - Dequeue node from front
      - Add node.val to currentLevel
      - If node.left exists, enqueue it
      - If node.right exists, enqueue it
   d. Push currentLevel to result
4. Return result
```

The trick is step 3a: capturing `queue.length` before the inner loop changes it.
