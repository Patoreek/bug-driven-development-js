# Hint 3 (Strong)

Split into `query` and `deferredQuery`:

```tsx
const handleChange = (e) => {
  setQuery(e.target.value);               // urgent — updates input immediately
  startTransition(() => {
    setDeferredQuery(e.target.value);      // deferred — expensive list can lag
  });
};
```

Bind the input to `query` and the `useMemo` filter to `deferredQuery`. An alternative approach is to use `useDeferredValue(query)` instead of a second state variable.
