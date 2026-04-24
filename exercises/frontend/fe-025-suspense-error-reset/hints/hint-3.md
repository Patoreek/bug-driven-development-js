# Hint 3 (Strong)

```tsx
// Fix ErrorBoundary:
handleRetry = () => {
  this.setState({ hasError: false, error: null });
  if (this.props.onRetry) this.props.onRetry();
};

// Fix App:
const [retryCount, setRetryCount] = useState(0);

const handleRetry = () => {
  cache.delete(url);                    // clear cached error
  setRetryCount(c => c + 1);           // force remount
};

// Use key on Suspense to force DataDisplay remount:
<Suspense key={retryCount} fallback={<p data-testid="loading">Loading...</p>}>
  <DataDisplay url={url} />
</Suspense>
```

The `key={retryCount}` forces React to unmount and remount the Suspense boundary and its children, which triggers a fresh `fetchData` call on the now-empty cache.
