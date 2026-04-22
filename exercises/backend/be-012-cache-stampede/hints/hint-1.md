# Hint 1 (Mild)

Think about what happens when 10 requests all arrive at the same time and the cache is empty. Each one independently checks the cache, finds nothing, and calls `fetchFn()`. By the time the first fetch completes and populates the cache, the other 9 are already running their own fetches.
