# Solution: Cache Stampede

## The Bug

The `cachedFetch` function had a classic "thundering herd" / cache stampede vulnerability:

```ts
// Every caller checks cache, finds it empty, and independently calls fetchFn
const value = await fetchFn();
cache.set(key, { value, expiresAt: now + ttlMs });
```

When 10 requests arrive simultaneously and the cache is empty, all 10 check the cache, all 10 find it empty, and all 10 fire off the expensive database query. The cache doesn't get populated until the first fetch completes, by which point all others are already in flight.

## The Fix

Implemented **promise coalescing** using an `inFlight` map:

```ts
const inFlight = new Map<string, Promise<unknown>>();

// If there's already a fetch in progress for this key, share it
const existing = inFlight.get(key);
if (existing) {
  return existing as Promise<T>;
}

// Create and store the fetch promise
const fetchPromise = fetchFn()
  .then((value) => {
    cache.set(key, { value, expiresAt: Date.now() + ttlMs });
    return value;
  })
  .finally(() => {
    inFlight.delete(key); // Clean up whether success or failure
  });

inFlight.set(key, fetchPromise);
```

Key details:
- The first caller creates the promise and stores it in `inFlight`
- Subsequent callers for the same key get the existing promise and await it
- On success, the result is cached and the in-flight entry is removed
- On failure, the in-flight entry is removed (via `.finally()`) so the next caller can retry

## Key Takeaway

In JavaScript, promises are naturally shareable -- multiple `await`s on the same promise all resolve to the same value. By storing the in-flight promise in a map, you can coalesce concurrent requests for the same resource into a single fetch. This is a lightweight alternative to a mutex that works perfectly for read-heavy cache patterns.
