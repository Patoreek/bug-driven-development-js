# Hint 3 (Strong)

Create `snapshotState` and `restoreState` helper functions that deep-copy and restore the Maps.

```ts
function snapshotState() {
  // Deep copy all three data stores and the orderCounter
  // Return the snapshot object
}

function restoreState(snapshot) {
  // Clear and repopulate all three data stores from snapshot
}
```

Then in `withTransaction`:
```ts
const snapshot = snapshotState();
try {
  const result = await fn(tx);
  return result;
} catch (error) {
  restoreState(snapshot);
  throw error;
}
```

Then in `placeOrder`, wrap all three operations in `withTransaction(async () => { ... })`.
