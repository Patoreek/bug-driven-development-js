# Hint 2 (Medium)

The hook is called `useSyncExternalStore`. It takes three arguments:
1. A `subscribe` function that accepts a callback
2. A `getSnapshot` function that returns the current value
3. An optional `getServerSnapshot` for SSR

Your store already has `subscribe` and `getTheme` methods that match this API.
