Here's the pattern:

```tsx
useEffect(() => {
  const controller = new AbortController();

  searchFn(query, controller.signal)
    .then((data) => {
      if (!controller.signal.aborted) {
        setResults(data);
        setIsLoading(false);
      }
    })
    .catch((err) => {
      if (!controller.signal.aborted && err.name !== "AbortError") {
        setError(err.message);
      }
    });

  return () => controller.abort();
}, [query, searchFn]);
```

The cleanup function runs every time `query` changes, aborting the previous request before the new one starts.
