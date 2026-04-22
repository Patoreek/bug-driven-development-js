# Solution: Race Condition Fetch

## The Problem

The `useEffect` fired a fetch request on every keystroke without canceling previous requests:

```tsx
useEffect(() => {
  searchFn(query)
    .then((data) => {
      setResults(data);  // Stale results can overwrite fresh ones!
      setIsLoading(false);
    });
  // No cleanup — requests pile up
}, [query]);
```

When a user types "react", five requests fire ("r", "re", "rea", "reac", "react"). If "rea" takes 500ms but "react" takes 50ms, the "react" results appear first, then get overwritten by the late-arriving "rea" results.

## The Fix

Use `AbortController` to cancel stale requests:

```tsx
useEffect(() => {
  const abortController = new AbortController();

  searchFn(query, abortController.signal)
    .then((data) => {
      if (!abortController.signal.aborted) {
        setResults(data);
        setIsLoading(false);
      }
    })
    .catch((err) => {
      if (!abortController.signal.aborted) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
        setIsLoading(false);
      }
    });

  return () => {
    abortController.abort();
  };
}, [query]);
```

Three key changes:
1. **Create an `AbortController`** for each effect invocation
2. **Pass `signal` to the search function** so the request can be canceled at the network level
3. **Return a cleanup function** that calls `abort()` — this runs before the next effect and on unmount
4. **Guard state updates** with `!abortController.signal.aborted` to prevent stale updates even if the promise resolves before the abort signal is processed

## Key Takeaway

Any `useEffect` that makes async requests needs a cancellation mechanism. `AbortController` is the standard web API for this. Always check if the request was aborted before updating state, and always cancel in the cleanup function.
