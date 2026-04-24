# Hint 2 (Medium)

Two fixes needed:

1. **ErrorBoundary:** In `handleRetry`, call `this.setState({ hasError: false, error: null })` to clear the error state before calling `onRetry`.

2. **App handleRetry:** Call `cache.delete(url)` to remove the failed entry, so the next render triggers a fresh fetch instead of re-throwing the cached error.

There's a subtlety: you may also need to force Suspense to remount `DataDisplay` to trigger a new fetch. Think about using a key.
