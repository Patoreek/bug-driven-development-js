# Hint 3 (Strong)

Use a `Map<string, Promise<unknown>>` called `inFlight` alongside the cache. When starting a fetch:

1. Check if `inFlight.has(key)` -- if yes, return the existing promise
2. If not, create the fetch promise, store it in `inFlight`, and return it
3. In the promise's `.finally()`, remove the key from `inFlight` so future requests (after this one resolves) can start a fresh fetch

Multiple `await`s on the same Promise all resolve to the same value, so this naturally shares the result.
