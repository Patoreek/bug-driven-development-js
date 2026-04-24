# Hint 1 (Mild)

Look at the `handleRetry` method in `ErrorBoundary`. It calls `onRetry` but check what happens to `this.state.hasError` afterward. Also, in the `App` component, what does `handleRetry` actually do? Does it remove the failed entry from the cache?
