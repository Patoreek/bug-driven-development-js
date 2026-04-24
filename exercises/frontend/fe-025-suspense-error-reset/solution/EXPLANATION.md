# Solution: Suspense + Error Boundary — The Stuck Error

## Why the Bug Happens

Error recovery with Suspense requires **three** things to happen on retry:

1. The error boundary must clear its error state
2. The cached failed data must be invalidated
3. The Suspense boundary must re-trigger the data fetch

The buggy code does **none** of these.

### Problem 1: Error boundary state stuck

```tsx
// BUGGY
handleRetry = () => {
  if (this.props.onRetry) this.props.onRetry();
  // hasError is still true! Next render still shows error UI.
};
```

### Problem 2: Cache not cleared

```tsx
// BUGGY
const handleRetry = () => {
  console.log("Retrying...");
  // Cache still has { status: "rejected", error: ... }
  // Next fetchData() call immediately throws the cached error
};
```

## The Fix

### 1. Reset error boundary state

```tsx
handleRetry = () => {
  this.setState({ hasError: false, error: null });
  if (this.props.onRetry) this.props.onRetry();
};
```

### 2. Clear cache and force remount

```tsx
const [retryCount, setRetryCount] = useState(0);

const handleRetry = useCallback(() => {
  cache.delete(url);              // Remove cached error
  setRetryCount(c => c + 1);     // Trigger re-render
}, [url]);
```

### 3. Key-based Suspense reset

```tsx
<Suspense key={retryCount} fallback={<p>Loading...</p>}>
  <DataDisplay url={url} />
</Suspense>
```

Changing the `key` forces React to unmount and remount the entire Suspense subtree. When `DataDisplay` mounts fresh, it calls `fetchData()`, which doesn't find the URL in cache (we deleted it), and initiates a new fetch.

## The Complete Flow After Fix

1. User clicks "Retry"
2. `ErrorBoundary.handleRetry` sets `hasError: false` and calls `onRetry`
3. `onRetry` deletes the cache entry and increments `retryCount`
4. React re-renders: boundary is clear, Suspense key changed
5. Suspense unmounts old tree, mounts new `DataDisplay`
6. `DataDisplay` calls `fetchData()`, cache miss, new promise thrown
7. Suspense catches the promise, shows "Loading..."
8. Promise resolves or rejects, Suspense shows result or boundary catches error

## Documentation

- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Resetting state with a key](https://react.dev/learn/preserving-and-resetting-state#resetting-state-with-a-key)
- [Suspense](https://react.dev/reference/react/Suspense)

## Common Variations

- Using `react-error-boundary` library which provides `resetKeys` prop
- SWR/React Query handle cache invalidation automatically
- Server Components with `error.tsx` and `reset()` in Next.js App Router
- Using `useTransition` with `startTransition` for optimistic retry

## Interview Context

This tests advanced React knowledge:
- Understanding error boundary lifecycle (class component APIs)
- Knowing that Suspense catches thrown promises (not just lazy imports)
- Cache invalidation as a prerequisite for retry
- The `key` prop as a tool for resetting component trees
- The full error → retry → re-fetch flow in data-fetching patterns
